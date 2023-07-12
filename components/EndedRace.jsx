import styles from "../styles/race.module.css"

import { useQuery } from "../convex/_generated/react"
import { Id } from "../convex/_generated/dataModel";

import { getNumberWithOrdinal } from "../lib/helpers"
import {Stopwatch, Watch} from "react-bootstrap-icons";

export default function EndedRace({ id }) {
    const race = useQuery('race/readRace', { id })
    const standing = useQuery('race/readStanding', { raceId: id }) || {};

    const textLeaderboard = useQuery('text/readText', { typeId: new Id('races', id) })

    return (
        <div className={styles.endedRace}>
            {standing.mine !== undefined ? <h2>Your Stats</h2> : null}
            {standing.mine !== undefined ? (
                <div className={styles.numbers}>
                    <article>
                        <img title="Speed" height="30" src="/speed.png" />
                        <p>{standing.mine.speed} wpm</p>
                    </article>
                    <article>
                        <img title="Accuracy" height="30" src="/accuracy.png" />
                        <p>{standing.mine.accuracy}%</p>
                    </article>
                    <article>
                        <img title="Placement" height="30" src="/placement.png" />
                        <p>{getNumberWithOrdinal(standing?.mine.place)}</p>
                    </article>
                    <article>
                        <img title="Winning Streak" height="30" src="/streak.png" />
                        <p>5</p>
                    </article>
                    <article title={`You took ${standing.mine.time?.minutes || 1} minute and ${standing.mine.time?.seconds || 55} seconds to complete this race`}>
                        <Watch height={30} width={30} />
                        <p>{`${standing.mine.time?.minutes || 1}:${standing.mine.time?.seconds || 55}`}</p>
                    </article>
                </div>
            ) : null}
            <div className={styles.leaderboard}>
                <img className={styles.track} src="/track.jpg" />
                <div className={styles.playerContainer}>
                    {standing?.players?.map((item, index) => <img className={styles.player} title={`${item.user.name} (@${item.user.username})`} key={item._id.id} src="/car.png" alt="Car" width="70" style={{ position: 'absolute', top: Math.min(index * 55, index * 4 * 55) + 'px', left: item.position * 88 + '%' }} />)}
                </div>

                <img className={styles.track} src="/track.jpg" />
            </div>
            <div className={styles.textInfo}>
                <strong>{race.text.source}</strong>
                <blockquote>{race.text.words}</blockquote>
            </div>
            <div className={styles.textLeaderboard}>
                <h2>Top Racers of this Text</h2>
                <ol>
                    {textLeaderboard?.topTypers.map(item => <li key={item.standing._id.id}>{item.user.name} at {item.standing.speed} wpm</li>)}
                </ol>
            </div>
        </div>
    )
}
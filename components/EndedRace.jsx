import styles from "../styles/race.module.css"

import { useQuery } from "../convex/_generated/react"
import { Id } from "../convex/_generated/dataModel";

import { getNumberWithOrdinal } from "../lib/helpers"

export default function EndedRace({ id }) {
    const race = useQuery('readRace', { id })
    const standing = useQuery('readStanding', { raceId: id }) || {};

    const textLeaderboard = useQuery('readText', { raceId: id })

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
                </div>
            ) : null}
            <div className={styles.leaderboard}>
                <img src="/track.jpg" />
                <div className={styles.playerContainer}>
                    {standing?.players?.map((item, index) => <img className={styles.player} title={`${item.user.name} (@${item.user.username})`} key={item._id.id} src="/car.png" width="70" style={{ position: 'absolute', top: Math.min(index * 55, index * 4 * 55) + 'px', left: item.position * 88 + '%' }} />)}
                </div>

                <img src="/track.jpg" />
            </div>
            <div className={styles.textInfo}>
                <strong>{race.text.source}</strong>
                <blockquote>{race.text.words}</blockquote>
            </div>
            <h2 style={{ gridRow: 3, gridColumn: 2, justifySelf: 'center' }}>Top Racers of this Text</h2>
            <div style={{ gridRow: 4, gridColumn: 2, justifySelf: 'center' }} className={styles.textLeaderboard}>
                <ol>
                    {textLeaderboard?.topTypers.map(item => <li key={item.standing._id.id}>{item.user.name} at {item.standing.speed} wpm</li>)}
                </ol>
            </div>
        </div>
    )
}
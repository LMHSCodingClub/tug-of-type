import EndedRace from "../components/EndedRace";
import { useQuery } from "../convex/_generated/react";
import styles from "../styles/race.module.css"
import {Id} from "../convex/_generated/dataModel";
import {Watch} from "react-bootstrap-icons";

export default function Practice(props) {
    const params = new URLSearchParams(window.location.search);
    const practice = useQuery('race/readPractice', { id: params.get('id') })
    const textLeaderboard = useQuery('text/readText', { typeId: new Id('practices', params.get('id')) })

    if (!practice) return <p>Loading...</p>

    return (
        <div className={styles.endedRace}>
            <h2>Your Stats</h2>
            <div className={styles.numbers}>
                <article>
                    <img title="Speed" height="30" src="/speed.png" />
                    <p>{practice.speed} wpm</p>
                </article>
                <article>
                    <img title="Accuracy" height="30" src="/accuracy.png" />
                    <p>{practice.accuracy}%</p>
                </article>
                <article>
                    <Watch />
                    <p>{practice.time}</p>
                </article>
            </div>
            <div className={styles.leaderboard}>
                <img src="/track.jpg" />
                <div className={styles.playerContainer}>
                    <img className={styles.player} src="/car.png" width="70" style={{ position: 'absolute', top: '0px', left: practice.position * 88 + '%' }} />
                </div>

                <img src="/track.jpg" />
            </div>
            <div className={styles.textInfo}>
                <strong>{textLeaderboard.baseInfo.source}</strong>
                <blockquote>{textLeaderboard.baseInfo.words}</blockquote>
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
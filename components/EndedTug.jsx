import { useQuery } from "../convex/_generated/react"
import styles from "../styles/race.module.css"

export default function EndedTug({ id }) {
    const tug = useQuery('tug/readTug', { id })
    const textLeaderboard = useQuery('text/readText', { textId: tug.text._id })

    return (
        <div className={styles.endedRace}>
            {tug.playerType !== 'spectator' ? (
                <>
                    <h2>Your Stats</h2>
                    <div className={styles.numbers}>
                        <article>
                            <img title="Speed" height="30" src="/speed.png" />
                            <p>Host: {tug.hostSpeed} wpm</p>
                            <p>Guest: {tug.guestSpeed} wpm</p>
                        </article>
                        <article>
                            <img title="Accuracy" height="30" src="/accuracy.png" />
                            <p>Host: {tug.hostAccuracy}%</p>
                            <p>Guest: {tug.guestAccuracy}%</p>
                        </article>
                    </div>
                </>
            ) : null}
            <div className={styles.textInfo}>
                <strong>{tug.text.source}</strong>
                <blockquote>{tug.text.words}</blockquote>
            </div>
            <h2 style={{ gridRow: 3, gridColumn: 2, justifySelf: 'center' }}>Top Tuggers of this Text</h2>
            <div style={{ gridRow: 4, gridColumn: 2, justifySelf: 'center' }} className={styles.textLeaderboard}>
                <ol>
                    {textLeaderboard?.topTypers.map(item => <li key={item.standing._id.id}>{item.user.name} at {item.standing.speed} wpm</li>)}
                </ol>
            </div>
        </div>
    )
}
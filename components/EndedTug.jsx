import { useQuery } from "../convex/_generated/react"
import styles from "../styles/tug.module.css"
import TugArena from "./TugArena"

export default function EndedTug({ id }) {
    const tug = useQuery('tug/readTug', { id })
    const textLeaderboard = useQuery('text/readText', { textId: tug.text._id })

    return (
        <div className={styles.endedTug}>
            <PlayerStats playerType='host' tug={tug} />
            <PlayerStats playerType='guest' tug={tug} />
            <TugArena id={tug._id.id} />
            <div className={styles.textInfo}>
                <strong>{tug.text.source}</strong>
                <blockquote>{tug.text.words}</blockquote>
            </div>
            <div className={styles.textLeaderboard}>
                <h2>Top Tuggers of this Text</h2>
                <ol>
                    {textLeaderboard?.topTypers.map(item => <li key={item.standing._id.id}>{item.user.name} at {item.standing.speed} wpm</li>)}
                </ol>
            </div>
        </div>
    )
}

function PlayerStats({ playerType, tug }) {
    return (
        <article className={`${playerType}Numbers`}>
            <h3>{playerType[0].toUpperCase()}{playerType.substring(1).toLowerCase()}</h3>
            <p>
                <img title="Speed" height="30" src="/speed.png" />
                <span> {tug[playerType + 'Speed']} wpm</span>
            </p>
            <p>
                <img title="Accuracy" height="30" src="/accuracy.png" />
                <span> {tug[playerType + 'Accuracy']}%</span>
            </p>
        </article>
    )
}
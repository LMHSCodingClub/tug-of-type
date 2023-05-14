import styles from "../styles/race.module.css"

export default function EndedRace({ race, standing }) {
    return (
        <div className={styles.endedRace}>
            <div className={styles.numbers}>

                <img title="Speed" height="30" src="/speed.png" />
                <p>{standing.mine.speed} wpm</p>
                <img title="Accuracy" height="30" src="/accuracy.png" />
                <p>{standing.mine.accuracy}%</p>
                <img title="Consistency" height="30" src="/consistency.png" />
                <p>74%</p>
            </div>
            <div className={styles.textInfo}>
                <p>{race.text.source}</p>
            </div>
            <ol className={styles.leaderboard}>
                <li>Player 2</li>
                <li>Player 3</li>
                <li>Player 1</li>
            </ol>
        </div>
    )
}
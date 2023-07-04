import { useQuery } from "../convex/_generated/react";
import styles from "../styles/tug.module.css"

export default function TugArena(props) {
    const tug = useQuery('tug/readTug', { id: props.id })
    let netProgression = tug.hostProgression - tug.guestProgression

    return (
        <div className={styles.tugContainer}>
            <div className={styles.tickLines}>
                <span></span>
                <span className={styles.playerWin}></span>
                <span></span>
                <span className={styles.starting}></span>
                <span></span>
                <span className={styles.opponentWin}></span>
                <span></span>
            </div>
            <img className={styles.car} src="/car.png" style={{ left: 33.2 - netProgression / 3 * 100 + '%' }} />
            <img className={styles.car} src="/car.png" style={{ left: 59 - netProgression / 3 * 100 + '%', transform: 'scaleX(-1)' }} />
            <p style={{ left: 50 - netProgression / 3 * 100 + '%' }} className={styles.rope}></p>
        </div>
    );
}
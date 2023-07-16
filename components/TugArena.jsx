import { useQuery } from "../convex/_generated/react";
import styles from "../styles/tug.module.css"

const CONDENSED_WIDTH_DIVIDEND = 1.26;

export default function TugArena(props) {
    const tug = useQuery('tug/readTug', { id: props.id })
    let netProgression = tug?.hostProgression - tug?.guestProgression
    netProgression /= props.mini ? CONDENSED_WIDTH_DIVIDEND : 1

    return (
        <div className={`${styles.tugContainer} ${props.mini ? styles.mini : ''} ${styles[tug?.status]}`}>
            <div className={styles.tickLines}>
                <span className={styles.normalWin}></span>
                <span className={styles.overtime}></span>
                <span className={styles.doubleOvertime}></span>
                <span className={styles.starting}></span>
                <span className={styles.doubleOvertime}></span>
                <span className={styles.overtime}></span>
                <span className={styles.normalWin}></span>
            </div>
            <img className={styles.car} src="/car.png" style={{ left: 37 - netProgression / 3 * 100 + '%' }} />
            <img className={styles.car} src="/car.png" style={{ left: 56 - netProgression / 3 * 100 + '%', transform: 'scaleX(-1)' }} />
            <p style={{ left: 50 - netProgression / 3 * 100 + '%' }} className={styles.rope}></p>
        </div>
    );
}
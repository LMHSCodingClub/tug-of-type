import Head from "next/head";
import { useState } from "react";
import { Input } from "reactstrap";
import styles from "../styles/tug.module.css";

const DISPLACEMENT_TO_WIN = 100

export default function Tug(props) {
    const [clientCarPosition, setClientCarPosition] = useState(0.29);

    return (
        <div className={styles.container}>
            <Head>
                <title>Tug of Type</title>
            </Head>
            <Input onChange={() => setClientCarPosition(s => Math.min(s + 0.009, 0.9))} />
            <div className={styles.tugContainer}>
                <div className={styles.tickLines}>
                    <span className={styles.playerBound}></span>
                    <span className={styles.playerWin}></span>
                    <span className={styles.starting}></span>
                    <span className={styles.opponentWin}></span>
                    <span className={styles.opponentBound}></span>
                </div>
                <div className={styles.carContainer}>
                    <img className={styles.car} src="/car.png" height="50" style={{ left: clientCarPosition * 90 + '%' }} />
                </div>
                <div className={styles.carContainer}>
                    <img className={styles.car} src="/car.png" height="50" style={{ right: clientCarPosition * 90 + '%', transform: 'scaleX(-1)' }} />
                </div>
                <p className={styles.rope}></p>
            </div>
        </div>
    )
}
import Head from "next/head";
import { useState } from "react";
import { Input } from "reactstrap";
import styles from "../styles/tug.module.css";

export default function Tug(props) {

    const [clientCarPosition, setClientCarPosition] = useState(0.29);

    return (
        <div className={styles.container}>
            <Head>
                <title>Tug of Type</title>
            </Head>
            <Input onChange={e => setClientCarPosition(s => Math.min(s + 0.009, 0.9))} />
            <div className={styles.tickLines}>

            </div>
            <div className={styles.tugContainer}>
                <div className={styles.carContainer}>
                    <img src="/car.png" style={{ position: 'absolute', right: clientCarPosition * 90 + '%' }} />
                </div>
                <div className={styles.carContainer}>
                    <img src="/car.png" style={{ position: 'absolute', left: clientCarPosition * 90 + '%', transform: 'scaleX(-1)' }} />
                </div>
                <img className={styles.rope} style={{ left: clientCarPosition * 90 + '%' }} src="/rope.png" />
            </div>
        </div>
    )
}
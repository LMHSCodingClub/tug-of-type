import Image from "next/image";
import { useState } from "react";
import { Input } from "reactstrap";
import tugStyles from "../styles/tug.module.css";
import Head from "next/head";
import typeStyles from "../styles/type.module.css"

export default function Tug(props) {
    const styles = { ...typeStyles, ...tugStyles }

    const [raceTextInput, setRaceTextInput] = useState('');
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
                    <p className={styles.car} style={{ right: clientCarPosition * 90 + '%' }}></p>
                </div>
                <div className={styles.carContainer}>
                    <p className={styles.car} style={{ left: clientCarPosition * 90 + '%', transform: 'scaleX(-1)' }}></p>
                </div>
                <img className={styles.rope} style={{ left: clientCarPosition * 90 + '%' }} src="/rope.png" />
            </div>
        </div>
    )
}
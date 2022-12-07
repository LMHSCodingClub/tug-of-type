import Head from "next/head";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { Input } from "reactstrap";
import { useMutation, useQuery } from '../convex/_generated/react';
import styles from "../styles/race.module.css";

export default function Race(props) {
    const decrementTimer = useMutation("decrementTimer");
    const timer = useQuery('getCounter', "timer");
    const params = new URLSearchParams(window.location.search);
    const race = useQuery('readRace', params.get('id')) || {}
    const [raceTextInput, setRaceTextInput] = useState('');
    const [clientCarPosition, setClientCarPosition] = useState(0);
    const carEl = useRef();

    useEffect(() => {
        console.debug("[keyup: raceTextInput]", raceTextInput);
        const proportionOfRaceCompleted = raceTextInput.length / race?.text?.words.length;
        console.info(`[${Date.now()}] proportionOfRaceCompleted: ${proportionOfRaceCompleted}`)
        carEl.current.style.left = proportionOfRaceCompleted * 90 + '%';
    }, [raceTextInput]);

    return (
        <div>
            <Head>
                <title>Race | Tug of Type</title>
            </Head>
            <p>Id: {params.get('id')}</p>
            <p className="border p-5 h3">{race.text?.words}</p>
            <div>
                <div className={styles.carContainer} style={{ position: 'relative' }}>
                    <p ref={carEl} className={styles.car} style={{ position: 'absolute', left: clientCarPosition + '%' }}></p>
                </div>
            </div>
            <Input value={raceTextInput} onChange={e => setRaceTextInput(e.target.value)}
                type="textarea" style={{ resize: 'none' }} rows="5" cols="5" />
        </div>
    );
}
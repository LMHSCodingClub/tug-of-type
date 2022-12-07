import styles from "../styles/race.module.css"
import { useMutation, useQuery } from '../convex/_generated/react'
import { Input } from "reactstrap";
import Head from "next/head";
import { useEffect, useState } from "react";
import useEventListener from "../lib/useEventListener";
import { validate } from "../lib/validate";

export default function Race(props) {
    const decrementTimer = useMutation("decrementTimer");
    const timer = useQuery('getCounter', "timer");
    const params = new URLSearchParams(window.location.search);
    const race = useQuery('readRace', params.get('id')) || {}
    const [raceTextInput, setRaceTextInput] = useState('');
    const [clientCarPosition, setClientCarPosition] = useState(0);

    useEventListener("keyup", e => {
        //validate(e.key);
        console.debug("[keyup: raceTextInput]", raceTextInput);
        const proportionOfRaceCompleted = raceTextInput.length / race.text.words.length;
        console.info(`[${Date.now()}] proportionOfRaceCompleted: ${proportionOfRaceCompleted}`)
        setClientCarPosition(proportionOfRaceCompleted * 100);
    })

    return (
        <div>
            <Head>
                <title>Race | Tug of Type</title>
            </Head>
            <p>Id: {params.get('id')}</p>
            <p className="border p-5 h3">{race.text?.words}</p>
            <div>
                <div className={styles.carContainer} style={{ position: 'relative' }}>
                    <p className={styles.car} style={{ position: 'absolute', left: clientCarPosition + '%' }}></p>
                </div>
            </div>
            <Input value={raceTextInput} onChange={e => setRaceTextInput(e.target.value)}
                type="textarea" style={{ resize: 'none' }} rows="5" cols="5" />
        </div>
    );
}
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
    const promptTextEl = useRef();

    const handleInputChange = e => {
        const inputText = e.target.value;
        setRaceTextInput(inputText)
        console.debug("[keyup: raceTextInput]", inputText);
        const proportionOfRaceCompleted = inputText.length / race?.text?.words.length;
        console.info(`[${Date.now()}] proportionOfRaceCompleted: ${proportionOfRaceCompleted}`)
        // Increases or decreases the x-position of the car in proportion to total length of prompt
        const index = inputText.length;
        console.debug(race.text.words.substring(0, index));
        if (inputText === race.text.words.substring(0, index)) {
            setClientCarPosition(proportionOfRaceCompleted * 90);
            promptTextEl.current.style.color = "";
        } else {
            promptTextEl.current.style.color = "red";
        }
    }

    return (
        <div>
            <Head>
                <title>Race | Tug of Type</title>
            </Head>
            <p>Id: {params.get('id')}</p>
            <p className={`border p-5 h3 ${styles.prompt}`} ref={promptTextEl}>{race.text?.words}</p>
            <div>
                <div className={styles.carContainer} style={{ position: 'relative' }}>
                    <p className={styles.car} style={{ position: 'absolute', left: clientCarPosition + '%' }}></p>
                </div>
            </div>
            <Input value={raceTextInput} className={styles.inputBox} onChange={handleInputChange}
                type="textarea" style={{ resize: 'none' }} rows="5" cols="5" />
        </div>
    );
}
import Head from "next/head";
import { useRef } from "react";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import { Input } from "reactstrap";
import { useMutation, useQuery } from '../convex/_generated/react';
import styles from "../styles/race.module.css";

export default function Race(props) {
    const decrementTimer = useMutation("decrementTimer");
    const params = new URLSearchParams(window.location.search);
    const race = useQuery('readRace', params.get('id')) || {}
    const endRace = useMutation('endRace');
    const [raceTextInput, setRaceTextInput] = useState('');
    const [clientCarPosition, setClientCarPosition] = useState(0);
    const promptTextEl = useRef();
    const statsEl = useRef();
    const endTime = useRef(Date.now());
    const typingSpeed = useMemo(() => {
        console.log(endTime - race._creationTime);
        return race?.text?.words.split(" ").length / ((endTime - race._creationTime) / 1000 / 60)
    }
        , [race._creationTime, endTime, race?.text?.words]);

    const handleInputChange = e => {
        const inputText = e.target.value;
        setRaceTextInput(inputText)
        const proportionOfRaceCompleted = inputText.length / race?.text?.words.length;

        if (race?.ended) return

        // Increases or decreases the x-position of the car in proportion to total length of prompt
        const index = inputText.length;
        if (inputText === race.text?.words.substring(0, index)) {
            setClientCarPosition(proportionOfRaceCompleted * 90);
            promptTextEl.current.style.color = "";
        } else {
            promptTextEl.current.style.color = "red";
        }

        // If user has completed the text accurately
        if (proportionOfRaceCompleted === 1 && inputText === race?.text?.words) {
            endTime = Date.now();
            console.debug(endTime - race._creationTime);
            console.debug(race?.text?.words.split(" ").length / ((endTime - race._creationTime) / 1000 / 60))
            endRace(race._id, typingSpeed);
            promptTextEl.current.style.color = "black";
            promptTextEl.current.classList.add(styles.raceEnd);
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            if (race.timer === 0 || race?.ended) {
                console.log("Interval cleared");
                clearInterval(timer);
            } else {
                decrementTimer(params.get('id'));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`${styles.container} ${race.timer === 0 || race.ended ? styles.raceEnd : ''}`}>
            <Head>
                <title>Race | Tug of Type</title>
            </Head>
            <time>{race.timer}</time>
            <article className={styles.promptContainer}>
                <p className={`border p-5 h3 ${styles.prompt}`} ref={promptTextEl}>{race.text?.words}</p>
                <div className={`border p - 5 ${styles.stats}`} ref={statsEl}>
                    <p><strong>This quote is from </strong>{race.text?.source}</p>
                    <p><strong>Typing Speed</strong>{typingSpeed}</p>
                    <p><strong>Accuracy</strong></p>
                </div>
            </article>
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
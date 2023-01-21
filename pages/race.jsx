import { useAuth0 } from "@auth0/auth0-react";
import Head from "next/head";
import { useRef } from "react";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import { Input } from "reactstrap";
import { useMutation, useQuery } from '../convex/_generated/react';
import styles from "../styles/race.module.css";

export default function Race() {
    const decrementTimer = useMutation("decrementTimer");
    const params = new URLSearchParams(window.location.search);
    const race = useQuery('readRace', params.get('id')) || {}
    const endRace = useMutation('endRace');
    const joinRace = useMutation('joinRace');
    const standing = useQuery('readStanding', params.get('id')) || {};
    const [raceTextInput, setRaceTextInput] = useState('');
    const [clientCarPosition, setClientCarPosition] = useState(0);
    const promptTextEl = useRef();
    const statsEl = useRef();
    const [endTime, setEndTime] = useState();
    const timerCallback = useRef();
    const timer = (id) => {
        if (race.timer === 0 || race?.ended) {
            clearInterval(id);
        } else {
            decrementTimer(params.get('id'));
        }
    };

    useEffect(() => {
        // TODO: If the user hosts the race, auto-join him
        async function join() {
            await joinRace(params.get('id'));
        }
        join();
    }, [])

    useEffect(() => {
        timerCallback.current = timer;
    });

    const typingSpeed = useMemo(() => {
        const minutesToComplete = Math.abs(endTime - race?._creationTime) / 1000 / 60;
        const numberOfWords = race?.text?.words.split(" ").length;
        const speed = numberOfWords / minutesToComplete;
        return Math.round(speed);
    }, [endTime]);

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
        if (proportionOfRaceCompleted === 1 && inputText === race?.text?.words || race.timer === 0) {
            setEndTime(Date.now());

            promptTextEl.current.style.color = "black";
            promptTextEl.current.classList.add(styles.raceEnd);
        }
    }

    useEffect(() => {
        if (endTime) {
            console.debug("speed", typingSpeed);
            endRace(race._id, standing._id, typingSpeed);
        }
    }, [endTime]);

    useEffect(() => {
        const id = setInterval(() => {
            timerCallback.current(id);
        }, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className={`${styles.container} ${race.timer === 0 || race.ended ? styles.raceEnd : ''}`}>
            <Head>
                <title>Race | Tug of Type</title>
            </Head>
            <p className={styles.timer}>
                <time>{race.timer}</time>
            </p>
            <article className={styles.promptContainer}>
                <p className={`border p-5 h3 ${styles.prompt}`} ref={promptTextEl}>{race.text?.words}</p>
                <div className={`border p - 5 ${styles.stats}`} ref={statsEl}>
                    <p><strong>This quote is from </strong>{race.text?.source}</p>
                    <p><strong>Typing Speed </strong>{standing ? standing.speed : Math.round(typingSpeed)} wpm</p>
                    <p><strong>Accuracy </strong></p>
                </div>
            </article>
            <div>
                <div className={styles.carContainer} style={{ position: 'relative' }}>
                    <p className={styles.car} style={{ position: 'absolute', left: clientCarPosition + '%' }}></p>
                </div>
            </div>
            <Input value={raceTextInput} className={styles.inputBox} onChange={handleInputChange} disabled={race?.ended}
                type="textarea" style={{ resize: 'none' }} rows="5" cols="5" />
        </div>
    );
}
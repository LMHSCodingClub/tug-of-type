import { useAuth0 } from "@auth0/auth0-react";
import Head from "next/head";
import { useRef } from "react";
import { useCallback } from "react";
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
    const lastCorrectCharacter = useRef(0);
    const promptTextEl = useRef();
    const statsEl = useRef();
    const [endTime, setEndTime] = useState();
    const timerCallback = useRef();
    const timer = (id) => {
        if (race.timer === 0 || race?.ended) {
            if (!standing.speed)
                setEndTime(Date.now());
            clearInterval(id);
        } else {
            decrementTimer(params.get('id'));
        }
    };

    useEffect(() => {
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
        const numberOfWords = raceTextInput.split(" ").length;
        const speed = numberOfWords / minutesToComplete;
        return Math.round(speed);
    }, [endTime]);

    const handleInputChange = e => {
        e.preventDefault();

        const inputText = e.target.value;
        setRaceTextInput(inputText)
        const proportionOfRaceCompleted = inputText.length / race?.text?.words.length;

        if (race?.ended) return

        // Increases or decreases the x-position of the car in proportion to total length of prompt
        const index = inputText.length;
        if (inputText === race.text?.words.substring(0, index)) { // Text is accurate so far
            lastCorrectCharacter.current = index - 1;
            setClientCarPosition(proportionOfRaceCompleted * 90);
        }

        // If user has completed the text accurately
        if ((proportionOfRaceCompleted === 1 && inputText === race?.text?.words) || race.timer === 0) {
            setEndTime(Date.now());
            promptTextEl.current.classList.add(styles.raceEnd);
        }
    }

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            promptTextEl.current.scroll({ top: promptTextEl.current.scrollTop + 10, smooth: true })
        }
    }

    const calculateColorOfLetter = (position) => {
        if (position >= raceTextInput.length) {
            return "black"
        } else if (raceTextInput[position] === race?.text.words[position] && position <= lastCorrectCharacter.current) {
            return "green"
        } else {
            return "red"
        }
    }

    useEffect(() => {
        if (endTime) {
            endRace(race._id, standing._id, typingSpeed);
        }
    }, [endTime]);

    useEffect(() => {
        const id = setInterval(() => {
            timerCallback.current(id);
        }, 1000);

        return () => clearInterval(id);
    }, []);

    const [loaded, setLoaded] = useState(styles.preload);

    useEffect(() => {
        setTimeout(() => setLoaded(''), 900);
    }, [])

    return (
        <div className={`${loaded} ${styles.container} ${race.timer === 0 || race.ended ? styles.raceEnd : ''}`}>
            <Head>
                <title>Race | Tug of Type</title>
            </Head>
            <p className={styles.timer}>
                <time>{race.timer}</time>
            </p>
            <article className={styles.promptContainer}>
                <p className={`border p-5 h3 ${styles.prompt}`} ref={promptTextEl}>{race.text?.words.split("").map((item, index) => <span key={index} style={{ color: calculateColorOfLetter(index) }}>{item}</span>)}</p>
                <div className={`border p-5 h3 ${styles.stats}`} ref={statsEl}>
                    <p><strong>This quote is from </strong>{race.text?.source}</p>
                    <p><strong>Typing Speed </strong>{standing ? standing.speed : Math.round(typingSpeed)} wpm</p>
                    <p><strong>Accuracy </strong>{Math.round(Math.random() * 100)}%</p>
                </div>
            </article>
            <div>
                <div className={styles.carContainer} style={{ position: 'relative' }}>
                    <p className={styles.car} style={{ position: 'absolute', left: clientCarPosition + '%' }}></p>
                </div>
            </div>
            <div>
                <Input value={raceTextInput} className={styles.inputBox} onChange={handleInputChange} onKeyDown={handleKeyDown} disabled={race?.ended}
                    type="textarea" />
            </div>

        </div>
    );
}
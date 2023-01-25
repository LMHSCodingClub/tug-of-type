import { useAuth0 } from "@auth0/auth0-react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Input } from "reactstrap";
import { useMutation, useQuery } from '../convex/_generated/react';
import styles from "../styles/race.module.css";

export default function Race() {
    const params = new URLSearchParams(window.location.search);

    const decrementTimer = useMutation("decrementTimer");
    const race = useQuery('readRace', params.get('id')) || {}
    const endRace = useMutation('endRace');
    const joinRace = useMutation('joinRace');
    const standing = useQuery('readStanding', params.get('id')) || {};
    const endStanding = useMutation('endStanding');
    const updatePosition = useMutation('updatePosition')

    const [raceTextInput, setRaceTextInput] = useState('');
    const [clientCarPosition, setClientCarPosition] = useState(0);

    const lastCorrectCharacter = useRef(0);
    const promptTextEl = useRef();
    const statsEl = useRef();
    const wrongWordCounter = useRef(0); // Don't need to constantly get the value, only at the end ==> ref

    const timerCallback = useRef();

    const timer = (id) => {
        if (race?.ended || !standing.userIsHost) {
            clearInterval(id)
            return
        }
        if (race.timer === 0) {
            if (!standing.mine.speed) { // Race did not already end
                endStanding(standing.mine._id, { speed: typingSpeed(Date.now()), accuracy: typingAccuracy() })
                endRace(race._id);
            }
            clearInterval(id);
        } else {
            decrementTimer(params.get('id'));
        }
    };

    useEffect(() => {
        timerCallback.current = timer;
    }, [timer]);

    useEffect(() => {
        async function join() {
            await joinRace(params.get('id'));
        }
        join();
    }, [])

    const typingSpeed = (endTime) => {
        const minutesToComplete = Math.abs(endTime - race?._creationTime) / 1000 / 60;
        const numberOfWords = raceTextInput.split(" ").length;
        const speed = numberOfWords / minutesToComplete;

        return Math.round(speed);
    }

    const typingAccuracy = (inputSize = raceTextInput.length) => {
        return Math.round(inputSize / (race?.text.words.length + wrongWordCounter.current) * 100)
    }

    const scrolledToBottom = (element) => {
        return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1
    }

    const handleInputChange = e => {
        e.preventDefault();

        const inputText = e.target.value;
        setRaceTextInput(inputText)
        const position = inputText.length;
        const proportionOfRaceCompleted = position / race?.text?.words.length;

        if (race?.ended) return

        // Increases or decreases the x-position of the car in proportion to total length of prompt

        if (inputText === race.text?.words.substring(0, position)) { // Text is accurate so far
            lastCorrectCharacter.current = position - 1;
            setClientCarPosition(proportionOfRaceCompleted * 90);
        } else {
            wrongWordCounter.current++
        }

        updatePosition(standing.mine._id, proportionOfRaceCompleted * 90)

        if (position % 40 === 0 && !scrolledToBottom(promptTextEl.current)) {
            promptTextEl.current.scroll({ top: promptTextEl.current.scrollTop + 10, behavior: 'smooth' })
        }

        // If user has completed the text accurately
        if ((proportionOfRaceCompleted === 1 && inputText === race?.text?.words)) {
            endStanding(standing.mine._id, { speed: typingSpeed(Date.now()), accuracy: typingAccuracy(position) });

            if (standing.opponents.every(item => item.speed)) {
                endRace(race._id)
            }
        }
    }

    const handleKeyDown = e => {
        if (e.key === 'Enter' && !scrolledToBottom(promptTextEl.current)) {
            promptTextEl.current.scroll({ top: promptTextEl.current.scrollTop + 30, behavior: 'smooth' })
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
        <div className={`${loaded} ${styles.container} ${race.timer === 0 || standing.allFinished || race.ended ? styles.raceEnd : ''}`}>
            <Head>
                <title>Race | Tug of Type</title>
            </Head>
            <div className="d-flex">
                <p className={styles.timer}>
                    <time>{race.timer}</time>
                </p>
                <div className={styles.carContainer} style={{ position: 'relative' }}>
                    <p className={styles.car} style={{ position: 'absolute', left: clientCarPosition + '%' }}></p>
                    {standing.opponents?.map(item => (
                        <p key={item._id.toString()} className={styles.car} style={{ position: 'absolute', left: item.position + '%' }}>{item.speed}</p>
                    ))}
                </div>
            </div>
            <article className={styles.promptContainer}>
                <p className={`border p-5 h3 ${styles.prompt}`} ref={promptTextEl}>{race.text?.words.split("").map((item, index) => <span key={index} style={{ color: calculateColorOfLetter(index) }}>{item}</span>)}</p>
                <div className={`border p-5 h3 ${styles.stats}`} ref={statsEl}>
                    <p><strong>This quote is from </strong>{race.text?.source}</p>
                    <p><strong>Typing Speed </strong>{standing.mine?.speed} wpm</p>
                    <p><strong>Accuracy </strong>{standing.mine?.accuracy}%</p>
                </div>
            </article>
            <div>
                <Input value={raceTextInput} className={styles.inputBox} onChange={handleInputChange} onKeyDown={handleKeyDown} disabled={race?.ended}
                    type="textarea" />
            </div>

        </div>
    );
}
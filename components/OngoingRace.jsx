import { useMemo, useRef, useState, useEffect } from "react";
import { useMutation, useQuery } from "../convex/_generated/react"
import styles from "../styles/race.module.css"
import { Input } from "reactstrap";

export default function OngoingRace({ raceId }) {
    const race = useQuery('readRace', { id: raceId }) || {}
    const promptTextEl = useRef();
    const statsEl = useRef();

    const decrementTimer = useMutation("race/decrementTimer");

    const [raceTextInput, setRaceTextInput] = useState('');
    const [clientCarPosition, setClientCarPosition] = useState(0);
    const standing = useQuery('readStanding', { raceId })
    const endStanding = useMutation('endStanding');
    const lastCorrectCharacter = useRef(0);
    const updatePosition = useMutation('race/updatePosition')

    const wrongWordCounter = useRef(0); // Don't need to constantly get the value, only at the end ==> ref

    const joinRace = useMutation('joinRace');
    const endRace = useMutation('endRace');

    const timerCallback = useRef();

    const timer = (id) => {
        if (race?.ended || !standing.userIsHost) {
            clearInterval(id)
            return
        }
        if (race.timer === 0) {
            if (!standing.mine.position < 1) { // User did not already finish
                endStanding({ standingId: standing.mine._id, speed: typingSpeed(Date.now()), accuracy: typingAccuracy() })
                endRace({ raceId: race._id });
            }
            clearInterval(id);
        } else {
            decrementTimer({ id: raceId });
        }
    };

    useEffect(() => {
        timerCallback.current = timer;
    }, [timer]);

    useEffect(() => {
        if (!(standing || race.ended))
            joinRace({ race: raceId });
    }, [])

    useEffect(() => {
        const id = setInterval(() => {
            timerCallback.current(id);
        }, 1000);

        return () => clearInterval(id);
    }, []);

    const typingSpeed = (endTime) => {
        const minutesToComplete = Math.abs(endTime - race?._creationTime) / 1000 / 60;
        const numberOfWords = raceTextInput.split(" ").length;
        const speed = numberOfWords / minutesToComplete;

        return Math.round(speed);
    }

    const typingAccuracy = (inputSize = raceTextInput.length) => {
        return Math.round(inputSize / (race?.text.words.length + wrongWordCounter.current) * 100)
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
            setClientCarPosition(proportionOfRaceCompleted);
        } else {
            wrongWordCounter.current++
        }

        updatePosition({ standingId: standing.mine._id, position: Math.round(proportionOfRaceCompleted * 20) / 20 })

        if (position % 40 === 0 && !scrolledToBottom(promptTextEl.current)) {
            promptTextEl.current.scroll({ top: promptTextEl.current.scrollTop + 10, behavior: 'smooth' })
        }

        // If user has completed the text accurately
        if ((proportionOfRaceCompleted === 1 && inputText === race?.text?.words)) {
            endStanding({ standingId: standing.mine._id, speed: typingSpeed(Date.now()), accuracy: typingAccuracy(position) });

            if (standing.opponents.every(item => item.speed)) {
                endRace({ raceId: race._id })
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

    const isRight = useMemo(() => {
        return !raceTextInput || race?.text?.words.substring(0, raceTextInput.length) === raceTextInput || raceTextInput.length !== 0
    }, [raceTextInput])

    const scrolledToBottom = (element) => {
        return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1
    }

    return (
        <div className={styles.container}>
            <div className="d-flex">
                <p className={styles.timer}>
                    <time>{race.timer}</time>
                </p>
                <div className={styles.carContainer} style={{ position: 'relative' }}>
                    <p
                        className={styles.car}
                        style={{ position: 'absolute', left: clientCarPosition * 90 + '%' }}
                    ></p>
                    {standing?.opponents?.map((item) => (
                        <p
                            key={item._id.toString()}
                            className={styles.car}
                            style={{ position: 'absolute', left: item.position * 90 + '%' }}
                        >
                        </p>
                    ))}
                </div>
            </div>
            <article className={styles.promptContainer}>
                <p className={`border p-5 h3 ${styles.prompt}`} ref={promptTextEl}>
                    {race.text?.words.split('').map((item, index) => (
                        <span key={index} style={{ color: calculateColorOfLetter(index) }}>
                            {item}
                        </span>
                    ))}
                </p>
            </article>
            <div>
                <Input
                    value={raceTextInput}
                    className={styles.inputBox}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={race?.ended}
                    type="textarea"
                    style={{ backgroundColor: isRight ? '' : 'bisque' }}
                    autoFocus
                />
            </div>
        </div>
    )
}

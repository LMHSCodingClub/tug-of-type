import { useMemo, useRef, useState, useEffect } from "react";
import { useMutation, useQuery } from "../convex/_generated/react"
import styles from "../styles/race.module.css"
import { Input, Row } from "reactstrap";
import Timer from "./Timer";
import { Id } from "../convex/_generated/dataModel";
import { useRouter } from "next/router";
import { scrolledToBottom } from "../lib/helpers";
import { typingSpeed, typingTime } from "../lib/metrics";

export default function OngoingRace({ raceId }) {
    const race = useQuery('race/readRace', { id: raceId }) || {}
    const promptTextEl = useRef();
    const statsEl = useRef();

    const [raceTextInput, setRaceTextInput] = useState('');
    const [clientCarPosition, setClientCarPosition] = useState(0);
    const standing = useQuery('race/readStanding', { raceId })
    const endStanding = useMutation('race/endStanding');
    const updatePosition = useMutation('race/updatePosition')

    const joinRace = useMutation('race/joinRace');
    const endRace = useMutation('race/endRace');

    const lastCorrectCharacter = useRef(0);
    const wrongWordCounter = useRef(0); // Don't need to constantly get the value, only at the end ==> ref

    const router = useRouter()

    useEffect(() => {
        // Standing has been fetched and the user is not in the race and the race has not ended
        if (!standing?.mine && standing?.players && !race.ended)
            joinRace({ race: raceId });
    }, [standing?.userIsHost]) // Use a property of standing that does not change once initialized 

    const typingAccuracy = (inputSize = raceTextInput.length) => {
        return Math.round(inputSize / (race?.text.words.length + wrongWordCounter.current) * 100)
    }

    const handleInputChange = async e => {
        e.preventDefault();

        const inputText = e.target.value;
        setRaceTextInput(inputText)
        const position = inputText.length;

        if (race?.ended) return

        if (raceTextInput.length % 60 === 0) {
            promptTextEl.current.scroll({ top: promptTextEl.current.scrollTop + 30, behavior: 'smooth' })
        }

        // Increases or decreases the x-position of the car in proportion to total length of prompt
        const proportionOfRaceCompleted = position / race?.text?.words.length;
        if (inputText === race.text?.words.substring(0, position)) { // Text is accurate so far
            lastCorrectCharacter.current = position - 1;
            setClientCarPosition(proportionOfRaceCompleted);
            updatePosition({ standingId: standing.mine._id, position: Math.round(proportionOfRaceCompleted * 20) / 20 })
        } else {
            wrongWordCounter.current++
        }


        // If user has completed the text accurately
        if ((proportionOfRaceCompleted === 1 && inputText === race?.text?.words)) {
            endStanding({
                standingId: standing.mine._id,
                speed: typingSpeed(raceTextInput.length, race._creationTime),
                accuracy: typingAccuracy(position),
                time: typingTime(race._creationTime)
            });

            if (standing.opponents.every(item => item.speed)) {
                const end = await endRace({ raceId: race._id })
                console.debug(end)
                if (end instanceof Id) {
                    router.push('/practice?id=' + end.id)
                }
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

    return (
        <div className={styles.container}>
            <div className="d-flex">
                {!race?.ended ? (
                    <Timer onTimerFinish={() => {
                        if (!standing.mine.position < 1) { // User did not already finish the text
                            endStanding({
                                standingId: standing.mine._id,
                                speed: typingSpeed(raceTextInput.length, race._creationTime),
                                accuracy: typingAccuracy(raceTextInput.length),
                                time: typingTime(race._creationTime)
                            })
                            endRace({ raceId: race._id });
                        }
                    }} typeInfo={{ typeName: 'Race', typeId: race._id }} withMutate={standing?.userIsHost} />
                ) : null}
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
            <Row>
                <div className="col-sm-4">
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
                <article className={`${styles.promptContainer} col-sm-8`}>
                    <p className={`h3 ${styles.prompt}`} ref={promptTextEl}>
                        {race.text?.words.split('').map((item, index) => (
                            <span key={index} style={{ color: calculateColorOfLetter(index) }}>
                                {item}
                            </span>
                        ))}
                    </p>
                </article>
            </Row>

        </div>
    )
}

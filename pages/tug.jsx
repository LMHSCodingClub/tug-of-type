import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Modal, ModalFooter, ModalHeader } from "reactstrap";
import Timer from "../components/Timer";
import { useMutation, useQuery } from "../convex/_generated/react";
import styles from "../styles/tug.module.css";
import { scrolledToBottom, typingAccuracy, typingSpeed } from "../lib/helpers";
import { timingSafeEqual } from "crypto";
import EndedTug from "../components/EndedTug";

export default function Tug(props) {
    const params = new URLSearchParams(window.location.search);
    const tug = useQuery('tug/readTug', { id: params.get('id') })

    const endTug = useMutation('tug/endTug')
    const updatePosition = useMutation('tug/updatePosition')
    const joinTugAsGuestPlayer = useMutation('tug/joinTug')
    const regenerateText = useMutation('tug/regenerateText')

    const [joinModal, showJoinModal] = useState(true)
    const [textInput, setTugTextInput] = useState('')
    const lastCorrectCharacter = useRef(0);
    const promptTextEl = useRef();
    const wrongWordCounter = useRef()
    let netProgression = tug?.hostProgression - tug?.guestProgression

    const onJoin = () => {
        joinTugAsGuestPlayer({ tugId: tug._id })
        showJoinModal(false)
    }

    const onSpectate = () => showJoinModal(false)

    useEffect(() => {
        setTugTextInput("")
    }, [tug?.text.words])

    const handleInputChange = async e => {
        e.preventDefault()
        // Scroll if the user presses 'Enter' for a new line to make visible the next lines in the prompt text
        if (e.key === 'Enter' && !scrolledToBottom(promptTextEl.current)) {
            promptTextEl.current.scroll({ top: promptTextEl.current.scrollTop + 30, behavior: 'smooth' })
        }

        const userInput = e.target.value
        setTugTextInput(userInput)
        const position = userInput.length;

        if (tug?.ended) return

        const accurateSoFar = userInput === tug.text.words.substring(0, position)
        const proportionOfTextCompleted = position / tug?.text?.words.length;
        if (accurateSoFar) {
            lastCorrectCharacter.current = position - 1;
        } else {
            wrongWordCounter.current++
        }

        updatePosition({ tugId: tug._id, playerType: tug.playerType, position: Math.round(proportionOfTextCompleted * 100) / 100 })

        // Scroll as the user types
        if (position % 40 === 0 && !scrolledToBottom(promptTextEl.current)) {
            promptTextEl.current.scroll({ top: promptTextEl.current.scrollTop + 10, behavior: 'smooth' })
        }

        if (proportionOfTextCompleted >= 1) {
            regenerateText({ tugId: tug._id })
        }

        if (Math.abs(netProgression) >= 0.54) {
            endTug({
                id: tug._id,
                [`${tug.playerType}Speed`]: typingSpeed(textInput.length, tug._creationTime),
                [`${tug.playerType}Accuracy`]: typingAccuracy(textInput.length, tug.text.words.length, wrongWordCounter.current)
            })
        }
    }

    const calculateColorOfLetter = (position) => {
        if (position >= textInput.length) {
            return "black"
        } else if (textInput[position] === tug.text.words[position] && position <= lastCorrectCharacter.current) {
            return "green"
        } else {
            return "red"
        }
    }

    const isRight = useMemo(() => {
        return !textInput || tug.text.words.substring(0, textInput.length) === textInput || textInput.length !== 0
    }, [textInput])

    if (!tug) return <p>Loading</p>

    if (tug.ended) return <EndedTug id={tug._id.id} />

    return (
        <div className={styles.container}>
            <Head>
                <title>Tug of Type</title>
            </Head>
            {tug.openToJoin ? (
                <Modal isOpen={joinModal} fullscreen="sm">
                    <ModalHeader>Play this Tug against {tug.host.username}?</ModalHeader>
                    <ModalFooter>
                        <Button color="primary" onClick={onJoin}>Play</Button>
                        <Button color="secondary" onClick={onSpectate}>Spectate</Button>
                    </ModalFooter>
                </Modal>
            ) : null}
            {!tug.ended && tug.guest ? (
                <Timer onTimerFinish={() => {
                    endTug({ id: tug._id })
                }} typeInfo={{ typeName: 'Tug', typeId: tug._id }} withMutate={tug.playerType === 'host'} />
            ) : null}
            <p style={{ textAlign: 'center' }}>{!tug.guest ? "Waiting for opponent..." : ""}</p>
            <div className={styles.tugContainer}>
                <div className={styles.tickLines}>
                    <span></span>
                    <span className={styles.playerWin}></span>
                    <span></span>
                    <span className={styles.starting}></span>
                    <span></span>
                    <span className={styles.opponentWin}></span>
                    <span></span>
                </div>
                <img className={styles.car} src="/car.png" style={{ left: 33.2 - netProgression / 3 * 100 + '%' }} />
                <img className={styles.car} src="/car.png" style={{ left: 59 - netProgression / 3 * 100 + '%', transform: 'scaleX(-1)' }} />
                <p style={{ left: 50 - netProgression / 3 * 100 + '%' }} className={styles.rope}></p>
            </div>
            <article className={styles.promptContainer}>
                <p className={`border p-5 h3 ${styles.prompt}`} ref={promptTextEl}>
                    {tug.text.words.split('').map((item, index) => (
                        <span key={index} style={{ color: calculateColorOfLetter(index) }}>{item}</span>
                    ))}
                </p>
            </article>
            <div>
                <Input
                    value={textInput}
                    className={styles.inputBox}
                    onChange={handleInputChange}
                    disabled={tug.ended || !tug.guest || tug.playerType === 'spectator'}
                    type="textarea"
                    style={{ backgroundColor: isRight ? '' : 'bisque' }}
                    autoFocus
                />
            </div>


        </div>
    )
}
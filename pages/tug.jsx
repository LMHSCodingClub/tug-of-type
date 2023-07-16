import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Modal, ModalFooter, ModalHeader, Row } from "reactstrap";
import Timer from "../components/Timer";
import { useMutation, useQuery } from "../convex/_generated/react";
import styles from "../styles/tug.module.css";
import { scrolledToBottom } from "../lib/helpers";
import { typingAccuracy, typingSpeed } from "../lib/metrics"
import EndedTug from "../components/EndedTug";
import TugArena from "../components/TugArena";
import { useConvexAuth } from "convex/react";
import TugGameStatus from "../components/TugGameStatus";

// Kind-of hard-coded. To make more intuitive, rethink relationship b/w front-end positioning and back-end 'progression' data
const REGULAR_WIN_THRESHOLD = 1.07, OVERTIME_WIN_THRESHOLD = 0.6, DOUBLE_OVERTIME_WIN_THRESHOLD = 0.09

export default function Tug(props) {
    const { isAuthenticated } = useConvexAuth()
    if (!isAuthenticated) return <p>You must log in before you can play</p>

    const params = new URLSearchParams(window.location.search);
    const tug = useQuery('tug/readTug', { id: params.get('id') })

    const endTug = useMutation('tug/endTug')
    const winTug = useMutation('tug/winTug')
    const updatePosition = useMutation('tug/updatePosition')
    const joinTugAsGuestPlayer = useMutation('tug/joinTug')
    const regenerateText = useMutation('tug/regenerateText')
    const enterOvertime = useMutation('tug/enterOvertime')

    const [joinModal, showJoinModal] = useState(true)
    const [textInput, setTugTextInput] = useState("")
    const lastCorrectCharacter = useRef(0);
    const promptTextEl = useRef();
    const wrongWordCounter = useRef(0)
    let netProgression = tug?.hostProgression - tug?.guestProgression
    let tugEnded = !(isNaN(tug?.hostSpeed) || isNaN(tug?.hostAccuracy) || isNaN(tug.guestSpeed) || isNaN(tug?.guestAccuracy))
    const lastProportion = useRef(0);

    const [initialTime, setInitialTime] = useState(90)

    useEffect(() => {
        setTugTextInput("")
    }, [tug?.text?.words])

    useEffect(() => {
        if (tug?.ended) postFinalTugData()
    }, [tug?.ended])

    if (!tug) {
        return <p>The tug does not exist.</p>
    }

    const onJoin = () => {
        joinTugAsGuestPlayer({ tugId: tug._id })
        showJoinModal(false)
    }

    const onSpectate = () => showJoinModal(false)

    const handleInputChange = async e => {
        e.preventDefault()
        // Scroll if the user presses 'Enter' for a new line to make visible the next lines in the prompt text
        if (e.key === 'Enter' && !scrolledToBottom(promptTextEl.current)) {
            promptTextEl.current.scroll({ top: promptTextEl.current.scrollTop + 30, behavior: 'smooth' })
        }

        const userInput = e.target.value
        const position = userInput.length;
        const accurateSoFar = textInput === tug.text.words.substring(0, textInput.length)
        // Let user type new text
        if (userInput.length >= textInput.length) {
            setTugTextInput(userInput)
        } else if (!accurateSoFar && userInput.length >= lastCorrectCharacter.current) {
            // Let the user fix existing text with Delete/Backspace buttons
            setTugTextInput(userInput)
        }

        if (accurateSoFar && userInput.length >= textInput.length) {
            lastCorrectCharacter.current = position - 1;
            lastProportion.current += 1 / tug?.text.words.length
            // Scale up the position to 110% of original value so that the car reaching the end does not match the text regeneration (otherwise the game cannot end)
            const carPosition = Math.round(lastProportion.current * 100) / 100
            await updatePosition({
                tugId: tug._id,
                playerType: tug.playerType,
                position: carPosition
            })
            console.log(Math.abs(netProgression))
        } else {
            wrongWordCounter.current++
        }

        if (accurateSoFar && position / tug?.text?.words.length >= 1) {
            return regenerateText({ tugId: tug._id })
        }

        if (tug.status === 'AP' && Math.abs(netProgression) >= REGULAR_WIN_THRESHOLD
            || tug.status === 'OV' && Math.abs(netProgression) >= OVERTIME_WIN_THRESHOLD
            || tug.status === 'DO' && Math.abs(netProgression) >= DOUBLE_OVERTIME_WIN_THRESHOLD
            || tug.status === 'SD') {
            postFinalTugData()
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

    if (!tug) return <p>Loading</p>

    if (tug.status === 'WH' || tug.status === 'WG') return <EndedTug id={tug._id} />

    function postFinalTugData() {
        endTug({
            playerType: tug.playerType,
            id: tug._id,
            speed: typingSpeed(lastCorrectCharacter.current, tug.startTime),
            accuracy: typingAccuracy(lastCorrectCharacter.current, wrongWordCounter.current)
        })
        winTug({id: tug._id})
    }

    const onTimerFinish = async () => {
        if (tug.playerType === 'host') {
            const newInitialTime = await enterOvertime({id: tug._id})
            setInitialTime(newInitialTime)
        }
    }

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
            {!tugEnded && tug.guest ? (
                <Timer onTimerFinish={onTimerFinish} typeInfo={{ typeName: 'Tug', typeId: tug._id }} withMutate={tug.playerType === 'host'} initialTime={initialTime} />
            ) : null}
            <div style={{ textAlign: 'center' }}>
                <TugGameStatus tug={tug} />
            </div>
            <TugArena id={tug._id.id} />
            <Row className={`py-4 pe-5 ${styles.textsContainer}`}>
                <div className="col-sm-5">
                    <Input
                        value={textInput}
                        className={styles.inputBox}
                        onChange={handleInputChange}
                        hidden={tug.playerType === 'spectator'}
                        disabled={tugEnded || !tug.guest}
                        type="textarea"
                        autoCorrect="off"
                        autoComplete="off"
                        autoFocus
                    />
                </div>
                <article className={`${styles.promptContainer} col-sm-7`}>
                    <p className="h3 prompt" ref={promptTextEl}>
                        {tug.text.words.split('').map((item, index) => (
                            <span key={index} style={{ color: calculateColorOfLetter(index) }}>{item}</span>
                        ))}
                    </p>
                </article>
            </Row>
        </div>
    )
}
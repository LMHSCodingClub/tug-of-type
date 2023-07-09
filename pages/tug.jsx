import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Modal, ModalFooter, ModalHeader, Row } from "reactstrap";
import Timer from "../components/Timer";
import { useMutation, useQuery } from "../convex/_generated/react";
import styles from "../styles/tug.module.css";
import { scrolledToBottom, typingAccuracy, typingSpeed } from "../lib/helpers";
import EndedTug from "../components/EndedTug";
import TugArena from "../components/TugArena";
import { useConvexAuth } from "convex/react";
import TugGameStatus from "../components/TugGameStatus";

export default function Tug(props) {
    const { isAuthenticated } = useConvexAuth()
    if (!isAuthenticated) return <p>You must log in before you can play</p>

    const params = new URLSearchParams(window.location.search);
    const tug = useQuery('tug/readTug', { id: params.get('id') })

    const endTug = useMutation('tug/endTug')
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
        if (!isNaN(textInput.length / tug?.text?.words.length))
            lastProportion.current += textInput.length / tug.text.words.length
    }, [tug?.text?.words])

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
        setTugTextInput(userInput)
        const position = userInput.length;

        const accurateSoFar = userInput === tug.text.words.substring(0, position)
        const proportionOfTextCompleted = position / tug?.text?.words.length + lastProportion.current
        if (accurateSoFar) {
            lastCorrectCharacter.current = position - 1;
            // Scale up the position to 110% of original value so that the car reaching the end does not match the text regeneration (otherwise the game cannot end)
            const carPosition = Math.round(proportionOfTextCompleted * 100) / 100
            updatePosition({
                tugId: tug._id,
                playerType: tug.playerType,
                position: carPosition
            })
        } else {
            wrongWordCounter.current++
        }

        if (accurateSoFar && position / tug?.text?.words.length >= 1) {
            return regenerateText({ tugId: tug._id })
        }

        console.debug(netProgression)

        if (Math.abs(netProgression) >= 0.54) {
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

    if (tugEnded) return <EndedTug id={tug._id} />

    function postFinalTugData() {
        endTug({
            playerType: tug.playerType,
            id: tug._id,
            speed: typingSpeed(textInput.length, tug.startTime),
            accuracy: typingAccuracy(textInput.length, wrongWordCounter.current)
        })
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
import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Modal, ModalFooter, ModalHeader, Row } from "reactstrap";
import Timer from "../components/Timer";
import { useMutation, useQuery } from "../convex/_generated/react";
import styles from "../styles/tug.module.css";
import { scrolledToBottom, typingAccuracy, typingSpeed } from "../lib/helpers";
import { timingSafeEqual } from "crypto";
import EndedTug from "../components/EndedTug";
import TugArena from "../components/TugArena";
import { useConvexAuth } from "convex/react";

export default function Tug(props) {
    const { isAuthenticated } = useConvexAuth()
    if (!isAuthenticated) return <p>You must log in before you can play</p>

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
    const wrongWordCounter = useRef(0)
    let netProgression = tug?.hostProgression - tug?.guestProgression
    let tugEnded = tug?.hostSpeed && tug?.hostAccuracy && tug.guestSpeed && tug?.guestAccuracy
    let lastProportion = 0;

    const onJoin = () => {
        joinTugAsGuestPlayer({ tugId: tug._id })
        showJoinModal(false)
    }

    const onSpectate = () => showJoinModal(false)

    useEffect(() => {
        setTugTextInput("")
        lastProportion = textInput.length / tug?.text?.words.length
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

        const accurateSoFar = userInput === tug.text.words.substring(0, position)
        const proportionOfTextCompleted = position / tug?.text?.words.length + lastProportion
        if (accurateSoFar) {
            lastCorrectCharacter.current = position - 1;
            updatePosition({ tugId: tug._id, playerType: tug.playerType, position: Math.round(proportionOfTextCompleted * 100) / 100 })
        } else {
            wrongWordCounter.current++
        }

        if (proportionOfTextCompleted >= 1) {
            return regenerateText({ tugId: tug._id })
        }

        if (Math.abs(netProgression) >= 0.54)
            postFinalTugData()
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

    if (tug.guestSpeed && tug.guestAccuracy && tug.hostSpeed && tug.hostAccuracy) return <EndedTug id={tug._id.id} />

    function postFinalTugData() {
        console.group('[postFinalTugData]', new Date().toLocaleTimeString())
        console.log('Posting %s wpm to tug datastore', typingSpeed(textInput.length, tug._creationTime))
        console.log('Posting %s% to tug datastore', typingAccuracy(textInput.length, tug.text.words.length, wrongWordCounter.current))
        console.groupEnd()
        endTug({
            playerType: tug.playerType,
            id: tug._id,
            speed: typingSpeed(textInput.length, tug._creationTime),
            accuracy: typingAccuracy(textInput.length, tug.text.words.length, wrongWordCounter.current)
        })
    }

    const onTimerFinish = () => postFinalTugData()

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
                <Timer onTimerFinish={onTimerFinish} typeInfo={{ typeName: 'Tug', typeId: tug._id }} withMutate={tug.playerType === 'host'} />
            ) : null}
            <p style={{ textAlign: 'center' }}>{!tug.guest ? "Waiting for opponent..." : ""}</p>
            <TugArena id={tug._id.id} />
            <Row className={`py-4 pe-5 ${styles.textsContainer}`}>
                <div className="col-sm-5">
                    <Input
                        value={textInput}
                        className={styles.inputBox}
                        onChange={handleInputChange}
                        disabled={tugEnded || !tug.guest || tug.playerType === 'spectator'}
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
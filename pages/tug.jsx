import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Modal, ModalFooter, ModalHeader } from "reactstrap";
import { useMutation, useQuery } from "../convex/_generated/react";
import styles from "../styles/tug.module.css";
import Timer from "../components/Timer";

export default function Tug(props) {
    const params = new URLSearchParams(window.location.search);
    const tug = useQuery('tug/readTug', { id: params.get('id') })
    const decrementTimer = useMutation('tug/decrementTimer')
    const updatePosition = useMutation('tug/updatePosition')
    const joinTugAsGuestPlayer = useMutation('tug/joinTug')
    const [joinModal, showJoinModal] = useState(true)
    const [textInput, setTugTextInput] = useState('')
    const lastCorrectCharacter = useRef(0);
    const promptTextEl = useRef();
    const wrongWordCounter = useRef()

    useEffect(() => {
        let id;
        if (tug?.playerType === 'host') {
            id = setInterval(() => {
                const timer = decrementTimer({ id: tug._id })
                if (timer.shouldStop) {
                    clearInterval(id)
                }
            }, 1000)
        }

        return () => clearInterval(id)
    }, [tug?.playerType])

    const onType = e => {
        setTugTextInput(e.target.value)
        updatePosition({ tugId: tug._id, playerType: tug.playerType, position: e.target.value.length / tug.text.words.length })
    }

    const onJoin = () => {
        joinTugAsGuestPlayer({ tugId: tug._id })
        showJoinModal(false)
    }

    const onSpectate = () => showJoinModal(false)

    const handleInputChange = e => {
        // Scroll if the user presses 'Enter' for a new line to make visible the next lines in the prompt text
        if (e.key === 'Enter' && !scrolledToBottom(promptTextEl.current)) {
            promptTextEl.current.scroll({ top: promptTextEl.current.scrollTop + 30, behavior: 'smooth' })
        }

        const userInput = e.target.value
        const position = textInput.length;

        if (userInput === tug.text.words.substring(0, position)) { // Text is accurate so far
            lastCorrectCharacter.current = position - 1;
            setClientCarPosition(proportionOfTypeCompleted);
        } else {
            wrongWordCounter.current++
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
            <Timer readOnly />
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
                    disabled={tug.text.ended}
                    type="textarea"
                    style={{ backgroundColor: isRight ? '' : 'bisque' }}
                    autoFocus
                />
            </div>

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
                <img className={styles.car} src="/car.png" style={{ left: 33.2 - tug.hostProgression * 100 + '%' }} />
                <img className={styles.car} src="/car.png" style={{ right: 33.2 - tug.guestProgression * 100 + '%', transform: 'scaleX(-1)' }} />
                <p className={styles.rope}></p>
            </div>
        </div>
    )
}
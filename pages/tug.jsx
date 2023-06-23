import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Modal, ModalFooter, ModalHeader } from "reactstrap";
import { useMutation, useQuery } from "../convex/_generated/react";
import styles from "../styles/tug.module.css";
import Timer from "../components/Timer";

export default function Tug(props) {
    const params = new URLSearchParams(window.location.search);
    const tug = useQuery('tug/readTug', { id: params.get('id') })
    const endTug = useMutation('tug/endTug')
    const updatePosition = useMutation('tug/updatePosition')
    const joinTugAsGuestPlayer = useMutation('tug/joinTug')
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

    const handleInputChange = e => {
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
        const proportionOfTugCompleted = position / tug?.text?.words.length;
        if (accurateSoFar) {
            lastCorrectCharacter.current = position - 1;
        } else {
            wrongWordCounter.current++
        }

        updatePosition({ tugId: tug._id, playerType: tug.playerType, position: Math.round(proportionOfTugCompleted * 100) / 100 })
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
            <Timer onTimerFinish={() => {
                endTug({ id: tug._id })
            }} typeInfo={{ typeName: 'Tug', typeId: tug._id }} withMutate={tug.playerType === 'host'} />
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
                    disabled={tug.ended}
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
                <img className={styles.car} src="/car.png" style={{ left: 33.2 - netProgression / 3 * 100 + '%' }} />
                <img className={styles.car} src="/car.png" style={{ left: 59 - netProgression / 3 * 100 + '%', transform: 'scaleX(-1)' }} />
                <p style={{ left: 50 - netProgression / 3 * 100 + '%' }} className={styles.rope}></p>
            </div>
        </div>
    )
}
import Head from "next/head";
import { useEffect, useState } from "react";
import { Input } from "reactstrap";
import styles from "../styles/tug.module.css";
import { useMutation, useQuery } from "../convex/_generated/react"

export default function Tug(props) {
    const [clientCarPosition, setClientCarPosition] = useState(0.37);
    const params = new URLSearchParams(window.location.search);
    const tug = useQuery('tug/readTug', { id: params.get('id') })
    const decrementTimer = useMutation('tug/decrementTimer')
    const updatePosition = useMutation('tug/updatePosition')

    useEffect(() => {
        let id;
        if (tug?.userIsHost) {
            console.log(tug.userIsHost)
            id = setInterval(() => {
                const timer = decrementTimer({ id: tug._id })
                if (timer.shouldStop) {
                    clearInterval(id)
                }
            }, 1000)
        }

        return () => clearInterval(id)
    }, [tug?.userIsHost])

    const onType = e => {
        updatePosition({ tugId: tug._id, playerType: tug.playerType, position: 2 })
    }

    if (!tug) return <p>Loading</p>

    return (
        <div className={styles.container}>
            <Head>
                <title>Tug of Type</title>
            </Head>
            <Input onChange={onType} />
            <p className={styles.timer}>{tug.timer}</p>
            <p>{tug.text.words}</p>
            <div className={styles.tugContainer}>
                <div className={styles.tickLines}>
                    <span className={styles.playerBound}></span>
                    <span className={styles.playerWin}></span>
                    <span className={styles.starting}></span>
                    <span className={styles.opponentWin}></span>
                    <span className={styles.opponentBound}></span>
                </div>
                <img className={styles.car} src="/car.png" height="100" style={{ left: clientCarPosition * 90 + '%' }} />
                <img className={styles.car} src="/car.png" height="100" style={{ right: '33.5%', transform: 'scaleX(-1)' }} />
                <p className={styles.rope}></p>
            </div>
        </div>
    )
}
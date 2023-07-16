import {useMutation, useQuery} from "../convex/_generated/react"
import styles from "../styles/tug.module.css"
import TugArena from "./TugArena"
import {useEffect} from "react";
import Head from "next/head";

export default function EndedTug({ id }) {
    console.log("Id", id)
    const tug = useQuery('tug/readTug', { id: id.id })
    const textLeaderboard = useQuery('text/readText', { textId: tug.text._id })
    const winTug = useMutation('tug/winTug')

    useEffect(() => {
        if (tug?.status === 'EC') {
            winTug({ id })
        }
    }, [tug?.status])

    return (
        <div className={styles.endedTug}>
            <Head>
                <title>Tug of Type</title>
            </Head>
            <PlayerStats playerType='host' tug={tug} won={tug.status === 'WH'} />
            <PlayerStats playerType='guest' tug={tug} won={tug.status === 'WG'} />
            <TugArena mini id={id.id} />
            <div className={styles.textInfo}>
                <strong>{tug.text.source}</strong>
                <blockquote>{tug.text.words}</blockquote>
            </div>
            <div className={styles.textLeaderboard}>
                <h2>Top Tuggers of this Text</h2>
                <ol>
                    {textLeaderboard?.topTypers.map(item => <li key={item.standing._id.id}>{item.user.name} at {item.standing.speed} wpm</li>)}
                </ol>
            </div>
        </div>
    )
}

function PlayerStats({ playerType, tug, won }) {
    return (
        <article className={`${playerType}Numbers`}>
            <h3>
                {won ? <img src='winner.png' height='30' /> : null}
                <span> {playerType[0].toUpperCase()}{playerType.substring(1).toLowerCase()}</span>
                <span>{tug.playerType === playerType ? ' (You)': ''}</span>
            </h3>
            <p>
                <img title="Speed" height="30" src="/speed.png" />
                <span> {tug[playerType + 'Speed']} wpm</span>
            </p>
            <p>
                <img title="Accuracy" height="30" src="/accuracy.png" />
                <span> {tug[playerType + 'Accuracy']}%</span>
            </p>
        </article>
    )
}
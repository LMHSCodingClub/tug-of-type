import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "reactstrap";
import { useMutation, useQuery } from '../convex/_generated/react';
import styles from "../styles/race.module.css";
import EndedRace from "../components/EndedRace";
import OngoingRace from "../components/OngoingRace";

export default function Race() {
    const params = new URLSearchParams(window.location.search);

    const race = useQuery('readRace', { id: params.get('id') }) || {}
    const standing = useQuery('readStanding', { raceId: params.get('id') }) || {};

    return (
        <div className={`${styles.container} ${race.timer === 0 || standing.allFinished || race.ended ? styles.raceEnd : ''}`}>
            <Head>
                <title>Race | Tug of Type</title>
            </Head>
            {race.ended ? <EndedRace race={race} standing={standing} /> : <OngoingRace raceId={params.get('id')} />}
        </div>
    )
}
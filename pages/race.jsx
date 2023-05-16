import Head from "next/head";
import EndedRace from "../components/EndedRace";
import OngoingRace from "../components/OngoingRace";
import { useQuery } from '../convex/_generated/react';
import styles from "../styles/race.module.css";

export default function Race() {
    const params = new URLSearchParams(window.location.search);
    const race = useQuery('readRace', { id: params.get('id') }) || {}

    return (
        <div className={styles.container}>
            <Head>
                <title>Race | Tug of Type</title>
            </Head>
            {race.ended ? <EndedRace id={params.get('id')} /> : <OngoingRace raceId={params.get('id')} />}
        </div>
    )
}
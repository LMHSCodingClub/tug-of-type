import styles from "../styles/race.module.css"
import { useMutation, useQuery } from '../convex/_generated/react'
import { useState } from "react";
import { Input } from "reactstrap";
import Head from "next/head";

export default function Race(props) {
    const decrementTimer = useMutation("decrementTimer");
    const timer = useQuery('getCounter', "timer");
    const params = new URLSearchParams(window.location.search);
    const race = useQuery('readRace', params.get('id'))

    const [carPosition, setCarPosition] = useState(0);

    window.addEventListener('keydown', e => {
        setCarPosition(carPosition + 1)
    })

    return (
        <div>
            <Head>
                <title>Race | Tug of Type</title>
            </Head>
            <p>Id: {params.get('id')}</p>
            <p>{JSON.stringify(race)}</p>
            {/* <p>Race: {race.words}</p> */}
            <ul>
                <li>{carPosition}</li>
            </ul>
            <Input />
        </div>
    );
}
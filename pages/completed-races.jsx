import Link from "next/link";
import Head from "next/head";
import { Table } from "reactstrap";
import { useQuery } from "../convex/_generated/react"
import styles from "../styles/raceList.module.css"

export default function OngoingRacesPage() {
    const allRaces = useQuery('listRaces', true) || [];
    return (
        <Table className={styles.container}>
            <Head>
                <title>Completed Races | Tug of Type</title>
            </Head>
            <thead>
                <tr>
                    <th style={{ width: '15%' }}>Host</th>
                    <th className={styles.textPreviewHeader}>Text</th>
                    <th>Mode</th>
                    <th>Winner's Speed</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {allRaces.map(item => (<tr key={item._id}>
                    <td>{item.host.name}</td>
                    <td className={styles.textPreview}>{item.text.words}</td>
                    <td>{item.mode}</td>
                    <td>{Math.round(Math.random() * 60) + 70} wpm</td>
                    <td><Link href={`/race?id=${item._id}`}>View</Link></td>
                </tr>))}
            </tbody>
        </Table>
    )
}
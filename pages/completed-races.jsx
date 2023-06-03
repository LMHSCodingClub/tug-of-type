import Link from "next/link";
import Head from "next/head";
import { Table } from "reactstrap";
import { useQuery } from "../convex/_generated/react"
import styles from "../styles/raceList.module.css"

export default function OngoingRacesPage() {
    const allRaces = useQuery('listTypes', { finished: true }) || []

    const sourceName = item => item.text.source.substring(0, item.text.source.indexOf(' by'));

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
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {allRaces.map(item => (<tr key={item._id}>
                    <td>{item.host.name}</td>
                    <td className={styles.textPreview}>Excerpt from <em>{sourceName(item)}</em></td>
                    <td>{item.mode}</td>
                    <td><Link href={`/${item.mode.toLocaleLowerCase()}?id=${item._id}`}>View</Link></td>
                </tr>))}
            </tbody>
        </Table>
    )
}
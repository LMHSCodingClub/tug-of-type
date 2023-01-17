import Link from "next/link";
import Head from "next/head";
import { Table } from "reactstrap";
import { useQuery } from "../convex/_generated/react"

export default function OngoingRacesPage() {
    const allRaces = useQuery('listRaces', true) || [];
    return (
        <Table>
            <Head>
                <title>Completed Races | Tug of Type</title>
            </Head>
            <thead>
                <tr>
                    <th style={{ width: '15%' }}>Host</th>
                    <th>Text</th>
                    <th>Mode</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {allRaces.map(item => (<tr key={item._id}>
                    <td>John Doe</td>
                    <td>{item.text.words}</td>
                    <td>Normal</td>
                    <td><Link href={`/race?id=${item._id}`}>View</Link></td>
                </tr>))}
            </tbody>
        </Table>
    )
}
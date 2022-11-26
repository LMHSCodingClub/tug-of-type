import Link from "next/link";
import { Table } from "reactstrap";
import { useQuery } from "../convex/_generated/react"

export default function OngoingRacesPage() {
    const allRaces = useQuery('listRaces') || [];
    return (
        <Table>
            <thead>
                <tr>
                    <th style={{ width: '15%' }}>Creator</th>
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
                    <td><Link href={`/race?id=${item._id}`}>Join</Link></td>
                </tr>))}
            </tbody>
        </Table>
    )
}
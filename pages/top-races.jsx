import { Table } from "reactstrap";
import { useQuery } from "../convex/_generated/react"

export default function TopRacesPage() {
    const allRaces = useQuery('listRaces') || [];
    return (
        <Table>
            <thead>
                <tr>
                    <th>Creator</th>
                    <th>Text</th>
                    <th>Status</th>
                    <th>Mode</th>
                </tr>
            </thead>
            <tbody>
                {allRaces.map(item => (<tr key={item._id}>
                    <td>John Doe</td>
                    <td>{item.text.words}</td>
                    <td>Ongoing</td>
                    <td>Normal</td>
                </tr>))}
            </tbody>
        </Table>
    )
}
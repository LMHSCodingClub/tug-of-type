import { useQuery } from '../convex/_generated/react'
import Head from 'next/head';
import { Table } from 'reactstrap';

export default function TextBank() {
    const allTexts = useQuery('text/listTexts') || [];
    return (
        <main>
            <Head>
                <title>Texts | Tug of Type</title>
            </Head>
            <h1>Texts</h1>
            <Table border="2">
                <thead>
                    <tr>
                        <th>Text</th>
                        <th>Source</th>
                    </tr>
                </thead>
                <tbody>
                    {allTexts.map(item => (<tr key={item._id}>
                        <td>{item.words}</td>
                        <td>{item.source}</td>
                    </tr>))}
                </tbody>
            </Table>
        </main>
    );
}
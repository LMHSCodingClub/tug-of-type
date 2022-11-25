import { useQuery } from '../convex/_generated/react'
import Head from 'next/head';
import { Table } from 'reactstrap';

export default function TextBank() {
    const allTexts = useQuery('listTexts') || [];
    return (
        <main>
            <Head>
                <title>The Tug of War Typeracer Bank</title>
            </Head>
            <h1>The Tug of War Typeracer Bank</h1>
            <Table border="2">
                <thead>
                    <tr>
                        <th>Text</th>
                        <th>Source</th>
                    </tr>
                </thead>
                <tbody>
                    {allTexts.map(item => (<tr>
                        <td>{item.words}</td>
                        <td>{item.source}</td>
                    </tr>))}
                </tbody>
            </Table>
        </main>
    );
}
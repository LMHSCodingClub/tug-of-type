import { useQuery } from '../convex/_generated/react'
import Head from 'next/head';

export default function TextBank() {
    const allTexts = useQuery('listTexts') || [];
    return (
        <main>
            <Head>
                <title>The Tug of War Typeracer Bank</title>
            </Head>
            <h1>The Tug of War Typeracer Bank</h1>
            <ul>
                {allTexts.map(item => <li>{item.words}</li>)}
            </ul>
            <ul>
                {allTexts.map(item => <li>{item.source}</li>)}
            </ul>
        </main>
    );
}
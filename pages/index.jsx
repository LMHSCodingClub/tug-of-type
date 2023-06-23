import { useConvexAuth } from 'convex/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AuthenticatedHomeWidget from "../components/AuthenticatedHomeWidget"
import { useMutation, useQuery } from '../convex/_generated/react'
import styles from '../styles/Home.module.css'
import { Table } from 'reactstrap'
import Link from 'next/link'

const Home = () => {
  const createRace = useMutation('race/createRace');
  const createTug = useMutation('tug/createTug')
  const router = useRouter();

  const { isAuthenticated } = useConvexAuth();

  const allRaces = useQuery('listTypes', { finished: false }) || [];

  return (
    <div>
      <Head>
        <title>Tug of War Typeracer | LMHS Coding Club</title>
        <meta name="description" content="A typeracing game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>
          <button onClick={async () => {
            const id = await createRace();
            router.push(`/race?id=${id}`);
          }}>
            Create a Race
          </button>
          <button onClick={async () => {
            const id = await createTug();
            router.push(`/tug?id=${id}`)
          }}>Create a Tug</button>
        </p>
        {isAuthenticated ? <AuthenticatedHomeWidget /> : null}
        <section className={styles.container}>
          <h2>Lobby</h2>
          <Table className={styles.ongoingRacesTable}>
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
                <td className={styles.textPreview}>{item.text.words}</td>
                <td>{item.mode}</td>
                <td><Link href={`/${item.mode.toLocaleLowerCase()}?id=${item._id}`}>Join</Link></td>
              </tr>))}
            </tbody>
          </Table>
        </section>

      </main>
    </div>
  )
}

export default Home

import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMutation } from '../convex/_generated/react'
import styles from '../styles/Home.module.css'
import { useEffect } from 'react'
import AuthenticatedHomeWidget from "../components/AuthenticatedHomeWidget"
import { useConvexAuth } from 'convex/react'

const Home = () => {
  const createRace = useMutation('createRace');
  const createTug = useMutation('createTug')
  const router = useRouter();

  const { isAuthenticated } = useConvexAuth();

  return (
    <div>
      <Head>
        <title>Tug of War Typeracer | LMHS Coding Club</title>
        <meta name="description" content="A typeracing game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to LMHS Coding Club's Tug of Type</h1>

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
      </main>
    </div>
  )
}

export default Home

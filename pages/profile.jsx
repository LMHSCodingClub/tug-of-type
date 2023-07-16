import Head from "next/head";
import { Card, CardBody, CardGroup, CardText, CardTitle, ListGroup, ListGroupItem, Table } from "reactstrap";
import { useQuery } from "../convex/_generated/react";
import Link from "next/link";
import Image from "next/image"
import { getNumberWithOrdinal } from "../lib/helpers";
import { useRouter } from "next/router";
import TugArena from "../components/TugArena";
import {useConvexAuth} from "convex/react";

export default function Profile() {
    const user = useQuery('user/readUser')
    const tugs = useQuery('user/readTugs')
    const races = useQuery('user/readRaces')
    const practices = useQuery('user/readPractices')

    const router = useRouter()

    const { isAuthenticated } = useConvexAuth()

    if (!isAuthenticated) return "You must log in to view your profile"

    if (!user || !races || !practices || !tugs) {
        return <p>Loading profile</p>
    }

    return (
        <main className="container">
            <Head>
                <title>My Profile | Tug of Type</title>
            </Head>
            <h1><img src={user.pictureUrl} /> {user.name}</h1>
            <p>@{user.username}</p>
            <CardGroup>
                <Card>
                    <CardBody>
                        <CardText><img src="/speed.png" height="30" /> Best Speed: {races.bestSpeed} wpm</CardText>
                        <CardText><img src="/streak.png" height="30" /> Streak: 5</CardText>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <CardText>{races.count} races</CardText>
                        <CardText>{tugs.count} tugs</CardText>
                        <CardText>{practices.count} practices</CardText>
                    </CardBody>
                </Card>
            </CardGroup>
            {races.count > 0 ? (<section className="my-3">
                <h2>Races</h2>
                <Table>
                    {/* TODO: Turn racetrack into component and create preview image and put stats below with flexbox wrapped layout */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Speed</th>
                            <th>Accuracy</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {races.topRaces?.map(raceStanding => {
                            return (
                                <tr className="link" onClick={() => router.push(`/race?id=${raceStanding.race.id}`)} key={raceStanding._id.id}>
                                    <td><RacePlace place={raceStanding.place} /></td>
                                    <td>{raceStanding.speed} wpm</td>
                                    <td>{raceStanding.accuracy}%</td>
                                    <td>{new Date(raceStanding.date).toDateString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <p>Average Speed (from top 5 races): {races.avgSpeed} wpm</p>
                <p>Average Accuracy (from top 5 races): {races.avgAccuracy}%</p>

            </section>) : <h2>No races yet! Start your first race</h2>
            }
            <section className="my-3">
                <h2>Tugs</h2>
                <ListGroup flush>
                    {tugs.topTugs.map(item => (
                        <ListGroupItem key={item._id.id}>
                            <Link href={"/tug?id=" + item._id.id}>{item.host.username} vs {item.guest.username}
                            <TugArena mini id={item._id} />
                            </Link>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </section>
            <section className="my-3">
                <h2>Practices</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Speed</th>
                            <th>Accuracy</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {practices.topPractices.map(practice => {
                            return (
                                <tr className="link" onClick={() => router.push(`/practice?id=${practice._id.id}`)} key={practice._id.id}>
                                    <td>{practice.speed} wpm</td>
                                    <td>{practice.accuracy}%</td>
                                    <td>{new Date(practice._creationTime).toDateString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <p>Average Speed (from top 5 races): {practices.avgSpeed} wpm</p>
                <p>Average Accuracy (from top 5 races): {practices.avgAccuracy}%</p>
            </section>
        </main>
    )
}

function RacePlace({ place }) {
    switch (place) {
        case 1:
            return (<>
                <Image width={25} height={25} src='/winner.png' alt='Crown indicating you won' />
                {' '}Winner!
            </>)
        case 2:
            return (
                <>
                    <Image width={25} height={25} src='/runner-up.png' alt='Silver crown indicating you came in second place' />
                    <span> Runner Up!</span>
                </>

            )
        case 3:
            return (
                <>
                    <Image width={25} height={25} src='/third-place.png' title='3rd place' alt='Bronze crown indicating you came in third place' />
                    <span> 3rd Place!</span>
                </>
            )
        default:
            return (
                <>
                    <Image width={25} height={25} src='/placement.png' alt='Flag indicating you did not place in the top three' />
                    <span> {getNumberWithOrdinal(place)} Place</span>
                </>
            )
    }
}
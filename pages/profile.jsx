import Head from "next/head";
import { Card, CardBody, CardGroup, CardText, CardTitle, ListGroup, ListGroupItem, Table } from "reactstrap";
import { useQuery } from "../convex/_generated/react";
import Link from "next/link";
import Image from "next/image"
import { getNumberWithOrdinal } from "../lib/helpers";

export default function Profile() {
    const user = useQuery('user/readUser')
    const tugs = useQuery('user/readTugs')
    const races = useQuery('user/readRaces')

    if (!user || !races) {
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
                        <CardTitle>Best Speed</CardTitle>{user.bestSpeed} wpm</CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <CardText>{races.count} races</CardText>
                        <CardText>{tugs.count} tugs</CardText>
                    </CardBody>
                </Card>
            </CardGroup>
            {races.count > 0 ? (<section className="my-3">
                <h2>Races</h2>
                <Table>
                    {/* TODO: Turn racetrack into component and create preview image and put stats below with flexbox wrapped layout */}
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>Speed</th>
                            <th>Accuracy</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {races.topRaces?.map(raceStanding => {
                            return (
                                <tr key={raceStanding._id}>
                                    <td>{raceStanding.won ? (<>
                                        <Image width={25} height={25} src='/winner.png' alt='Crown indicating you won' />
                                        {' '}Winner!
                                    </>) : getNumberWithOrdinal(raceStanding.place)}</td>
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
                <p><img src="/streak.png" height="30" />Streak: 5</p>
            </section>) : <h2>No races yet! Start your first race</h2>}
            <section className="my-3">
                <h2>Tugs</h2>
                <ListGroup flush>
                    {tugs.topTugs.map(item => (
                        <ListGroupItem key={item._id.id}>
                            <Link href={"/tug?id=" + item.text.id}>{item.text.id}</Link>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </section>
        </main>
    )
}
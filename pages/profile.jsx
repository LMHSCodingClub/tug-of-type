import { Card, CardBody, CardGroup, CardText, CardTitle, List, ListGroup, ListGroupItem, Table } from "reactstrap";
import { useQuery } from "../convex/_generated/react";
import Link from "next/link";

export default function Profile() {
    const { user, topRaces } = useQuery('readUser') || {}

    if (!user || !topRaces) {
        return <p>Loading profile</p>
    }

    return (
        <main className="container">
            <h1><img src={user.pictureUrl} /> {user.name}</h1>
            <p>@{user.username}</p>
            <CardGroup>
                <Card>
                    <CardBody>
                        <CardTitle>Best Speed</CardTitle>{user.bestScore}</CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <CardText>51 races</CardText>
                        <CardText>11 tugs</CardText>
                    </CardBody>
                </Card>
            </CardGroup>
            <section className="my-3">
                <h2>Races</h2>
                <Table>
                    {/* TODO: Turn racetrack into component and create preview image and put stats below with flexbox wrapped layout */}
                    <thead>
                        <tr>
                            <th>{/* 'Winner' Icon */}</th>
                            <th>Speed</th>
                            <th>Accuracy</th>
                            <th>Consistency</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topRaces.map(raceStanding => {
                            return (
                                <tr key={raceStanding._id}>
                                    <td>{raceStanding.won ? <img src='won.png' alt='Crown indicating you won' /> : null}</td>
                                    <td>{raceStanding.speed} wpm</td>
                                    <td>{raceStanding.accuracy}%</td>
                                    <td>74%</td>
                                    <td>{new Date(raceStanding.date).toDateString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <p>Average Speed (from top 5 races): {topRaces.map(item => item.speed).reduce((prev, current) => prev + current) / topRaces.length} wpm</p>
                <p>Average Accuracy (from top 5 races): {topRaces.map(item => item.accuracy).reduce((prev, current) => prev + current) / topRaces.length}%</p>
                <p>Average Consistency (from top 5 races): 74%</p>
                <p><img src="/streak.png" height="30" />Streak: 5</p>
            </section>
            <section className="my-3">
                <h2>Top Tugs</h2>
                <ListGroup flush>

                </ListGroup>
            </section>
        </main>
    )
}
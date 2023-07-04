import { query } from "../_generated/server";
import { withUser } from "../withUser";

export default query(withUser(async ({ db, user }) => {
    const userStandings = await db.query('standings').withIndex('by_user', q => q.eq('user', user._id)).order('desc').collect()

    if (userStandings.length < 1) return { count: 0 }

    const topStandings = userStandings.slice(0, 5)
    const bestSpeed = topStandings[0].speed

    const topRaces = []
    for (const standing of topStandings) {
        const race = await db.get(standing.race);
        if (!race.ended) continue

        const won = standing.place === 1

        topRaces.push({ ...standing, date: race._creationTime, won })
    }

    const avgSpeed = Math.round(userStandings.map(item => item.speed).filter(Number).reduce((prev, curr) => prev + curr, 0) / userStandings.length)
    const avgAccuracy = Math.round(userStandings.map(item => item.accuracy).filter(Number).reduce((prev, curr) => prev + curr, 0) / userStandings.length)

    return { topRaces, avgSpeed, avgAccuracy, bestSpeed, count: userStandings.length }
}))
import { query } from "../_generated/server";
import { withUser } from "../withUser";

export default query(withUser(async ({ db, user }) => {
    const races = await db.query('standings').withIndex('by_user', q => q.eq('user', user._id)).order('desc').collect()

    if (races.length < 1) return { count: 0 }

    const topStandings = races.slice(0, 5)

    const bestSpeed = topStandings[0].speed
    for (let i = 0; i < topStandings.length; i++) {
        const race = await db.get(topStandings[i].race);
        const won = topStandings[i].place === 1

        topStandings[i] = { ...topStandings[i], date: race._creationTime, won }
    }

    const avgSpeed = Math.round(races.map(item => item.speed).reduce((prev, curr) => prev + curr) / races.length)
    const avgAccuracy = Math.round(races.map(item => item.accuracy).reduce((prev, curr) => prev + curr) / races.length)

    return { topRaces: topStandings, avgSpeed, avgAccuracy, bestSpeed, count: races.length }
}))
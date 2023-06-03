import { query } from "./_generated/server";
import { withUser } from "./withUser";

export default query(withUser(async ({ db, user }) => {
    const races = await db.query('standings').withIndex('by_user', q => q.eq('user', user._id)).order('desc').collect()

    const topRaces = races.slice(0, 5)
    const bestSpeed = topRaces[0].speed
    for (let i = 0; i < topRaces.length; i++) {
        const race = await db.get(topRaces[i].race);
        const won = race.winner === user._id

        topRaces[i] = { ...topRaces[i], date: race._creationTime, won }
    }

    const tugs = await db.query('tugs')
        .withIndex('by_players', q => q.eq('host', user._id) || q.eq('guest', user._id))
        .order('desc').collect()

    return {
        user: { ...user, bestSpeed, numRaces: races.length, numTugs: tugs.length || 0 },
        topRaces,
        topTugs: tugs.slice(0, 5)
    }
}));
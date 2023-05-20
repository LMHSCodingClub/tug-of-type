import { query } from "./_generated/server";
import { withUser } from "./withUser";

export default query(withUser(async ({ db, user }) => {
    const topRaces = await db.query('standings').withIndex('by_user', q => q.eq('user', user._id)).take(5)
    for (let i = 0; i < topRaces.length; i++) {
        const race = await db.get(topRaces[i].race);
        const won = race.winner === user._id

        topRaces[i] = { ...topRaces[i], date: race._creationTime, won }
    }

    return {
        user,
        topRaces
    }
}));
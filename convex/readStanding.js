import { withUser } from "./withUser";
import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

export default query(withUser(async ({ db, user }, raceId) => {
    const standings = await db.query('standings').withIndex('by_race', q => q.eq('race', new Id('races', raceId))).collect()
    const mine = standings.find(item => {
        return item.user.equals(user._id)
    }) || {}
    const host = (await db.get(new Id('races', raceId))).host

    return {
        mine,
        opponents: standings.filter(item => item !== mine),
        userIsHost: host.equals(user._id)
    }
}));
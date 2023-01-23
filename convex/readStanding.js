import { withUser } from "./withUser";
import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

export default query(withUser(async ({ db, user }, raceId) => {
    return await db.query('standings').withIndex('combo', q => q.eq('race', new Id('races', raceId)).eq('user', user._id)).first();
}));
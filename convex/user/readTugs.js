import { query } from "../_generated/server";
import { withUser } from "../withUser";

export default query(withUser(async ({ db, user }) => {
    const tugs = await db.query('tugs')
        .withIndex('by_host', q => q.eq('host', user._id))
        .order('desc').collect()

    tugs.push(...await db.query('tugs').withIndex('by_guest', q => q.eq('guest', user._id)).order('desc').collect())

    return { tugs, topTugs: tugs.slice(0, 5), count: tugs.length || 0 }
}))
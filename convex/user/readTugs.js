import { query } from "../_generated/server";
import { withUser } from "../withUser";

export default query(withUser(async ({ db, user }) => {
    let tugs = []

    tugs.push(...await db.query('tugs')
        .withIndex('by_host', q => q.eq('host', user._id))
        .order('desc').collect())
    tugs.push(...await db.query('tugs')
        .withIndex('by_guest', q => q.eq('guest', user._id))
        .order('desc').collect()
    )

    tugs = tugs.filter(tug => tug.status !== 'OJ')

    for (let i = 0; i < tugs.length; i++) {
        const host = await db.get(tugs[i].host)
        const guest = await db.get(tugs[i].guest)

        tugs[i] = { ...tugs[i], host, guest }
    }

    return { tugs, topTugs: tugs.filter(tug => tug.ended).slice(0, 5), count: tugs.length || 0 }
}))
import { query } from "../_generated/server";
import { withUser } from "../withUser";

export default query(withUser(async ({ db, user }) => {
    const practices = await db.query('practices').withIndex('by_user', q => q.eq('user', user._id)).collect()

    Array.prototype.average = function () {
        return this.filter(Number).reduce((prev, curr) => prev + curr, 0) / practices.length
    }
    const avgSpeed = Math.round(practices.map(item => item.speed).average())
    const avgAccuracy = Math.round(practices.map(item => item.accuracy).average())

    return { topPractices: practices.slice(0, 5), avgSpeed, avgAccuracy, count: practices.length }
}))
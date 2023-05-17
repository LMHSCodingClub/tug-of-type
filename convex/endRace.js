import { mutation } from "./_generated/server";

export default mutation(async ({ db }, { raceId }) => {
    const standings = await db.query('standings').withIndex('by_race', q => q.eq('race', raceId)).collect();
    // Determine winner by position, then (fallback 1) by speed, and finally (fallback 2) by accuracy
    const winner = standings.reduce((a, b) => {
        if (a.position !== b.position) {
            return Math.max(a.position, b.position)
        } else if (a.speed !== b.speed) {
            return Math.max(a.speed, b.speed)
        } else {
            return Math.max(a.accuracy, b.accuracy)
        }
    })
    db.patch(raceId, { ended: true, winner: winner.user });
})
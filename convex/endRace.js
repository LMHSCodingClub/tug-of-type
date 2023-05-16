import { mutation } from "./_generated/server";

export default mutation(async ({ db }, { raceId }) => {
    const standings = await db.query('standings').withIndex('by_race', q => q.eq('race', raceId)).collect();
    const winner = standings.reduce((a, b) => {
        if (a.position > b.position) {
            return a.position;
        } else if (b.position > a.position) {
            return b.position;
        } else {
            return Math.max(a.accuracy, b.accuracy)
        }
    })
    db.patch(raceId, { ended: true, winner: winner.user });
})
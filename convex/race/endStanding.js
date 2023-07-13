import { mutation } from "../_generated/server";

export default mutation(async ({ db }, { standingId, speed, accuracy, time }) => {
    const standing = await db.get(standingId)
    const previousFinishers = await db.query('standings').withIndex('by_race', q => q.eq('race', standing.race)).filter(q => q.eq(q.field('position'), 1)).collect()

    // The player's place is the number of racers who have already finished, which includes this racer, because the standing was already updated with the position 
    await db.patch(standingId, {
        speed, accuracy,
        time: { minutes: Math.min(time, 2) || 2, seconds: time.seconds || 0 },
        place: Math.max(previousFinishers.length, 1)
    });
})
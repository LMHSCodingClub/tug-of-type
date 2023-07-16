import { mutation } from "../_generated/server";

export default mutation(async ({ db }, { raceId }) => {
    const standings = await db.query('standings').withIndex('by_race', q => q.eq('race', raceId)).collect();

    // If the user was the only one in the race, remove it from the races and convert it to a practice
    if (standings.length < 2) {
        const practiceRaceInfo = await db.get(raceId)
        const practiceStandingInfo = standings[0]
        const practiceId = await db.insert('practices', {
            user: practiceStandingInfo.user,
            speed: practiceStandingInfo.speed,
            accuracy: practiceStandingInfo.accuracy,
            time: practiceStandingInfo.time,
            text: practiceRaceInfo.text,
            timer: practiceRaceInfo.timer,
            ended: true
        })

        if (raceId.tableName === 'races') db.delete(raceId)
        db.delete(practiceStandingInfo._id)

        return practiceId
    }

    // Determine winner by position, then (fallback 1) by speed, and finally (fallback 2) by accuracy
    const winner = standings.reduce((a, b) => {
        if (a.position > b.position) {
            return a
        } else if (b.position > a.position) {
            return b;
        }
        // Positions are the same, so move to fallback property 1 - speed 
        else if (a.speed > b.speed) {
            return a;
        } else if (b.speed > a.speed) {
            return b;
        }
        // Speeds are also the same, so move to second fallback property - accuracy
        else if (a.accuracy > b.accuracy) {
            return a;
        } else if (b.accuracy > a.accuracy) {
            return b;
        } else { // Accuracies are also the same, but since this is unlikely, we choose a winner randomly
            // TODO: Get max instantaneous speed to determine winner
            return [a, b][Math.round(Math.random())]
        }
    })

    db.patch(raceId, { ended: true, winner: winner.user });
})
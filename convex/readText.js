import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

export default query(async ({ db }, { raceId, textId }) => {
    let id = textId;
    if (!textId) {
        const currentRace = await db.get(new Id('races', raceId))
        id = currentRace.text
    }

    const baseInfo = await db.get(id);
    const racesWithThisText = await db.query('races').filter(q => q.eq(q.field('text'), id)).collect();

    const topTypers = [];
    for (const race of racesWithThisText) {
        if (!race.winner) continue;

        const user = await db.get(race.winner)
        const standing = await db.query('standings').withIndex('combo', q => q.eq('race', race._id).eq('user', race.winner)).first();
        topTypers.push({ user, standing })
    }

    return {
        baseInfo,
        topTypers
    };
})
import { Id } from "../_generated/dataModel";
import { query } from "../_generated/server";

/**
 * Get stats about the text
 */
export default query(async ({ db }, { typeId, textId, gameMode }) => {
    let id = textId;
    if (!textId) {
        const currentType = await db.get(typeId)
        id = currentType.text
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
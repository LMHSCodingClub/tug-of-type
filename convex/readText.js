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

    racesWithThisText.sort((a, b) => a.timer - b.timer)

    const topTypers = racesWithThisText.map(item => item.winner).filter(item => item)

    return {
        baseInfo,
        topTypers
    };
})
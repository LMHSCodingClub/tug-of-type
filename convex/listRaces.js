import { query } from './_generated/server';

export default query(async ({ db }, finished = false) => {
    let races = await db.query('races').filter(q => q.eq(q.field('ended'), finished)).collect();
    races = await Promise.all(races.map(async (race, index) => {
        return {
            ...race,
            text: await db.get(race.text)
        }
    }))

    return races;
})

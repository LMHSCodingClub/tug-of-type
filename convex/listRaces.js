import { query } from './_generated/server';

export default query(async ({ db }, finished = false) => {
    const races = await db.query('races').filter(q => q.eq(q.field('ended'), finished)).collect();
    races.forEach(async item => {
        item.text = await db.get(item.text);
    })
    return races;
})

import { query } from './_generated/server'

export default query(async ({ db }) => {
    const races = await db.query('races').collect();
    races.forEach(async item => {
        item.text = await db.get(item.text);
    })
    return races;
})

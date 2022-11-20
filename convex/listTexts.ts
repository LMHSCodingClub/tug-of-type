import { query } from './_generated/server'

export default query(async ({ db }: any) => {
    return await db.query('texts').collect()
})

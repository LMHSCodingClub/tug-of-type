import { query } from './_generated/server'

export default query(
    async ({ db }: any, id: number): Promise<object> => {
        const race = await db
            .query('races')
            .filter((q: any) => q.eq(q.field('_id'), id))
            .first();

        return race;
    })
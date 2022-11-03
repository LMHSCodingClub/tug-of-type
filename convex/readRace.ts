import { query } from './_generated/server'

export default query(
    async ({ db }, id: number): Promise<boolean> => {
        const credentialsExist = await db
            .query('races')
            .filter((q) => q.eq(q.field('id'), id))
            .first();

        return credentialsExist !== null;
    })
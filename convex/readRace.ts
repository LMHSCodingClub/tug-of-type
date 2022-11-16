import { query } from './_generated/server'

export default query(
    async ({ db }: any, id: number): Promise<boolean> => {
        const credentialsExist = await db
            .query('races')
            .filter((q: any) => q.eq(q.field('id'), id))
            .first();

        return credentialsExist !== null;
    })
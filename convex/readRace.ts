import { Id } from './_generated/dataModel';
import { query } from './_generated/server'

export default query(
    async ({ db }: any, id: string): Promise<object> => {
        const race = await db.get(new Id('races', id))
        race.text = await db.get(race.text);
        return race;
    })
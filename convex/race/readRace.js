import { Id } from '../_generated/dataModel';
import { query } from '../_generated/server'

/**
 * Get the meta information for the race with the given id and the information about the text
 * @returns {object | boolean} The race object or false if the id does not exist
 */
export default query(
    async ({ db }, { id }) => {
        try {
            const race = await db.get(new Id('races', id))
            race.text = await db.get(race.text);
            return race;
        } catch (e) {
            console.error(e)
            return false;
        }
    })
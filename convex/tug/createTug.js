import { mutation } from '../_generated/server'
import { selectRandomText } from '../lib/helpers'
import { withUser } from '../withUser'

/**
 * Inserts a new tug into the 'tugs' table
 * @returns The id of the new tug
 */
export default mutation(withUser(async ({ db, user }) => {
    const text = await selectRandomText(db)
    return await db.insert('tugs', {
        host: user._id,
        timer: 90,
        status: 'OJ',
        ended: false,
        text,
        hostProgression: 0,
        guestProgression: 0
    })
}))
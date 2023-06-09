import { mutation } from '../_generated/server'
import { decrementTimer } from "../lib/helpers"

export default mutation(async ({ db }, { id }) => {
    const newTime = await decrementTimer(db, { tableName: 'tugs', id })
    return { shouldStop: newTime === 0 }
})
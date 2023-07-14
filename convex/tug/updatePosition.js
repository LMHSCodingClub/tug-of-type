import { mutation } from "../_generated/server"

/**
 * Updates position of a player in the tug
 */
export default mutation(async ({ db }, { tugId, playerType, position }) => {
 db.patch(tugId, { [playerType + 'Progression']: Math.round(position * 1.10 * 100) / 100 })
})
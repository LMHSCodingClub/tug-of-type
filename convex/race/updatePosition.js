import { withUser } from '../withUser'
import { mutation } from '../_generated/server'

export default mutation(async ({ db }, { standingId, position }) => {
    db.patch(standingId, { position })
})
import { Id } from "../_generated/dataModel"
import { query } from "../_generated/server"
import { withUser } from "../withUser"

export default query(withUser(async ({ db, user }, { id }) => {
    const tug = await db.get(new Id('tugs', id))
    tug.text = await db.get(new Id('texts', tug.text))
    const userIsHost = tug.host.equals(user._id)
    return {
        ...tug,
        userIsHost,
        playerType: userIsHost ? 'host' : 'guest'
    }
}))
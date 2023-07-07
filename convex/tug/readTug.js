import { Id } from "../_generated/dataModel"
import { query } from "../_generated/server"
import { withUser } from "../withUser"

export default query(withUser(async ({ db, user }, { id }) => {
    const tug = await db.get(new Id('tugs', id))

    if (!tug) return false

    tug.text = await db.get(new Id('texts', tug.text))
    tug.host = await db.get(tug.host)

    let playerType = 'spectator'
    if (tug.host._id.equals(user._id)) playerType = 'host'
    else if (tug.guest?.equals(user._id)) playerType = 'guest'

    return {
        ...tug,
        playerType,
        openToJoin: typeof guest === 'undefined' && playerType !== 'host'
    }
}))
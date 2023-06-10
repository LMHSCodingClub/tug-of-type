import { Id } from "../_generated/dataModel"
import { query } from "../_generated/server"
import { withUser } from "../withUser"

export default query(withUser(async ({ db, user }, { id }) => {
    const tug = await db.get(new Id('tugs', id))
    tug.text = await db.get(new Id('texts', tug.text))

    let playerType = 'spectator'
    if (tug.host.equals(user._id)) playerType = 'host'
    else if (tug.guest?.equals(user._id)) playerType = 'guest'

    const openToJoin = !tug.guest

    return { ...tug, playerType, openToJoin }
}))
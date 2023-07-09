import { mutation } from "../_generated/server";
import { withUser } from "../withUser";

export default mutation(withUser(async ({ db, user }, { tugId }) => {
    const tug = await db.get(tugId)
    if (tug.guest) {
        console.error('Two players are already playing in this tug.')
        return false;
    }

    if (tug.host === user._id) {
        console.error('You are already hosting the race')
        return false;
    }

    db.patch(tugId, { guest: user._id, status: 'AP', startTime: Date.now() })
}))
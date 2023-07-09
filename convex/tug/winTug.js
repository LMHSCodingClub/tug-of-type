import {mutation} from "../_generated/server";
import {Id} from "../_generated/dataModel";

export default mutation(async ({ db }, { id }) => {
    const tug = await db.get(id)
    if (!(isNaN(tug.hostSpeed) || isNaN(tug.guestSpeed))) {
        if (tug.hostProgression - tug.guestProgression > 0) {
            await db.patch(id, { status: 'WH' })
            return 'WH'
        } else if (tug.hostProgression - tug.guestProgression < 0) {
            await db.patch(id, { status: 'WG' })
            return 'WG'
        }
    }
})
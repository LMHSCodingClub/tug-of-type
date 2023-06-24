import { mutation } from "../_generated/server";

export default mutation(async ({ db }, { id, hostSpeed, guestSpeed, hostAccuracy, guestAccuracy }) => {
    await db.patch(id, { ended: true, hostSpeed, guestSpeed, hostAccuracy, guestAccuracy })
})
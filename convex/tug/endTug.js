import { mutation } from "../_generated/server";

export default mutation(async ({ db }, { id, playerType, speed, accuracy }) => {
    const tug = await db.get(id)

    // Only update speed and accuracy once
    await db.patch(id, { ended: true, status: "EC", [`${playerType}Speed`]: speed, [`${playerType}Accuracy`]: accuracy })
})
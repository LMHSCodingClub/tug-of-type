import { mutation } from "../_generated/server";

export default mutation(async ({ db }, { id, playerType, speed, accuracy }) => {
    await db.patch(id, { ended: true, status: "EC", [`${playerType}Speed`]: speed, [`${playerType}Accuracy`]: accuracy })
})
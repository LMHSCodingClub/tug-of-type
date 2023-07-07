import { mutation } from "../_generated/server";

export default mutation(async ({ db }, { id, playerType, speed, accuracy }) => {
    await db.patch(id, { ended: true, status: "EC", [`${playerType}Speed`]: speed, [`${playerType}Accuracy`]: accuracy })

    const tug = await db.get(id)
    if (tug.hostSpeed && tug.guestSpeed) {
        if (tug.hostProgression - tug.guestProgression > 0)
            await db.patch(id, { status: 'WH' })
        else if (tug.hostProgression - tug.guestProgression < 0)
            await db.patch(id, { status: 'WG' })
    }
})
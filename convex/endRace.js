import { mutation } from "./_generated/server";

export default mutation(({ db }, raceId, standingId, { speed, accuracy }) => {
    db.patch(raceId, { ended: true });
    db.patch(standingId, { speed, accuracy });
})
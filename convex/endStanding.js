import { mutation } from "./_generated/server";

export default mutation(({ db }, { standingId, speed, accuracy }) => {
    db.patch(standingId, { speed, accuracy });
})
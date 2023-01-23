import { mutation } from "./_generated/server";

export default mutation(({ db }, raceId) => {
    db.patch(raceId, { ended: true });
})
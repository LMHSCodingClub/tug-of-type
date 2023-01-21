import { mutation } from "./_generated/server";

export default mutation(({ db }, raceId, standingId, typingSpeed) => {
    db.patch(raceId, { ended: true });
    db.patch(standingId, { speed: typingSpeed });
})
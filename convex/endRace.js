import { mutation } from "./_generated/server";

export default mutation(({ db }, id) => {
    db.patch(id, { ended: true });
})
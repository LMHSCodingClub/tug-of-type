import { mutation } from "../_generated/server";
import { withUser } from "../withUser";

export default mutation(withUser(({ db, user }, { tugId }) => {
    db.patch(tugId, { guest: user._id })
}))
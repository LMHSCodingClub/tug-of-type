import { mutation } from "../_generated/server";
import { selectRandomText } from "../lib/helpers";

export default mutation(async ({ db }, { tugId }) => {
    const newText = await selectRandomText(db)
    db.patch(tugId, { text: newText })
    return newText
})
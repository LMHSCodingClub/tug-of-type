import { Id } from "../_generated/dataModel";
import { query } from "../_generated/server";

export default query(async ({ db }, { id }) => {
    return await db.get(new Id('practices', id))
})
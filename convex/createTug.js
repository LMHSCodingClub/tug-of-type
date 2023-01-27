import { withUser } from "./withUser";
import { mutation } from "./_generated/server";

export default mutation(withUser(async ({ db, user }) => {
    const texts = await db.query('texts').collect();
    const totalRows = texts.length;
    const rowNumber = Math.round(Math.random() * ((totalRows) - 1));
    const text = texts[rowNumber];

    return db.insert('tugs', {
        timer: 120,
        text: text._id,
        host: user._id,
        ended: false
    })
}))
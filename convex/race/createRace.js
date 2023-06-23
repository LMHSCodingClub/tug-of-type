import { withUser } from "../withUser";
import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server"

export default mutation(withUser(async ({ db, user }) => {
  const texts = await db.query('texts').collect();
  const totalRows = texts.length;
  const rowNumber = Math.round(Math.random() * ((totalRows) - 1));
  const txt = texts[rowNumber];

  const id = await db.insert('races', {
    timer: 120,
    text: txt._id,
    host: user._id,
    ended: false
  });

  return id;
}

))
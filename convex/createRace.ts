import { mutation } from "./_generated/server"

export default mutation(
  async ({ db }) => {
    const texts = await db.query('texts').collect();
    const totalRows = texts.length;
    const rowNumber = Math.round(Math.random() * ((totalRows) - 1) + 1);
    const txt = texts[rowNumber];

    console.debug("[createRace]", rowNumber, txt);

    const id = await db.insert('races', {
      userList: [],
      timer: 120,
      text: txt._id,
    });

    return id;
  }

)
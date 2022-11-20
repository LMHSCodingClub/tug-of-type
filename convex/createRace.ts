import { mutation } from "./_generated/server"

export default mutation(
  async ({ db }) => {
    // TODO: Use Math.random() inside a filter to randomly return that text instead of two expensive queriesz
    const texts = await db.query('texts').collect();
    const totalRows = texts.length;
    const rowNumber = Math.random() * ((totalRows) - 1) + 1;
    const txt = texts[rowNumber];

    const id = await db.insert('races', {
      userList: [],
      timer: 120,
      text: txt,
    });

    return id;
  }

)

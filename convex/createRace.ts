import { mutation } from "./_generated/server"

export default mutation(
  async ({ db }: any) => {
    // TODO: Use Math.random() inside a filter to randomly return that text instead of two expensive queries
    const totalRows = (await db.query('texts').collect()).length;
    const rowNumber = Math.random() * ((totalRows) - 1) + 1;
    const txt = (await db.query('texts').collect())[rowNumber]

    await db.insert('races',
    {
      userList: [],
      timer: 120,
      text: txt,
    }
    )
  }

)
import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, txt: string) => {
    // TODO: Use Math.random() inside a filter to randomly return that text instead of two expensive queriesz
    const totalRows = await db.query('texts').length
    const rowNumber = Math.random() * ((totalRows) - 1) + 1
    await db.query('texts')[rowNumber].text

      .insert('races', {
        userList: [],
        timer: 120,
        text: txt,
      })

  }

)

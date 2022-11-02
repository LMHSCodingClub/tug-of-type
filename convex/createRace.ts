import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, ul: string[], tmr: number, txt: string) => {
    const totalRows = await db.query('texts').length
    const rowNumber = Math.random() * ((totalRows)-1) + 1
    await db
    .query('texts')[rowNumber].text
    
      .insert('races', {
        userList: ul,
        timer: tmr,
        text: txt,
      })

    }

)

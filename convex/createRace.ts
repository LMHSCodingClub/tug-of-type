import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, ul: string[], tmr: number, txt: string) => {

    await db
      .insert('races', {
        userList: ul,
        timer: tmr,
        text: txt,
      })

    }

)

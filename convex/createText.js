import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, txt) => {
    await db
      .insert('texts', {
        words: txt
      })

  }
)
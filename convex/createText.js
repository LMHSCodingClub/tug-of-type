import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, txt, scr) => {
    await db
      .insert('texts', {
        words: txt,
        source: scr
      })
  }
)
import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, txt, src) => {
    await db
      .insert('texts', {
        words: txt
        source: src
      })

  }
)
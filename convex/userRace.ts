import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, score:number) => {
    await db
      .insert('point', {
        sco: score
      })
  }
)
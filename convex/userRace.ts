import { mutation } from './_generated/server'

export default mutation(
  async ({ db }: any, score:number) => {
    await db
      .insert('point', {
        sco: score
      })
  }
)
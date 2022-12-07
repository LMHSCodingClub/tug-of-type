import { mutation } from './_generated/server'

export default mutation(
  async ({ db }: any, wpm:number, point:number) => {
    await db
      .insert('typingGame', {
        sco: wpm,
        pt: point
      })
  }
)
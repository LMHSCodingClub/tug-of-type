import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, tmr: number) => {
    const updateTimer = await db
      .query('races')
      .filter((q) => q.field('timer'))
      .first()
    if (updateTimer.tmr !== 0) {
      updateTimer.tmr += 1;
      db.replace(tmr, updateTimer.tmr)
    }
  }
)
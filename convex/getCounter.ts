import { query } from './_generated/server'

export default query(async ({ db }: any, counterName: string): Promise<number> => {
  const counterDoc = await db
    .query('races')
    .filter((q: any) => q.eq(q.field('name'), counterName))
    .first()

  if (counterDoc === null) {
    return 0
  }
  return counterDoc.counter
})

import { DatabaseWriter, query } from './_generated/server'

/**
 * @param 
 */
export default query(async ({ db }, counterName: string): Promise<number> => {
  const counterDoc = await db
    .query('races')
    .filter((q: any) => q.eq(q.field('name'), counterName))
    .first()

  if (counterDoc === null) {
    return 0
  }
  return counterDoc.counter
})

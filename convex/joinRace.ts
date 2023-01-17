import { mutation, MutationCtx } from './_generated/server'

export default mutation(async ({ db }: MutationCtx, user: string, race: string) => {
  await db.insert('user-race', {
    user: user,
    race: race

  })

})
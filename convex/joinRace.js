import { withUser } from "./withUser";
import { Id } from './_generated/dataModel';
import { mutation } from './_generated/server';

export default mutation(withUser(async ({ db, user }, race) => {
  const raceId = new Id('races', race);
  const standingId = await db.query('standings').withIndex('combo', q => q.eq('race', raceId).eq('user', user._id)).first();

  if (standingId) return standingId

  if ((await db.get(raceId)).ended) {
    return;
    throw new Error("You cannot join the race anymore because it has already ended");
  }

  return await db.insert('standings', {
    race: new Id('races', race),
    user: user._id
  })
}));
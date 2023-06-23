import { withUser } from "../withUser";
import { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server';

export default mutation(withUser(async ({ db, user }, { race }) => {
  const raceId = new Id('races', race);
  const standingId = await db.query('standings').withIndex('combo', q => q.eq('race', raceId).eq('user', user._id)).first();

  if ((await db.get(raceId)).ended) throw new Error("cannot join ended race")

  if (standingId) throw new Error("user is already in that race")

  return await db.insert('standings', {
    race: new Id('races', race),
    user: user._id,
    position: 0
  })
}));
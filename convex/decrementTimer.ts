import { Id } from './_generated/dataModel';
import { mutation } from './_generated/server'

export default mutation(
  async ({ db }: any, raceId: string) => {
    const race = await db.get(new Id("races", raceId));
    race.timer = Math.max(parseInt(race.timer) - 1, 0);
    db.replace(race._id, race);
  }
)
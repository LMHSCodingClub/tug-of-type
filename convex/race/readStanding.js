import { withUser } from "../withUser";
import { Id } from "../_generated/dataModel";
import { query } from "../_generated/server";

export default query(withUser(async ({ db, user }, { raceId }) => {
    const players = await db.query('standings').withIndex('by_race', q => q.eq('race', new Id('races', raceId))).collect()

    players.sort((a, b) => a.position - b.position)

    const opponents = []
    let mine;

    for (let i = 0; i < players.length; i++) {
        players[i].user = await db.get(players[i].user)

        if (players[i].user._id.equals(user._id))
            mine = players[i]
        else
            opponents.push(players[i])
    }

    const host = (await db.get(new Id('races', raceId))).host

    return {
        mine,
        opponents,
        players,
        userIsHost: host.equals(user._id)
    }
}));
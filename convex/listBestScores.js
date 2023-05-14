import { mutation } from "./_generated/server"

export default mutation(
  async ({ db }, { txt }) => {
    // TODO: make leaderboard that displays the top 5 best scores

    const topScore = 1000; //need to find maximum score in user array
    const highScore = await db
      .query("users")
      //.filter((q: any) => q.gte(q.field(), ))
      .collect();

    await db
      .insert('leaderboard', {

      }
      )
  }

)
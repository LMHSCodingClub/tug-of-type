import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, un: string, pswd: string) => {
    const login = await db
      .query ('users')
      .filter(q => q.and(q.eq(q.field("userName"), un), q.eq(q.field("password"), pswd)))
      .first();
      
      return login != null;
      
    //const messages = await db.query("messages").order("desc").collect();
    //const user: User | null = await db
  }
)
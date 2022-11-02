import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, un: string, pswd: string) => {
    
      )

    await db
      .insert ('users' , { 
            userName : un, password : pswd
      })

  }
)
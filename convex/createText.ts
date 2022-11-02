import { mutation } from './_generated/server'

export default mutation(
    async ({ db }, txt : string) => {
      await db
        .insert ('text' , { 
              words : txt
        })
  
    }
  )
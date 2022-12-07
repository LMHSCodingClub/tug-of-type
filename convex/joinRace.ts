import { mutation } from './_generated/server'

export default mutation(async ({ db }, user: string, race: string) => function() {
        await db
          .insert('user-race', {
            user: user,
            race: race
            
          })    
    }
  } 

)

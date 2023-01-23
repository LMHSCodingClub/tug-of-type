import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, txt, scr) => {
    txt = txt.replace(/[\u2019\u2018]/g, "'").replace(/\u201C\u201D\u201F/g, '"').replace(/\u2014\u2013\u2012/g);
    await db
      .insert('texts', {
        words: txt,
        source: scr
      })
  }
)
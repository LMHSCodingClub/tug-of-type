import { mutation } from './_generated/server'

export default mutation(
  async ({ db }, txt, scr) => {
    // Replace em-dashes and en-dashes with regular dashes and replace curly quotes with regular quotes 
    // (convert non-ASCII to ASCII so that everyone can type it with a standard keyboard)
    txt = txt.trim().replace(/[\u2019\u2018]/g, "'").replace(/\u201C\u201D\u201F/g, '"').replace(/\u2014\u2013\u2012/g);
    await db
      .insert('texts', {
        words: txt,
        source: scr
      })
  }
)
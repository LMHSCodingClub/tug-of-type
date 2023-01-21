import { defineSchema, defineTable, s } from "convex/schema";

export default defineSchema({
    races: defineTable({
        ended: s.boolean(),
        text: s.id("texts"),
        timer: s.number()
    }),
    standings: defineTable({ race: s.string(), user: s.string() }).index('combo', ["race", "user"]),
    texts: defineTable({ source: s.string(), words: s.string() }),
    users: defineTable({
        bestScore: s.number(),
        bio: s.string(),
        name: s.string(),
        pictureURL: s.string(),
        tokenIdentifier: s.string(),
    }).index("by_token", ["tokenIdentifier"]),
});
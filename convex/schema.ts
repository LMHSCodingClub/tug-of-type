import { defineSchema, defineTable, s } from "convex/schema";

export default defineSchema({
    races: defineTable({
        ended: s.boolean(),
        text: s.id("texts"),
        timer: s.number(),
        host: s.id("users"),
        mode: s.union(s.literal("Relay"), s.literal("Tug"))
    }),
    standings: defineTable({ race: s.string(), user: s.string() }).index('combo', ["race", "user"]).index('by_race', ['race']),
    texts: defineTable({ source: s.string(), words: s.string() }),
    users: defineTable({
        bestScore: s.number(),
        bio: s.string(),
        name: s.string(),
        pictureURL: s.string(),
        tokenIdentifier: s.string(),
    }).index("by_token", ["tokenIdentifier"]),
});
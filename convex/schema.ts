import { defineSchema, defineTable, } from "convex/schema";
import { v } from "convex/values";

export default defineSchema({
    races: defineTable({
        ended: v.boolean(),
        text: v.id("texts"),
        timer: v.number(),
        host: v.id("users"),
        mode: v.union(v.literal("Race"), v.literal("Tug")),
        winner: v.optional(v.id("users"))
    }),
    standings: defineTable({
        race: v.id("races"),
        user: v.id("users"),
        accuracy: v.optional(v.number()),
        position: v.number(),
        speed: v.optional(v.number())
    }).index('combo', ["race", "user"]).index('by_race', ['race']),
    texts: defineTable({ source: v.string(), words: v.string() }),
    users: defineTable({
        bestScore: v.number(),
        bio: v.string(),
        name: v.string(),
        pictureURL: v.optional(v.string()),
        tokenIdentifier: v.string(),
    }).index("by_token", ["tokenIdentifier"]),
});
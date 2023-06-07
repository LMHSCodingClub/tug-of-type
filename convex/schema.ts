import { defineSchema, defineTable, } from "convex/schema";
import { v } from "convex/values";

export default defineSchema({
    races: defineTable({
        ended: v.boolean(),
        text: v.id("texts"),
        timer: v.number(),
        host: v.id("users"),
        winner: v.optional(v.id("users"))
    }),
    standings: defineTable({
        race: v.id("races"),
        user: v.id("users"),
        accuracy: v.optional(v.number()),
        position: v.number(),
        speed: v.optional(v.number()),
        place: v.optional(v.number())
    }).index('combo', ["race", "user"]).index('by_race', ['race']).index('by_user', ['user', 'position', 'speed', 'accuracy']),
    texts: defineTable({ source: v.string(), words: v.string() }),
    users: defineTable({
        bestScore: v.optional(v.number()),
        name: v.string(),
        username: v.optional(v.string()),
        pictureUrl: v.optional(v.string()),
        tokenIdentifier: v.string(),
    }).index("by_token", ["tokenIdentifier"]),
    tugs: defineTable({
        ended: v.boolean(),
        host: v.id("users"),
        guest: v.optional(v.id('users')),
        text: v.id("texts"),
        timer: v.number(),
    }).index('by_players', ['host', 'guest']),
});
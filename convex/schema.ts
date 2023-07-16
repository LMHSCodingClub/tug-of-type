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
        time: v.optional(v.object({
            minutes: v.number(),
            seconds: v.number()
        })),
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
        status: v.union(
            v.literal("OJ"), // OJ: Open to Join
            v.literal("AP"), // AP: Active Play
            v.literal("EC"), // EC: Ending and Calculating
            v.literal("OV"), // OV: Overtime
            v.literal("DO"), // DO: Double Overtime
            v.literal("SD"), // SD: Sudden Death
            v.literal("WH"), // WH: Winner-Host
            v.literal("WG")  // WG: Winner-Guest
        ),
        host: v.id("users"),
        guest: v.optional(v.id('users')),
        hostProgression: v.number(),
        guestProgression: v.number(),
        text: v.id("texts"),
        timer: v.number(),
        time: v.optional(v.object({
            minutes: v.number(),
            seconds: v.number()
        })),
        startTime: v.optional(v.number()),
        hostSpeed: v.optional(v.number()),
        hostAccuracy: v.optional(v.number()),
        guestSpeed: v.optional(v.number()),
        guestAccuracy: v.optional(v.number()),
    }).index('by_host', ['host']).index('by_guest', ['guest']),
    practices: defineTable({
        user: v.id("users"),
        speed: v.number(),
        accuracy: v.number(),
        time: v.optional(v.object({
            minutes: v.number(),
            seconds: v.number()
        })),
        text: v.id("texts"),
        timer: v.number(),
        ended: v.boolean()
    }).index('by_user', ['user'])
});
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  coinRecords: defineTable({
    sessionId: v.optional(v.string()),
    loginName: v.optional(v.string()),
    pinHash: v.optional(v.string()),
    pinSalt: v.optional(v.string()),
    failedAttempts: v.optional(v.number()),
    blockedUntil: v.optional(v.number()),
    coins: v.optional(v.number()),
    avatar: v.optional(v.string()),
    ownedAvatars: v.optional(v.array(v.string())),
    name: v.string(),
    country: v.string(),
    maxCoins: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_loginName", ["loginName"])
    .index("by_maxCoins", ["maxCoins"]),
  playerSessions: defineTable({
    playerId: v.id("coinRecords"),
    tokenHash: v.string(),
    expiresAt: v.number(),
  }).index("by_tokenHash", ["tokenHash"]),
});

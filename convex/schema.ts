import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { vSessionId } from "convex-helpers/server/sessions";

export default defineSchema({
  coinRecords: defineTable({
    sessionId: vSessionId,
    name: v.string(),
    country: v.string(),
    maxCoins: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_maxCoins", ["maxCoins"]),
});

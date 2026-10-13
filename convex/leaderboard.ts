import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("coinRecords"),
      name: v.string(),
      country: v.string(),
      maxCoins: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("coinRecords")
      .withIndex("by_maxCoins")
      .order("desc")
      .filter((q) => q.neq(q.field("loginName"), undefined))
      .take(10);
    return rows.map(({ _id, name, country, maxCoins }) => ({
      _id,
      name,
      country,
      maxCoins,
    }));
  },
});

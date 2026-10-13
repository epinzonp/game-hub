import { v } from "convex/values";
import { SessionIdArg } from "convex-helpers/server/sessions";
import { mutation, query } from "./_generated/server";

export const recordBalance = mutation({
  args: {
    ...SessionIdArg,
    name: v.string(),
    country: v.string(),
    balance: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, { sessionId, name, country, balance }) => {
    // shortcut: balances are client-reported; verify server-side rewards before competitive use.
    name = name.trim();
    country = country.trim();
    if (
      !name ||
      name.length > 32 ||
      !country ||
      country.length > 64 ||
      !sessionId ||
      sessionId.length > 128
    ) {
      throw new Error("Perfil inválido");
    }
    if (!Number.isSafeInteger(balance) || balance < 0) {
      throw new Error("Saldo inválido");
    }
    const existing = await ctx.db
      .query("coinRecords")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        name,
        country,
        maxCoins: Math.max(existing.maxCoins, balance),
      });
    } else {
      await ctx.db.insert("coinRecords", {
        sessionId,
        name,
        country,
        maxCoins: balance,
      });
    }
    return null;
  },
});

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
      .take(10);
    return rows.map(({ _id, name, country, maxCoins }) => ({
      _id,
      name,
      country,
      maxCoins,
    }));
  },
});

"use node";

import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

function credentials(name: string, pin: string) {
  name = name.trim().replace(/\s+/g, " ");
  if (!name || name.length > 32 || !/^\d{4}$/.test(pin))
    throw new ConvexError("Escribe un nombre y un PIN de 4 números.");
  return { name, loginName: name.toLowerCase() };
}

export const register = action({
  args: {
    name: v.string(),
    pin: v.string(),
    country: v.string(),
    legacy: v.optional(
      v.object({
        guestId: v.string(),
        coins: v.number(),
        maxCoins: v.number(),
        avatar: v.union(v.string(), v.null()),
      }),
    ),
  },
  returns: v.string(),
  handler: async (ctx, { name, pin, country, legacy }): Promise<string> => {
    const names = credentials(name, pin);
    const pinSalt = randomBytes(16).toString("hex");
    const pinHash = scryptSync(pin, pinSalt, 32).toString("hex");
    const sessionToken = randomBytes(32).toString("hex");
    await ctx.runMutation(internal.players.registerAccount, {
      ...names,
      country,
      pinSalt,
      pinHash,
      sessionHash: createHash("sha256").update(sessionToken).digest("hex"),
      ...(legacy ? { legacy } : {}),
    });
    return sessionToken;
  },
});

export const login = action({
  args: { name: v.string(), pin: v.string() },
  returns: v.string(),
  handler: async (ctx, { name, pin }): Promise<string> => {
    const { loginName } = credentials(name, pin);
    const account = await ctx.runQuery(internal.players.findAccount, {
      loginName,
    });
    if (!account?.pinHash || !account.pinSalt)
      throw new ConvexError("Nombre o PIN incorrectos.");
    const matches = timingSafeEqual(
      scryptSync(pin, account.pinSalt, 32),
      Buffer.from(account.pinHash, "hex"),
    );
    const sessionToken = randomBytes(32).toString("hex");
    const error = await ctx.runMutation(internal.players.finishLogin, {
      playerId: account._id,
      matches,
      sessionHash: createHash("sha256").update(sessionToken).digest("hex"),
    });
    if (error) throw new ConvexError(error);
    return sessionToken;
  },
});

import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  type QueryCtx,
} from "./_generated/server";
import { avatars } from "../lib/avatars";

const sessionArgs = { sessionToken: v.string() };
const sessionDuration = 90 * 24 * 60 * 60 * 1000;

async function sessionHash(token: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

async function currentSession(ctx: QueryCtx, token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  const hash = await sessionHash(token);
  const session = await ctx.db
    .query("playerSessions")
    .withIndex("by_tokenHash", (q) => q.eq("tokenHash", hash))
    .unique();
  return session && session.expiresAt > Date.now() ? session : null;
}

async function currentPlayer(ctx: QueryCtx, token: string) {
  const session = await currentSession(ctx, token);
  const player = session ? await ctx.db.get(session.playerId) : null;
  if (!player) throw new ConvexError("Inicia sesión para continuar.");
  return player;
}

export const findAccount = internalQuery({
  args: { loginName: v.string() },
  handler: async (ctx, { loginName }) =>
    ctx.db
      .query("coinRecords")
      .withIndex("by_loginName", (q) => q.eq("loginName", loginName))
      .unique(),
});

export const registerAccount = internalMutation({
  args: {
    name: v.string(),
    loginName: v.string(),
    country: v.string(),
    pinSalt: v.string(),
    pinHash: v.string(),
    sessionHash: v.string(),
    legacy: v.optional(
      v.object({
        guestId: v.string(),
        coins: v.number(),
        maxCoins: v.number(),
        avatar: v.union(v.string(), v.null()),
      }),
    ),
  },
  returns: v.null(),
  handler: async (
    ctx,
    { name, loginName, country, pinSalt, pinHash, sessionHash, legacy },
  ) => {
    country = country.trim();
    if (!country || country.length > 64)
      throw new ConvexError("Elige un país válido.");
    const existing = await ctx.db
      .query("coinRecords")
      .withIndex("by_loginName", (q) => q.eq("loginName", loginName))
      .unique();
    if (existing)
      throw new ConvexError(
        "Ese nombre ya está en uso. Elige otro o entra a tu cuenta.",
      );
    const fields = {
      name,
      loginName,
      country,
      pinSalt,
      pinHash,
      failedAttempts: 0,
      blockedUntil: 0,
    };
    let playerId;
    if (legacy) {
      if (
        !legacy.guestId ||
        legacy.guestId.length > 128 ||
        !Number.isSafeInteger(legacy.coins) ||
        legacy.coins < 0 ||
        !Number.isSafeInteger(legacy.maxCoins) ||
        legacy.maxCoins < 0 ||
        (legacy.avatar !== null && !avatars.some((a) => a.id === legacy.avatar))
      )
        throw new ConvexError("El progreso guardado no es válido.");
      const guest = await ctx.db
        .query("coinRecords")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", legacy.guestId))
        .unique();
      if (!guest)
        throw new ConvexError(
          "No encontramos el registro anterior. Puedes empezar sin transferirlo.",
        );
      if (guest.loginName)
        throw new ConvexError("Este progreso ya se transfirió a una cuenta.");
      // shortcut: legacy balances were client-reported; this one-time import preserves existing progress.
      await ctx.db.patch(guest._id, {
        ...fields,
        coins: legacy.coins,
        maxCoins: Math.max(guest.maxCoins, legacy.coins, legacy.maxCoins),
        ...(legacy.avatar
          ? { avatar: legacy.avatar, ownedAvatars: [legacy.avatar] }
          : {}),
      });
      playerId = guest._id;
    } else {
      playerId = await ctx.db.insert("coinRecords", {
        ...fields,
        coins: 0,
        maxCoins: 0,
      });
    }
    await ctx.db.insert("playerSessions", {
      playerId,
      tokenHash: sessionHash,
      expiresAt: Date.now() + sessionDuration,
    });
    return null;
  },
});

export const finishLogin = internalMutation({
  args: {
    playerId: v.id("coinRecords"),
    matches: v.boolean(),
    sessionHash: v.string(),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, { playerId, matches, sessionHash }) => {
    const player = await ctx.db.get(playerId);
    if (!player) return "Nombre o PIN incorrectos.";
    const now = Date.now();
    if ((player.blockedUntil ?? 0) > now)
      return "Espera 5 minutos antes de volver a intentar.";
    if (!matches) {
      const attempts =
        (player.blockedUntil ? 0 : (player.failedAttempts ?? 0)) + 1;
      await ctx.db.patch(playerId, {
        failedAttempts: attempts,
        blockedUntil: attempts >= 5 ? now + 5 * 60 * 1000 : 0,
      });
      return "Nombre o PIN incorrectos.";
    }
    await ctx.db.patch(playerId, { failedAttempts: 0, blockedUntil: 0 });
    await ctx.db.insert("playerSessions", {
      playerId,
      tokenHash: sessionHash,
      expiresAt: now + sessionDuration,
    });
    return null;
  },
});

export const me = query({
  args: sessionArgs,
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("coinRecords"),
      name: v.string(),
      country: v.string(),
      coins: v.number(),
      maxCoins: v.number(),
      avatar: v.union(v.string(), v.null()),
      ownedAvatars: v.array(v.string()),
    }),
  ),
  handler: async (ctx, { sessionToken }) => {
    const session = await currentSession(ctx, sessionToken);
    const player = session ? await ctx.db.get(session.playerId) : null;
    const ownedIds = new Set([
      ...(player?.ownedAvatars ?? []),
      ...(player?.avatar ? [player.avatar] : []),
    ]);
    return player
      ? {
          _id: player._id,
          name: player.name,
          country: player.country,
          coins: player.coins ?? 0,
          maxCoins: player.maxCoins,
          avatar: player.avatar ?? null,
          ownedAvatars: avatars
            .filter((choice) => ownedIds.has(choice.id))
            .map((choice) => choice.id),
        }
      : null;
  },
});

export const signOut = mutation({
  args: sessionArgs,
  returns: v.null(),
  handler: async (ctx, { sessionToken }) => {
    const session = await currentSession(ctx, sessionToken);
    if (session) await ctx.db.delete(session._id);
    return null;
  },
});

export const awardWin = mutation({
  args: sessionArgs,
  returns: v.null(),
  handler: async (ctx, { sessionToken }) => {
    const player = await currentPlayer(ctx, sessionToken);
    const coins = (player.coins ?? 0) + 100;
    if (!Number.isSafeInteger(coins))
      throw new ConvexError("El saldo alcanzó su límite.");
    // shortcut: the game reports wins; server-side gameplay verification is needed for competitive rewards.
    await ctx.db.patch(player._id, {
      coins,
      maxCoins: Math.max(player.maxCoins, coins),
    });
    return null;
  },
});

export const awardTiragolGoal = mutation({
  args: sessionArgs,
  returns: v.null(),
  handler: async (ctx, { sessionToken }) => {
    const player = await currentPlayer(ctx, sessionToken);
    const coins = (player.coins ?? 0) + 10;
    if (!Number.isSafeInteger(coins))
      throw new ConvexError("El saldo alcanzó su límite.");
    await ctx.db.patch(player._id, {
      coins,
      maxCoins: Math.max(player.maxCoins, coins),
    });
    return null;
  },
});

export const purchaseAvatar = mutation({
  args: { ...sessionArgs, avatar: v.string() },
  returns: v.null(),
  handler: async (ctx, { sessionToken, avatar }) => {
    const player = await currentPlayer(ctx, sessionToken);
    const choice = avatars.find((a) => a.id === avatar);
    if (!choice) throw new ConvexError("Avatar inválido.");
    const ownedAvatars = [
      ...new Set([
        ...(player.ownedAvatars ?? []),
        ...(player.avatar ? [player.avatar] : []),
      ]),
    ].filter((id) => avatars.some((owned) => owned.id === id));
    if (ownedAvatars.includes(avatar)) {
      if (player.avatar !== avatar || !player.ownedAvatars?.includes(avatar)) {
        await ctx.db.patch(player._id, { avatar, ownedAvatars });
      }
      return null;
    }
    const coins = player.coins ?? 0;
    if (coins < choice.price)
      throw new ConvexError("No tienes suficientes monedas.");
    await ctx.db.patch(player._id, {
      avatar,
      coins: coins - choice.price,
      ownedAvatars: [...ownedAvatars, avatar],
    });
    return null;
  },
});

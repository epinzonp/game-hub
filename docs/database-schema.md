# Player accounts and coin leaderboard

Players register with a unique nickname, a four-digit PIN, and a country. Nicknames are trimmed, whitespace-normalized, and matched case-insensitively. Node actions hash PINs with salted scrypt; plaintext PINs are never stored. Internal mutations atomically reserve names, create accounts, check login limits, and create sessions. Five incorrect PIN attempts block login for five minutes.

`coinRecords` stores each player's `loginName`, private `pinHash` and `pinSalt`, failed-login counters, display `name`, `country`, current `coins`, highest `maxCoins`, and optional `avatar`. `by_loginName` finds accounts.

`playerSessions` stores a SHA-256 hash of a random 256-bit session token, the player ID, and a 90-day expiry. The browser stores only the token in local storage. The token authorizes `players.me`, purchases, and rewards; clients cannot choose another account by player ID or name. Each login creates its own session, so signing out on one browser does not sign out another. Expired sessions cannot mutate progress. Session and credential fields never appear on the public leaderboard.

`awardWin` awards the existing 100 coins; purchases read their cost from the shared avatar catalog and atomically deduct coins. A repeated purchase of the currently selected avatar does not charge twice. Purchases never lower `maxCoins`. The game still reports victories from the client; this does not establish competitive anti-cheat protection.

`leaderboard.list` uses `by_maxCoins` to return the ten best registered accounts. It excludes unclaimed guest records before taking the top ten, so old guest entries cannot duplicate an account or displace it. Explicit transfers make the existing guest record an account and preserve its maximum. It exposes only the display name, country, record, and public row ID, never credential fields or current wallet balances.

Legacy guest records remain valid through optional schema fields and `by_sessionId`. A new player may explicitly transfer this browser's existing guest record, balance, and avatar once by presenting its stored guest ID. Claiming changes the existing record, preserving its maximum. Another account cannot claim an already-transferred record. Successful transfers clear only the old profile, wallet, avatar, record, and guest-ID keys. Game-specific local history stays intact. Legacy balances were client-reported and cannot be retroactively verified.

No email recovery or PIN reset flow is included. Four-digit PINs and client-reported rewards suit casual play, not valuable balances or competitive rankings. Back up data before removing legacy fields or moving deployments.

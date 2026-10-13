# Coin leaderboard

Convex stores `coinRecords` with a private guest `sessionId`, display `name`, `country`, and `maxCoins`.

`by_sessionId` finds the guest's single record. `by_maxCoins` serves the top ten in descending order. The public query omits the session ID. The transactional mutation validates nonnegative safe integers and keeps `Math.max(existing.maxCoins, balance)` so spending, retries, and concurrent submissions cannot reduce a record.

Guest IDs persist in localStorage and are refreshed on sign-out. They are not authenticated accounts. Scores are client-reported; this casual leaderboard does not validate gameplay or prevent edited local balances. It cannot recover peaks reached before record tracking was added.

The local peak survives offline purchases and is submitted on the next visit. Convex queues mutations while disconnected. Clearing browser data removes the local identity and any unsynced peak.

This is a new additive table. Rolling back the frontend and functions leaves the records intact; do not drop the table to roll back presentation changes.

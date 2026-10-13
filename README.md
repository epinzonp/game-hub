This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Authentication and saved progress

Install dependencies with `npm install`, then run `npm run dev` to start Next.js and the local Convex backend together. `npm run dev:convex` starts only the local backend when needed. Players create an account with a unique nickname, a four-digit PIN, and their country. No email or external authentication provider is required. This browser remembers the session for up to 90 days; use the same nickname and PIN on another device to load the same coins, avatar, and record. Signing out revokes only the current session.

Convex stores player profiles, coins, selected avatars, highest balances, salted PIN hashes, and hashed session tokens. Five incorrect PIN attempts lock login for five minutes. This is simple authentication for a casual game: there is no email recovery or PIN reset flow, so players need to remember their nickname and PIN. The frontend only needs `NEXT_PUBLIC_CONVEX_URL`.

Local development uses the anonymous local Convex deployment so development mutations stay off cloud databases. For access across devices, link a cloud deployment using `npx convex login`, then `npx convex dev --configure new --dev-deployment cloud`, use the same cloud URL for all clients. Local account persistence works across browser sessions on this machine; production access requires cloud setup.

Moving from local Convex to a cloud deployment creates a different database. Export the local data before relinking and import that snapshot into the new deployment to retain existing profiles, balances, avatars, and guest records.

The `/leaderboard` route ranks the ten highest coin balances. Purchases never reduce the record. Players can explicitly transfer this browser's legacy guest progress once during initial profile setup. Existing accounts always load their database progress instead of importing local balances again. Rewards remain client-reported gameplay outcomes; authentication does not prevent cheating.

Run `npm test`, `npm run lint`, and `npm run build`. See [the schema notes](docs/database-schema.md) for authorization and migration behavior.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Live coin leaderboard

Install dependencies with `npm install`. Run `npm run dev:convex` in one terminal and `npm run dev` in another. Convex writes `NEXT_PUBLIC_CONVEX_URL` to `.env.local`. Keep the existing Supabase variables for the existing middleware.

Without a Convex account, initialize local development with `CONVEX_AGENT_MODE=anonymous npx convex dev`. This backend supports live updates between browsers on this machine. For shared access across devices, run `npx convex login`, then `npx convex dev --configure new --dev-deployment cloud`. Use the same cloud URL for every frontend client. For production, deploy with `npx convex deploy` and set the frontend's `NEXT_PUBLIC_CONVEX_URL` to that deployment's URL before building.

The dedicated `/leaderboard` route and the compact shop board rank the top ten guest players by their highest coin balance, including the initial saved balance and new Hangman rewards. The landing header links to the leaderboard. Purchases keep the peak intact. Guest identities persist per browser and change on sign-out; they are not cross-device accounts. Records do not prove gameplay because coin balances remain local and client-reported. Historical peaks before this feature cannot be recovered.

Run `npm test`, `npm run lint`, and `npm run build` to verify changes. See [the schema notes](docs/database-schema.md) for indexes and validation.

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

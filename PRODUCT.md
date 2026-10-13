# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Kids and families looking for casual games.

## Product Purpose

Game Hub brings a collection of casual games together so visitors can choose a game and start playing.

## Capabilities and Constraints

- The hub includes solo and multiplayer game experiences, a friends entry, and an avatar shop.
- Players sign up and log in with a unique nickname and a four-digit PIN; their browser remembers the session. No email or external authentication provider is required. Convex stores their profile, coin balance, selected avatar, and highest balance. Preserve the existing avatar catalog, costs, and 100-coin Hangman reward.
- `/leaderboard` shows the live top ten coin records with a podium and ranking rows. The landing header links to it; the store does not show leaderboard records. Spending coins never lowers a record. Players return to the same database-backed profile after sign-in. Existing guest progress can be transferred once by explicit choice. Game victories remain client-reported.
- This redesign changes the landing page, game thumbnails, and shop presentation. Existing game experiences remain unchanged.

## Brand Commitments

- The product is labeled Game Hub / GAME HUB in the current interface.
- The landing page should take layout inspiration from Fortnite's discovery page without reusing its artwork or branding.
- Use the dark burgundy, deep red, purple, and vivid yellow palette in the user's supplied screenshot.

## Evidence on Hand

- Existing game list, descriptions, avatar options, and shop behavior are in `app/components/GameHub.tsx`.
- No original game thumbnail artwork is present in `public/`.

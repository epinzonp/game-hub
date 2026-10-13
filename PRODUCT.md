# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Kids and families looking for casual games.

## Product Purpose

Game Hub brings a collection of casual games together so visitors can choose a game and start playing.

## Capabilities and Constraints

- The hub includes solo and multiplayer game experiences, a friends entry, and a local avatar shop.
- The shop uses locally stored coins and avatar choices; preserve its existing selection and purchase behavior.
- `/leaderboard` shows the live top ten coin records with a podium and ranking rows. The landing header links to it, and the shop keeps its compact board. Spending coins never lowers a record. Players are guests identified in this browser; clearing browser data creates a new identity, and balances are client-reported.
- This redesign changes the landing page, game thumbnails, and shop presentation. Existing game experiences remain unchanged.

## Brand Commitments

- The product is labeled Game Hub / GAME HUB in the current interface.
- The landing page should take layout inspiration from Fortnite's discovery page without reusing its artwork or branding.
- Use the dark burgundy, deep red, purple, and vivid yellow palette in the user's supplied screenshot.

## Evidence on Hand

- Existing game list, descriptions, avatar options, and local shop behavior are in `app/components/GameHub.tsx`.
- No original game thumbnail artwork is present in `public/`.

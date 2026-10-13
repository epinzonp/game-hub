<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Game Hub: product and design guide

## Database safety

- Never mutate production or cloud database data, and never run destructive resets, imports, or schema changes against those deployments. Use the local Convex deployment for all agent testing and mutations.
- Before clearing or resetting local database data, inspect the target and get explicit user authorization.

## Game routes and scoring

- Give every playable game its own stable route under `/games/<game-id>`. Keep hub launch buttons, direct links, and browser navigation aligned with the game ID.
- Keep an unfinished game's points in memory only. Persist or award points only after the game reaches its completed result. Show the existing lost-points confirmation only for games listed in `pointEnabledGameRouteIds` in `lib/game-routes.ts`, when leaving through an in-app link, the hub control, browser back, or browser forward. Games without points must navigate without this dialog. Keep the route list, game mechanics, and docs in sync when enabling points for a game; use one confirmation dialog for supported navigation.
- Use [docs/README.md](docs/README.md) as the developer and agent documentation gateway. Keep a guide in `docs/games/` for every playable game, covering its goal, mechanics, controls, completion conditions, and score persistence; add and update the guide and game index whenever a game is added or its mechanics change.

## Store economy

- Use clear, fixed cosmetic price tiers calibrated to this game's coin-earning rate and expected play effort. Keep early unlocks attainable and reserve very expensive items for optional long-term goals; do not treat another game's prices as universal benchmarks.
- Keep exactly 12 avatars: 1 free starter, 3 normal at 1,000 coins each (10 Hangman wins), 4 rare at 3,000 each (30 wins), and 4 legendary at 5,000 each (50 wins), based on the 100-coin Hangman reward. Apply the same tier price consistently, including to Ronaldo 7 and 67 Phantom. This is a testable starting economy, not a proven universal price table; adjust only using this game's play data and player feedback.
- Evidence caveat: a 14-million-player field experiment on virtual-currency quantity discounts found little change in purchaser conversion and cautioned that its results may not generalize. It did not test earn-to-unlock price tiers in a kids' casual game, so it supports testing the economy rather than copying a supposedly proven price table ([Levitt et al., PNAS 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC4941432/)).

## What this page is

Game Hub is a Spanish-language web hub for kids and families who want quick, casual games they can start playing without friction. The landing page helps visitors browse the available games, the friends entry point introduces social play, and the local shop lets players personalize their avatar with the existing coin and selection flow. Keep product facts in [PRODUCT.md](PRODUCT.md); this file describes how to preserve the experience while changing it.

## Visual direction

- Make the page feel like an inviting game-discovery shelf: bold cover art, clear game names, and simple paths into play. Fortnite's discovery layout is a structural reference only; do not copy its logo, artwork, text, or distinctive branded UI.
- Keep the supplied palette: near-black plum backgrounds, deep burgundy and red surfaces, purple accents for social content, warm white text, and vivid yellow for the primary accent and actions. Existing colors include `#180e13`, `#241519`, `#391923`, `#291a32`, and `#fff34b`.
- Use the existing Inter-based sans-serif typography, strong compact headings, clear contrast, and rounded cover cards. Let the art carry visual energy; avoid adding decorative UI that competes with it.
- Keep the landing focused on discovering games. At narrow widths, let the game shelf scroll horizontally and leave part of the next card visible as a cue; at wide widths, show a balanced grid. Keep navigation and controls usable at both sizes.
- Keep the store visually connected to the landing with the same palette and cover-art style. Preserve existing coin costs, local persistence, avatar choices, and purchase/selection behavior when changing its presentation.
- Music is opt-in and off by default. Use the existing shadcn switch and its volume icons; retain a clear accessible name and keyboard operation.

## Change boundaries

- Do not change game rules, scoring, controls, or gameplay components when working on the landing, thumbnail art, or store presentation. Check with the user before broadening that scope.
- Keep the game IDs, launch routing, visible game catalog, and their associations with thumbnail files aligned. Store covers in `public/game-covers/`; preserve each game's identity and do not bake title text or logos into the artwork.
- Every game's first screen must use `app/components/GameEntryScreen.tsx` with that game's existing thumbnail, Spanish title, short description, and launch or mode/difficulty controls. Keep selector screens in the same burgundy, plum, warm-white, and vivid-yellow visual language; use the selected game's thumbnail there too. Keep one shared `Volver al hub` control from `GameHub` rather than adding another inside the game.
- When adding a game, add its catalog entry and matching cover association, then build its entry page and any mode or level selectors with `GameEntryScreen` before entering the unchanged gameplay view.
- Keep copy in Spanish for older kids and teens: confident, concise, and playful without babyish diminutives such as “cubito.” Keep it welcoming to families and do not introduce mature or unsupported competitive/monetization claims.
- Store avatars should feel like original collectible game characters. Make higher-priced tiers visibly more detailed and premium with stronger glow/motion; retain the “67” avatar's identity while honoring explicitly requested prices for new avatars.
- Preserve semantic headings, meaningful image alternatives where art conveys content, visible keyboard focus, adequate contrast, and sufficiently large touch targets.
- Keep server-rendered markup deterministic. Do not branch on browser globals or generate random/time-based content during render; initialize browser-only behavior after hydration when needed.
- Prefer the existing components, Tailwind setup, shadcn primitives, and Lucide icons. Avoid adding dependencies or a second design system for visual-only work.

## Sources of truth

- [PRODUCT.md](PRODUCT.md): audience, purpose, capabilities, and product constraints.
- `app/components/GameHub.tsx`: current game catalog, navigation, landing/store presentation, and music behavior.
- `public/game-covers/`: current game and shop cover artwork.
- `components/ui/`: installed shadcn UI primitives.

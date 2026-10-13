# El Ahorcado

**Goal:** Guess the hidden word before the character falls into the lava.

**Mechanics and controls:** Each round chooses a word with a category and hint. Guess letters with the on-screen alphabet or keyboard. Accented letters are normalized for matching; `ñ` is a separate letter. Incorrect guesses add a mistake to the drawing. The round ends when all letters are revealed or the mistake limit is reached.

**Difficulty:** Consecutive wins raise the challenge: Fácil starts with 6 allowed mistakes and words of at least 4 characters; Normal (2+ wins) uses 5 and 6; Difícil (5+) uses 4 and 7; Extremo (10+) uses 3 and 8. A loss resets the streak.

**Scoring and persistence:** A completed win adds one point to the local `hangman-scores` leaderboard and awards coins through the player reward flow. A loss awards neither. These are separate from the coin-record leaderboard.

**Leaving:** The lost-points confirmation appears only during an unfinished round. Leaving the entry screen or a completed win/loss result needs no confirmation and does not remove saved rewards. Playing again starts a new unfinished round and restores the warning.

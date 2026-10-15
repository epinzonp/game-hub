# Radiotricky

**Goal:** Get three marks in a row on a 3×3 board.

**Mechanics and controls:** Choose VS amigo for local two-player play or VS IA and select a difficulty. Players alternate placing X and O in empty cells. Three matching marks horizontally, vertically, or diagonally wins the round; filling the board without a line is a draw. The AI's Fácil mode chooses a random open cell, Medio takes a winning move or blocks an immediate loss when possible, and Difícil uses minimax search.

**Progression and scoring:** An X victory in VS IA awards 100 coins and shows a green animated `100+` reward indicator. O victories, draws, and VS amigo rounds award nothing. The displayed X, O, and draw totals accumulate across rounds until the score is reset or the mode changes; these totals are local to the current session.

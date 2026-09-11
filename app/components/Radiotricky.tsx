"use client";

import React, { useState, useEffect } from "react";

type Cell = "X" | "O" | "draw" | null;
type Player = "X" | "O";
type GameMode = "pvp" | "ai";
type Difficulty = "easy" | "medium" | "hard";

export default function Radiotricky({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Cell>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [mode, setMode] = useState<GameMode>("pvp");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  const [showModeSelect, setShowModeSelect] = useState(true);

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkWinner = (b: Cell[]): { winner: Cell; line: number[] } | null => {
    for (const combo of winningCombos) {
      const [a, b1, c] = combo;
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return { winner: b[a], line: combo };
      }
    }
    if (b.every(cell => cell !== null)) return { winner: "draw", line: [] };
    return null;
  };

  const handleCellClick = (index: number) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === "X") setScore(s => ({ ...s, X: s.X + 1 }));
      else if (result.winner === "O") setScore(s => ({ ...s, O: s.O + 1 }));
      else setScore(s => ({ ...s, draws: s.draws + 1 }));
    } else {
      setCurrentPlayer(p => p === "X" ? "O" : "X");
    }
  };

  useEffect(() => {
    if (mode === "ai" && currentPlayer === "O" && !winner) {
      const timer = setTimeout(() => {
        const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
        if (emptyIndices.length === 0) return;

        let move: number;

        if (difficulty === "easy") {
          move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        } else if (difficulty === "medium") {
          const winMove = findWinningMove(board, "O");
          const blockMove = findWinningMove(board, "X");
          if (winMove !== null) move = winMove;
          else if (blockMove !== null) move = blockMove;
          else move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        } else {
          move = minimax(board, "O").index;
        }

        handleCellClick(move);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [board, currentPlayer, winner, mode, difficulty]);

  const findWinningMove = (b: Cell[], player: Player): number | null => {
    for (const combo of winningCombos) {
      const cells = combo.map(i => b[i]);
      const playerCount = cells.filter(c => c === player).length;
      const emptyCount = cells.filter(c => c === null).length;
      if (playerCount === 2 && emptyCount === 1) {
        return combo[cells.indexOf(null)];
      }
    }
    return null;
  };

  const minimax = (b: Cell[], player: Player): { index: number; score: number } => {
    const emptyIndices = b.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
    if (emptyIndices.length === 0) return { index: -1, score: 0 };

    const result = checkWinner(b);
    if (result) {
      if (result.winner === "O") return { index: -1, score: 10 };
      if (result.winner === "X") return { index: -1, score: -10 };
      return { index: -1, score: 0 };
    }

    const moves = [];
    for (const index of emptyIndices) {
      const nextBoard = [...b];
      nextBoard[index] = player;
      const nextScore = minimax(nextBoard, player === "O" ? "X" : "O").score;
      moves.push({ index, score: nextScore });
    }

    if (player === "O") {
      let best = { index: -1, score: -Infinity };
      moves.forEach(m => { if (m.score > best.score) best = m; });
      return best;
    } else {
      let best = { index: -1, score: Infinity };
      moves.forEach(m => { if (m.score < best.score) best = m; });
      return best;
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setWinningLine(null);
  };

  const resetScore = () => {
    resetGame();
    setScore({ X: 0, O: 0, draws: 0 });
  };

  if (showModeSelect) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 p-4 overflow-hidden relative" 
           style={{ 
             background: 'linear-gradient(45deg, #00ff00, #39ff14, #ccff00, #ffff00, #ff6600, #ff0000, #cc00ff)',
             backgroundSize: '400% 400%',
             animation: 'gradientBG 10s ease infinite'
           }}>
        <style>{`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
        <div className="text-center">
          <h1 className="text-6xl font-black italic mb-2">RADIO<span className="text-green-400">TRICKY</span></h1>
          <p className="text-zinc-300">Tres en Raya con onda</p>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-4">
            <button onClick={() => { setMode("pvp"); setShowModeSelect(false); }} className="rounded-xl bg-green-600 px-8 py-4 font-bold text-xl hover:bg-green-500">VS Amigo</button>
            <button onClick={() => { setMode("ai"); setShowModeSelect(false); }} className="rounded-xl bg-purple-600 px-8 py-4 font-bold text-xl hover:bg-purple-500">VS IA</button>
          </div>
          {mode === "ai" && (
            <div className="flex gap-2 mt-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map(diff => (
                <button 
                  key={diff} 
                  onClick={() => setDifficulty(diff)} 
                  className={`px-4 py-2 rounded-lg font-bold uppercase text-sm transition-all ${difficulty === diff ? 'bg-white text-purple-600 scale-110' : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800'}`}
                >
                  {diff === "easy" ? "Fácil" : diff === "medium" ? "Medio" : "Difícil"}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={onBack} className="text-zinc-400 underline mt-8">Volver al Hub</button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 p-4 overflow-hidden relative" 
         style={{ 
           background: 'linear-gradient(45deg, #00ff00, #39ff14, #ccff00, #ffff00, #ff6600, #ff0000, #cc00ff)',
           backgroundSize: '400% 400%',
           animation: 'gradientBG 10s ease infinite'
         }}>
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="flex items-center justify-between w-full max-w-md">
        <h1 className="text-4xl font-black italic">RADIO<span className="text-green-400">TRICKY</span></h1>
        <button onClick={() => { setShowModeSelect(true); resetScore(); }} className="text-zinc-400 underline hover:text-white">Cambiar modo</button>
      </div>

      <div className="flex gap-6 items-center text-xl font-mono">
        <div className="bg-zinc-900/50 px-6 py-2 rounded-xl border border-green-400/50">✕ <span className="text-green-400">{score.X}</span></div>
        <div className="bg-zinc-900/50 px-6 py-2 rounded-xl border border-zinc-700">Empates <span className="text-zinc-400">{score.draws}</span></div>
        <div className="bg-zinc-900/50 px-6 py-2 rounded-xl border border-pink-400/50">◯ <span className="text-pink-400">{score.O}</span></div>
      </div>

      <div className={`relative grid grid-cols-3 gap-3 w-80 h-80 ${winner ? 'opacity-50' : ''}`}>
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleCellClick(i)}
            disabled={!!cell || !!winner}
            className={`relative aspect-square bg-zinc-900/50 border-2 border-zinc-700 rounded-xl font-black text-5xl transition-all hover:border-green-400 hover:bg-zinc-800 disabled:cursor-not-allowed ${winningLine?.includes(i) ? 'border-green-400 bg-green-400/20' : ''}`}
            style={{ 
              color: cell === "X" ? "#39ff14" : cell === "O" ? "#ff00ff" : "transparent",
              textShadow: cell ? "0 0 10px currentColor, 0 0 20px currentColor" : "none"
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="text-center p-8 bg-zinc-900/90 rounded-2xl border-2 border-green-400">
            <h2 className="text-4xl font-black mb-4 text-green-400">
              {winner === "draw" ? "EMPATE" : `GANA ${winner === "X" ? "✕" : "◯"}!`}
            </h2>
            <div className="flex gap-4 justify-center">
              <button onClick={resetGame} className="bg-green-400 text-zinc-900 px-6 py-2 rounded-xl font-bold hover:bg-green-300">Revancha</button>
              <button onClick={resetScore} className="bg-zinc-700 text-zinc-300 px-6 py-2 rounded-xl font-bold">Reiniciar</button>
            </div>
          </div>
        </div>
      )}

      <div className="text-zinc-400 text-sm">
        Turno: <span className={currentPlayer === "X" ? "text-green-400" : "text-pink-400"}>✕</span> / <span className={currentPlayer === "O" ? "text-pink-400" : "text-zinc-400"}>◯</span>
      </div>

      <button onClick={onBack} className="text-zinc-400 underline mt-4">Volver al Hub</button>
    </div>
  );
}
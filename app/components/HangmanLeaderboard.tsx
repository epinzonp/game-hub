"use client";

import { useEffect, useState } from "react";

interface ScoreEntry {
  name: string;
  country: string;
  points: number;
}

export default function HangmanLeaderboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("hangman-scores");
    if (saved) {
      setScores(JSON.parse(saved));
    }
  }, []);

  const sortedScores = [...scores].sort((a, b) => b.points - a.points).slice(0, 10);

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl">
      <h3 className="mb-4 text-center text-2xl font-black tracking-tight text-white uppercase">
        Tabla Mundialista
      </h3>
      <div className="flex flex-col gap-2">
        {sortedScores.length === 0 ? (
          <p className="text-center text-zinc-500 italic">Aún no hay puntuaciones</p>
        ) : (
          sortedScores.map((entry, idx) => (
            <div 
              key={`${entry.name}-${idx}`} 
              className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-3 transition-colors hover:bg-zinc-800"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-500 w-4">{idx + 1}.</span>
                <span className="font-semibold text-zinc-200">{entry.name}</span>
                <span className="text-xs text-zinc-500">({entry.country})</span>
              </div>
              <span className="font-bold text-amber-400">{entry.points} pts</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

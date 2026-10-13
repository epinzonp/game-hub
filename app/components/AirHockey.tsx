"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import GameEntryScreen from "./GameEntryScreen";

type GameState = "menu" | "difficulty" | "playing" | "result";
type Opponent = "AI" | "Player";
type Difficulty = "easy" | "medium" | "hard" | "impossible";

export default function AirHockey() {
  const [state, setState] = useState<GameState>("menu");
  const [opponent, setOpponent] = useState<Opponent>("AI");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState({ player: 0, enemy: 0 });
  const [winner, setWinner] = useState<string | null>(null);

  // Game constants
  const TABLE_WIDTH = 400;
  const TABLE_HEIGHT = 600;
  const PADDLE_RADIUS = 25;
  const PUCK_RADIUS = 15;
  const WIN_SCORE = 1;

  // Refs for physics to avoid re-renders on every frame
  const puckRef = useRef({ x: TABLE_WIDTH / 2, y: TABLE_HEIGHT / 2, vx: 3, vy: 3 });
  const playerRef = useRef({ x: TABLE_WIDTH / 2, y: TABLE_HEIGHT - 50 });
  const enemyRef = useRef({ x: TABLE_WIDTH / 2, y: 50 });
  const requestRef = useRef<number | null>(null);

  const updatePhysics = () => {
    const puck = puckRef.current;
    const player = playerRef.current;
    const enemy = enemyRef.current;

    // 1. Move Puck
    puck.x += puck.vx;
    puck.y += puck.vy;

    // 2. Wall Collisions (Sides)
    if (puck.x - PUCK_RADIUS < 0 || puck.x + PUCK_RADIUS > TABLE_WIDTH) {
      puck.vx *= -1;
      puck.x = puck.x < PUCK_RADIUS ? PUCK_RADIUS : TABLE_WIDTH - PUCK_RADIUS;
    }

    // 3. Goal/Wall Collisions (Top/Bottom)
    const goalWidth = 160;
    const goalLeft = (TABLE_WIDTH - goalWidth) / 2;
    const goalRight = (TABLE_WIDTH + goalWidth) / 2;

    // Verificar si el disco ha cruzado la línea superior o inferior
    if (puck.y < PUCK_RADIUS) {
      if (puck.x >= goalLeft && puck.x <= goalRight) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 1000
        });
        setScore(s => {
          const ns = { ...s, player: s.player + 1 };
          if (ns.player >= WIN_SCORE) {
            setTimeout(() => setWinner("Player"), 5000);
          }
          return ns;
        });
        resetPuck();
      } else {
        puck.vy = Math.abs(puck.vy); // Forzar rebote hacia abajo
        puck.y = PUCK_RADIUS;
      }
    }

    if (puck.y > TABLE_HEIGHT - PUCK_RADIUS) {
      if (puck.x >= goalLeft && puck.x <= goalRight) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 1000
        });
        setScore(s => {
          const ns = { ...s, enemy: s.enemy + 1 };
          if (ns.enemy >= WIN_SCORE) {
            setTimeout(() => setWinner("Enemy"), 5000);
          }
          return ns;
        });
        resetPuck();
      } else {
        puck.vy = -Math.abs(puck.vy); // Forzar rebote hacia arriba
        puck.y = TABLE_HEIGHT - PUCK_RADIUS;
      }
    }

    // 4. Paddle Collisions
    const checkCollision = (p: { x: number, y: number }) => {
      const dx = puck.x - p.x;
      const dy = puck.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < PUCK_RADIUS + PADDLE_RADIUS) {
        // Simple collision response: reflect velocity
        const nx = dx / distance;
        const ny = dy / distance;
        const dot = puck.vx * nx + puck.vy * ny;
        puck.vx -= 2 * dot * nx;
        puck.vy -= 2 * dot * ny;
        // Prevent sticking
        const overlap = (PUCK_RADIUS + PADDLE_RADIUS) - distance;
        puck.x += nx * overlap;
        puck.y += ny * overlap;
      }
    };

    checkCollision(player);
    checkCollision(enemy);

    // 5. AI Behavior
    if (opponent === "AI") {
      const targetX = puck.x;
      let speed = 3;
      
      switch (difficulty) {
        case "easy": speed = 2; break;
        case "medium": speed = 4; break;
        case "hard": speed = 6; break;
        case "impossible": speed = 10; break;
      }
      
      if (enemy.x < targetX) enemy.x += speed;
      else if (enemy.x > targetX) enemy.x -= speed;
      
      // Keep AI in its half
      enemy.y = 50 + (Math.sin(Date.now() / 500) * 20); 
      enemy.x = Math.max(PADDLE_RADIUS, Math.min(TABLE_WIDTH - PADDLE_RADIUS, enemy.x));
    }

    // Force state update for rendering
    setScore({ ...score }); 
  };

  const resetPuck = () => {
    const isGameOver = score.player >= WIN_SCORE || score.enemy >= WIN_SCORE;
    puckRef.current = { 
      x: TABLE_WIDTH / 2, 
      y: TABLE_HEIGHT / 2, 
      vx: isGameOver ? 0 : (Math.random() > 0.5 ? 3 : -3), 
      vy: isGameOver ? 0 : (Math.random() > 0.5 ? 3 : -3) 
    };
  };

  useEffect(() => {
    if (state === "playing") {
      const loop = () => {
        updatePhysics();
        requestRef.current = requestAnimationFrame(loop);
      };
      requestRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [state, opponent]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    playerRef.current = { 
      x: Math.max(PADDLE_RADIUS, Math.min(TABLE_WIDTH - PADDLE_RADIUS, x)),
      y: Math.max(TABLE_HEIGHT / 2 + PADDLE_RADIUS, Math.min(TABLE_HEIGHT - PADDLE_RADIUS, y))
    };
  };

  if (state === "menu") {
    return (
      <GameEntryScreen
        title="Hockey de Aire"
        description="Desliza el disco y vence a la IA o a un amigo."
        image="/game-covers/cover-3.webp"
      >
        <h2 className="text-xl font-extrabold">Elige rival</h2>
        <div className="grid gap-3">
          <button onClick={() => { setOpponent("AI"); setState("difficulty"); }} className="min-h-12 rounded-xl bg-[#fff34b] px-6 py-3 font-black text-[#180e13] transition hover:bg-[#fff877] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Contra IA</button>
          <button onClick={() => { setOpponent("Player"); setState("playing"); }} className="min-h-12 rounded-xl border border-white/15 bg-[#392126] px-6 py-3 font-bold text-white transition hover:bg-[#4a2932] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff34b]">Contra Jugador</button>
        </div>
      </GameEntryScreen>
    );
  }

  if (state === "difficulty") {
    return (
      <GameEntryScreen
        title="Hockey de Aire"
        description="Elige qué tan intenso quieres que sea el partido."
        image="/game-covers/cover-3.webp"
      >
        <h2 className="text-xl font-extrabold">Selecciona dificultad</h2>
        <div className="grid grid-cols-2 gap-3">
          {([["easy", "Fácil"], ["medium", "Medio"], ["hard", "Difícil"], ["impossible", "Imposible"]] as const).map(([level, label]) => (
            <button key={level} onClick={() => { setDifficulty(level); setState("playing"); }} className="min-h-12 rounded-xl border border-white/10 bg-[#392126] px-4 py-3 font-bold text-white transition hover:border-[#fff34b]/60 hover:bg-[#4a2932] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff34b]">
              {label}
            </button>
          ))}
        </div>
        <button onClick={() => setState("menu")} className="self-start text-sm font-bold text-rose-100/70 underline underline-offset-4 hover:text-white">Volver a elegir rival</button>
      </GameEntryScreen>
    );
  }

  if (winner) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-zinc-900 text-white">
        <h2 className="text-5xl font-black">¡{winner === "Player" ? "GANASTE!" : "PERDISTE!"}</h2>
        <div className="text-2xl">Final: {score.player} - {score.enemy}</div>
        <button onClick={() => { setWinner(null); setScore({ player: 0, enemy: 0 }); setState("menu"); }} className="rounded-xl bg-blue-600 px-8 py-3 font-bold">Jugar de nuevo</button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-zinc-900 text-white overflow-hidden">
      <div className="flex gap-20 text-4xl font-black mb-2">
        <div className="text-red-500">{score.enemy}</div>
        <div className="text-blue-500">{score.player}</div>
      </div >
      <div 
        className="relative bg-slate-200 rounded-lg shadow-2xl border-8 border-slate-400 cursor-none"
        style={{ width: TABLE_WIDTH, height: TABLE_HEIGHT }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        {/* Center Line */}
        <div className="absolute top-1/2 w-full h-1 bg-slate-400 -translate-y-1/2" />
        {/* Goals */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-2 bg-red-500" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150px] h-2 bg-blue-500" />

        {/* Puck */}
        <div 
          className="absolute bg-zinc-800 rounded-full transition-none"
          style={{ 
            width: PUCK_RADIUS * 2, 
            height: PUCK_RADIUS * 2, 
            left: puckRef.current.x - PUCK_RADIUS, 
            top: puckRef.current.y - PUCK_RADIUS 
          }} 
        />
        {/* Player */}
        <div 
          className="absolute bg-blue-600 rounded-full shadow-lg"
          style={{ 
            width: PADDLE_RADIUS * 2, 
            height: PADDLE_RADIUS * 2, 
            left: playerRef.current.x - PADDLE_RADIUS, 
            top: playerRef.current.y - PADDLE_RADIUS 
          }} 
        />
        {/* Enemy */}
        <div 
          className="absolute bg-red-600 rounded-full shadow-lg"
          style={{ 
            width: PADDLE_RADIUS * 2, 
            height: PADDLE_RADIUS * 2, 
            left: enemyRef.current.x - PADDLE_RADIUS, 
            top: enemyRef.current.y - PADDLE_RADIUS 
          }} 
        />
      </div >
    </div>
  );
}

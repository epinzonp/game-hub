"use client";

import React, { useState, useEffect, useRef } from "react";
import { reproducirFunkVictoria, reproducirTicTac } from "../../lib/sonido";
import GameEntryScreen from "./GameEntryScreen";
import { useGameProgress } from "./GameNavigationGuard";

type Difficulty = "easy" | "medium" | "hard" | "impossible";

export default function PinPon({ onWin }: { onWin: () => Promise<void> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameState, setGameState] = useState<"menu" | "difficulty" | "playing" | "gameOver">("menu");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [rewardError, setRewardError] = useState("");
  const rewardGranted = useRef(false);

  useGameProgress(gameState === "playing" || gameState === "gameOver");
  
  const stateRef = useRef({
    playerY: 0,
    aiY: 0,
    ballX: 0,
    ballY: 0,
    ballDX: 0,
    ballDY: 0,
    score: { player: 0, ai: 0 }
  });

  useEffect(() => {
    if (gameState === "playing") {
      rewardGranted.current = false;
      return;
    }
    if (gameState !== "gameOver" || score.player < 5 || rewardGranted.current)
      return;
    rewardGranted.current = true;
    void onWin().catch(() =>
      setRewardError("No pudimos guardar las monedas de esta victoria. Revisa tu conexión."),
    );
  }, [gameState, onWin, score.player]);

    useEffect(() => {
      if (gameState !== "playing") return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animationFrameId: number;
      
      const paddleWidth = 10;
      const paddleHeight = 80;
      const ballSize = 8;
      
      // Initialize stateRef
      stateRef.current = {
        playerY: canvas.height / 2 - paddleHeight / 2,
        aiY: canvas.height / 2 - paddleHeight / 2,
        ballX: canvas.width / 2,
        ballY: canvas.height / 2,
        ballDX: 4,
        ballDY: 4,
        score: { ...score }
      };

       const update = () => {
         const s = stateRef.current;

         // Ball movement
         s.ballX += s.ballDX;
         s.ballY += s.ballDY;

         // Wall bounce
         if (s.ballY <= 0 || s.ballY >= canvas.height - ballSize) {
           s.ballDY *= -1;
         }

         // AI movement based on difficulty
         const aiCenter = s.aiY + paddleHeight / 2;
         let aiSpeed = 3.5;
         switch (difficulty) {
           case "easy": aiSpeed = 2; break;
           case "medium": aiSpeed = 4; break;
           case "hard": aiSpeed = 6; break;
           case "impossible": aiSpeed = 10; break;
         }
         if (aiCenter < s.ballY - 10) s.aiY += aiSpeed;
         else if (aiCenter > s.ballY + 10) s.aiY -= aiSpeed;

         // Collision Player
        if (s.ballX <= paddleWidth && s.ballY >= s.playerY && s.ballY <= s.playerY + paddleHeight) {
          s.ballDX *= -1.1;
          s.ballX = paddleWidth;
          reproducirTicTac();
        }

        // Collision AI
        if (s.ballX >= canvas.width - paddleWidth - ballSize && s.ballY >= s.aiY && s.ballY <= s.aiY + paddleHeight) {
          s.ballDX *= -1.1;
          s.ballX = canvas.width - paddleWidth - ballSize;
          reproducirTicTac();
        }

        // Scoring
        if (s.ballX < 0) {
          s.score.ai += 1;
          setScore({ ...s.score });
          if (s.score.ai >= 5) {
            setGameState("gameOver");
            reproducirFunkVictoria();
          } else {
            resetBall();
          }
        } else if (s.ballX > canvas.width) {
          s.score.player += 1;
          setScore({ ...s.score });
          if (s.score.player >= 5) {
            setGameState("gameOver");
            reproducirFunkVictoria();
          } else {
            resetBall();
          }
        }

        function resetBall() {
          if (!canvas) return;
          s.ballX = canvas.width / 2;
          s.ballY = canvas.height / 2;
          s.ballDX = s.ballDX > 0 ? -4 : 4;
          s.ballDY = 4 * (Math.random() > 0.5 ? 1 : -1);
        }

        // Draw
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#000"; 
        ctx.strokeStyle = "#39ff14";
        ctx.lineWidth = 2;
        ctx.fillRect(0, s.playerY, paddleWidth, paddleHeight);
        ctx.strokeRect(0, s.playerY, paddleWidth, paddleHeight);

        ctx.fillStyle = "#ff0000"; 
        ctx.fillRect(canvas.width - paddleWidth, s.aiY, paddleWidth, paddleHeight);

        ctx.fillStyle = "#fff"; 
        ctx.fillRect(s.ballX, s.ballY, ballSize, ballSize);

        animationFrameId = requestAnimationFrame(update);
      };

      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        stateRef.current.playerY = e.clientY - rect.top - paddleHeight / 2;
        if (stateRef.current.playerY < 0) stateRef.current.playerY = 0;
        if (stateRef.current.playerY > canvas.height - paddleHeight) stateRef.current.playerY = canvas.height - paddleHeight;
      };

      window.addEventListener("mousemove", handleMouseMove);
      update();

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(animationFrameId);
      };
    }, [gameState]);


  if (gameState === "menu") {
    return (
      <GameEntryScreen
        title="Pin Pon"
        description="Devuelve la pelota y mantén el ritmo para ganar."
        image="/game-covers/cover-5.webp"
      >
        <h2 className="text-xl font-extrabold">¿Listo para jugar?</h2>
        <p className="text-sm leading-6 text-rose-100/70">Mueve el ratón para controlar tu paleta y vencer a la IA.</p>
        <button
          onClick={() => setGameState("difficulty")}
          className="min-h-12 rounded-xl bg-[#fff34b] px-8 py-3 text-lg font-black text-[#180e13] transition hover:bg-[#fff877] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          ¡Jugar!
        </button>
      </GameEntryScreen>
    );
  }

  if (gameState === "difficulty") {
    return (
      <GameEntryScreen
        title="Pin Pon"
        description="Escoge el nivel de reto para esta partida."
        image="/game-covers/cover-5.webp"
      >
        <h2 className="text-xl font-extrabold">Selecciona dificultad</h2>
        <div className="grid grid-cols-2 gap-3">
          {([["easy", "Fácil"], ["medium", "Medio"], ["hard", "Difícil"], ["impossible", "Imposible"]] as const).map(([level, label]) => (
            <button key={level} onClick={() => { setDifficulty(level); setScore({ player: 0, ai: 0 }); setGameState("playing"); }} className="min-h-12 rounded-xl border border-white/10 bg-[#392126] px-4 py-3 font-bold text-white transition hover:border-[#fff34b]/60 hover:bg-[#4a2932] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff34b]">
              {label}
            </button>
          ))}
        </div>
      </GameEntryScreen>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-[#180e13] p-4 overflow-hidden relative">
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <h1 className="text-4xl font-black italic text-white">PIN <span className="text-amber-500">PON</span></h1>
      </div>

      <div className="flex gap-8 text-3xl font-mono mb-4">
        <div className="text-green-400">Tú: {score.player}</div>
        <div className="text-pink-400">IA: {score.ai}</div>
      </div>

       {gameState === "gameOver" ? (
         <div className="relative">
           <canvas 
             ref={canvasRef} 
             width={600} 
             height={400} 
             className="border-4 border-zinc-800 rounded-xl bg-black"
           />
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl">
            {score.player >= 5 && (
              <div
                role="status"
                aria-label="Ganaste 100 monedas"
                className="pointer-events-none mb-4 text-6xl font-black text-green-400 drop-shadow-[0_5px_0_#14532d] coin-reward-pop"
              >
                100+
              </div>
            )}
             <h2 className={`text-6xl font-black mb-8 ${score.player >= 5 ? 'text-white' : 'text-red-600'}`}>
               {score.player >= 5 ? "NEGRO GANA" : "ROJO GANA"}
             </h2>
            {rewardError && <p role="alert" className="mb-4 text-sm text-rose-200">{rewardError}</p>}
             <button 
               onClick={() => {
                 setScore({ player: 0, ai: 0 });
                 setGameState("playing");
               }} 
               className="bg-amber-500 text-black px-8 py-4 rounded-2xl font-black text-2xl hover:bg-amber-400 transition-all"
             >
               REVANCHA
             </button>
           </div>
         </div>
       ) : (
         <canvas 
           ref={canvasRef} 
           width={600} 
           height={400} 
           className="border-4 border-zinc-800 rounded-xl bg-black"
         />
       )}


      <div className="text-zinc-500 text-sm mt-4">
        Mueve el ratón para controlar tu paleta.
      </div>
    </div>
  );
}

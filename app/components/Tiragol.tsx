"use client";

import React, { useState, useEffect, useCallback } from "react";
import { reproducirRisa, reproducirVictoria } from "@/lib/sonido";
import confetti from "canvas-confetti";

type GameState = "aiming" | "shooting" | "result";
type Result = "goal" | "miss" | "saved";

function FloatingCup() {
  const [pos, setPos] = useState({ x: Math.random() * 100, y: 110 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPos(p => ({
        x: p.x + (Math.random() * 2 - 1),
        y: p.y - 0.2
      }));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="absolute text-4xl animate-bounce" 
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transition: 'all 0.1s linear' }}
    >
      🏆
    </div>
  );
}

function FloatingSadFace() {
  const [pos, setPos] = useState({ x: Math.random() * 100, y: 110 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPos(p => ({
        x: p.x + (Math.random() * 2 - 1),
        y: p.y - 0.2
      }));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="absolute text-4xl animate-bounce" 
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transition: 'all 0.1s linear' }}
    >
      😢
    </div>
  );
}

export default function Tiragol({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<GameState>("aiming");
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });
  const [goalPos, setGoalPos] = useState({ x: 0, y: 0 });
  const [keeperPos, setKeeperPos] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const handleShoot = () => {
    setState("shooting");
    
    // Portero elige dirección aleatoria: -1 (izq), 0 (centro), 1 (der)
    const keeperMove = Math.floor(Math.random() * 3) - 1;
    setKeeperPos(keeperMove);

    // Determinamos si es gol basado en la posición del balón
    // Simplificación: x > 100 es derecha, x < -100 es izquierda, resto centro
    setTimeout(() => {
      let shotDir = 0;
      
      const constrainedX = Math.max(-120, Math.min(120, ballPos.x));
      const constrainedY = Math.max(-150, Math.min(150, ballPos.y));
      
      if (constrainedX > 100) shotDir = 1;
      else if (constrainedX < -100) shotDir = -1;

      if (Math.abs(constrainedY) > 150) {
        setResult("miss");
        reproducirRisa();
      } else if (shotDir === keeperMove) {
        setResult("saved");
        reproducirRisa();
        // Efecto de rebote: el balón vuelve un poco hacia atrás y hacia los lados
        setBallPos(prev => ({
          x: prev.x * 0.5 + (Math.random() * 40 - 20),
          y: prev.y * 0.5 + 20
        }));
      } else {
        const newScore = score + 1;
        setScore(newScore);
        setResult("goal");
        reproducirVictoria();
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        if (newScore >= 10) {
          setTimeout(() => {
            onBack();
          }, 3000);
        }
      }
      setState("result");
    }, 800);
  };

  const resetTurn = () => {
    setBallPos({ x: 0, y: 0 });
    setKeeperPos(0);
    setResult(null);
    setState("aiming");
  };

  useEffect(() => {
    setAttempts(a => a + 1);
  }, [result]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 p-4 text-center bg-green-900 text-white overflow-hidden">
      <div className="flex justify-between w-full max-w-2xl text-2xl font-bold">
        <div>Goles: <span className="text-amber-400">{score}</span></div>
        <div className="text-sm self-center">Tiragol ⚽</div>
        <div>Intentos: {attempts}</div>
      </div>

      <div className="relative w-full max-w-3xl h-[400px] bg-green-700 border-b-8 border-green-800 rounded-t-3xl flex items-end justify-center pb-10 overflow-hidden">
        {result === "goal" && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => <FloatingCup key={i} />)}
          </div>
        )}
        {result && result !== "goal" && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => <FloatingSadFace key={i} />)}
          </div>
        )}
        {/* Portería */}
        <div className="absolute top-10 w-64 h-40 border-4 border-white border-b-0 flex justify-center">
          {/* Redes */}
          <div className="absolute inset-0 opacity-30 pointer-events-none" 
               style={{ 
                 backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
                 backgroundSize: '10px 10px' 
               }} 
          />
          {/* Portero */}
          <div 
            className="absolute bottom-0 text-5xl transition-all duration-1000 ease-in-out z-10"
            style={{ 
              transform: score >= 10 
                ? `translateX(100vw)` 
                : `translateX(${keeperPos * 60}px)` 
            }}
          >
            {score >= 10 ? "😢" : "😊"}
          </div>
        </div>

        {/* Balón */}
        <div 
          className="absolute w-10 h-10 bg-white rounded-full shadow-lg transition-all duration-700 ease-in cursor-pointer flex items-center justify-center text-2xl border-2 border-zinc-300"
          style={{ 
            bottom: state === "shooting" || state === "result" ? "250px" : "40px",
            left: `calc(50% + ${ballPos.x}px)`,
            transform: `translateX(-50%) translateY(${ballPos.y}px)`,
            opacity: state === "result" && result === "saved" ? 0.5 : 1
          }}
          onMouseDown={(e) => {
            if (state !== "aiming") return;
            const startX = e.clientX;
            const startY = e.clientY;
            
            const onMouseMove = (moveEvent: MouseEvent) => {
              setBallPos({
                x: moveEvent.clientX - startX,
                y: moveEvent.clientY - startY
              });
            };
            
            const onMouseUp = () => {
              window.removeEventListener("mousemove", onMouseMove);
              window.removeEventListener("mouseup", onMouseUp);
              handleShoot();
            };
            
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
          }}
        >
          ⚽
        </div>
      </div>

      {state === "aiming" && (
        <p className="text-zinc-300 animate-pulse">Arrastra el balón para tirar!</p>
      )}

      {state === "result" && (
        <div className="flex flex-col items-center gap-4">
          <h2 className={`text-5xl font-black ${result === "goal" ? "text-green-400" : "text-red-500"}`}>
            {result === "goal" ? "¡GOLAZO!" : result === "saved" ? "¡PARADA!" : "¡FUERA!"}
          </h2>
          <button 
            onClick={resetTurn}
            className="rounded-xl bg-amber-500 px-8 py-3 font-bold text-zinc-900 hover:scale-105 transition-transform"
          >
            Tirar otra vez
          </button>
        </div>
      )}

      <button 
        onClick={onBack}
        className="text-sm text-zinc-400 underline hover:text-white"
      >
        Volver al Hub
      </button>
    </div>
  );
}

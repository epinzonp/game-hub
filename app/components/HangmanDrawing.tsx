interface HangmanDrawingProps {
  errores: number;
  perdio: boolean;
}

export default function HangmanDrawing({ errores, perdio }: HangmanDrawingProps) {
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 300 320" className="h-full w-full max-h-72">
        {/* Lava de fondo */}
        <g className={perdio ? "lava-rise" : ""}>
          <ellipse cx="150" cy="300" rx="150" ry="45" fill="#ff4d00" />
          <ellipse cx="150" cy="302" rx="120" ry="30" fill="#ff8c00" opacity="0.9" />
          <ellipse cx="150" cy="304" rx="70" ry="16" fill="#ffd166" opacity="0.9" />
        </g>

        {/* Horca */}
        <g stroke="#8b5a2b" strokeWidth="8" strokeLinecap="round" fill="none">
          <line x1="30" y1="295" x2="95" y2="295" />
          <line x1="62" y1="295" x2="62" y2="45" />
          <line x1="62" y1="45" x2="180" y2="45" />
        </g>
        {/* Cuerda */}
        <g className={perdio ? "opacity-0 transition-opacity duration-300" : ""}>
          <line x1="180" y1="45" x2="200" y2="62" stroke="#888" strokeWidth="4" />
        </g>

        {/* Muñeco */}
        <g
          className={`hang-piece ${perdio ? "hang-fall hang-melt" : ""}`}
          stroke="#f2c79b"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        >
          {errores >= 1 && <circle cx="200" cy="82" r="20" fill="#f2c79b" strokeWidth="4" />}
          {errores >= 2 && <line x1="200" y1="102" x2="200" y2="160" />}
          {errores >= 3 && <line x1="200" y1="112" x2="172" y2="142" />}
          {errores >= 4 && <line x1="200" y1="112" x2="228" y2="142" />}
          {errores >= 5 && <line x1="200" y1="160" x2="174" y2="195" />}
          {errores >= 6 && <line x1="200" y1="160" x2="226" y2="195" />}
        </g>
      </svg>
    </div>
  );
}

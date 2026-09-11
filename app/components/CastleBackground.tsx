export default function CastleBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 left-0 h-full w-full"
      >
        <defs>
          <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1033" />
            <stop offset="55%" stopColor="#3b1f54" />
            <stop offset="100%" stopColor="#6b2f5e" />
          </linearGradient>
          <radialGradient id="luna" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8d6" />
            <stop offset="70%" stopColor="#ffe9a8" />
            <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Cielo nocturno */}
        <rect width="1200" height="800" fill="url(#cielo)" />

        {/* Estrellas */}
        <g fill="#ffffff">
          <circle cx="90" cy="90" r="2" opacity="0.8" />
          <circle cx="230" cy="60" r="1.5" opacity="0.6" />
          <circle cx="380" cy="120" r="2" opacity="0.7" />
          <circle cx="520" cy="45" r="1.5" opacity="0.5" />
          <circle cx="690" cy="100" r="2" opacity="0.8" />
          <circle cx="860" cy="55" r="1.5" opacity="0.6" />
          <circle cx="1010" cy="130" r="2" opacity="0.7" />
          <circle cx="1130" cy="80" r="1.5" opacity="0.5" />
          <circle cx="170" cy="180" r="1.5" opacity="0.5" />
          <circle cx="940" cy="190" r="1.5" opacity="0.5" />
        </g>

        {/* Luna */}
        <circle cx="980" cy="170" r="90" fill="url(#luna)" opacity="0.5" />
        <circle cx="980" cy="170" r="45" fill="#ffe9a8" />

        {/* Colinas lejanas */}
        <path d="M0 610 Q 200 540 420 600 T 850 590 T 1200 610 L 1200 800 L 0 800 Z" fill="#231736" />
        <path d="M0 660 Q 250 600 500 650 T 1000 640 T 1200 660 L 1200 800 L 0 800 Z" fill="#2a1c40" />

        {/* Muro del castillo */}
        <g>
          <rect x="300" y="460" width="600" height="340" fill="#4a3a58" />
          {/* Pared de piedras (líneas) */}
          <g stroke="#5d4a6e" strokeWidth="2" opacity="0.7">
            <line x1="300" y1="500" x2="900" y2="500" />
            <line x1="300" y1="540" x2="900" y2="540" />
            <line x1="300" y1="580" x2="900" y2="580" />
            <line x1="300" y1="620" x2="900" y2="620" />
            <line x1="300" y1="660" x2="900" y2="660" />
            <line x1="300" y1="700" x2="900" y2="700" />
            <line x1="300" y1="740" x2="900" y2="740" />
            <line x1="420" y1="460" x2="420" y2="500" />
            <line x1="540" y1="500" x2="540" y2="540" />
            <line x1="660" y1="460" x2="660" y2="540" />
            <line x1="780" y1="540" x2="780" y2="620" />
            <line x1="360" y1="620" x2="360" y2="660" />
            <line x1="600" y1="660" x2="600" y2="700" />
            <line x1="840" y1="700" x2="840" y2="740" />
          </g>
          {/* Almenas del muro */}
          <g fill="#544163">
            <rect x="300" y="430" width="40" height="34" />
            <rect x="380" y="430" width="40" height="34" />
            <rect x="460" y="430" width="40" height="34" />
            <rect x="540" y="430" width="40" height="34" />
            <rect x="620" y="430" width="40" height="34" />
            <rect x="700" y="430" width="40" height="34" />
            <rect x="780" y="430" width="40" height="34" />
            <rect x="860" y="430" width="40" height="34" />
          </g>

          {/* Torre izquierda */}
          <rect x="240" y="360" width="120" height="440" fill="#42334f" />
          <g fill="#544163">
            <rect x="238" y="322" width="38" height="42" />
            <rect x="298" y="322" width="38" height="42" />
            <rect x="358" y="322" width="38" height="42" />
          </g>
          <rect x="278" y="400" width="44" height="60" rx="22" fill="#2a1f36" />
          <line x1="300" y1="400" x2="300" y2="460" stroke="#2a1f36" strokeWidth="3" />

          {/* Torre derecha */}
          <rect x="840" y="360" width="120" height="440" fill="#42334f" />
          <g fill="#544163">
            <rect x="804" y="322" width="38" height="42" />
            <rect x="864" y="322" width="38" height="42" />
            <rect x="924" y="322" width="38" height="42" />
          </g>
          <rect x="878" y="400" width="44" height="60" rx="22" fill="#2a1f36" />
          <line x1="900" y1="400" x2="900" y2="460" stroke="#2a1f36" strokeWidth="3" />

          {/* Puerta principal (arco) */}
          <path d="M 540 800 L 540 660 A 60 60 0 0 1 660 660 L 660 800 Z" fill="#231826" />
          <rect x="585" y="700" width="30" height="52" rx="6" fill="#8a6d3b" />

          {/* Ventanas */}
          <g>
            <rect x="360" y="520" width="34" height="40" rx="17" fill="#181020" />
            <rect x="805" y="520" width="34" height="40" rx="17" fill="#181020" />
          </g>
        </g>

        {/* Banderas */}
        <g>
          <line x1="300" y1="322" x2="300" y2="270" stroke="#6b5b3a" strokeWidth="5" />
          <path d="M300 272 L 350 282 L 300 292 Z" fill="#e64545" />
          <line x1="900" y1="322" x2="900" y2="270" stroke="#6b5b3a" strokeWidth="5" />
          <path d="M900 272 L 850 282 L 900 292 Z" fill="#2f6fed" />
        </g>
      </svg>

      {/* Niebla en la base para integrar el castillo */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950/80 to-transparent" />
    </div>
  );
}

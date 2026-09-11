interface ScareOverlayProps {
  activo: boolean;
}

export default function ScareOverlay({ activo }: ScareOverlayProps) {
  if (!activo) return null;

  return (
    <div className="scare-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="scare-face h-[70vmin] w-[70vmin]">
        <svg viewBox="0 0 400 400" className="h-full w-full drop-shadow-[0_0_40px_rgba(255,0,0,0.8)]">
          <defs>
            <radialGradient id="scareSkin" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#d8d4c8" />
              <stop offset="100%" stopColor="#8f9a9a" />
            </radialGradient>
            <radialGradient id="scareEye" cx="50%" cy="50%" r="50%">
              <stop offset="40%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#c9c9c9" />
            </radialGradient>
          </defs>

          {/* Cabeza pálida y desencajada */}
          <ellipse cx="200" cy="200" rx="150" ry="175" fill="url(#scareSkin)" />

          {/* Sombra ocular profunda y ojos enormes */}
          <ellipse cx="135" cy="165" rx="52" ry="58" fill="#1a0a0a" />
          <ellipse cx="265" cy="165" rx="52" ry="58" fill="#1a0a0a" />

          {/* Ojos saltones: blanco + pupila roja diminuta */}
          <circle cx="135" cy="160" r="40" fill="url(#scareEye)" />
          <circle cx="265" cy="160" r="40" fill="url(#scareEye)" />
          <circle cx="138" cy="158" r="9" fill="#b40000" />
          <circle cx="262" cy="158" r="9" fill="#b40000" />
          <circle cx="140" cy="155" r="3" fill="#000" />
          <circle cx="264" cy="155" r="3" fill="#000" />

          {/* Venas rojas en la frente */}
          <g stroke="#a01818" strokeWidth="4" strokeLinecap="round" opacity="0.85">
            <path d="M200 40 C 200 70 180 80 160 100" fill="none" />
            <path d="M205 45 C 235 75 240 90 245 110" fill="none" />
            <path d="M190 50 C 150 75 130 90 125 115" fill="none" />
          </g>

          {/* Boca descomunal abierta */}
          <path
            d="M100 270 Q 200 210 300 270 Q 290 380 200 385 Q 110 380 100 270 Z"
            fill="#3a0505"
          />
          {/* Dientes superiores */}
          <g fill="#f4f0dc">
            <path d="M120 268 L 133 305 L 147 266 Z" />
            <path d="M158 260 L 170 300 L 184 258 Z" />
            <path d="M196 255 L 207 296 L 220 254 Z" />
            <path d="M236 257 L 246 300 L 262 254 Z" />
            <path d="M276 266 L 286 306 L 298 268 Z" />
          </g>
          {/* Dientes inferiores */}
          <g fill="#e8e2cc">
            <path d="M150 380 L 164 345 L 178 383 Z" />
            <path d="M196 388 L 208 352 L 222 388 Z" />
            <path d="M242 384 L 254 348 L 268 386 Z" />
          </g>
          {/* Lengua */}
          <ellipse cx="200" cy="350" rx="40" ry="26" fill="#8c0f1e" />

          {/* Labio superior azulado */}
          <path
            d="M95 265 Q 200 220 305 265 Q 200 245 95 265 Z"
            fill="#5c1010"
          />

          {/* Cejas fruncidas (maldad) */}
          <path d="M78 110 Q 135 90 190 122" stroke="#1c1c1c" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M322 110 Q 265 90 210 122" stroke="#1c1c1c" strokeWidth="14" fill="none" strokeLinecap="round" />

          {/* Cabello despeinado */}
          <g fill="#1c1c1c">
            <path d="M80 140 Q 70 60 130 45 Q 120 90 140 100 Z" />
            <path d="M180 30 Q 200 5 230 30 Q 250 70 240 100 Z" />
            <path d="M300 120 Q 330 70 290 40 Q 280 80 270 105 Z" />
          </g>

          {/* Goteo de sangre en la boca/mentón */}
          <g fill="#a01818">
            <ellipse cx="150" cy="392" rx="8" ry="14" />
            <ellipse cx="252" cy="392" rx="7" ry="12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

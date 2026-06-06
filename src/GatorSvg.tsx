import type { GatorKind, GatorPhase } from "./types";
import "./GatorSvg.css";

type Props = {
  kind: GatorKind;
  gatorPhase: GatorPhase;
  biteElapsed: number;
};

export function GatorSvg({ kind: _kind, gatorPhase, biteElapsed: _biteElapsed }: Props) {
  const isBiting  = gatorPhase === "biting";
  const isWhacked = gatorPhase === "whacked";

  return (
    <svg
      viewBox="0 0 70 150"
      width={GATOR_WIDTH}
      height={GATOR_HEIGHT}
      className={`gator-svg${isWhacked ? " whacked" : ""}`}
      style={{ transform: "rotate(180deg)" }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ===== Body ===== */}
      <path
        d="M 35 2 C 39 2 47 10 48 28 C 49 38 52 45 54 58
           C 57 70 58 82 57 96 C 56 110 51 124 44 138
           C 41 143 38 148 35 148
           C 32 148 29 143 26 138
           C 19 124 14 110 13 96 C 12 82 13 70 16 58
           C 18 45 21 38 22 28 C 23 10 31 2 35 2 Z"
        fill="#4a7c3f"
        stroke="#2d5016"
        strokeWidth="1.5"
      />

      {/* ===== Belly highlight ===== */}
      <ellipse cx="35" cy="90" rx="13" ry="26" fill="#5a9c4e" opacity="0.5" />

      {/* ===== Scale arcs ===== */}
      <path d="M 24 72 Q 35 69 46 72" stroke="#2d5016" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M 22 90 Q 35 87 48 90" stroke="#2d5016" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M 24 108 Q 35 105 46 108" stroke="#2d5016" strokeWidth="1" fill="none" opacity="0.6" />

      {/* ===== Front legs ===== */}
      <path d="M 15 85 C 7 83 3 88 5 94 C 7 98 11 97 14 95"
            fill="#4a7c3f" stroke="#2d5016" strokeWidth="1.2" />
      <path d="M 55 85 C 63 83 67 88 65 94 C 63 98 59 97 56 95"
            fill="#4a7c3f" stroke="#2d5016" strokeWidth="1.2" />

      {/* ===== Back legs ===== */}
      <path d="M 16 114 C 8 112 4 117 6 122 C 8 126 12 125 15 122"
            fill="#4a7c3f" stroke="#2d5016" strokeWidth="1.2" />
      <path d="M 54 114 C 62 112 66 117 64 122 C 62 126 58 125 55 122"
            fill="#4a7c3f" stroke="#2d5016" strokeWidth="1.2" />

      {/* ===== Eyes ===== */}
      <circle cx="22" cy="58" r="5.5" fill="#f0c030" stroke="#2d5016" strokeWidth="1" />
      <circle cx="22" cy="58" r="2.5" fill="#1a1a1a" />
      <circle cx="21" cy="57" r="0.8" fill="#ffffff" />

      <circle cx="48" cy="58" r="5.5" fill="#f0c030" stroke="#2d5016" strokeWidth="1" />
      <circle cx="48" cy="58" r="2.5" fill="#1a1a1a" />
      <circle cx="47" cy="57" r="0.8" fill="#ffffff" />

      {/* ===== Mouth ===== */}
      {isBiting ? (
        <g className="mouth-open">
          <ellipse cx="35" cy="50" rx="11" ry="8" fill="#c0392b" />
          <path
            d="M 27 42 L 28 37 M 31 42 L 32 37 M 35 42 L 36 37 M 39 42 L 40 37 M 43 42 L 44 37"
            stroke="#fffdf0" strokeWidth="1.8" strokeLinecap="round"
          />
          <path d="M 26 58 C 30 63 40 63 44 58" stroke="#a02020" strokeWidth="1" fill="none" />
        </g>
      ) : (
        <line
          x1="24" y1="42" x2="46" y2="42"
          stroke="#2d5016" strokeWidth="1.5" strokeLinecap="round"
        />
      )}
    </svg>
  );
}

// Keep in sync with constants.ts but avoid circular import
const GATOR_WIDTH  = 70;
const GATOR_HEIGHT = 150;

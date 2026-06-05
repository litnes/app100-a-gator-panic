import type { GamePhase } from "./types";
import "./HUD.css";

type Props = {
  score: number;
  biteCount: number;
  timeLeft: number;
  gamePhase: GamePhase;
};

const PLAYING_PHASES: GamePhase[] = ["early", "mid", "late", "anger"];

export function HUD({ score, biteCount, timeLeft, gamePhase }: Props) {
  const isPlaying = PLAYING_PHASES.includes(gamePhase);
  const isUrgent  = isPlaying && timeLeft <= 10;

  return (
    <div className="hud">
      <div className="hud-item">
        <span className="hud-label">スコア</span>
        <span className="hud-value hud-score">{score}</span>
      </div>
      <div className="hud-item">
        <span className="hud-label">残り</span>
        <span className={`hud-value hud-time${isUrgent ? " danger" : ""}`}>
          {timeLeft}s
        </span>
      </div>
      <div className="hud-item">
        <span className="hud-label">噛まれた</span>
        <span className="hud-value hud-bites">{biteCount}</span>
      </div>
    </div>
  );
}

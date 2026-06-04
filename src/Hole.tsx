import type { HoleState } from "./types";
import "./Hole.css";

type Props = {
  hole: HoleState;
  onWhack: (id: number) => void;
};

export function Hole({ hole, onWhack }: Props) {
  return (
    <div className="hole">
      <div className="hole-pit" />
      <button
        className={`gator ${hole.isUp ? "up" : ""} ${hole.isWhacked ? "whacked" : ""}`}
        onClick={() => onWhack(hole.id)}
        aria-label="ワニを叩く"
      >
        <span className="gator-face">🐊</span>
        {hole.isWhacked && <span className="hit-effect">💥</span>}
      </button>
    </div>
  );
}

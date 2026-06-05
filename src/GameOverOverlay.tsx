import "./Overlay.css";

type Props = {
  score: number;
  biteCount: number;
  onRestart: () => void;
};

export function GameOverOverlay({ score, biteCount, onRestart }: Props) {
  return (
    <div className="overlay-backdrop">
      <h2 className="overlay-title">ゲーム終了！</h2>
      <div className="overlay-stats">
        <div className="overlay-stat">
          <span className="overlay-stat-label">スコア</span>
          <span className="overlay-stat-value">{score}</span>
        </div>
        <div className="overlay-stat">
          <span className="overlay-stat-label">噛まれた</span>
          <span className="overlay-stat-value" style={{ color: biteCount > 0 ? "#ff8060" : "#fff8e0" }}>
            {biteCount}
          </span>
        </div>
      </div>
      <button className="btn-start" onClick={onRestart} autoFocus>
        もう一度
      </button>
    </div>
  );
}

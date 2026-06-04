import { useGame } from "./useGame";
import { Hole } from "./Hole";
import "./App.css";

export default function App() {
  const { phase, score, timeLeft, holes, startGame, whack } = useGame();

  return (
    <div className="app">
      <h1 className="title">🐊 わにわにパニック</h1>

      <div className="hud">
        <div className="hud-item">
          <span className="hud-label">スコア</span>
          <span className="hud-value">{score}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">残り時間</span>
          <span className={`hud-value ${timeLeft <= 5 && phase === "playing" ? "danger" : ""}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      <div className="board">
        {holes.map((hole) => (
          <Hole key={hole.id} hole={hole} onWhack={whack} />
        ))}
      </div>

      {phase === "idle" && (
        <div className="overlay">
          <p className="overlay-text">ワニが出たら素早くクリック！</p>
          <button className="btn-start" onClick={startGame}>スタート</button>
        </div>
      )}

      {phase === "gameover" && (
        <div className="overlay">
          <p className="overlay-text">ゲームオーバー！</p>
          <p className="final-score">スコア: {score}</p>
          <button className="btn-start" onClick={startGame}>もう一度</button>
        </div>
      )}
    </div>
  );
}

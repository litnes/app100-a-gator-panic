import { useGame } from "./useGame";
import { HUD } from "./HUD";
import { Board } from "./Board";
import { AngerBanner } from "./AngerBanner";
import { StartOverlay } from "./StartOverlay";
import { GameOverOverlay } from "./GameOverOverlay";
import "./App.css";

export default function App() {
  const { gameState, pressedLanes, startGame, whack } = useGame();
  const { gamePhase, score, biteCount, timeLeft, gators, angerBannerVisible } = gameState;

  return (
    <div className="app">
      <h1 className="title">わにわにパニック</h1>

      <HUD
        score={score}
        biteCount={biteCount}
        timeLeft={timeLeft}
        gamePhase={gamePhase}
      />

      <Board
        gators={gators}
        gamePhase={gamePhase}
        onWhack={whack}
        pressedLanes={pressedLanes}
      />

      {angerBannerVisible && <AngerBanner />}

      {gamePhase === "idle" && (
        <StartOverlay onStart={startGame} />
      )}

      {gamePhase === "gameover" && (
        <GameOverOverlay
          score={score}
          biteCount={biteCount}
          onRestart={startGame}
        />
      )}
    </div>
  );
}

import { Lane } from "./Lane";
import type { GatorState, GamePhase } from "./types";
import { LANE_COUNT } from "./constants";
import "./Board.css";

const KEY_LABELS = ["A", "S", "D", "F", "G"];

type Props = {
  gators: GatorState[];
  gamePhase: GamePhase;
  onWhack: (laneId: number) => void;
  pressedLanes: Set<number>;
};

export function Board({ gators, gamePhase, onWhack, pressedLanes }: Props) {
  function gatorAt(laneId: number): GatorState | undefined {
    return gators.find(g => g.laneId === laneId && g.gatorPhase !== "hidden");
  }

  return (
    <div className={`board${gamePhase === "anger" ? " board--anger" : ""}`}>
      {Array.from({ length: LANE_COUNT }, (_, i) => (
        <Lane
          key={i}
          laneId={i}
          keyLabel={KEY_LABELS[i]}
          gator={gatorAt(i)}
          onWhack={onWhack}
          gamePhase={gamePhase}
          isKeyPressed={pressedLanes.has(i)}
        />
      ))}
    </div>
  );
}

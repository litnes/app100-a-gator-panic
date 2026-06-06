import { GatorSvg } from "./GatorSvg";
import { BushSvg } from "./BushSvg";
import type { GatorState, GamePhase } from "./types";
import { GATOR_HEIGHT, BUSH_HEIGHT, GATOR_CONFIG } from "./constants";
import "./Lane.css";

// Bush is at top of arena; gator slides DOWN from behind the bush (SVG rotated 180deg, snout faces down).
// Container anchor: top = BUSH_HEIGHT (70px).
// offsetY = riseProgress * VISIBLE_MAX * riseRatio - GATOR_HEIGHT
//   riseProgress=0            → offsetY=-150  (fully hidden behind/above bush)
//   riseProgress=1, ratio=1   → offsetY=-70   (80px of snout visible below bush)
//   riseProgress=1, ratio=0.35→ offsetY=-122  (28px visible)
const VISIBLE_MAX = GATOR_HEIGHT - BUSH_HEIGHT; // 80px

type Props = {
  laneId: number;
  keyLabel: string;
  gator?: GatorState;
  onWhack: (laneId: number) => void;
  gamePhase: GamePhase;
  isKeyPressed: boolean;
};

export function Lane({ laneId, keyLabel, gator, onWhack, gamePhase, isKeyPressed }: Props) {
  const isAnger = gamePhase === "anger";
  const hasActiveGator = gator !== undefined && gator.gatorPhase !== "hidden";

  const offsetY = hasActiveGator
    ? gator!.riseProgress * VISIBLE_MAX * GATOR_CONFIG[gator!.kind].riseRatio - GATOR_HEIGHT
    : -GATOR_HEIGHT;

  return (
    <div
      className={`lane${isAnger ? " lane--anger" : ""}`}
      onClick={() => onWhack(laneId)}
    >
      {/* Sandy beach area — gator visible here */}
      <div className="lane-arena">
        {hasActiveGator && (
          <div
            className="gator-container"
            style={{ transform: `translateX(-50%) translateY(${offsetY}px)` }}
          >
            <GatorSvg
              kind={gator!.kind}
              gatorPhase={gator!.gatorPhase}
              biteElapsed={gator!.biteElapsed}
            />
            {gator!.gatorPhase === "whacked" && (
              <span className="hit-text">いて！</span>
            )}
            {gator!.gatorPhase === "biting" && gator!.biteElapsed < 600 && (
              <span className="bite-text">ガブ！</span>
            )}
          </div>
        )}
      </div>

      {/* Bush overlay — hides the hole and gator tail */}
      <div className="lane-bush">
        <BushSvg />
      </div>

      {/* Key label */}
      <div className={`key-label${isKeyPressed ? " pressed" : ""}`}>
        {keyLabel}
      </div>
    </div>
  );
}

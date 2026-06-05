import { GatorSvg } from "./GatorSvg";
import { BushSvg } from "./BushSvg";
import type { GatorState, GamePhase } from "./types";
import { GATOR_HEIGHT, BUSH_HEIGHT, GATOR_CONFIG } from "./constants";
import "./Lane.css";

// When riseProgress=0: gator fully hidden (offsetY = GATOR_HEIGHT = 150)
// When riseProgress=1, riseRatio=1: gator fully up (offsetY = 0, 80px of snout/body visible above bush)
// When riseProgress=1, riseRatio=0.35: offsetY = 52 (only ~28px of snout visible above bush)
// Formula derivation: offsetY = GATOR_HEIGHT - riseProgress * (BUSH_HEIGHT + VISIBLE_MAX * riseRatio)
const VISIBLE_MAX = GATOR_HEIGHT - BUSH_HEIGHT; // 80px: max visible above the bush

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
    ? GATOR_HEIGHT - gator!.riseProgress * (BUSH_HEIGHT + VISIBLE_MAX * GATOR_CONFIG[gator!.kind].riseRatio)
    : GATOR_HEIGHT;

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

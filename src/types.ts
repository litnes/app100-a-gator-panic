export type GatorKind = "slow-full" | "quick-full" | "peek" | "biter";

export type GatorPhase =
  | "hidden"
  | "rising"
  | "up"
  | "biting"
  | "retreating"
  | "whacked";

export type GatorState = {
  id: string;
  laneId: number;
  kind: GatorKind;
  gatorPhase: GatorPhase;
  riseProgress: number;
  riseDuration: number;
  retreatDuration: number;
  upDuration: number;
  upElapsed: number;
  biteElapsed: number;
  whackElapsed: number;
};

export type GamePhase = "idle" | "early" | "mid" | "late" | "anger" | "gameover";

export type GameState = {
  gamePhase: GamePhase;
  timeLeft: number;
  elapsed: number;
  score: number;
  biteCount: number;
  gators: GatorState[];
  angerBannerVisible: boolean;
};

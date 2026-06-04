export type HoleState = {
  id: number;
  isUp: boolean;
  isWhacked: boolean;
};

export type GamePhase = "idle" | "playing" | "gameover";

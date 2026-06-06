import type { GamePhase, GatorKind } from "./types";

export const LANE_COUNT = 5;
export const GAME_DURATION = 60;
export const ANGER_START_AT = 50;       // elapsed seconds to trigger anger
export const ANGER_DURATION = 10000;    // ms: total anger phase length (10s)
export const ANGER_BANNER_DURATION = 2000;

export const PHASE_EARLY_END = 20;
export const PHASE_MID_END   = 40;

export const KEY_MAP: Record<string, number> = {
  a: 0, s: 1, d: 2, f: 3, g: 4,
};

export const GATOR_HEIGHT = 150;
export const GATOR_WIDTH  = 70;
export const BUSH_HEIGHT  = 70;

export const GATOR_CONFIG = {
  "slow-full": {
    riseRatio: 1.0,
    riseDuration:    [1400, 2000] as [number, number],
    retreatDuration: [1200, 1800] as [number, number],
    upDuration:      [800,  1500] as [number, number],
    bites: false,
  },
  "quick-full": {
    riseRatio: 1.0,
    riseDuration:    [400, 700]   as [number, number],
    retreatDuration: [300, 600]   as [number, number],
    upDuration:      [300, 600]   as [number, number],
    bites: false,
  },
  peek: {
    riseRatio: 0.35,
    riseDuration:    [600, 900]   as [number, number],
    retreatDuration: [500, 800]   as [number, number],
    upDuration:      [500, 900]   as [number, number],
    bites: false,
  },
  biter: {
    riseRatio: 1.0,
    riseDuration:    [1500, 2200] as [number, number],
    retreatDuration: [1000, 1400] as [number, number],
    upDuration:      [600,  1000] as [number, number],
    bites: true,
  },
} satisfies Record<GatorKind, {
  riseRatio: number;
  riseDuration: [number, number];
  retreatDuration: [number, number];
  upDuration: [number, number];
  bites: boolean;
}>;

export const BITE_ANIMATION_DURATION = 1400;
export const WHACK_DURATION = 400;

export const SPAWN_TABLE: Record<GamePhase, Partial<Record<GatorKind, number>>> = {
  idle:     {},
  early:    { "slow-full": 1.0 },
  mid:      { "slow-full": 0.4, "quick-full": 0.3, peek: 0.2, biter: 0.1 },
  late:     { "slow-full": 0.15, "quick-full": 0.3, peek: 0.2, biter: 0.35 },
  anger:    { "quick-full": 0.4, biter: 0.6 },
  gameover: {},
};

export const MAX_CONCURRENT: Record<GamePhase, number> = {
  idle: 0, early: 1, mid: 3, late: 4, anger: 5, gameover: 0,
};

export const SPAWN_INTERVAL: Record<GamePhase, [number, number]> = {
  idle:     [0,    0   ],
  early:    [900,  1500],
  mid:      [500,  1000],
  late:     [300,  700 ],
  anger:    [80,   200 ],
  gameover: [0,    0   ],
};

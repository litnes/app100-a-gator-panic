import { useState, useEffect, useRef, useCallback } from "react";
import type { GameState, GatorState, GatorPhase, GatorKind } from "./types";
import {
  LANE_COUNT,
  GAME_DURATION,
  ANGER_START_AT,
  ANGER_DURATION,
  ANGER_BANNER_DURATION,
  KEY_MAP,
  GATOR_CONFIG,
  SPAWN_TABLE,
  MAX_CONCURRENT,
  SPAWN_INTERVAL,
  BITE_ANIMATION_DURATION,
  WHACK_DURATION,
  PHASE_EARLY_END,
  PHASE_MID_END,
} from "./constants";

// ─── helpers ────────────────────────────────────────────────────────────────

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickKind(table: Partial<Record<GatorKind, number>>): GatorKind {
  const entries = Object.entries(table) as [GatorKind, number][];
  const r = Math.random();
  let acc = 0;
  for (const [kind, prob] of entries) {
    acc += prob;
    if (r < acc) return kind;
  }
  return entries[entries.length - 1][0];
}

function calcPhase(elapsed: number): "early" | "mid" | "late" {
  if (elapsed < PHASE_EARLY_END) return "early";
  if (elapsed < PHASE_MID_END)   return "mid";
  return "late";
}

// ─── tick single gator ───────────────────────────────────────────────────────

function tickGator(g: GatorState, dt: number): [GatorState, boolean] {
  const cfg = GATOR_CONFIG[g.kind];
  switch (g.gatorPhase) {
    case "rising": {
      const p = g.riseProgress + dt / g.riseDuration;
      if (p >= 1) return [{ ...g, riseProgress: 1, gatorPhase: "up", upElapsed: 0 }, false];
      return [{ ...g, riseProgress: p }, false];
    }
    case "up": {
      const up = g.upElapsed + dt;
      if (up >= g.upDuration) {
        const next: GatorPhase = cfg.bites ? "biting" : "retreating";
        return [{ ...g, upElapsed: up, gatorPhase: next, biteElapsed: 0 }, false];
      }
      return [{ ...g, upElapsed: up }, false];
    }
    case "biting": {
      const be = g.biteElapsed + dt;
      if (be >= BITE_ANIMATION_DURATION) {
        return [{ ...g, biteElapsed: BITE_ANIMATION_DURATION, gatorPhase: "retreating" }, true];
      }
      return [{ ...g, biteElapsed: be }, false];
    }
    case "retreating": {
      const p = g.riseProgress - dt / g.retreatDuration;
      if (p <= 0) return [{ ...g, riseProgress: 0, gatorPhase: "hidden" }, false];
      return [{ ...g, riseProgress: p }, false];
    }
    case "whacked": {
      const we = g.whackElapsed + dt;
      if (we >= WHACK_DURATION) return [{ ...g, whackElapsed: we, gatorPhase: "hidden" }, false];
      return [{ ...g, whackElapsed: we }, false];
    }
    default:
      return [g, false];
  }
}

// ─── initial state ───────────────────────────────────────────────────────────

const INITIAL: GameState = {
  gamePhase: "idle",
  timeLeft: GAME_DURATION,
  elapsed: 0,
  score: 0,
  biteCount: 0,
  gators: [],
  angerBannerVisible: false,
};

// ─── hook ────────────────────────────────────────────────────────────────────

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(INITIAL);
  const [pressedLanes, setPressedLanes] = useState<Set<number>>(new Set());

  // Mutable ref mirrors latest state so timers/RAF can read it synchronously
  const stateRef  = useRef<GameState>(INITIAL);
  const rafRef    = useRef<number | null>(null);
  const prevTsRef = useRef<number | null>(null);

  // Timer refs so we can cancel on restart / game-over
  const countdownRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bannerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const angerStartRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const angerEndRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep stateRef in sync
  useEffect(() => { stateRef.current = gameState; }, [gameState]);

  // ── clear all mutable timers ──────────────────────────────────────────────
  const clearTimers = useCallback(() => {
    if (countdownRef.current)  clearInterval(countdownRef.current);
    if (spawnRef.current)      clearTimeout(spawnRef.current);
    if (bannerRef.current)     clearTimeout(bannerRef.current);
    if (angerStartRef.current) clearTimeout(angerStartRef.current);
    if (angerEndRef.current)   clearTimeout(angerEndRef.current);
    countdownRef.current = spawnRef.current = bannerRef.current = null;
    angerStartRef.current = angerEndRef.current = null;
  }, []);

  // ── rAF loop (always running) ────────────────────────────────────────────
  useEffect(() => {
    const loop = (ts: number) => {
      if (prevTsRef.current !== null) {
        const dt = Math.min(ts - prevTsRef.current, 100);

        setGameState(prev => {
          if (
            prev.gamePhase === "idle" ||
            prev.gamePhase === "gameover"
          ) return prev;

          let newBites = 0;
          const next: GatorState[] = [];
          for (const g of prev.gators) {
            const [ng, bit] = tickGator(g, dt);
            if (bit) newBites++;
            if (ng.gatorPhase !== "hidden") next.push(ng);
          }

          if (next.length === prev.gators.length && newBites === 0) {
            // Check if any gator state actually changed
            let changed = false;
            for (let i = 0; i < next.length; i++) {
              if (next[i] !== prev.gators[i]) { changed = true; break; }
            }
            if (!changed) return prev;
          }

          return {
            ...prev,
            gators: next,
            biteCount: prev.biteCount + newBites,
          };
        });
      }
      prevTsRef.current = ts;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── spawn scheduler ───────────────────────────────────────────────────────
  const scheduleSpawn = useCallback(() => {
    const phase = stateRef.current.gamePhase;
    const table = SPAWN_TABLE[phase];
    if (!table || Object.keys(table).length === 0) return;

    const [minW, maxW] = SPAWN_INTERVAL[phase];
    const wait = rand(minW, maxW);

    spawnRef.current = setTimeout(() => {
      const cur = stateRef.current;
      if (cur.gamePhase === "idle" || cur.gamePhase === "gameover") return;

      const active = cur.gators;
      if (active.length < MAX_CONCURRENT[cur.gamePhase]) {
        const occupied = new Set(active.map(g => g.laneId));
        const free = Array.from({ length: LANE_COUNT }, (_, i) => i)
          .filter(i => !occupied.has(i));

        if (free.length > 0) {
          const lane = free[Math.floor(Math.random() * free.length)];
          const kind = pickKind(SPAWN_TABLE[cur.gamePhase]);
          const cfg  = GATOR_CONFIG[kind];

          const gator: GatorState = {
            id:             `${lane}-${Date.now()}`,
            laneId:         lane,
            kind,
            gatorPhase:     "rising",
            riseProgress:   0,
            riseDuration:   rand(...cfg.riseDuration),
            retreatDuration: rand(...cfg.retreatDuration),
            upDuration:     rand(...cfg.upDuration),
            upElapsed:      0,
            biteElapsed:    0,
            whackElapsed:   0,
          };

          setGameState(prev => ({ ...prev, gators: [...prev.gators, gator] }));
        }
      }

      scheduleSpawn();
    }, wait);
  }, []);

  // ── anger phase sequence ─────────────────────────────────────────────────
  const startAnger = useCallback(() => {
    const cur = stateRef.current;
    if (cur.gamePhase === "idle" || cur.gamePhase === "gameover" || cur.gamePhase === "anger") return;

    clearInterval(countdownRef.current!);
    clearTimeout(spawnRef.current!);
    countdownRef.current = spawnRef.current = null;

    setGameState(prev => ({
      ...prev,
      gamePhase: "anger",
      gators: prev.gators.map(g => ({
        ...g,
        gatorPhase: (g.gatorPhase !== "hidden" ? "retreating" : "hidden") as GatorPhase,
      })),
      angerBannerVisible: true,
    }));

    // After banner fades, begin anger spawning
    bannerRef.current = setTimeout(() => {
      setGameState(prev => ({ ...prev, angerBannerVisible: false }));
      scheduleSpawn();
    }, ANGER_BANNER_DURATION);

    // End game after anger duration
    angerEndRef.current = setTimeout(() => {
      clearTimeout(spawnRef.current!);
      spawnRef.current = null;
      setGameState(prev => ({ ...prev, gamePhase: "gameover", gators: [] }));
    }, ANGER_DURATION);
  }, [scheduleSpawn]);

  // ── start game ───────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    clearTimers();
    prevTsRef.current = null;

    const fresh: GameState = { ...INITIAL, gamePhase: "early" };
    setGameState(fresh);
    stateRef.current = fresh;

    // Countdown — updates elapsed / timeLeft / phase each second
    countdownRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.gamePhase === "anger" || prev.gamePhase === "gameover") return prev;
        const newElapsed  = prev.elapsed + 1;
        const newTimeLeft = Math.max(0, GAME_DURATION - newElapsed);
        const newPhase    = calcPhase(newElapsed);
        return { ...prev, elapsed: newElapsed, timeLeft: newTimeLeft, gamePhase: newPhase };
      });
    }, 1000);

    // Anger trigger — fires exactly at ANGER_START_AT seconds
    angerStartRef.current = setTimeout(() => startAnger(), ANGER_START_AT * 1000);

    // Kick off spawning
    scheduleSpawn();
  }, [clearTimers, scheduleSpawn, startAnger]);

  // ── whack ────────────────────────────────────────────────────────────────
  const whack = useCallback((laneId: number) => {
    setGameState(prev => {
      const { gamePhase } = prev;
      if (
        gamePhase !== "early" && gamePhase !== "mid" &&
        gamePhase !== "late"  && gamePhase !== "anger"
      ) return prev;

      const target = prev.gators.find(g =>
        g.laneId === laneId &&
        (g.gatorPhase === "rising" || g.gatorPhase === "up" || g.gatorPhase === "biting")
      );
      if (!target) return prev;

      const bonus = gamePhase === "anger" ? 2 : 1;
      return {
        ...prev,
        score: prev.score + bonus,
        gators: prev.gators.map(g =>
          g.id === target.id
            ? { ...g, gatorPhase: "whacked" as GatorPhase, whackElapsed: 0 }
            : g
        ),
      };
    });
  }, []);

  // ── keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (e.key === "Enter" && stateRef.current.gamePhase === "idle") {
        startGame();
        return;
      }

      const laneId = KEY_MAP[e.key.toLowerCase()];
      if (laneId !== undefined) {
        whack(laneId);
        setPressedLanes(prev => new Set([...prev, laneId]));
      }
    };

    const onUp = (e: KeyboardEvent) => {
      const laneId = KEY_MAP[e.key.toLowerCase()];
      if (laneId !== undefined) {
        setPressedLanes(prev => {
          const next = new Set(prev);
          next.delete(laneId);
          return next;
        });
      }
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup",   onUp);
    };
  }, [whack, startGame]);

  return { gameState, pressedLanes, startGame, whack };
}

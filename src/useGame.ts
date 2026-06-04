import { useState, useEffect, useRef, useCallback } from "react";
import type { HoleState, GamePhase } from "./types";

const HOLE_COUNT = 9;
const GAME_DURATION = 30;

function makeHoles(): HoleState[] {
  return Array.from({ length: HOLE_COUNT }, (_, i) => ({
    id: i,
    isUp: false,
    isWhacked: false,
  }));
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function useGame() {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [holes, setHoles] = useState<HoleState[]>(makeHoles());

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    popTimersRef.current.forEach(clearTimeout);
    popTimersRef.current = [];
  }, []);

  const popGator = useCallback(() => {
    const index = randomBetween(0, HOLE_COUNT - 1);
    const upDuration = randomBetween(600, 1200);

    setHoles((prev) =>
      prev.map((h) => (h.id === index ? { ...h, isUp: true, isWhacked: false } : h))
    );

    const hideTimer = setTimeout(() => {
      setHoles((prev) =>
        prev.map((h) => (h.id === index ? { ...h, isUp: false, isWhacked: false } : h))
      );
    }, upDuration);

    popTimersRef.current.push(hideTimer);

    const nextDelay = randomBetween(400, 900);
    const nextTimer = setTimeout(popGator, nextDelay);
    popTimersRef.current.push(nextTimer);
  }, []);

  const startGame = useCallback(() => {
    clearAllTimers();
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setHoles(makeHoles());
    setPhase("playing");
  }, [clearAllTimers]);

  // countdown timer
  useEffect(() => {
    if (phase !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearAllTimers();
          setPhase("gameover");
          setHoles(makeHoles());
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, clearAllTimers]);

  // gator popping
  useEffect(() => {
    if (phase !== "playing") return;
    const firstTimer = setTimeout(popGator, 500);
    popTimersRef.current.push(firstTimer);
    return () => {
      popTimersRef.current.forEach(clearTimeout);
      popTimersRef.current = [];
    };
  }, [phase, popGator]);

  const whack = useCallback(
    (id: number) => {
      if (phase !== "playing") return;
      setHoles((prev) => {
        const hole = prev.find((h) => h.id === id);
        if (!hole || !hole.isUp || hole.isWhacked) return prev;
        setScore((s) => s + 1);
        return prev.map((h) =>
          h.id === id ? { ...h, isWhacked: true, isUp: false } : h
        );
      });
    },
    [phase]
  );

  return { phase, score, timeLeft, holes, startGame, whack };
}

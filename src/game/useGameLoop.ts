import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { AUTO } from "./constants";
import {
  aLvAtom,
  autoPctAtom,
  cdPctAtom,
  cooldownAtom,
  sLvAtom,
  startedAtom,
  stunPctAtom,
  stunScheduleAtom,
  stunnedAtom,
} from "./atoms/primitives";
import { autoMsAtom, cdMsAtom, gameLockedAtom } from "./atoms/derived";
import { clearRollTimeouts } from "./rollTimers";

/**
 * Timers and RAF progress tied to roll phase atoms. Mount once under the Jotai provider.
 */
export function useGameLoop(rollDice: () => void): void {
  const aLv = useAtomValue(aLvAtom);
  const started = useAtomValue(startedAtom);
  const locked = useAtomValue(gameLockedAtom);
  const cooldown = useAtomValue(cooldownAtom);
  const stunned = useAtomValue(stunnedAtom);
  const cdMs = useAtomValue(cdMsAtom);
  const stunSchedule = useAtomValue(stunScheduleAtom);

  const setCooldown = useSetAtom(cooldownAtom);
  const setStunned = useSetAtom(stunnedAtom);
  const setStunSchedule = useSetAtom(stunScheduleAtom);
  const setAutoPct = useSetAtom(autoPctAtom);
  const setCdPct = useSetAtom(cdPctAtom);
  const setStunPct = useSetAtom(stunPctAtom);

  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoStartRef = useRef(0);
  const autoFrameRef = useRef(0);
  const cdFrameRef = useRef(0);
  const stunFrameRef = useRef(0);

  useEffect(
    () => () => {
      clearRollTimeouts();
      setStunSchedule(null);
    },
    [setStunSchedule],
  );

  const sLv = useAtomValue(sLvAtom);
  useEffect(() => {
    clearRollTimeouts();
    setCooldown(false);
    setStunned(false);
    setStunSchedule(null);
  }, [sLv, setCooldown, setStunned, setStunSchedule]);

  useEffect(() => {
    const ms = AUTO[aLv].ms;
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }

    if (ms === null || !started) {
      setAutoPct(0);
      return;
    }

    if (!locked) {
      autoStartRef.current = Date.now();
      const delay = ms === 0 ? 10 : ms;
      autoTimerRef.current = setTimeout(() => {
        autoTimerRef.current = null;
        rollDice();
      }, delay);
    }

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [aLv, locked, started, rollDice, setAutoPct]);

  useEffect(() => {
    const ms = AUTO[aLv].ms;
    if (ms === null || ms <= 0 || !started || locked) {
      setAutoPct(0);
      cancelAnimationFrame(autoFrameRef.current);
      return;
    }
    const tick = () => {
      const p = Math.min((Date.now() - autoStartRef.current) / ms, 1);
      setAutoPct(p);
      if (p < 1) autoFrameRef.current = requestAnimationFrame(tick);
    };
    autoFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(autoFrameRef.current);
  }, [aLv, locked, started, setAutoPct]);

  useEffect(() => {
    if (cooldown && !stunned) {
      const cdStart = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - cdStart) / cdMs, 1);
        setCdPct(p);
        if (p < 1) cdFrameRef.current = requestAnimationFrame(tick);
      };
      cdFrameRef.current = requestAnimationFrame(tick);
    } else if (!stunned) {
      setCdPct(0);
      cancelAnimationFrame(cdFrameRef.current);
    }
    return () => cancelAnimationFrame(cdFrameRef.current);
  }, [cooldown, stunned, cdMs, setCdPct]);

  useEffect(() => {
    if (stunned && stunSchedule) {
      const { startMs, durationMs } = stunSchedule;
      const tick = () => {
        const p = Math.min((Date.now() - startMs) / durationMs, 1);
        setStunPct(p);
        if (p < 1) stunFrameRef.current = requestAnimationFrame(tick);
        else setStunPct(1);
      };
      stunFrameRef.current = requestAnimationFrame(tick);
    } else if (!stunned) {
      setStunPct(0);
      cancelAnimationFrame(stunFrameRef.current);
    }
    return () => cancelAnimationFrame(stunFrameRef.current);
  }, [stunned, stunSchedule, setStunPct]);
}

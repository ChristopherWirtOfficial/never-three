import { useCallback, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  MULTI,
  SPEED,
  STREAK_RETENTION,
  STUN,
  fmt,
  hexStreakMultiplier,
  streakMultiplier,
} from "./constants";
import { currentDieAtom, gameLockedAtom } from "./atoms/derived";
import { rollTimers } from "./rollTimers";
import * as P from "./atoms/primitives";

type RollSnap = {
  locked: boolean;
  currentDie: number[];
  multi: number;
  streakRetentionPct: number;
  pMult: number;
  cdMs: number;
  stunMs: number;
  stunTier: (typeof STUN)[number];
};

/**
 * Roll the current die: reads/writes game atoms via Jotai hooks.
 * A ref keeps values fresh for `setTimeout` handlers (no store threading).
 */
export function useDiceRoll(): () => void {
  const locked = useAtomValue(gameLockedAtom);
  const currentDie = useAtomValue(currentDieAtom);
  const mLv = useAtomValue(P.mLvAtom);
  const rLv = useAtomValue(P.rLvAtom);
  const prestige = useAtomValue(P.prestigeAtom);
  const sLv = useAtomValue(P.sLvAtom);
  const tLv = useAtomValue(P.tLvAtom);

  const snapRef = useRef<RollSnap>({
    locked,
    currentDie,
    multi: MULTI[mLv].x,
    streakRetentionPct: STREAK_RETENTION[rLv].pct,
    pMult: 1 + prestige * 0.5,
    cdMs: SPEED[sLv].ms,
    stunMs: STUN[tLv].ms,
    stunTier: STUN[tLv],
  });
  snapRef.current = {
    locked,
    currentDie,
    multi: MULTI[mLv].x,
    streakRetentionPct: STREAK_RETENTION[rLv].pct,
    pMult: 1 + prestige * 0.5,
    cdMs: SPEED[sLv].ms,
    stunMs: STUN[tLv].ms,
    stunTier: STUN[tLv],
  };

  const setCooldown = useSetAtom(P.cooldownAtom);
  const setRolling = useSetAtom(P.rollingAtom);
  const setStarted = useSetAtom(P.startedAtom);
  const setRoll = useSetAtom(P.rollAtom);
  const setRolls = useSetAtom(P.rollsAtom);
  const setFlash = useSetAtom(P.flashAtom);
  const setHexStreak = useSetAtom(P.hexStreakAtom);
  const setStreak = useSetAtom(P.streakAtom);
  const setGold = useSetAtom(P.goldAtom);
  const setEarned = useSetAtom(P.earnedAtom);
  const setShook = useSetAtom(P.shookAtom);
  const setThrees = useSetAtom(P.threesAtom);
  const setHex = useSetAtom(P.hexAtom);
  const setBestHexStreak = useSetAtom(P.bestHexStreakAtom);
  const setBest = useSetAtom(P.bestAtom);
  const setStunned = useSetAtom(P.stunnedAtom);
  const setStunSchedule = useSetAtom(P.stunScheduleAtom);
  const setLog = useSetAtom(P.logAtom);

  return useCallback(() => {
    if (snapRef.current.locked) return;

    setCooldown(true);
    setRolling(true);
    setStarted((s) => (s ? s : true));

    setTimeout(() => {
      const {
        currentDie: die,
        multi,
        streakRetentionPct,
        pMult,
        cdMs,
        stunMs,
        stunTier,
      } = snapRef.current;

      const faceIndex = Math.floor(Math.random() * die.length);
      const v = die[faceIndex];
      setRoll(v);
      setRolling(false);
      setRolls((p: number) => p + 1);

      const dangerous = v % 3 === 0;

      if (dangerous) {
        setShook(true);
        setFlash("#ff3355");
        setThrees((p: number) => p + 1);
        setStreak((s: number) => {
          const kept = Math.floor((s * streakRetentionPct) / 100);
          let line: string;
          if (s === 0) {
            line = `💀 Rolled ${v}! Stunned ${stunTier.name}`;
          } else if (kept >= s) {
            line = `💀 Rolled ${v}! Streak ${s} held. Stunned ${stunTier.name}`;
          } else if (streakRetentionPct > 0) {
            line = `💀 Rolled ${v}! Streak ${s} → ${kept} (${streakRetentionPct}% kept). Stunned ${stunTier.name}`;
          } else {
            line = `💀 Rolled ${v}! Streak gone. Stunned ${stunTier.name}`;
          }
          setLog((p: string[]) => [line, ...p].slice(0, 60));
          return kept;
        });
        setHexStreak((hs: number) => {
          const hm = hexStreakMultiplier(hs);
          const earnedHex = Math.max(1, Math.floor(hm));
          setHex((h: number) => h + earnedHex);
          const nhs = hs + 1;
          setBestHexStreak((b: number) => Math.max(b, nhs));
          setLog((p: string[]) =>
            [
              `🔮 +${earnedHex} hex${hs > 1 ? ` (×${hm.toFixed(1)} streak)` : ""}`,
              ...p,
            ].slice(0, 60),
          );
          return nhs;
        });
        setTimeout(() => {
          setShook(false);
          setFlash(null);
        }, 400);
        setCooldown(false);
        setStunSchedule({ startMs: Date.now(), durationMs: stunMs });
        setStunned(true);
        if (rollTimers.stun) clearTimeout(rollTimers.stun);
        rollTimers.stun = setTimeout(() => {
          rollTimers.stun = null;
          setStunSchedule(null);
          setStunned(false);
        }, stunMs);
      } else {
        setHexStreak(0);
        setStreak((s: number) => {
          const sm = streakMultiplier(s);
          const e = Math.floor(v * sm * multi * pMult);
          setGold((g: number) => g + e);
          setEarned((er: number) => er + e);
          const ns = s + 1;
          setBest((b: number) => Math.max(b, ns));
          setLog((p: string[]) =>
            [
              `🎲 ${v} → +${fmt(e)}g${s > 2 ? ` (×${sm.toFixed(1)})` : ""}`,
              ...p,
            ].slice(0, 60),
          );
          return ns;
        });
        setFlash("#44ffbb");
        setTimeout(() => setFlash(null), 200);
        if (rollTimers.cool) clearTimeout(rollTimers.cool);
        rollTimers.cool = setTimeout(() => {
          rollTimers.cool = null;
          setCooldown(false);
        }, cdMs);
      }
    }, 160);
  }, [
    setCooldown,
    setRolling,
    setStarted,
    setRoll,
    setRolls,
    setFlash,
    setHexStreak,
    setStreak,
    setGold,
    setEarned,
    setShook,
    setThrees,
    setHex,
    setBestHexStreak,
    setBest,
    setStunned,
    setStunSchedule,
    setLog,
  ]);
}

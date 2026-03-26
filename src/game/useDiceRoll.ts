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
  prestigeGoldMultiplier: number;
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
  const multiplierUpgradeLevel = useAtomValue(P.multiplierUpgradeLevelAtom);
  const streakRetentionUpgradeLevel = useAtomValue(
    P.streakRetentionUpgradeLevelAtom,
  );
  const prestige = useAtomValue(P.prestigeAtom);
  const speedUpgradeLevel = useAtomValue(P.speedUpgradeLevelAtom);
  const stunUpgradeLevel = useAtomValue(P.stunUpgradeLevelAtom);

  const snapRef = useRef<RollSnap>({
    locked,
    currentDie,
    multi: MULTI[multiplierUpgradeLevel].x,
    streakRetentionPct: STREAK_RETENTION[streakRetentionUpgradeLevel].pct,
    prestigeGoldMultiplier: 1 + prestige * 0.5,
    cdMs: SPEED[speedUpgradeLevel].ms,
    stunMs: STUN[stunUpgradeLevel].ms,
    stunTier: STUN[stunUpgradeLevel],
  });
  snapRef.current = {
    locked,
    currentDie,
    multi: MULTI[multiplierUpgradeLevel].x,
    streakRetentionPct: STREAK_RETENTION[streakRetentionUpgradeLevel].pct,
    prestigeGoldMultiplier: 1 + prestige * 0.5,
    cdMs: SPEED[speedUpgradeLevel].ms,
    stunMs: STUN[stunUpgradeLevel].ms,
    stunTier: STUN[stunUpgradeLevel],
  };

  const setRollCooldownActive = useSetAtom(P.isRollCooldownActiveAtom);
  const setRolling = useSetAtom(P.isRollingAtom);
  const setRunStarted = useSetAtom(P.runStartedAtom);
  const setLastRolledFace = useSetAtom(P.lastRolledFaceAtom);
  const setTotalRollCount = useSetAtom(P.totalRollCountAtom);
  const setScreenFlashColor = useSetAtom(P.screenFlashColorAtom);
  const setHexRewardStreak = useSetAtom(P.hexRewardStreakAtom);
  const setGoldStreak = useSetAtom(P.goldStreakAtom);
  const setGold = useSetAtom(P.goldAtom);
  const setLifetimeGoldEarned = useSetAtom(P.lifetimeGoldEarnedAtom);
  const setDieShakeActive = useSetAtom(P.dieShakeActiveAtom);
  const setMultipleOfThreeRollCount = useSetAtom(
    P.multipleOfThreeRollCountAtom,
  );
  const setHexBalance = useSetAtom(P.hexBalanceAtom);
  const setBestHexRewardStreak = useSetAtom(P.bestHexRewardStreakAtom);
  const setBestGoldStreak = useSetAtom(P.bestGoldStreakAtom);
  const setStunned = useSetAtom(P.isStunnedAtom);
  const setActiveStunWindow = useSetAtom(P.activeStunWindowAtom);
  const setGameEventLog = useSetAtom(P.gameEventLogAtom);

  return useCallback(() => {
    if (snapRef.current.locked) return;

    setRollCooldownActive(true);
    setRolling(true);
    setRunStarted((s) => (s ? s : true));

    setTimeout(() => {
      const {
        currentDie: die,
        multi,
        streakRetentionPct,
        prestigeGoldMultiplier,
        cdMs,
        stunMs,
        stunTier,
      } = snapRef.current;

      const faceIndex = Math.floor(Math.random() * die.length);
      const v = die[faceIndex];
      setLastRolledFace(v);
      setRolling(false);
      setTotalRollCount((p: number) => p + 1);

      const dangerous = v % 3 === 0;

      if (dangerous) {
        setDieShakeActive(true);
        setScreenFlashColor("#ff3355");
        setMultipleOfThreeRollCount((p: number) => p + 1);
        setGoldStreak((s: number) => {
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
          setGameEventLog((p: string[]) => [line, ...p].slice(0, 60));
          return kept;
        });
        setHexRewardStreak((hs: number) => {
          const hm = hexStreakMultiplier(hs);
          const earnedHex = Math.max(1, Math.floor(hm));
          setHexBalance((h: number) => h + earnedHex);
          const nhs = hs + 1;
          setBestHexRewardStreak((b: number) => Math.max(b, nhs));
          setGameEventLog((p: string[]) =>
            [
              `🔮 +${earnedHex} hex${hs > 1 ? ` (×${hm.toFixed(1)} streak)` : ""}`,
              ...p,
            ].slice(0, 60),
          );
          return nhs;
        });
        setTimeout(() => {
          setDieShakeActive(false);
          setScreenFlashColor(null);
        }, 400);
        setRollCooldownActive(false);
        setActiveStunWindow({ startMs: Date.now(), durationMs: stunMs });
        setStunned(true);
        if (rollTimers.stun) clearTimeout(rollTimers.stun);
        rollTimers.stun = setTimeout(() => {
          rollTimers.stun = null;
          setActiveStunWindow(null);
          setStunned(false);
        }, stunMs);
      } else {
        setHexRewardStreak(0);
        setGoldStreak((s: number) => {
          const sm = streakMultiplier(s);
          const e = Math.floor(v * sm * multi * prestigeGoldMultiplier);
          setGold((g: number) => g + e);
          setLifetimeGoldEarned((er: number) => er + e);
          const ns = s + 1;
          setBestGoldStreak((b: number) => Math.max(b, ns));
          setGameEventLog((p: string[]) =>
            [
              `🎲 ${v} → +${fmt(e)}g${s > 2 ? ` (×${sm.toFixed(1)})` : ""}`,
              ...p,
            ].slice(0, 60),
          );
          return ns;
        });
        setScreenFlashColor("#44ffbb");
        setTimeout(() => setScreenFlashColor(null), 200);
        if (rollTimers.cool) clearTimeout(rollTimers.cool);
        rollTimers.cool = setTimeout(() => {
          rollTimers.cool = null;
          setRollCooldownActive(false);
        }, cdMs);
      }
    }, 160);
  }, [
    setRollCooldownActive,
    setRolling,
    setRunStarted,
    setLastRolledFace,
    setTotalRollCount,
    setScreenFlashColor,
    setHexRewardStreak,
    setGoldStreak,
    setGold,
    setLifetimeGoldEarned,
    setDieShakeActive,
    setMultipleOfThreeRollCount,
    setHexBalance,
    setBestHexRewardStreak,
    setBestGoldStreak,
    setStunned,
    setActiveStunWindow,
    setGameEventLog,
  ]);
}

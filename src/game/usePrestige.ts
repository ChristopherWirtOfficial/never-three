import { useCallback, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { makeDefaultDie } from "./constants";
import { canPrestigeAtom } from "./atoms/derived";
import * as P from "./atoms/primitives";

/**
 * Reset run state and advance prestige when requirements are met.
 */
export function usePrestige(): () => void {
  const canPrestige = useAtomValue(canPrestigeAtom);
  const prestige = useAtomValue(P.prestigeAtom);

  const snapRef = useRef({ canPrestige, prestige });
  snapRef.current = { canPrestige, prestige };

  const setPrestige = useSetAtom(P.prestigeAtom);
  const setGold = useSetAtom(P.goldAtom);
  const setEarned = useSetAtom(P.earnedAtom);
  const setStreak = useSetAtom(P.streakAtom);
  const setRoll = useSetAtom(P.rollAtom);
  const setHex = useSetAtom(P.hexAtom);
  const setHexStreak = useSetAtom(P.hexStreakAtom);
  const setSLv = useSetAtom(P.sLvAtom);
  const setALv = useSetAtom(P.aLvAtom);
  const setMLv = useSetAtom(P.mLvAtom);
  const setRLv = useSetAtom(P.rLvAtom);
  const setTLv = useSetAtom(P.tLvAtom);
  const setDice = useSetAtom(P.diceAtom);
  const setTotalReforges = useSetAtom(P.totalReforgesAtom);
  const setLog = useSetAtom(P.logAtom);

  return useCallback(() => {
    if (!snapRef.current.canPrestige) return;
    const p = snapRef.current.prestige;
    setPrestige((x: number) => x + 1);
    setGold(0);
    setEarned(0);
    setStreak(0);
    setRoll(null);
    setHex(0);
    setHexStreak(0);
    setSLv(0);
    setALv(0);
    setMLv(0);
    setRLv(0);
    setTLv(0);
    setDice([makeDefaultDie()]);
    setTotalReforges(0);
    setLog([
      `✨ PRESTIGE ${p + 1}! ×${(1 + (p + 1) * 0.5).toFixed(1)} forever`,
    ]);
  }, [
    setPrestige,
    setGold,
    setEarned,
    setStreak,
    setRoll,
    setHex,
    setHexStreak,
    setSLv,
    setALv,
    setMLv,
    setRLv,
    setTLv,
    setDice,
    setTotalReforges,
    setLog,
  ]);
}

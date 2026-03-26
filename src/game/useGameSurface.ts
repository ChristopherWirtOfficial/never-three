import { useAtomValue, useSetAtom } from "jotai";
import type { TabId } from "./types";
import * as P from "./atoms/primitives";
import * as D from "./atoms/derived";
import { useGameLoop } from "./useGameLoop";
import { useDiceRoll } from "./useDiceRoll";
import { usePurchaseUpgrade } from "./usePurchaseUpgrade";
import { usePrestige } from "./usePrestige";
import { useIncrementDieFace } from "./useIncrementDieFace";
import { useDecrementDieFace } from "./useDecrementDieFace";

/** Game UI state and actions; backing state lives in Jotai atoms (`atoms/`). */
export function useGameSurface() {
  const rollDice = useDiceRoll();
  useGameLoop(rollDice);

  const gold = useAtomValue(P.goldAtom);
  const earned = useAtomValue(P.earnedAtom);
  const streak = useAtomValue(P.streakAtom);
  const best = useAtomValue(P.bestAtom);
  const hex = useAtomValue(P.hexAtom);
  const hexStreak = useAtomValue(P.hexStreakAtom);
  const bestHexStreak = useAtomValue(P.bestHexStreakAtom);
  const roll = useAtomValue(P.rollAtom);
  const rolling = useAtomValue(P.rollingAtom);
  const cooldown = useAtomValue(P.cooldownAtom);
  const stunned = useAtomValue(P.stunnedAtom);
  const stunPct = useAtomValue(P.stunPctAtom);
  const cdPct = useAtomValue(P.cdPctAtom);
  const autoPct = useAtomValue(P.autoPctAtom);
  const sLv = useAtomValue(P.sLvAtom);
  const aLv = useAtomValue(P.aLvAtom);
  const mLv = useAtomValue(P.mLvAtom);
  const rLv = useAtomValue(P.rLvAtom);
  const tLv = useAtomValue(P.tLvAtom);
  const prestige = useAtomValue(P.prestigeAtom);
  const rolls = useAtomValue(P.rollsAtom);
  const threes = useAtomValue(P.threesAtom);
  const shook = useAtomValue(P.shookAtom);
  const flash = useAtomValue(P.flashAtom);
  const saved = useAtomValue(P.savedAtom);
  const tab = useAtomValue(P.tabAtom);
  const log = useAtomValue(P.logAtom);
  const started = useAtomValue(P.startedAtom);
  const dice = useAtomValue(P.diceAtom);
  const totalReforges = useAtomValue(P.totalReforgesAtom);
  const reforgeCap = useAtomValue(P.reforgeCapAtom);

  const currentDie = useAtomValue(D.currentDieAtom);
  const multi = useAtomValue(D.multiAtom);
  const armor = useAtomValue(D.armorAtom);
  const pMult = useAtomValue(D.pMultAtom);
  const cdMs = useAtomValue(D.cdMsAtom);
  const stunMs = useAtomValue(D.stunMsAtom);
  const autoMs = useAtomValue(D.autoMsAtom);
  const prestigeReq = useAtomValue(D.prestigeReqAtom);
  const canPrestige = useAtomValue(D.canPrestigeAtom);
  const locked = useAtomValue(D.gameLockedAtom);

  const setTab = useSetAtom(P.tabAtom);

  const purchaseUpgrade = usePurchaseUpgrade();
  const commitPrestige = usePrestige();
  const incrementDieFace = useIncrementDieFace();
  const decrementDieFace = useDecrementDieFace();

  return {
    gold,
    earned,
    streak,
    best,
    hex,
    hexStreak,
    bestHexStreak,
    roll,
    rolling,
    cooldown,
    stunned,
    stunPct,
    cdPct,
    autoPct,
    sLv,
    aLv,
    mLv,
    rLv,
    tLv,
    prestige,
    rolls,
    threes,
    shook,
    flash,
    saved,
    tab,
    log,
    started,
    locked,
    dice,
    totalReforges,
    reforgeCap,
    currentDie,
    multi,
    armor,
    pMult,
    cdMs,
    stunMs,
    autoMs,
    prestigeReq,
    canPrestige,
    setTab,
    rollDice,
    purchaseUpgrade,
    commitPrestige,
    incrementDieFace,
    decrementDieFace,
  };
}

import { atom } from "jotai";
import {
  ARMOR,
  AUTO,
  MULTI,
  PRESTIGE_BASE,
  SPEED,
  STUN,
  makeDefaultDie,
} from "../constants";
import {
  aLvAtom,
  cooldownAtom,
  diceAtom,
  earnedAtom,
  mLvAtom,
  prestigeAtom,
  rLvAtom,
  rollingAtom,
  sLvAtom,
  stunnedAtom,
  tLvAtom,
} from "./primitives";

export type RollPhase = "idle" | "rolling" | "cooldown" | "stunned";

/** Single place to read “what part of the roll cycle are we in?”. */
export const rollPhaseAtom = atom((get): RollPhase => {
  if (get(rollingAtom)) return "rolling";
  if (get(stunnedAtom)) return "stunned";
  if (get(cooldownAtom)) return "cooldown";
  return "idle";
});

/** True whenever a new roll should not start (UI + auto-roll gate). */
export const gameLockedAtom = atom((get) => get(rollPhaseAtom) !== "idle");

export const currentDieAtom = atom(
  (get) => get(diceAtom)[0] ?? makeDefaultDie(),
);

export const multiAtom = atom((get) => MULTI[get(mLvAtom)].x);
export const armorAtom = atom((get) => ARMOR[get(rLvAtom)].pct);
export const pMultAtom = atom((get) => 1 + get(prestigeAtom) * 0.5);
export const cdMsAtom = atom((get) => SPEED[get(sLvAtom)].ms);
export const stunMsAtom = atom((get) => STUN[get(tLvAtom)].ms);
export const autoMsAtom = atom((get) => AUTO[get(aLvAtom)].ms);

export const prestigeReqAtom = atom(
  (get) => PRESTIGE_BASE * Math.pow(2.5, get(prestigeAtom)),
);

export const canPrestigeAtom = atom(
  (get) => get(earnedAtom) >= get(prestigeReqAtom),
);

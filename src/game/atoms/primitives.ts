import { atom } from "jotai";
import { DEFAULT_REFORGE_CAP, makeDefaultDie } from "../constants";
import type { Die, TabId } from "../types";

export const goldAtom = atom(0);
export const earnedAtom = atom(0);
export const streakAtom = atom(0);
export const bestAtom = atom(0);

export const hexAtom = atom(0);
export const hexStreakAtom = atom(0);
export const bestHexStreakAtom = atom(0);

export const rollAtom = atom<number | null>(null);
export const rollingAtom = atom(false);
export const cooldownAtom = atom(false);
export const stunnedAtom = atom(false);
export const stunPctAtom = atom(0);
export const cdPctAtom = atom(0);
export const autoPctAtom = atom(0);

export const sLvAtom = atom(0);
export const aLvAtom = atom(0);
export const mLvAtom = atom(0);
export const rLvAtom = atom(0);
export const tLvAtom = atom(0);
export const prestigeAtom = atom(0);

export const rollsAtom = atom(0);
export const threesAtom = atom(0);
export const shookAtom = atom(false);
export const flashAtom = atom<string | null>(null);
export const savedAtom = atom(false);

export const tabAtom = atom<TabId>("roll");
export const logAtom = atom<string[]>([]);
export const startedAtom = atom(false);

export const diceAtom = atom<Die[]>([makeDefaultDie()]);
export const totalReforgesAtom = atom(0);
export const reforgeCapAtom = atom(DEFAULT_REFORGE_CAP);

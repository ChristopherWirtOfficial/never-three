import type { Store } from "jotai/vanilla/store";
import * as P from "./atoms/primitives";
import { clearRollTimeouts } from "./rollTimers";
import type { SaveState } from "./saves";
import { SAVE_VERSION } from "./saves";

/** Primitive atoms whose values are written to `SaveState` and watched for autosave. */
export const durableGameAtoms = [
  P.goldAtom,
  P.earnedAtom,
  P.streakAtom,
  P.bestAtom,
  P.hexAtom,
  P.hexStreakAtom,
  P.bestHexStreakAtom,
  P.sLvAtom,
  P.aLvAtom,
  P.mLvAtom,
  P.rLvAtom,
  P.tLvAtom,
  P.prestigeAtom,
  P.rollsAtom,
  P.threesAtom,
  P.diceAtom,
  P.totalReforgesAtom,
  P.reforgeCapAtom,
] as const;

export function collectSaveStateFromStore(store: Store): SaveState {
  return {
    _v: SAVE_VERSION,
    gold: store.get(P.goldAtom),
    earned: store.get(P.earnedAtom),
    streak: store.get(P.streakAtom),
    best: store.get(P.bestAtom),
    hex: store.get(P.hexAtom),
    hexStreak: store.get(P.hexStreakAtom),
    bestHexStreak: store.get(P.bestHexStreakAtom),
    sLv: store.get(P.sLvAtom),
    aLv: store.get(P.aLvAtom),
    mLv: store.get(P.mLvAtom),
    rLv: store.get(P.rLvAtom),
    tLv: store.get(P.tLvAtom),
    prestige: store.get(P.prestigeAtom),
    rolls: store.get(P.rollsAtom),
    threes: store.get(P.threesAtom),
    dice: store.get(P.diceAtom),
    totalReforges: store.get(P.totalReforgesAtom),
    reforgeCap: store.get(P.reforgeCapAtom),
  };
}

/** Apply disk snapshot and reset ephemeral roll / UI atoms. */
export function hydrateStoreFromSaveState(
  store: Store,
  state: SaveState,
): void {
  clearRollTimeouts();

  store.set(P.goldAtom, state.gold);
  store.set(P.earnedAtom, state.earned);
  store.set(P.streakAtom, state.streak);
  store.set(P.bestAtom, state.best);
  store.set(P.hexAtom, state.hex ?? 0);
  store.set(P.hexStreakAtom, state.hexStreak ?? 0);
  store.set(P.bestHexStreakAtom, state.bestHexStreak ?? 0);
  store.set(P.sLvAtom, state.sLv);
  store.set(P.aLvAtom, state.aLv);
  store.set(P.mLvAtom, state.mLv);
  store.set(P.rLvAtom, state.rLv);
  store.set(P.tLvAtom, state.tLv);
  store.set(P.prestigeAtom, state.prestige);
  store.set(P.rollsAtom, state.rolls);
  store.set(P.threesAtom, state.threes);
  store.set(P.diceAtom, state.dice);
  store.set(P.totalReforgesAtom, state.totalReforges);
  store.set(P.reforgeCapAtom, state.reforgeCap);

  store.set(P.rollAtom, null);
  store.set(P.rollingAtom, false);
  store.set(P.cooldownAtom, false);
  store.set(P.stunnedAtom, false);
  store.set(P.stunScheduleAtom, null);
  store.set(P.stunPctAtom, 0);
  store.set(P.cdPctAtom, 0);
  store.set(P.autoPctAtom, 0);
  store.set(P.shookAtom, false);
  store.set(P.flashAtom, null);
  store.set(P.tabAtom, "roll");
  store.set(P.logAtom, []);

  const hasProgress =
    state.gold > 0 ||
    state.earned > 0 ||
    state.rolls > 0 ||
    state.prestige > 0 ||
    state.hex > 0;
  store.set(P.startedAtom, hasProgress);
}

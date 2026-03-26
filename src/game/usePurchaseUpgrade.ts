import { useCallback, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { ARMOR, AUTO, MULTI, SPEED, STUN } from "./constants";
import type { UpgradeType } from "./types";
import * as P from "./atoms/primitives";

/**
 * Spend gold on the next tier of a shop upgrade (speed, auto, multi, armor, stun).
 */
export function usePurchaseUpgrade(): (type: UpgradeType) => void {
  const gold = useAtomValue(P.goldAtom);
  const sLv = useAtomValue(P.sLvAtom);
  const aLv = useAtomValue(P.aLvAtom);
  const mLv = useAtomValue(P.mLvAtom);
  const rLv = useAtomValue(P.rLvAtom);
  const tLv = useAtomValue(P.tLvAtom);

  const snapRef = useRef({ gold, sLv, aLv, mLv, rLv, tLv });
  snapRef.current = { gold, sLv, aLv, mLv, rLv, tLv };

  const setGold = useSetAtom(P.goldAtom);
  const setSLv = useSetAtom(P.sLvAtom);
  const setALv = useSetAtom(P.aLvAtom);
  const setMLv = useSetAtom(P.mLvAtom);
  const setRLv = useSetAtom(P.rLvAtom);
  const setTLv = useSetAtom(P.tLvAtom);

  return useCallback(
    (type: UpgradeType) => {
      const s = snapRef.current;

      const tryBuy = (
        lv: number,
        arr: { cost: number }[],
        bump: (fn: (x: number) => number) => void,
      ) => {
        if (lv >= arr.length - 1) return;
        const cost = arr[lv + 1].cost;
        if (s.gold < cost) return;
        setGold((g: number) => g - cost);
        bump((x: number) => x + 1);
      };

      switch (type) {
        case "speed":
          tryBuy(s.sLv, SPEED, setSLv);
          break;
        case "auto":
          tryBuy(s.aLv, AUTO, setALv);
          break;
        case "multi":
          tryBuy(s.mLv, MULTI, setMLv);
          break;
        case "armor":
          tryBuy(s.rLv, ARMOR, setRLv);
          break;
        case "stun":
          tryBuy(s.tLv, STUN, setTLv);
          break;
      }
    },
    [setGold, setSLv, setALv, setMLv, setRLv, setTLv],
  );
}

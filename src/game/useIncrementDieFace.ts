import { useCallback, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { fmt, reforgeCost } from "./constants";
import * as P from "./atoms/primitives";

/**
 * Spend hex to raise one face on a die (forge), up to the reforge cap.
 */
export function useIncrementDieFace(): (
  dieIndex: number,
  faceIndex: number,
) => void {
  const dice = useAtomValue(P.diceAtom);
  const reforgeCap = useAtomValue(P.reforgeCapAtom);
  const totalReforges = useAtomValue(P.totalReforgesAtom);
  const hex = useAtomValue(P.hexAtom);

  const snapRef = useRef({ dice, reforgeCap, totalReforges, hex });
  snapRef.current = { dice, reforgeCap, totalReforges, hex };

  const setHex = useSetAtom(P.hexAtom);
  const setTotalReforges = useSetAtom(P.totalReforgesAtom);
  const setDice = useSetAtom(P.diceAtom);
  const setLog = useSetAtom(P.logAtom);

  return useCallback(
    (dieIndex: number, faceIndex: number) => {
      const {
        dice: d,
        reforgeCap: cap,
        totalReforges: tr,
        hex: h,
      } = snapRef.current;
      const die = d[dieIndex];
      if (!die) return;
      const currentVal = die[faceIndex];
      if (currentVal >= cap) return;
      const target = currentVal + 1;
      const cost = reforgeCost(currentVal, target, tr);
      if (h < cost) return;
      setHex((x: number) => x - cost);
      setTotalReforges((t: number) => t + 1);
      setDice((prev: number[][]) => {
        const next = prev.map((row: number[]) => [...row]);
        next[dieIndex][faceIndex] = target;
        return next;
      });
      setLog((p: string[]) =>
        [
          `🔥 Face ${faceIndex + 1}: ${currentVal} → ${target} (-${fmt(cost)} hex)`,
          ...p,
        ].slice(0, 60),
      );
    },
    [setHex, setTotalReforges, setDice, setLog],
  );
}

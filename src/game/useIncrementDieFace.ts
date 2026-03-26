import { useCallback, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { fmt, reforgeCost } from './constants'
import * as P from './atoms/primitives'

/**
 * Spend hex to raise one face on a die (forge), up to the reforge cap.
 */
export function useIncrementDieFace(): (dieIndex: number, faceIndex: number) => void {
	const dice = useAtomValue(P.diceAtom)
	const maxReforgeFaceValue = useAtomValue(P.maxReforgeFaceValueAtom)
	const totalDieReforgeCount = useAtomValue(P.totalDieReforgeCountAtom)
	const hexBalance = useAtomValue(P.hexBalanceAtom)

	const snapRef = useRef({
		dice,
		maxReforgeFaceValue,
		totalDieReforgeCount,
		hexBalance,
	})
	snapRef.current = {
		dice,
		maxReforgeFaceValue,
		totalDieReforgeCount,
		hexBalance,
	}

	const setHexBalance = useSetAtom(P.hexBalanceAtom)
	const setTotalDieReforgeCount = useSetAtom(P.totalDieReforgeCountAtom)
	const setDice = useSetAtom(P.diceAtom)
	const setGameEventLog = useSetAtom(P.gameEventLogAtom)

	return useCallback(
		(dieIndex: number, faceIndex: number) => {
			const {
				dice: d,
				maxReforgeFaceValue: cap,
				totalDieReforgeCount: tr,
				hexBalance: h,
			} = snapRef.current
			const die = d[dieIndex]
			if (!die) return
			const currentVal = die[faceIndex]
			if (currentVal >= cap) return
			const target = currentVal + 1
			const cost = reforgeCost(currentVal, target, tr)
			if (h < cost) return
			setHexBalance((x: number) => x - cost)
			setTotalDieReforgeCount((t: number) => t + 1)
			setDice((prev: number[][]) => {
				const next = prev.map((row: number[]) => [...row])
				next[dieIndex][faceIndex] = target
				return next
			})
			setGameEventLog((p: string[]) =>
				[`🔥 Face ${faceIndex + 1}: ${currentVal} → ${target} (-${fmt(cost)} hex)`, ...p].slice(
					0,
					60
				)
			)
		},
		[setHexBalance, setTotalDieReforgeCount, setDice, setGameEventLog]
	)
}

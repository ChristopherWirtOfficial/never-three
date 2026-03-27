import { useCallback, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { reforgeCost } from './balanceConfig'
import { formatCompactNumber } from './constants'
import * as P from './atoms/primitives'

/**
 * Spend hex to raise one face on a die (forge), up to the reforge cap.
 */
export function useIncrementDieFace(): (dieIndex: number, faceIndex: number) => void {
	const dice = useAtomValue(P.diceAtom)
	const maxReforgeFaceValue = useAtomValue(P.maxReforgeFaceValueAtom)
	const totalDieReforgeCount = useAtomValue(P.totalDieReforgeCountAtom)
	const hexBalance = useAtomValue(P.hexBalanceAtom)
	const balance = useAtomValue(P.balanceConfigAtom)

	const snapRef = useRef({
		dice,
		maxReforgeFaceValue,
		totalDieReforgeCount,
		hexBalance,
		balance,
	})
	snapRef.current = {
		dice,
		maxReforgeFaceValue,
		totalDieReforgeCount,
		hexBalance,
		balance,
	}

	const setHexBalance = useSetAtom(P.hexBalanceAtom)
	const setTotalDieReforgeCount = useSetAtom(P.totalDieReforgeCountAtom)
	const setDice = useSetAtom(P.diceAtom)
	const setGameEventLog = useSetAtom(P.gameEventLogAtom)

	return useCallback(
		(dieIndex: number, faceIndex: number) => {
			const {
				dice: diceSnapshot,
				maxReforgeFaceValue: reforgeCap,
				totalDieReforgeCount: reforgeCount,
				hexBalance: currentHex,
				balance: balanceConfig,
			} = snapRef.current
			const die = diceSnapshot[dieIndex]
			if (!die) return
			const currentFaceValue = die[faceIndex]
			if (currentFaceValue >= reforgeCap) return
			const target = currentFaceValue + 1
			const cost = reforgeCost(currentFaceValue, target, reforgeCount, balanceConfig)
			if (currentHex < cost) return
			setHexBalance((hex: number) => hex - cost)
			setTotalDieReforgeCount((count: number) => count + 1)
			setDice((prev: number[][]) => {
				const next = prev.map((row: number[]) => [...row])
				next[dieIndex][faceIndex] = target
				return next
			})
			setGameEventLog((prevLog: string[]) =>
				[
					`🔥 Face ${faceIndex + 1}: ${currentFaceValue} → ${target} (-${formatCompactNumber(cost)} hex)`,
					...prevLog,
				].slice(0, 60)
			)
		},
		[setHexBalance, setTotalDieReforgeCount, setDice, setGameEventLog]
	)
}

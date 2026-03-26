import { useCallback, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { AUTO, MULTI, SPEED, STREAK_RETENTION, STUN } from './constants'
import type { UpgradeType } from './types'
import * as P from './atoms/primitives'

/**
 * Spend gold on the next tier of a shop upgrade (speed, auto, multi, streak retention, stun).
 */
export function usePurchaseUpgrade(): (type: UpgradeType) => void {
	const gold = useAtomValue(P.goldAtom)
	const speedUpgradeLevel = useAtomValue(P.speedUpgradeLevelAtom)
	const autoRollUpgradeLevel = useAtomValue(P.autoRollUpgradeLevelAtom)
	const multiplierUpgradeLevel = useAtomValue(P.multiplierUpgradeLevelAtom)
	const streakRetentionUpgradeLevel = useAtomValue(P.streakRetentionUpgradeLevelAtom)
	const stunUpgradeLevel = useAtomValue(P.stunUpgradeLevelAtom)

	const snapRef = useRef({
		gold,
		speedUpgradeLevel,
		autoRollUpgradeLevel,
		multiplierUpgradeLevel,
		streakRetentionUpgradeLevel,
		stunUpgradeLevel,
	})
	snapRef.current = {
		gold,
		speedUpgradeLevel,
		autoRollUpgradeLevel,
		multiplierUpgradeLevel,
		streakRetentionUpgradeLevel,
		stunUpgradeLevel,
	}

	const setGold = useSetAtom(P.goldAtom)
	const setSpeedUpgradeLevel = useSetAtom(P.speedUpgradeLevelAtom)
	const setAutoRollUpgradeLevel = useSetAtom(P.autoRollUpgradeLevelAtom)
	const setMultiplierUpgradeLevel = useSetAtom(P.multiplierUpgradeLevelAtom)
	const setStreakRetentionUpgradeLevel = useSetAtom(P.streakRetentionUpgradeLevelAtom)
	const setStunUpgradeLevel = useSetAtom(P.stunUpgradeLevelAtom)

	return useCallback(
		(type: UpgradeType) => {
			const s = snapRef.current

			const tryBuy = (
				lv: number,
				arr: { cost: number }[],
				bump: (fn: (x: number) => number) => void
			) => {
				if (lv >= arr.length - 1) return
				const cost = arr[lv + 1].cost
				if (s.gold < cost) return
				setGold((g: number) => g - cost)
				bump((x: number) => x + 1)
			}

			switch (type) {
				case 'speed':
					tryBuy(s.speedUpgradeLevel, SPEED, setSpeedUpgradeLevel)
					break
				case 'auto':
					tryBuy(s.autoRollUpgradeLevel, AUTO, setAutoRollUpgradeLevel)
					break
				case 'multi':
					tryBuy(s.multiplierUpgradeLevel, MULTI, setMultiplierUpgradeLevel)
					break
				case 'retention':
					tryBuy(s.streakRetentionUpgradeLevel, STREAK_RETENTION, setStreakRetentionUpgradeLevel)
					break
				case 'stun':
					tryBuy(s.stunUpgradeLevel, STUN, setStunUpgradeLevel)
					break
			}
		},
		[
			setGold,
			setSpeedUpgradeLevel,
			setAutoRollUpgradeLevel,
			setMultiplierUpgradeLevel,
			setStreakRetentionUpgradeLevel,
			setStunUpgradeLevel,
		]
	)
}

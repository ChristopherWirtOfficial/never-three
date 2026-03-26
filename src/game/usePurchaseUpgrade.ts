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
			const snapshot = snapRef.current

			const tryBuyNextTier = (
				currentTierIndex: number,
				tiers: { cost: number }[],
				setTier: (fn: (level: number) => number) => void
			) => {
				if (currentTierIndex >= tiers.length - 1) return
				const cost = tiers[currentTierIndex + 1].cost
				if (snapshot.gold < cost) return
				setGold((gold: number) => gold - cost)
				setTier((level: number) => level + 1)
			}

			switch (type) {
				case 'speed':
					tryBuyNextTier(snapshot.speedUpgradeLevel, SPEED, setSpeedUpgradeLevel)
					break
				case 'auto':
					tryBuyNextTier(snapshot.autoRollUpgradeLevel, AUTO, setAutoRollUpgradeLevel)
					break
				case 'multi':
					tryBuyNextTier(snapshot.multiplierUpgradeLevel, MULTI, setMultiplierUpgradeLevel)
					break
				case 'retention':
					tryBuyNextTier(
						snapshot.streakRetentionUpgradeLevel,
						STREAK_RETENTION,
						setStreakRetentionUpgradeLevel
					)
					break
				case 'stun':
					tryBuyNextTier(snapshot.stunUpgradeLevel, STUN, setStunUpgradeLevel)
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

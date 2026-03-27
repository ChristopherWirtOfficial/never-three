import { useCallback, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import type { BalanceConfig } from './balanceConfig'
import type { UpgradeType } from './types'
import * as P from './atoms/primitives'

/**
 * Spend piplets on the next tier of a shop upgrade (speed, auto, multi, streak retention, stun).
 */
export function usePurchaseUpgrade(): (type: UpgradeType) => void {
	const piplets = useAtomValue(P.pipletsAtom)
	const balance = useAtomValue(P.balanceConfigAtom)
	const speedUpgradeLevel = useAtomValue(P.speedUpgradeLevelAtom)
	const autoRollUpgradeLevel = useAtomValue(P.autoRollUpgradeLevelAtom)
	const multiplierUpgradeLevel = useAtomValue(P.multiplierUpgradeLevelAtom)
	const streakRetentionUpgradeLevel = useAtomValue(P.streakRetentionUpgradeLevelAtom)
	const stunUpgradeLevel = useAtomValue(P.stunUpgradeLevelAtom)

	const snapRef = useRef({
		piplets,
		balance,
		speedUpgradeLevel,
		autoRollUpgradeLevel,
		multiplierUpgradeLevel,
		streakRetentionUpgradeLevel,
		stunUpgradeLevel,
	})
	snapRef.current = {
		piplets,
		balance,
		speedUpgradeLevel,
		autoRollUpgradeLevel,
		multiplierUpgradeLevel,
		streakRetentionUpgradeLevel,
		stunUpgradeLevel,
	}

	const setPiplets = useSetAtom(P.pipletsAtom)
	const setSpeedUpgradeLevel = useSetAtom(P.speedUpgradeLevelAtom)
	const setAutoRollUpgradeLevel = useSetAtom(P.autoRollUpgradeLevelAtom)
	const setMultiplierUpgradeLevel = useSetAtom(P.multiplierUpgradeLevelAtom)
	const setStreakRetentionUpgradeLevel = useSetAtom(P.streakRetentionUpgradeLevelAtom)
	const setStunUpgradeLevel = useSetAtom(P.stunUpgradeLevelAtom)

	return useCallback(
		(type: UpgradeType) => {
			const snapshot = snapRef.current
			const cfg: BalanceConfig = snapshot.balance

			const tryBuyNextTier = (
				currentTierIndex: number,
				tiers: { cost: number }[],
				setTier: (fn: (level: number) => number) => void
			) => {
				if (currentTierIndex >= tiers.length - 1) return
				const cost = tiers[currentTierIndex + 1].cost
				if (snapshot.piplets < cost) return
				setPiplets((p: number) => p - cost)
				setTier((level: number) => level + 1)
			}

			switch (type) {
				case 'speed':
					tryBuyNextTier(snapshot.speedUpgradeLevel, cfg.speed, setSpeedUpgradeLevel)
					break
				case 'auto':
					tryBuyNextTier(snapshot.autoRollUpgradeLevel, cfg.auto, setAutoRollUpgradeLevel)
					break
				case 'multi':
					tryBuyNextTier(snapshot.multiplierUpgradeLevel, cfg.multi, setMultiplierUpgradeLevel)
					break
				case 'retention':
					tryBuyNextTier(
						snapshot.streakRetentionUpgradeLevel,
						cfg.streakRetention,
						setStreakRetentionUpgradeLevel
					)
					break
				case 'stun':
					tryBuyNextTier(snapshot.stunUpgradeLevel, cfg.stun, setStunUpgradeLevel)
					break
			}
		},
		[
			setPiplets,
			setSpeedUpgradeLevel,
			setAutoRollUpgradeLevel,
			setMultiplierUpgradeLevel,
			setStreakRetentionUpgradeLevel,
			setStunUpgradeLevel,
		]
	)
}

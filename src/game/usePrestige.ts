import { useCallback, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { makeDefaultDie } from './constants'
import { canPrestigeAtom } from './atoms/derived'
import * as P from './atoms/primitives'

/**
 * Reset run state and advance prestige when requirements are met.
 */
export function usePrestige(): () => void {
	const canPrestige = useAtomValue(canPrestigeAtom)
	const prestige = useAtomValue(P.prestigeAtom)

	const snapRef = useRef({ canPrestige, prestige })
	snapRef.current = { canPrestige, prestige }

	const setPrestige = useSetAtom(P.prestigeAtom)
	const setGold = useSetAtom(P.goldAtom)
	const setLifetimeGoldEarned = useSetAtom(P.lifetimeGoldEarnedAtom)
	const setGoldStreak = useSetAtom(P.goldStreakAtom)
	const setLastRolledFace = useSetAtom(P.lastRolledFaceAtom)
	const setHexBalance = useSetAtom(P.hexBalanceAtom)
	const setHexRewardStreak = useSetAtom(P.hexRewardStreakAtom)
	const setSpeedUpgradeLevel = useSetAtom(P.speedUpgradeLevelAtom)
	const setAutoRollUpgradeLevel = useSetAtom(P.autoRollUpgradeLevelAtom)
	const setMultiplierUpgradeLevel = useSetAtom(P.multiplierUpgradeLevelAtom)
	const setStreakRetentionUpgradeLevel = useSetAtom(P.streakRetentionUpgradeLevelAtom)
	const setStunUpgradeLevel = useSetAtom(P.stunUpgradeLevelAtom)
	const setDice = useSetAtom(P.diceAtom)
	const setTotalDieReforgeCount = useSetAtom(P.totalDieReforgeCountAtom)
	const setGameEventLog = useSetAtom(P.gameEventLogAtom)

	return useCallback(() => {
		if (!snapRef.current.canPrestige) return
		const prestigeBefore = snapRef.current.prestige
		setPrestige((level: number) => level + 1)
		setGold(0)
		setLifetimeGoldEarned(0)
		setGoldStreak(0)
		setLastRolledFace(null)
		setHexBalance(0)
		setHexRewardStreak(0)
		setSpeedUpgradeLevel(0)
		setAutoRollUpgradeLevel(0)
		setMultiplierUpgradeLevel(0)
		setStreakRetentionUpgradeLevel(0)
		setStunUpgradeLevel(0)
		setDice([makeDefaultDie()])
		setTotalDieReforgeCount(0)
		setGameEventLog([
			`✨ PRESTIGE ${prestigeBefore + 1}! ×${(1 + (prestigeBefore + 1) * 0.5).toFixed(1)} forever`,
		])
	}, [
		setPrestige,
		setGold,
		setLifetimeGoldEarned,
		setGoldStreak,
		setLastRolledFace,
		setHexBalance,
		setHexRewardStreak,
		setSpeedUpgradeLevel,
		setAutoRollUpgradeLevel,
		setMultiplierUpgradeLevel,
		setStreakRetentionUpgradeLevel,
		setStunUpgradeLevel,
		setDice,
		setTotalDieReforgeCount,
		setGameEventLog,
	])
}

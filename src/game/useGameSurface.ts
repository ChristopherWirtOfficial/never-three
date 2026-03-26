import { useAtomValue, useSetAtom } from 'jotai'
import * as P from './atoms/primitives'
import * as D from './atoms/derived'
import { useGameLoop } from './useGameLoop'
import { useDiceRoll } from './useDiceRoll'
import { usePurchaseUpgrade } from './usePurchaseUpgrade'
import { usePrestige } from './usePrestige'
import { useIncrementDieFace } from './useIncrementDieFace'
import { useDecrementDieFace } from './useDecrementDieFace'

/** Game UI state and actions; backing state lives in Jotai atoms (`atoms/`). */
export function useGameSurface() {
	const rollDice = useDiceRoll()
	useGameLoop(rollDice)

	const gold = useAtomValue(P.goldAtom)
	const lifetimeGoldEarned = useAtomValue(P.lifetimeGoldEarnedAtom)
	const goldStreak = useAtomValue(P.goldStreakAtom)
	const bestGoldStreak = useAtomValue(P.bestGoldStreakAtom)
	const hexBalance = useAtomValue(P.hexBalanceAtom)
	const hexRewardStreak = useAtomValue(P.hexRewardStreakAtom)
	const bestHexRewardStreak = useAtomValue(P.bestHexRewardStreakAtom)
	const lastRolledFace = useAtomValue(P.lastRolledFaceAtom)
	const isRolling = useAtomValue(P.isRollingAtom)
	const isRollCooldownActive = useAtomValue(P.isRollCooldownActiveAtom)
	const isStunned = useAtomValue(P.isStunnedAtom)
	const activeStunWindow = useAtomValue(P.activeStunWindowAtom)
	const stunRecoveryProgress = useAtomValue(P.stunRecoveryProgressAtom)
	const rollCooldownProgress = useAtomValue(P.rollCooldownProgressAtom)
	const autoRollProgress = useAtomValue(P.autoRollProgressAtom)
	const speedUpgradeLevel = useAtomValue(P.speedUpgradeLevelAtom)
	const autoRollUpgradeLevel = useAtomValue(P.autoRollUpgradeLevelAtom)
	const multiplierUpgradeLevel = useAtomValue(P.multiplierUpgradeLevelAtom)
	const streakRetentionUpgradeLevel = useAtomValue(P.streakRetentionUpgradeLevelAtom)
	const stunUpgradeLevel = useAtomValue(P.stunUpgradeLevelAtom)
	const prestige = useAtomValue(P.prestigeAtom)
	const totalRollCount = useAtomValue(P.totalRollCountAtom)
	const multipleOfThreeRollCount = useAtomValue(P.multipleOfThreeRollCountAtom)
	const dieShakeActive = useAtomValue(P.dieShakeActiveAtom)
	const screenFlashColor = useAtomValue(P.screenFlashColorAtom)
	const activeGameTab = useAtomValue(P.activeGameTabAtom)
	const gameEventLog = useAtomValue(P.gameEventLogAtom)
	const runStarted = useAtomValue(P.runStartedAtom)
	const dice = useAtomValue(P.diceAtom)
	const totalDieReforgeCount = useAtomValue(P.totalDieReforgeCountAtom)
	const maxReforgeFaceValue = useAtomValue(P.maxReforgeFaceValueAtom)

	const currentDie = useAtomValue(D.currentDieAtom)
	const goldMultiplier = useAtomValue(D.goldMultiplierAtom)
	const goldStreakMult = useAtomValue(D.goldStreakMultAtom)
	const hexStreakMult = useAtomValue(D.hexStreakMultAtom)
	const streakRetentionPct = useAtomValue(D.streakRetentionPctAtom)
	const prestigeGoldMultiplier = useAtomValue(D.prestigeGoldMultiplierAtom)
	const cdMs = useAtomValue(D.cdMsAtom)
	const stunMs = useAtomValue(D.stunMsAtom)
	const stunActiveDurationMs = activeStunWindow?.durationMs ?? stunMs
	const autoMs = useAtomValue(D.autoMsAtom)
	const prestigeReq = useAtomValue(D.prestigeReqAtom)
	const canPrestige = useAtomValue(D.canPrestigeAtom)
	const locked = useAtomValue(D.gameLockedAtom)

	const setActiveGameTab = useSetAtom(P.activeGameTabAtom)

	const purchaseUpgrade = usePurchaseUpgrade()
	const commitPrestige = usePrestige()
	const incrementDieFace = useIncrementDieFace()
	const decrementDieFace = useDecrementDieFace()

	return {
		gold,
		lifetimeGoldEarned,
		goldStreak,
		bestGoldStreak,
		hexBalance,
		hexRewardStreak,
		bestHexRewardStreak,
		lastRolledFace,
		isRolling,
		isRollCooldownActive,
		isStunned,
		stunRecoveryProgress,
		rollCooldownProgress,
		autoRollProgress,
		speedUpgradeLevel,
		autoRollUpgradeLevel,
		multiplierUpgradeLevel,
		streakRetentionUpgradeLevel,
		stunUpgradeLevel,
		prestige,
		totalRollCount,
		multipleOfThreeRollCount,
		dieShakeActive,
		screenFlashColor,
		activeGameTab,
		gameEventLog,
		runStarted,
		dice,
		totalDieReforgeCount,
		maxReforgeFaceValue,
		currentDie,
		goldMultiplier,
		goldStreakMult,
		hexStreakMult,
		streakRetentionPct,
		prestigeGoldMultiplier,
		cdMs,
		stunMs,
		stunActiveDurationMs,
		autoMs,
		prestigeReq,
		canPrestige,
		locked,
		setActiveGameTab,
		rollDice,
		purchaseUpgrade,
		commitPrestige,
		incrementDieFace,
		decrementDieFace,
	}
}

import type { Store } from 'jotai/vanilla/store'
import * as P from './atoms/primitives'
import { clearRollTimeouts } from './rollTimers'
import type { SaveState } from './saves'
import { SAVE_VERSION } from './saves'

/** Primitive atoms whose values are written to `SaveState` and watched for autosave. */
export const durableGameAtoms = [
	P.pipletsAtom,
	P.lifetimePipletsEarnedAtom,
	P.pipletStreakAtom,
	P.bestPipletStreakAtom,
	P.hexBalanceAtom,
	P.hexRewardStreakAtom,
	P.bestHexRewardStreakAtom,
	P.speedUpgradeLevelAtom,
	P.autoRollUpgradeLevelAtom,
	P.multiplierUpgradeLevelAtom,
	P.streakRetentionUpgradeLevelAtom,
	P.stunUpgradeLevelAtom,
	P.prestigeAtom,
	P.totalRollCountAtom,
	P.multipleOfThreeRollCountAtom,
	P.diceAtom,
	P.totalDieReforgeCountAtom,
	P.maxReforgeFaceValueAtom,
] as const

export function collectSaveStateFromStore(store: Store): SaveState {
	return {
		_v: SAVE_VERSION,
		piplets: store.get(P.pipletsAtom),
		lifetimePipletsEarned: store.get(P.lifetimePipletsEarnedAtom),
		pipletStreak: store.get(P.pipletStreakAtom),
		bestPipletStreak: store.get(P.bestPipletStreakAtom),
		hexBalance: store.get(P.hexBalanceAtom),
		hexRewardStreak: store.get(P.hexRewardStreakAtom),
		bestHexRewardStreak: store.get(P.bestHexRewardStreakAtom),
		speedUpgradeLevel: store.get(P.speedUpgradeLevelAtom),
		autoRollUpgradeLevel: store.get(P.autoRollUpgradeLevelAtom),
		multiplierUpgradeLevel: store.get(P.multiplierUpgradeLevelAtom),
		streakRetentionUpgradeLevel: store.get(P.streakRetentionUpgradeLevelAtom),
		stunUpgradeLevel: store.get(P.stunUpgradeLevelAtom),
		prestige: store.get(P.prestigeAtom),
		totalRollCount: store.get(P.totalRollCountAtom),
		multipleOfThreeRollCount: store.get(P.multipleOfThreeRollCountAtom),
		dice: store.get(P.diceAtom),
		totalDieReforgeCount: store.get(P.totalDieReforgeCountAtom),
		maxReforgeFaceValue: store.get(P.maxReforgeFaceValueAtom),
	}
}

/** Apply disk snapshot and reset ephemeral roll / UI atoms. */
export function hydrateStoreFromSaveState(store: Store, state: SaveState): void {
	clearRollTimeouts()

	store.set(P.pipletsAtom, state.piplets)
	store.set(P.lifetimePipletsEarnedAtom, state.lifetimePipletsEarned)
	store.set(P.pipletStreakAtom, state.pipletStreak)
	store.set(P.bestPipletStreakAtom, state.bestPipletStreak)
	store.set(P.hexBalanceAtom, state.hexBalance ?? 0)
	store.set(P.hexRewardStreakAtom, state.hexRewardStreak ?? 0)
	store.set(P.bestHexRewardStreakAtom, state.bestHexRewardStreak ?? 0)
	store.set(P.speedUpgradeLevelAtom, state.speedUpgradeLevel)
	store.set(P.autoRollUpgradeLevelAtom, state.autoRollUpgradeLevel)
	store.set(P.multiplierUpgradeLevelAtom, state.multiplierUpgradeLevel)
	store.set(P.streakRetentionUpgradeLevelAtom, state.streakRetentionUpgradeLevel)
	store.set(P.stunUpgradeLevelAtom, state.stunUpgradeLevel)
	store.set(P.prestigeAtom, state.prestige)
	store.set(P.totalRollCountAtom, state.totalRollCount)
	store.set(P.multipleOfThreeRollCountAtom, state.multipleOfThreeRollCount)
	store.set(P.diceAtom, state.dice)
	store.set(P.totalDieReforgeCountAtom, state.totalDieReforgeCount)
	store.set(P.maxReforgeFaceValueAtom, state.maxReforgeFaceValue)

	store.set(P.lastRolledFaceAtom, null)
	store.set(P.isRollingAtom, false)
	store.set(P.isRollCooldownActiveAtom, false)
	store.set(P.isStunnedAtom, false)
	store.set(P.activeStunWindowAtom, null)
	store.set(P.stunRecoveryProgressAtom, 0)
	store.set(P.rollCooldownProgressAtom, 0)
	store.set(P.autoRollProgressAtom, 0)
	store.set(P.dieShakeActiveAtom, false)
	store.set(P.activeGameTabAtom, 'roll')
	store.set(P.gameEventLogAtom, [])
	store.set(P.rollRewardPopupsAtom, [])

	const hasProgress =
		state.piplets > 0 ||
		state.lifetimePipletsEarned > 0 ||
		state.totalRollCount > 0 ||
		state.prestige > 0 ||
		state.hexBalance > 0
	store.set(P.runStartedAtom, hasProgress)
}

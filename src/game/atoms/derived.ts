import { atom } from 'jotai'
import { clampUpgradeLevel, hexStreakMultiplier, streakMultiplier } from '../balanceConfig'
import { makeDefaultDie } from '../constants'
import {
	autoRollUpgradeLevelAtom,
	balanceConfigAtom,
	diceAtom,
	pipletStreakAtom,
	hexRewardStreakAtom,
	isRollCooldownActiveAtom,
	isRollingAtom,
	isStunnedAtom,
	lifetimePipletsEarnedAtom,
	multiplierUpgradeLevelAtom,
	prestigeAtom,
	speedUpgradeLevelAtom,
	streakRetentionUpgradeLevelAtom,
	stunUpgradeLevelAtom,
} from './primitives'

export type RollPhase = 'idle' | 'rolling' | 'cooldown' | 'stunned'

/** Single place to read “what part of the roll cycle are we in?”. */
export const rollPhaseAtom = atom((get): RollPhase => {
	if (get(isRollingAtom)) return 'rolling'
	if (get(isStunnedAtom)) return 'stunned'
	if (get(isRollCooldownActiveAtom)) return 'cooldown'
	return 'idle'
})

/** True whenever a new roll should not start (UI + auto-roll gate). */
export const gameLockedAtom = atom(get => get(rollPhaseAtom) !== 'idle')

export const currentDieAtom = atom(get => get(diceAtom)[0] ?? makeDefaultDie())

export const pipletMultiplierAtom = atom(get => {
	const balanceConfig = get(balanceConfigAtom)
	const multiplierTierIndex = clampUpgradeLevel(
		get(multiplierUpgradeLevelAtom),
		balanceConfig.multi.length
	)
	return balanceConfig.multi[multiplierTierIndex].x
})

export const streakRetentionPctAtom = atom(get => {
	const balanceConfig = get(balanceConfigAtom)
	const streakRetentionTierIndex = clampUpgradeLevel(
		get(streakRetentionUpgradeLevelAtom),
		balanceConfig.streakRetention.length
	)
	return balanceConfig.streakRetention[streakRetentionTierIndex].pct
})

export const prestigePipletMultiplierAtom = atom(
	get => 1 + get(prestigeAtom) * get(balanceConfigAtom).prestigePipletMultPerLevel
)

/** Multiplier applied on the next safe roll from the current piplet streak (matches `useDiceRoll`). */
export const pipletStreakMultAtom = atom(get => {
	const balanceConfig = get(balanceConfigAtom)
	return streakMultiplier(get(pipletStreakAtom), balanceConfig)
})

/** Multiplier applied on the next dangerous roll from the current hex streak (matches `useDiceRoll`). */
export const hexStreakMultAtom = atom(get => {
	const balanceConfig = get(balanceConfigAtom)
	return hexStreakMultiplier(get(hexRewardStreakAtom), balanceConfig)
})

export const cdMsAtom = atom(get => {
	const balanceConfig = get(balanceConfigAtom)
	const speedTierIndex = clampUpgradeLevel(get(speedUpgradeLevelAtom), balanceConfig.speed.length)
	return balanceConfig.speed[speedTierIndex].ms
})

export const stunMsAtom = atom(get => {
	const balanceConfig = get(balanceConfigAtom)
	const stunTierIndex = clampUpgradeLevel(get(stunUpgradeLevelAtom), balanceConfig.stun.length)
	return balanceConfig.stun[stunTierIndex].ms
})

export const autoMsAtom = atom(get => {
	const balanceConfig = get(balanceConfigAtom)
	const autoRollTierIndex = clampUpgradeLevel(
		get(autoRollUpgradeLevelAtom),
		balanceConfig.auto.length
	)
	return balanceConfig.auto[autoRollTierIndex].ms
})

export const prestigeReqAtom = atom(
	get => get(balanceConfigAtom).prestigeBase * Math.pow(2.5, get(prestigeAtom))
)

export const canPrestigeAtom = atom(get => get(lifetimePipletsEarnedAtom) >= get(prestigeReqAtom))

import { atom } from 'jotai'
import { clampUpgradeLevel, hexStreakMultiplier, streakMultiplier } from '../balanceConfig'
import { makeDefaultDie } from '../constants'
import {
	autoRollUpgradeLevelAtom,
	balanceConfigAtom,
	diceAtom,
	goldStreakAtom,
	hexRewardStreakAtom,
	isRollCooldownActiveAtom,
	isRollingAtom,
	isStunnedAtom,
	lifetimeGoldEarnedAtom,
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

export const goldMultiplierAtom = atom(get => {
	const cfg = get(balanceConfigAtom)
	const lv = clampUpgradeLevel(get(multiplierUpgradeLevelAtom), cfg.multi.length)
	return cfg.multi[lv].x
})

export const streakRetentionPctAtom = atom(get => {
	const cfg = get(balanceConfigAtom)
	const lv = clampUpgradeLevel(get(streakRetentionUpgradeLevelAtom), cfg.streakRetention.length)
	return cfg.streakRetention[lv].pct
})

export const prestigeGoldMultiplierAtom = atom(
	get => 1 + get(prestigeAtom) * get(balanceConfigAtom).prestigeGoldMultPerLevel
)

/** Multiplier applied on the next safe roll from the current gold streak (matches `useDiceRoll`). */
export const goldStreakMultAtom = atom(get => {
	const cfg = get(balanceConfigAtom)
	return streakMultiplier(get(goldStreakAtom), cfg)
})

/** Multiplier applied on the next dangerous roll from the current hex streak (matches `useDiceRoll`). */
export const hexStreakMultAtom = atom(get => {
	const cfg = get(balanceConfigAtom)
	return hexStreakMultiplier(get(hexRewardStreakAtom), cfg)
})

export const cdMsAtom = atom(get => {
	const cfg = get(balanceConfigAtom)
	const lv = clampUpgradeLevel(get(speedUpgradeLevelAtom), cfg.speed.length)
	return cfg.speed[lv].ms
})

export const stunMsAtom = atom(get => {
	const cfg = get(balanceConfigAtom)
	const lv = clampUpgradeLevel(get(stunUpgradeLevelAtom), cfg.stun.length)
	return cfg.stun[lv].ms
})

export const autoMsAtom = atom(get => {
	const cfg = get(balanceConfigAtom)
	const lv = clampUpgradeLevel(get(autoRollUpgradeLevelAtom), cfg.auto.length)
	return cfg.auto[lv].ms
})

export const prestigeReqAtom = atom(
	get => get(balanceConfigAtom).prestigeBase * Math.pow(2.5, get(prestigeAtom))
)

export const canPrestigeAtom = atom(get => get(lifetimeGoldEarnedAtom) >= get(prestigeReqAtom))

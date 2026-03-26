import { atom } from 'jotai'
import {
	AUTO,
	MULTI,
	PRESTIGE_BASE,
	SPEED,
	STREAK_RETENTION,
	STUN,
	makeDefaultDie,
} from '../constants'
import {
	autoRollUpgradeLevelAtom,
	diceAtom,
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

export const multiAtom = atom(get => MULTI[get(multiplierUpgradeLevelAtom)].x)
export const streakRetentionPctAtom = atom(
	get => STREAK_RETENTION[get(streakRetentionUpgradeLevelAtom)].pct
)
export const prestigeGoldMultiplierAtom = atom(get => 1 + get(prestigeAtom) * 0.5)
export const cdMsAtom = atom(get => SPEED[get(speedUpgradeLevelAtom)].ms)
export const stunMsAtom = atom(get => STUN[get(stunUpgradeLevelAtom)].ms)
export const autoMsAtom = atom(get => AUTO[get(autoRollUpgradeLevelAtom)].ms)

export const prestigeReqAtom = atom(get => PRESTIGE_BASE * Math.pow(2.5, get(prestigeAtom)))

export const canPrestigeAtom = atom(get => get(lifetimeGoldEarnedAtom) >= get(prestigeReqAtom))

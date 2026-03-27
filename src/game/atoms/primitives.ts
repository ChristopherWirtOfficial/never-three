import { atom } from 'jotai'
import { DEFAULT_BALANCE_CONFIG, type BalanceConfig } from '../balanceConfig'
import { makeDefaultDie } from '../constants'
import type { Die, RollRewardPopup, TabId } from '../types'

export const pipletsAtom = atom(0)
export const lifetimePipletsEarnedAtom = atom(0)
export const pipletStreakAtom = atom(0)
export const bestPipletStreakAtom = atom(0)

export const hexBalanceAtom = atom(0)
export const hexRewardStreakAtom = atom(0)
export const bestHexRewardStreakAtom = atom(0)

export const lastRolledFaceAtom = atom<number | null>(null)
export const isRollingAtom = atom(false)
export const isRollCooldownActiveAtom = atom(false)
export const isStunnedAtom = atom(false)
/** Wall-clock span of the current stun (set with roll; not tied to live stun upgrade tier). */
export const activeStunWindowAtom = atom<{
	startMs: number
	durationMs: number
} | null>(null)
export const stunRecoveryProgressAtom = atom(0)
export const rollCooldownProgressAtom = atom(0)
export const autoRollProgressAtom = atom(0)

export const speedUpgradeLevelAtom = atom(0)
export const autoRollUpgradeLevelAtom = atom(0)
export const multiplierUpgradeLevelAtom = atom(0)
export const streakRetentionUpgradeLevelAtom = atom(0)
export const stunUpgradeLevelAtom = atom(0)
export const prestigeAtom = atom(0)

export const totalRollCountAtom = atom(0)
/** After prestige, next roll avoids multiples of 3 (persisted). Fresh games use totalRollCount === 0 instead. */
export const pendingSafeFirstRollAtom = atom(false)
export const multipleOfThreeRollCountAtom = atom(0)
export const dieShakeActiveAtom = atom(false)

export const activeGameTabAtom = atom<TabId>('roll')
export const gameEventLogAtom = atom<string[]>([])
/** Ephemeral +piplets / +hex floaters from the last roll(s); not persisted. */
export const rollRewardPopupsAtom = atom<RollRewardPopup[]>([])
export const runStartedAtom = atom(false)

export const diceAtom = atom<Die[]>([makeDefaultDie()])
export const totalDieReforgeCountAtom = atom(0)
export const maxReforgeFaceValueAtom = atom(DEFAULT_BALANCE_CONFIG.defaultReforgeCap)

/** Active balance preset; hydrated at boot from localStorage. */
export const balanceConfigAtom = atom<BalanceConfig>(DEFAULT_BALANCE_CONFIG)

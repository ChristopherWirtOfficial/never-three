export interface SpeedTier {
	ms: number
	name: string
	cost: number
}
export interface AutoTier {
	ms: number | null
	name: string
	cost: number
}
export interface MultiTier {
	x: number
	cost: number
}
export interface StreakRetentionTier {
	/** Percent of piplet streak preserved when a multiple-of-3 is rolled. */
	pct: number
	cost: number
}
export interface StunTier {
	ms: number
	name: string
	cost: number
}

export type UpgradeType = 'speed' | 'auto' | 'multi' | 'retention' | 'stun'
export type TabId = 'roll' | 'shop' | 'forge' | 'log' | 'balance'

/** One-shot UI floater: actual currency gained this roll (after all multipliers). */
export interface RollRewardPopup {
	id: string
	kind: 'piplet' | 'hex'
	amount: number
}

// Each die is an array of face values
export type Die = number[]

// Full dice state
export interface DiceState {
	dice: Die[]
	totalDieReforgeCount: number
	maxReforgeFaceValue: number
}

export interface GameState {
	piplets: number
	lifetimePipletsEarned: number
	pipletStreak: number
	bestPipletStreak: number
	lastRolledFace: number | null
	isRolling: boolean
	isRollCooldownActive: boolean
	isStunned: boolean
	stunRecoveryProgress: number
	rollCooldownProgress: number
	speedUpgradeLevel: number
	autoRollUpgradeLevel: number
	multiplierUpgradeLevel: number
	streakRetentionUpgradeLevel: number
	stunUpgradeLevel: number
	prestige: number
	totalRollCount: number
	multipleOfThreeRollCount: number
	dieShakeActive: boolean
	tab: TabId
	gameEventLog: string[]
	runStarted: boolean
}

import type {
	DiceTier,
	SpeedTier,
	AutoTier,
	MultiTier,
	StreakRetentionTier,
	StunTier,
} from './types'

export const DICE: DiceTier[] = [
	{ sides: 6, name: 'd6', cost: 0 },
	{ sides: 8, name: 'd8', cost: 300 },
	{ sides: 10, name: 'd10', cost: 2000 },
	{ sides: 12, name: 'd12', cost: 12000 },
	{ sides: 20, name: 'd20', cost: 80000 },
	{ sides: 100, name: 'd100', cost: 750000 },
]

export const SPEED: SpeedTier[] = [
	{ ms: 2000, name: '2.0s', cost: 0 },
	{ ms: 1500, name: '1.5s', cost: 8 },
	{ ms: 1100, name: '1.1s', cost: 30 },
	{ ms: 750, name: '0.75s', cost: 120 },
	{ ms: 500, name: '0.5s', cost: 600 },
	{ ms: 350, name: '0.35s', cost: 4000 },
]

export const AUTO: AutoTier[] = [
	{ ms: null, name: 'Off', cost: 0 },
	{ ms: 5000, name: '5s', cost: 15 },
	{ ms: 2000, name: '2s', cost: 60 },
	{ ms: 800, name: '0.8s', cost: 300 },
	{ ms: 300, name: '0.3s', cost: 2000 },
	{ ms: 100, name: '0.1s', cost: 15000 },
	{ ms: 0, name: 'Instant', cost: 80000 },
]

export const MULTI: MultiTier[] = [
	{ x: 1, cost: 0 },
	{ x: 2, cost: 5 },
	{ x: 4, cost: 20 },
	{ x: 8, cost: 80 },
	{ x: 16, cost: 400 },
	{ x: 40, cost: 3000 },
	{ x: 100, cost: 25000 },
]

/** % of gold streak kept after a dangerous roll (stun + hex still apply). */
export const STREAK_RETENTION: StreakRetentionTier[] = [
	{ pct: 0, cost: 0 },
	{ pct: 8, cost: 40 },
	{ pct: 16, cost: 200 },
	{ pct: 25, cost: 1000 },
	{ pct: 35, cost: 6000 },
	{ pct: 50, cost: 40000 },
]

export const STUN: StunTier[] = [
	{ ms: 3000, name: '3.0s', cost: 0 },
	{ ms: 2000, name: '2.0s', cost: 15 },
	{ ms: 1200, name: '1.2s', cost: 80 },
	{ ms: 800, name: '0.8s', cost: 400 },
	{ ms: 500, name: '0.5s', cost: 2500 },
	{ ms: 300, name: '0.3s', cost: 15000 },
]

export const PRESTIGE_BASE = 10000

/** Abbreviated number for UI (K / M / B / T). */
export function formatCompactNumber(value: number): string {
	if (value >= 1e12) return (value / 1e12).toFixed(1) + 'T'
	if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B'
	if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M'
	if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K'
	return Math.floor(value).toString()
}

export function streakMultiplier(streak: number): number {
	return 1 + Math.sqrt(streak) * 0.25
}

export function hexStreakMultiplier(streak: number): number {
	return 1 + Math.sqrt(streak) * 0.3
}

export const HEX_BASE = 1 // scales hex per “danger unit” (face value / 3)

/** For a multiple-of-3 face, how many danger units (3→1, 6→2, …). */
export function dangerousFaceHexUnits(faceValue: number): number {
	return Math.floor(faceValue / 3)
}

// ── Reforging (costs Hex) ──

export const REFORGE_BASE = 3
export const DANGER_ESCAPE_MULT = 4 // leaving a multiple of 3 costs 4x

export function reforgeCost(
	currentValue: number,
	targetValue: number,
	totalDieReforgeCount: number
): number {
	const base =
		REFORGE_BASE * Math.max(currentValue, targetValue) * (1 + totalDieReforgeCount * 0.15)
	// Escaping a dangerous number costs a premium
	if (currentValue % 3 === 0) {
		return Math.floor(base * DANGER_ESCAPE_MULT)
	}
	return Math.floor(base)
}

export function makeDefaultDie(): number[] {
	return [1, 2, 3, 4, 5, 6]
}

export const DEFAULT_REFORGE_CAP = 6

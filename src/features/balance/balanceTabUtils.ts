import { mergeWithDefaults, type BalanceConfig } from '../../game/balanceConfig'

/** Dropdown value: edit built-in defaults; Apply creates a new saved preset (never leaves game on “anonymous” applied state). */
export const BALANCE_EDITOR_TEMPLATE = '__nt_balance_template__'

export function configFingerprint(c: BalanceConfig): string {
	return JSON.stringify(mergeWithDefaults(c))
}

export function moveRow<T>(arr: T[], from: number, to: number): T[] {
	if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) return arr
	const next = [...arr]
	const [removed] = next.splice(from, 1)
	next.splice(to, 0, removed)
	return next
}

export type BalanceTierDragState = {
	key: keyof Pick<BalanceConfig, 'speed' | 'auto' | 'multi' | 'streakRetention' | 'stun'>
	index: number
} | null

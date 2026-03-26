import type { AutoTier, MultiTier, SpeedTier, StreakRetentionTier, StunTier } from './types'

/** Tunable game balance; persisted per named preset in localStorage. */
export interface BalanceConfig {
	_v: number
	speed: SpeedTier[]
	auto: AutoTier[]
	multi: MultiTier[]
	streakRetention: StreakRetentionTier[]
	stun: StunTier[]
	prestigeBase: number
	hexBase: number
	reforgeBase: number
	dangerEscapeMult: number
	defaultReforgeCap: number
	/** `1 + sqrt(streak) * slope` gold streak multiplier */
	streakMultSlope: number
	/** `1 + sqrt(streak) * slope` hex streak multiplier */
	hexStreakMultSlope: number
	/** Added to reforge cost as `totalDieReforgeCount * this` factor inside `(1 + …)` */
	reforgeScalingPerCount: number
	/** `1 + prestige * this` gold multiplier */
	prestigeGoldMultPerLevel: number
}

export const BALANCE_CONFIG_VERSION = 1

/** Default label when creating a balance preset (user can rename inline). */
export function formatDefaultBalancePresetName(atMs: number = Date.now()): string {
	return `Balance · ${new Date(atMs).toLocaleString(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short',
	})}`
}

const BALANCE_INDEX_KEY = 'nt-balance-configs'
const BALANCE_ACTIVE_KEY = 'nt-active-balance'
const BALANCE_BLOB_PREFIX = 'nt-balance-'

function readLocalStorageString(key: string): string | null {
	try {
		return localStorage.getItem(key)
	} catch {
		return null
	}
}

function writeLocalStorageString(key: string, value: string): boolean {
	try {
		localStorage.setItem(key, value)
		return true
	} catch {
		return false
	}
}

function removeLocalStorageItem(key: string): void {
	try {
		localStorage.removeItem(key)
	} catch {
		/* ignore */
	}
}

function makeId(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function deepClone<T>(v: T): T {
	return JSON.parse(JSON.stringify(v)) as T
}

export const DEFAULT_BALANCE_CONFIG: BalanceConfig = {
	_v: BALANCE_CONFIG_VERSION,
	speed: [
		{ ms: 2000, name: '2.0s', cost: 0 },
		{ ms: 1500, name: '1.5s', cost: 8 },
		{ ms: 1100, name: '1.1s', cost: 30 },
		{ ms: 750, name: '0.75s', cost: 120 },
		{ ms: 500, name: '0.5s', cost: 600 },
		{ ms: 350, name: '0.35s', cost: 4000 },
	],
	auto: [
		{ ms: null, name: 'Off', cost: 0 },
		{ ms: 5000, name: '5s', cost: 15 },
		{ ms: 2000, name: '2s', cost: 60 },
		{ ms: 800, name: '0.8s', cost: 300 },
		{ ms: 300, name: '0.3s', cost: 2000 },
		{ ms: 100, name: '0.1s', cost: 15000 },
		{ ms: 0, name: 'Instant', cost: 80000 },
	],
	multi: [
		{ x: 1, cost: 0 },
		{ x: 2, cost: 5 },
		{ x: 4, cost: 20 },
		{ x: 8, cost: 80 },
		{ x: 16, cost: 400 },
		{ x: 40, cost: 3000 },
		{ x: 100, cost: 25000 },
	],
	streakRetention: [
		{ pct: 0, cost: 0 },
		{ pct: 8, cost: 40 },
		{ pct: 16, cost: 200 },
		{ pct: 25, cost: 1000 },
		{ pct: 35, cost: 6000 },
		{ pct: 50, cost: 40000 },
	],
	stun: [
		{ ms: 3000, name: '3.0s', cost: 0 },
		{ ms: 2000, name: '2.0s', cost: 15 },
		{ ms: 1200, name: '1.2s', cost: 80 },
		{ ms: 800, name: '0.8s', cost: 400 },
		{ ms: 500, name: '0.5s', cost: 2500 },
		{ ms: 300, name: '0.3s', cost: 15000 },
	],
	prestigeBase: 10000,
	hexBase: 1,
	reforgeBase: 3,
	dangerEscapeMult: 4,
	defaultReforgeCap: 6,
	streakMultSlope: 0.25,
	hexStreakMultSlope: 0.3,
	reforgeScalingPerCount: 0.15,
	prestigeGoldMultPerLevel: 0.5,
}

/** Keep upgrade level index valid when tier tables are edited shorter. */
export function clampUpgradeLevel(level: number, tierLength: number): number {
	if (tierLength <= 0) return 0
	return Math.min(Math.max(0, level), tierLength - 1)
}

/** Deep clone via merge (ensures all fields present). */
export function cloneBalanceConfig(cfg: BalanceConfig): BalanceConfig {
	return mergeWithDefaults(cfg)
}

export function mergeWithDefaults(
	partial: Partial<BalanceConfig> | null | undefined
): BalanceConfig {
	const d = DEFAULT_BALANCE_CONFIG
	if (!partial || typeof partial !== 'object') return deepClone(d)
	return {
		_v: typeof partial._v === 'number' ? partial._v : d._v,
		speed: Array.isArray(partial.speed) ? deepClone(partial.speed) : deepClone(d.speed),
		auto: Array.isArray(partial.auto) ? deepClone(partial.auto) : deepClone(d.auto),
		multi: Array.isArray(partial.multi) ? deepClone(partial.multi) : deepClone(d.multi),
		streakRetention: Array.isArray(partial.streakRetention)
			? deepClone(partial.streakRetention)
			: deepClone(d.streakRetention),
		stun: Array.isArray(partial.stun) ? deepClone(partial.stun) : deepClone(d.stun),
		prestigeBase: num(partial.prestigeBase, d.prestigeBase),
		hexBase: num(partial.hexBase, d.hexBase),
		reforgeBase: num(partial.reforgeBase, d.reforgeBase),
		dangerEscapeMult: num(partial.dangerEscapeMult, d.dangerEscapeMult),
		defaultReforgeCap: num(partial.defaultReforgeCap, d.defaultReforgeCap),
		streakMultSlope: num(partial.streakMultSlope, d.streakMultSlope),
		hexStreakMultSlope: num(partial.hexStreakMultSlope, d.hexStreakMultSlope),
		reforgeScalingPerCount: num(partial.reforgeScalingPerCount, d.reforgeScalingPerCount),
		prestigeGoldMultPerLevel: num(partial.prestigeGoldMultPerLevel, d.prestigeGoldMultPerLevel),
	}
}

function num(v: unknown, fallback: number): number {
	return typeof v === 'number' && !Number.isNaN(v) ? v : fallback
}

/** Parse imported JSON into a full config (merges unknown fields to defaults). */
export function parseBalanceConfigJson(raw: unknown): BalanceConfig | null {
	if (!raw || typeof raw !== 'object') return null
	return mergeWithDefaults(raw as Partial<BalanceConfig>)
}

export function streakMultiplier(streak: number, cfg: BalanceConfig): number {
	return 1 + Math.sqrt(streak) * cfg.streakMultSlope
}

export function hexStreakMultiplier(streak: number, cfg: BalanceConfig): number {
	return 1 + Math.sqrt(streak) * cfg.hexStreakMultSlope
}

export function reforgeCost(
	currentValue: number,
	targetValue: number,
	totalDieReforgeCount: number,
	cfg: BalanceConfig
): number {
	const base =
		cfg.reforgeBase *
		Math.max(currentValue, targetValue) *
		(1 + totalDieReforgeCount * cfg.reforgeScalingPerCount)
	if (currentValue % 3 === 0) {
		return Math.floor(base * cfg.dangerEscapeMult)
	}
	return Math.floor(base)
}

export type BalanceProfileMeta = { id: string; name: string; lastSaved: number }

async function getBalanceIndex(): Promise<Record<string, { name: string; lastSaved: number }>> {
	const raw = readLocalStorageString(BALANCE_INDEX_KEY)
	if (!raw) return {}
	try {
		return JSON.parse(raw) as Record<string, { name: string; lastSaved: number }>
	} catch {
		return {}
	}
}

async function setBalanceIndex(
	index: Record<string, { name: string; lastSaved: number }>
): Promise<void> {
	writeLocalStorageString(BALANCE_INDEX_KEY, JSON.stringify(index))
}

export async function listBalanceProfiles(): Promise<BalanceProfileMeta[]> {
	const index = await getBalanceIndex()
	return Object.entries(index)
		.map(([id, info]) => ({ id, name: info.name, lastSaved: info.lastSaved }))
		.sort((a, b) => b.lastSaved - a.lastSaved)
}

export async function getActiveBalanceProfileId(): Promise<string | null> {
	return readLocalStorageString(BALANCE_ACTIVE_KEY)
}

export async function setActiveBalanceProfileId(id: string | null): Promise<void> {
	if (id === null || id === '') {
		removeLocalStorageItem(BALANCE_ACTIVE_KEY)
		return
	}
	writeLocalStorageString(BALANCE_ACTIVE_KEY, id)
}

export async function loadBalanceProfile(id: string): Promise<BalanceConfig | null> {
	const raw = readLocalStorageString(`${BALANCE_BLOB_PREFIX}${id}`)
	if (!raw) return null
	try {
		const parsed = JSON.parse(raw) as unknown
		return parseBalanceConfigJson(parsed)
	} catch {
		return null
	}
}

export async function saveBalanceProfile(
	id: string,
	name: string,
	config: BalanceConfig,
	setActive: boolean
): Promise<void> {
	const index = await getBalanceIndex()
	const full = mergeWithDefaults(config)
	full._v = BALANCE_CONFIG_VERSION
	index[id] = { name, lastSaved: Date.now() }
	await setBalanceIndex(index)
	writeLocalStorageString(`${BALANCE_BLOB_PREFIX}${id}`, JSON.stringify(full))
	if (setActive) {
		await setActiveBalanceProfileId(id)
	}
}

export async function createBalanceProfile(
	name: string,
	config: BalanceConfig
): Promise<{ id: string }> {
	const id = makeId()
	await saveBalanceProfile(id, name, config, true)
	return { id }
}

export async function deleteBalanceProfile(id: string): Promise<void> {
	const index = await getBalanceIndex()
	delete index[id]
	await setBalanceIndex(index)
	removeLocalStorageItem(`${BALANCE_BLOB_PREFIX}${id}`)
	const active = await getActiveBalanceProfileId()
	if (active === id) {
		await setActiveBalanceProfileId(null)
	}
}

export async function renameBalanceProfile(id: string, newName: string): Promise<void> {
	const index = await getBalanceIndex()
	if (index[id]) {
		index[id].name = newName
		await setBalanceIndex(index)
	}
}

/** Config to hydrate the game atom at boot (default if none / invalid). */
export async function loadResolvedActiveBalanceConfig(): Promise<BalanceConfig> {
	const activeId = await getActiveBalanceProfileId()
	if (!activeId) return deepClone(DEFAULT_BALANCE_CONFIG)
	const loaded = await loadBalanceProfile(activeId)
	return loaded ?? deepClone(DEFAULT_BALANCE_CONFIG)
}

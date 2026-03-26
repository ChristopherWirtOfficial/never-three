// Save/load via localStorage (keys prefixed nt-)

export const SAVE_VERSION = 5;

export interface SaveProfile {
  name: string;
  id: string;
  lastPlayed: number; // timestamp
  state: SaveState;
}

/** On-disk shape; field names are stable for future save/export features. */
export interface SaveState {
  _v: number;
  gold: number;
  lifetimeGoldEarned: number;
  goldStreak: number;
  bestGoldStreak: number;
  hexBalance: number;
  hexRewardStreak: number;
  bestHexRewardStreak: number;
  speedUpgradeLevel: number;
  autoRollUpgradeLevel: number;
  multiplierUpgradeLevel: number;
  streakRetentionUpgradeLevel: number;
  stunUpgradeLevel: number;
  prestige: number;
  totalRollCount: number;
  multipleOfThreeRollCount: number;
  dice: number[][];
  totalDieReforgeCount: number;
  maxReforgeFaceValue: number;
}

const PROFILES_KEY = "nt-profiles";
const ACTIVE_KEY = "nt-active";

function readLocalStorageString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** @returns whether the value was written */
function writeLocalStorageString(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function num(raw: Record<string, unknown>, ...keys: string[]): number {
  for (const k of keys) {
    const v = raw[k];
    if (typeof v === "number" && !Number.isNaN(v)) return v;
  }
  return 0;
}

function numOpt(
  raw: Record<string, unknown>,
  fallback: number,
  ...keys: string[]
): number {
  for (const k of keys) {
    const v = raw[k];
    if (typeof v === "number" && !Number.isNaN(v)) return v;
  }
  return fallback;
}

/**
 * Normalize any supported save version (or pasted partial JSON) into the current `SaveState`.
 * Unknown `_v` values are rejected by `loadProfile`; this function assumes a recognized legacy version.
 */
export function migrateRawToSaveState(raw: Record<string, unknown>): SaveState {
  return {
    _v: SAVE_VERSION,
    gold: num(raw, "gold"),
    lifetimeGoldEarned: num(raw, "lifetimeGoldEarned", "earned"),
    goldStreak: num(raw, "goldStreak", "streak"),
    bestGoldStreak: num(raw, "bestGoldStreak", "best"),
    hexBalance: numOpt(raw, 0, "hexBalance", "hex"),
    hexRewardStreak: numOpt(raw, 0, "hexRewardStreak", "hexStreak"),
    bestHexRewardStreak: numOpt(raw, 0, "bestHexRewardStreak", "bestHexStreak"),
    speedUpgradeLevel: num(raw, "speedUpgradeLevel", "sLv"),
    autoRollUpgradeLevel: num(raw, "autoRollUpgradeLevel", "aLv"),
    multiplierUpgradeLevel: num(raw, "multiplierUpgradeLevel", "mLv"),
    streakRetentionUpgradeLevel: num(raw, "streakRetentionUpgradeLevel", "rLv"),
    stunUpgradeLevel: num(raw, "stunUpgradeLevel", "tLv"),
    prestige: num(raw, "prestige"),
    totalRollCount: num(raw, "totalRollCount", "rolls"),
    multipleOfThreeRollCount: num(raw, "multipleOfThreeRollCount", "threes"),
    dice: (Array.isArray(raw.dice) ? (raw.dice as number[][]) : null) ?? [
      [1, 2, 3, 4, 5, 6],
    ],
    totalDieReforgeCount: numOpt(
      raw,
      0,
      "totalDieReforgeCount",
      "totalReforges",
    ),
    maxReforgeFaceValue: numOpt(raw, 6, "maxReforgeFaceValue", "reforgeCap"),
  };
}

export function extractSaveState(g: Record<string, unknown>): SaveState {
  return migrateRawToSaveState({ ...g, _v: SAVE_VERSION });
}

export const DEFAULT_STATE: SaveState = {
  _v: SAVE_VERSION,
  gold: 0,
  lifetimeGoldEarned: 0,
  goldStreak: 0,
  bestGoldStreak: 0,
  hexBalance: 0,
  hexRewardStreak: 0,
  bestHexRewardStreak: 0,
  speedUpgradeLevel: 0,
  autoRollUpgradeLevel: 0,
  multiplierUpgradeLevel: 0,
  streakRetentionUpgradeLevel: 0,
  stunUpgradeLevel: 0,
  prestige: 0,
  totalRollCount: 0,
  multipleOfThreeRollCount: 0,
  dice: [[1, 2, 3, 4, 5, 6]],
  totalDieReforgeCount: 0,
  maxReforgeFaceValue: 6,
};

// ── Profile index ──

async function getProfileIndex(): Promise<
  Record<string, { name: string; lastPlayed: number }>
> {
  const raw = readLocalStorageString(PROFILES_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function setProfileIndex(
  index: Record<string, { name: string; lastPlayed: number }>,
): Promise<void> {
  writeLocalStorageString(PROFILES_KEY, JSON.stringify(index));
}

// ── Public API ──

export async function listProfiles(): Promise<
  { id: string; name: string; lastPlayed: number }[]
> {
  const index = await getProfileIndex();
  return Object.entries(index)
    .map(([id, info]) => ({ id, ...info }))
    .sort((a, b) => b.lastPlayed - a.lastPlayed);
}

export async function getActiveProfileId(): Promise<string | null> {
  return readLocalStorageString(ACTIVE_KEY);
}

export async function setActiveProfileId(id: string): Promise<void> {
  writeLocalStorageString(ACTIVE_KEY, id);
}

/** Label used when the player leaves the save name blank. */
export function formatUnnamedSaveLabel(atMs: number = Date.now()): string {
  return `Unnamed save · ${new Date(atMs).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })}`;
}

/** Display name for index rows (handles legacy empty names). */
export function resolveProfileDisplayName(
  name: string | undefined,
  lastPlayed: number,
): string {
  const t = name?.trim();
  if (t) return t;
  return formatUnnamedSaveLabel(lastPlayed);
}

export async function loadProfile(id: string): Promise<SaveState | null> {
  const raw = readLocalStorageString(`nt-save-${id}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown> & { _v?: number };
    const v = parsed._v;

    if (v === 2) {
      return migrateRawToSaveState({
        ...parsed,
        hexBalance: 0,
        hexRewardStreak: 0,
        bestHexRewardStreak: 0,
      });
    }

    if (v === 3 || v === 4 || v === SAVE_VERSION) {
      return migrateRawToSaveState(parsed);
    }

    return null;
  } catch {
    return null;
  }
}

/** Write snapshot to disk. When `setActive` is false, active profile id is unchanged. */
export async function persistProfileSnapshot(
  id: string,
  name: string,
  state: SaveState,
  setActive: boolean,
): Promise<void> {
  const index = await getProfileIndex();
  index[id] = { name, lastPlayed: Date.now() };
  await setProfileIndex(index);
  writeLocalStorageString(
    `nt-save-${id}`,
    JSON.stringify({ ...state, _v: SAVE_VERSION }),
  );
  if (setActive) {
    await setActiveProfileId(id);
  }
}

export async function saveProfile(
  id: string,
  name: string,
  state: SaveState,
): Promise<void> {
  await persistProfileSnapshot(id, name, state, true);
}

export async function createProfile(
  optionalDisplayName?: string,
): Promise<{ id: string; name: string }> {
  const trimmed = optionalDisplayName?.trim();
  const name =
    trimmed && trimmed.length > 0 ? trimmed : formatUnnamedSaveLabel();
  const id = makeId();
  await persistProfileSnapshot(id, name, DEFAULT_STATE, true);
  return { id, name };
}

/** Clone disk state into a new slot without activating it (caller can switch). */
export async function duplicateProfile(
  sourceId: string,
  optionalDisplayName?: string,
): Promise<{ id: string; name: string; state: SaveState } | null> {
  const state = await loadProfile(sourceId);
  if (!state) return null;
  const index = await getProfileIndex();
  const sourceName = resolveProfileDisplayName(
    index[sourceId]?.name,
    index[sourceId]?.lastPlayed ?? Date.now(),
  );
  const trimmed = optionalDisplayName?.trim();
  const name = trimmed && trimmed.length > 0 ? trimmed : `${sourceName} (copy)`;
  const id = makeId();
  await persistProfileSnapshot(id, name, state, false);
  return { id, name, state };
}

export async function deleteProfile(id: string): Promise<void> {
  const index = await getProfileIndex();
  delete index[id];
  await setProfileIndex(index);
  removeLocalStorageItem(`nt-save-${id}`);
  const activeId = await getActiveProfileId();
  if (activeId === id) {
    const remaining = Object.entries(index).sort(
      (a, b) => b[1].lastPlayed - a[1].lastPlayed,
    );
    if (remaining.length > 0) {
      await setActiveProfileId(remaining[0][0]);
    } else {
      removeLocalStorageItem(ACTIVE_KEY);
    }
  }
}

export async function renameProfile(
  id: string,
  newName: string,
): Promise<void> {
  const index = await getProfileIndex();
  if (index[id]) {
    index[id].name = newName;
    await setProfileIndex(index);
  }
}

export type BootResult = { id: string; name: string; state: SaveState };

let bootSingleFlight: Promise<BootResult> | null = null;

/** Single-flight so React StrictMode / overlapping calls do not double-create profiles. */
export function boot(): Promise<BootResult> {
  if (!bootSingleFlight) {
    bootSingleFlight = executeBoot().finally(() => {
      bootSingleFlight = null;
    });
  }
  return bootSingleFlight;
}

/** Pick the most recently played loadable profile, or create a fresh unnamed save. */
export async function resolvePlayableSession(): Promise<BootResult> {
  const profiles = await listProfiles();
  for (const p of profiles) {
    const state = await loadProfile(p.id);
    if (state) {
      await setActiveProfileId(p.id);
      return { id: p.id, name: p.name, state };
    }
  }

  const { id, name } = await createProfile();
  return { id, name, state: DEFAULT_STATE };
}

async function executeBoot(): Promise<BootResult> {
  return resolvePlayableSession();
}

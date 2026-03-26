// Save/load system using window.storage

export const SAVE_VERSION = 2;

export interface SaveProfile {
  name: string;
  id: string;
  lastPlayed: number; // timestamp
  state: SaveState;
}

export interface SaveState {
  _v: number; // save version
  gold: number;
  earned: number;
  streak: number;
  best: number;
  sLv: number;
  aLv: number;
  mLv: number;
  rLv: number;
  tLv: number;
  prestige: number;
  rolls: number;
  threes: number;
  dice: number[][];
  totalReforges: number;
  reforgeCap: number;
}

const PROFILES_KEY = "nt-profiles";
const ACTIVE_KEY = "nt-active";

declare global {
  interface Window {
    storage?: {
      get(key: string, shared?: boolean): Promise<{ key: string; value: string; shared: boolean } | null>;
      set(key: string, value: string, shared?: boolean): Promise<{ key: string; value: string; shared: boolean } | null>;
      delete(key: string, shared?: boolean): Promise<{ key: string; deleted: boolean; shared: boolean } | null>;
      list(prefix?: string, shared?: boolean): Promise<{ keys: string[]; prefix?: string; shared: boolean } | null>;
    };
  }
}

async function storageGet(key: string): Promise<string | null> {
  try {
    if (!window.storage) return null;
    const result = await window.storage.get(key);
    return result?.value ?? null;
  } catch {
    return null;
  }
}

async function storageSet(key: string, value: string): Promise<boolean> {
  try {
    if (!window.storage) return false;
    const result = await window.storage.set(key, value);
    return result !== null;
  } catch {
    return false;
  }
}

async function storageDel(key: string): Promise<boolean> {
  try {
    if (!window.storage) return false;
    const result = await window.storage.delete(key);
    return result?.deleted ?? false;
  } catch {
    return false;
  }
}

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function extractSaveState(g: Record<string, unknown>): SaveState {
  return {
    _v: SAVE_VERSION,
    gold: g.gold as number,
    earned: g.earned as number,
    streak: g.streak as number,
    best: g.best as number,
    sLv: g.sLv as number,
    aLv: g.aLv as number,
    mLv: g.mLv as number,
    rLv: g.rLv as number,
    tLv: g.tLv as number,
    prestige: g.prestige as number,
    rolls: g.rolls as number,
    threes: g.threes as number,
    dice: (g.dice as number[][] | undefined) ?? [[1, 2, 3, 4, 5, 6]],
    totalReforges: (g.totalReforges as number | undefined) ?? 0,
    reforgeCap: (g.reforgeCap as number | undefined) ?? 6,
  };
}

export const DEFAULT_STATE: SaveState = {
  _v: SAVE_VERSION,
  gold: 0, earned: 0, streak: 0, best: 0,
  sLv: 0, aLv: 0, mLv: 0, rLv: 0, tLv: 0,
  prestige: 0, rolls: 0, threes: 0,
  dice: [[1, 2, 3, 4, 5, 6]], totalReforges: 0, reforgeCap: 6,
};

// ── Profile index ──

async function getProfileIndex(): Promise<Record<string, { name: string; lastPlayed: number }>> {
  const raw = await storageGet(PROFILES_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

async function setProfileIndex(index: Record<string, { name: string; lastPlayed: number }>): Promise<void> {
  await storageSet(PROFILES_KEY, JSON.stringify(index));
}

// ── Public API ──

export async function listProfiles(): Promise<{ id: string; name: string; lastPlayed: number }[]> {
  const index = await getProfileIndex();
  return Object.entries(index)
    .map(([id, info]) => ({ id, ...info }))
    .sort((a, b) => b.lastPlayed - a.lastPlayed);
}

export async function getActiveProfileId(): Promise<string | null> {
  return storageGet(ACTIVE_KEY);
}

export async function setActiveProfileId(id: string): Promise<void> {
  await storageSet(ACTIVE_KEY, id);
}

export async function loadProfile(id: string): Promise<SaveState | null> {
  const raw = await storageGet(`nt-save-${id}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SaveState;
    if (!parsed._v || parsed._v !== SAVE_VERSION) return null; // incompatible version
    return parsed;
  } catch { return null; }
}

export async function saveProfile(id: string, name: string, state: SaveState): Promise<void> {
  const index = await getProfileIndex();
  index[id] = { name, lastPlayed: Date.now() };
  await setProfileIndex(index);
  await storageSet(`nt-save-${id}`, JSON.stringify(state));
  await setActiveProfileId(id);
}

export async function createProfile(name: string): Promise<string> {
  const id = makeId();
  await saveProfile(id, name, DEFAULT_STATE);
  return id;
}

export async function deleteProfile(id: string): Promise<void> {
  const index = await getProfileIndex();
  delete index[id];
  await setProfileIndex(index);
  await storageDel(`nt-save-${id}`);
  const activeId = await getActiveProfileId();
  if (activeId === id) {
    // Switch to most recent remaining, or clear
    const remaining = Object.entries(index).sort((a, b) => b[1].lastPlayed - a[1].lastPlayed);
    if (remaining.length > 0) {
      await setActiveProfileId(remaining[0][0]);
    } else {
      await storageDel(ACTIVE_KEY);
    }
  }
}

export async function renameProfile(id: string, newName: string): Promise<void> {
  const index = await getProfileIndex();
  if (index[id]) {
    index[id].name = newName;
    await setProfileIndex(index);
  }
}

// Boot: find or create the active profile
export async function boot(): Promise<{ id: string; name: string; state: SaveState }> {
  let activeId = await getActiveProfileId();

  if (activeId) {
    const state = await loadProfile(activeId);
    const index = await getProfileIndex();
    if (state && index[activeId]) {
      return { id: activeId, name: index[activeId].name, state };
    }
  }

  // No valid active profile — find most recent or create default
  const profiles = await listProfiles();
  if (profiles.length > 0) {
    const top = profiles[0];
    const state = await loadProfile(top.id);
    if (state) {
      await setActiveProfileId(top.id);
      return { id: top.id, name: top.name, state };
    }
  }

  // Nothing exists — create default
  const id = await createProfile("Default");
  return { id, name: "Default", state: DEFAULT_STATE };
}

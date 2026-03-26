export interface DiceTier {
  sides: number;
  name: string;
  cost: number;
}
export interface SpeedTier {
  ms: number;
  name: string;
  cost: number;
}
export interface AutoTier {
  ms: number | null;
  name: string;
  cost: number;
}
export interface MultiTier {
  x: number;
  cost: number;
}
export interface StreakRetentionTier {
  /** Percent of gold streak preserved when a multiple-of-3 is rolled. */
  pct: number;
  cost: number;
}
export interface StunTier {
  ms: number;
  name: string;
  cost: number;
}

export type UpgradeType = "speed" | "auto" | "multi" | "retention" | "stun";
export type TabId = "roll" | "shop" | "forge" | "log";

// Each die is an array of face values
export type Die = number[];

// Full dice state
export interface DiceState {
  dice: Die[]; // array of dice, each is array of face values
  totalReforges: number;
  reforgeCap: number; // max value a face can be reforged to (starts 6)
}

export interface GameState {
  gold: number;
  earned: number;
  streak: number;
  best: number;
  roll: number | null;
  rolling: boolean;
  cooldown: boolean;
  stunned: boolean;
  stunPct: number;
  cdPct: number;
  sLv: number;
  aLv: number;
  mLv: number;
  rLv: number;
  tLv: number;
  prestige: number;
  rolls: number;
  threes: number;
  shook: boolean;
  flash: string | null;
  tab: TabId;
  log: string[];
  started: boolean;
}

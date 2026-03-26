# NEVER THREE — Architecture Guide

## Tech Stack

- **TypeScript** with strict mode
- **React** (JSX, hooks only, no class components)
- **Vite** for dev server and production builds
- **Chakra UI v3** + **Emotion** for layout primitives, design tokens, and global styles (`src/theme/system.ts`)

## Build

```bash
cd never-three
npm install          # first time only
npm run dev          # Vite dev server with HMR
npm run build        # tsc --noEmit, then vite build → dist/
npm run preview      # serve dist/ locally
```

## File Structure

```
src/
├── main.tsx              # Vite entry: mounts React root + Chakra provider
├── app/
│   └── App.tsx           # NeverThree root: shell + tab routing
├── game/
│   ├── types.ts          # Tab, die, upgrade, save-related types
│   ├── constants.ts      # Upgrade tables, costs, fmt, reforge math
│   ├── format-gold.ts    # Header gold abbreviation helper
│   ├── atoms/            # Jotai primitive + derived atoms
│   ├── useGameSurface.ts # Composes hooks → props + actions for App
│   ├── useDiceRoll.ts    # Roll pipeline (atom hooks + ref for timeouts)
│   ├── usePurchaseUpgrade.ts, usePrestige.ts, useIncrementDieFace.ts, …
│   ├── useGameLoop.ts    # Auto-roll chain + cooldown/stun RAF progress
│   └── saves.ts          # Save/load (artifact storage; optional UI later)
├── features/
│   ├── roll/             # Roll screen
│   │   ├── RollTab.tsx
│   │   ├── RollBadges.tsx
│   │   ├── RollFeedback.tsx
│   │   └── AutoRollCountdown.tsx
│   ├── shop/
│   │   ├── ShopTab.tsx
│   │   └── UpgradeButton.tsx
│   ├── forge/
│   │   ├── ForgeTab.tsx
│   │   ├── ForgeDieSection.tsx
│   │   ├── ReforgeFaceRow.tsx
│   │   └── ForgeFooter.tsx
│   └── log/
│       └── LogTab.tsx
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx
│   │   ├── FlashOverlay.tsx
│   │   ├── BottomDock.tsx
│   │   ├── DockRollZone.tsx
│   │   └── DockTabBar.tsx
│   └── dice/
│       └── DiceFace.tsx
├── providers/
│   └── AppProviders.tsx
├── theme/
│   └── system.ts
└── DevSaveManager.tsx    # Dev save UI (unused in main app)
```

Feature folders own one screen each; shared chrome lives under `components/`. Domain rules and persistence live under `game/`.

## State Architecture

Game state lives in **Jotai atoms** (`src/game/atoms/`). `useGameSurface()` composes `useAtomValue` / `useSetAtom` with small action hooks and returns a flat object for `App.tsx`:

- **State values**: gold, hex, streaks, levels, dice, UI flags
- **Derived atoms**: multipliers, `rollPhase` / `gameLocked`, prestige gates
- **Actions**: `rollDice`, `purchaseUpgrade`, `commitPrestige`, `incrementDieFace`, `decrementDieFace`, `setTab`

Components are pure renderers — they receive props and call actions.
No component has its own game state.

### Key State Groups

**Economy**: gold, earned, hex, streak, hexStreak, best, bestHexStreak
**Upgrade levels**: sLv, aLv, mLv, rLv, tLv (speed, auto, multi, armor, stun)
**Dice**: dice (Die[][]), totalReforges, reforgeCap, currentDie (derived)
**UI/Animation**: roll, rolling, cooldown, stunned, stunPct, cdPct, autoPct, flash, shook, saved
**Meta**: prestige, rolls, threes, tab, log, started

### Roll Flow

1. `rollDice()` called (tap or auto-roll)
2. Lock set, cooldown starts, rolling animation plays
3. Random face picked from `currentDie`
4. If dangerous (face % 3 === 0):
   - Armor check → if blocked, award gold, continue streak
   - Otherwise: award hex (scaled by hex streak), break gold streak, start stun timer
5. If safe: award gold (scaled by gold streak), break hex streak
6. Cooldown timer starts
7. When cooldown ends → if auto-roll enabled, auto-roll delay starts → chain continues

### Auto-Roll Architecture

Auto-roll is NOT an interval. It's a chained timeout:

- Cooldown/stun ends → `locked` becomes false
- Effect detects `!locked && autoMs !== null` → starts setTimeout for autoMs
- Timeout fires → calls `rollDice()` → new cooldown starts → cycle repeats

This means auto-roll delay is ADDITIVE with cooldown. Total time between
rolls = cooldown + auto delay. Both are independently upgradeable.

### Reforge Cost Model

```
cost = REFORGE_BASE × max(current, target) × (1 + totalReforges × 0.15)
if escaping a multiple of 3: cost × 4
```

## Design Principles

1. **Mobile-first**: Die and tabs at bottom (thumb zone), content scrolls in middle
2. **Always progressing**: Safe rolls earn gold, dangerous rolls earn hex. No dead time.
3. **Readable at a glance**: Three visual states for everything (active/inactive/maxed)
4. **Focused dependencies**: UI via Chakra only; no extra state libraries
5. **Fast iteration**: TypeScript catches errors, Vite dev server + HMR

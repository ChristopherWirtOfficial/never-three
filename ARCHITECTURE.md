# NEVER THREE — Architecture Guide

## Tech Stack
- **TypeScript** with strict mode
- **React** (JSX, hooks only, no class components)
- **esbuild** for bundling to single-file JSX artifact
- No external UI libraries — all inline styles

## Build
```bash
cd never-three
npm install          # first time only
bash build.sh        # typechecks via tsc, bundles via esbuild
# Output: dist/never-three.jsx
```

Build takes ~50ms. The output is a single ESM file with `export default`
that React artifact renderers can consume directly. JSX is preserved
(not compiled to createElement) because the artifact runtime handles it.

## File Structure

```
src/
├── index.tsx          # Root component, layout shell, tab routing
├── useGameState.ts    # All game state + logic in one hook
├── constants.ts       # Upgrade tables, cost functions, helpers
├── types.ts           # Shared TypeScript interfaces
├── styles.ts          # Global CSS keyframes
│
├── RollTab.tsx        # Roll screen: feedback, auto-roll countdown, stats
├── ShopTab.tsx        # Gold upgrade shop
├── ForgeTab.tsx       # Hex-powered die face reforging
├── LogTab.tsx         # Roll history log
│
├── BottomDock.tsx     # Die display, cooldown/stun bars, tab navigation
├── DiceFace.tsx       # Visual die face renderer (dots for d6, numbers otherwise)
├── UpgradeButton.tsx  # Reusable shop button with 3-state styling
│
├── saves.ts           # Save/load system (currently unused, preserved for later)
└── DevSaveManager.tsx # Dev save profile UI (currently unused, preserved for later)
```

## State Architecture

All game state lives in `useGameState()`. It returns a flat object with:
- **State values**: gold, hex, streaks, levels, dice, UI flags
- **Derived values**: computed costs, multipliers, lock states
- **Actions**: doRoll, buy, reforgeUp, reforgeDown, doPrestige, setTab

Components are pure renderers — they receive props and call actions.
No component has its own game state.

### Key State Groups

**Economy**: gold, earned, hex, streak, hexStreak, best, bestHexStreak
**Upgrade levels**: sLv, aLv, mLv, rLv, tLv (speed, auto, multi, armor, stun)
**Dice**: dice (Die[][]), totalReforges, reforgeCap, currentDie (derived)
**UI/Animation**: roll, rolling, cooldown, stunned, stunPct, cdPct, autoPct, flash, shook, saved
**Meta**: prestige, rolls, threes, tab, log, started

### Roll Flow
1. `doRoll()` called (tap or auto-roll)
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
- Timeout fires → calls doRoll() → new cooldown starts → cycle repeats

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
4. **Minimal dependencies**: No state management libraries, no CSS frameworks
5. **Fast iteration**: TypeScript catches errors, esbuild bundles instantly

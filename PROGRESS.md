# NEVER THREE — Progress Log

## What's Done

### Phase 1: Core Danger Rule ✅

- Multiples of 3 are dangerous (not just 3 itself)
- On a d6, both 3 and 6 stun — 33% danger rate
- Removed old "dice type" upgrade (d6→d8→d20) since it trivialized danger

### Phase 2: Reforging ✅

- Forge tab with per-face +1/-1 controls
- Cost scales with face value × total reforges
- 4× premium to escape a multiple of 3
- Reforge down also costs hex (no free moves)
- Die faces are actual game state — rolls draw from real faces
- Data model supports multiple dice (array of arrays) for future Phase 5
- Reforge cap at 6 (will be raisable via Hex shop later)

### Phase 3: Hex Resource ✅

- Hex earned from dangerous rolls, scaled by hex streak
- Two-streak system: gold streak (safe) and hex streak (danger) mirror each other
- Hex displayed in header alongside gold
- Hex streak shown when active
- Reforging costs Hex (not gold)
- Prestige resets Hex

### Infrastructure ✅

- TypeScript project with Vite
- `npm run dev` / `npm run build` (Vite + `tsc --noEmit`)
- Component architecture: 9 source files, clean separation
- Git repo with meaningful commits

### UX Polish ✅

- Mobile-first layout with bottom-anchored die and tabs
- Tap anywhere in die row to roll
- Three-state upgrade buttons (affordable/unaffordable/maxed) all legible
- Stun bar visible on all tabs (lives in bottom dock)
- Auto-roll countdown on roll screen
- Auto-roll chains off cooldown (not blind interval)
- Screen shake on danger, color flash on all outcomes
- Die face dots render for d6 values

---

## What's Not Done

### Phase 4: Hex Shop

- Reforge cap increase (6 → 7+)
- Hex multi
- Permanent stun reduction
- New tab or section in existing shop

### Phase 5: Multiple Dice + Sum Rule

- Buy additional dice (gold upgrade)
- Each die rolls independently
- Sum of all dice also checked for multiples of 3
- Gold = sum of safe dice (if any die is dangerous, zero gold)
- Visual display of multiple dice
- Each new die needs its own reforging

### Phase 6: Prestige Rework

- Hex threshold gates prestige access
- Prestige currency system
- What persists vs resets
- Prestige rewards

### Save System

- Was implemented, hit issues with artifact storage API
- Code exists in saves.ts and DevSaveManager.tsx (not imported)
- Versioned save format (SAVE_VERSION = 2)
- Profile management UI was built
- Needs debugging — probably storage API availability in artifact context
- Recommend reimplementing once on real dev tools

### Known Issues / Polish Needed

- Balance is intentionally undertuned — costs may be too cheap
- Forge tab could be more visual / show preview of danger probability
- Roll screen die badge ([1,2,3,4,5,6] 💀2) could be prettier
- No tutorial or onboarding beyond 3-line hint
- Gold formatting is inlined in App.tsx instead of using fmt()
- Log tab could show hex earnings
- No haptic feedback / sound

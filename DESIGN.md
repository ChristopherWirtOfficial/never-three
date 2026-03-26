# NEVER THREE — Game Design Document

## Elevator Pitch

An incremental idle dice game where you roll dice and earn gold — unless you
roll a multiple of 3, which stuns you. The twist: getting stunned earns you
**Hex**, a second resource you spend to **reforge** your die faces. The entire
game is about managing the tension between wanting safe rolls (gold) and
needing dangerous rolls (hex).

---

## Core Mechanics

### Rolling
- You have dice with customizable faces (start: 1d6 with {1,2,3,4,5,6})
- Each roll picks a random face from your die
- Safe rolls (face NOT a multiple of 3): earn gold, build gold streak
- Dangerous rolls (face IS a multiple of 3): earn hex, build hex streak, get stunned

### Danger Rules (Current: Single Die)
A roll is dangerous if the face value is a multiple of 3.

### Danger Rules (Future: Multiple Dice)
A roll is dangerous if ANY of:
- Any individual die shows a multiple of 3
- The SUM of all dice is a multiple of 3

If dangerous: zero gold, entire roll is a loss. Stun applies.

### Two Streaks
| | Gold Streak | Hex Streak |
|---|---|---|
| Built by | Safe rolls | Dangerous rolls |
| Broken by | Dangerous rolls | Safe rolls |
| Multiplies | Gold income | Hex income |
| Scaling | 1 + √(streak) × 0.25 | 1 + √(streak) × 0.3 |

There is no wasted roll. Bad luck farms Hex. Good luck farms Gold.

---

## Resources

### Gold
- Earned from safe rolls: face_value × streak_mult × gold_multi × prestige_mult
- Spent in the **Shop** on speed, auto-roll, gold multi, armor, stun recovery

### Hex
- Earned from dangerous rolls: HEX_BASE × hex_streak_mult
- Spent in the **Forge** to reforge die faces
- Future: also spent in a Hex Shop for meta-upgrades (reforge cap, etc.)
- Future: threshold required to access Prestige

---

## Reforging

### How It Works
- Each die face can be reforged +1 or -1
- Both directions cost Hex
- Cost = REFORGE_BASE × max(current, target) × (1 + totalReforges × 0.15)
- **Escaping a multiple of 3 costs 4× the base price** (the "danger escape premium")
- Face floor: 1. Face cap: 6 (raisable via future Hex upgrades)

### The Danger Gauntlet
To reforge a 2 up to a 5, you must pass through 3:
- 2 → 3: normal cost (entering danger)
- 3 → 4: **4× cost** (escaping danger)
- 4 → 5: normal cost

To reach 7 (once cap is raised), you pass through 6:
- 5 → 6: normal cost
- 6 → 7: **4× cost**

This means reforging is a strategic commitment, not just "buy upgrade."

### Strategic Implications
- All-5s die: no individual danger, but with multiple dice 5+5+5=15 (dangerous!)
- All-7s die: safe individually, but 7+7+7=21 (dangerous!)
- You can reforge DOWN to reposition, but it costs hex too
- Can never fully escape sum danger with multiple dice

---

## The Farming Inversion (Key Design Moment)

This is the soul of the game:

1. **Early game**: Multiples of 3 are terrifying. You reforge away from them ASAP.
2. **Mid game**: You're safe, printing gold, but Hex-starved.
3. **Late game**: You NEED Hex for more reforges / prestige. You deliberately:
   - Stop reforging new dice (keep them dangerous)
   - Add MORE dice (more hex sources)
   - Maybe reforge faces BACK to multiples of 3
   - Accept stun cost as the price of progress

**Fear → safety → voluntarily returning to danger.**

---

## Upgrade Paths

### Gold Shop (resets on prestige)
| Upgrade | Tiers | Range | Notes |
|---|---|---|---|
| Gold Multi | 7 | ×1 → ×100 | First and cheapest buy |
| Roll Speed | 6 | 2.0s → 0.35s | Manual tap cooldown |
| Auto-Roll | 7 | Off → Instant | Chains after cooldown ends |
| Stun Recovery | 6 | 3.0s → 0.3s | Time locked after danger |
| Streak Armor | 6 | 0% → 50% | Chance to survive danger |

### Forge (costs Hex)
- Per-face reforging (+1/-1)
- Costs scale with total reforges and face value
- 4× premium to escape multiples of 3

### Future: Hex Shop (persists through prestige)
- Reforge cap increase (6 → 7 → 8...)
- Hex multi
- Permanent stun reduction
- TBD

### Future: Prestige
- Requires Hex threshold to access
- Resets: gold, gold upgrades, reforges, dice
- Keeps: Hex shop upgrades
- Awards: prestige currency (scaled by total Hex)

---

## Multiple Dice (Future — Phase 5)

- Unlocked as late pre-prestige gold upgrade
- Each new die starts as stock {1,2,3,4,5,6}
- Gold = sum of ALL dice (if safe) × streak × multi
- If ANY die is dangerous OR sum is multiple of 3: zero gold, full stun
- More dice = higher gold ceiling but exponentially more danger
- Each new die needs its own reforge investment
- First run: max 2-3 dice. More via prestige.

---

## Open Design Questions

1. Hex shop contents beyond reforge cap
2. Prestige currency and what it buys
3. Multiple dice visual display on mobile
4. Target first-run length (currently feels like ~5-10 min to meaningful progress)
5. Should bigger base dice (d8, d10) exist as prestige rewards?
6. Hex streak armor (survive a safe roll without breaking hex streak)?
7. Sum danger visual feedback with multiple dice

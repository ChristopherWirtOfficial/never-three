# NEVER THREE — Design Document v2.1

## Core Loop

Roll dice. Earn **Gold** from safe rolls. Get **stunned** by dangerous rolls
but earn **Hex** instead. Both resources have upgrade paths. You need a
Hex threshold to unlock prestige.

---

## Danger Rules

A roll is **dangerous** if ANY of these are true:
- Any **individual die** shows a multiple of 3
- The **sum of all dice** is a multiple of 3

A dangerous roll:
- **Zero gold** — the entire roll awards nothing, even if some dice were safe
- **Breaks gold streak** (resets to 0)
- **Stuns** you (time penalty, upgradeable)
- **Awards Hex** — scaled by a separate "hex streak" (consecutive dangerous rolls)

A safe roll:
- Awards gold = sum of ALL dice faces × gold streak multiplier × gold multi
- Increments gold streak
- **Breaks hex streak** (resets to 0)

---

## Two Streaks

| | Gold Streak | Hex Streak |
|---|---|---|
| Incremented by | Safe rolls | Dangerous rolls |
| Broken by | Dangerous rolls | Safe rolls |
| Multiplies | Gold income | Hex income |
| Scaling | √(streak) × 0.25 | Same formula TBD |

A string of bad luck is GOOD for Hex farming. A string of good luck is
GOOD for gold. There is no wasted roll.

---

## Dice & Faces

Start with **1d6**, faces {1, 2, 3, 4, 5, 6}.

### Reforging

- **+1**: Costs gold, escalating per step on that face
- **-1**: Cheap or free (allows strategic repositioning)
- Must pass through dangerous values:
  - 2 → **3** → 4 → 5 → **6** → 7 (if cap allows)
- **Reforge cap**: starts at 6, can be raised (Hex upgrade)
  - Cap 6: faces can be 1–6
  - Cap 7: faces can be 1–7 (first safe ceiling above 6)
  - Cap 8+: further Hex upgrades

### What makes this interesting
- Pushing 2→7 means temporarily sitting on 3, then 6
  (your die is MORE dangerous mid-reforge)
- All-5s die: safe individually, but 5+5=10 (safe), 5+5+5=15 (DANGEROUS)
- All-7s die: safe individually, but 7+7=14 (safe), 7+7+7=21 (DANGEROUS)
- Reforging down is free/cheap: undo mistakes, adapt strategy
- Can't escape sum danger with multiple dice — math always catches up

---

## Multiple Dice

Unlocked as late pre-prestige gold upgrade. Each new die is stock {1,2,3,4,5,6}.

### Gold calculation (safe rolls only)
Sum of ALL dice × streak mult × gold multi.
If ANY die is dangerous OR sum is multiple of 3: zero gold, full stun.

### Risk scaling
- 1 die: ~33% danger on stock d6
- 2 dice: individual danger + sum danger compounds
- More dice = higher gold ceiling but exponentially more danger
- Reforging each new die is a whole new gold sink

### First run: max 2-3 dice. More slots available via prestige.

---

## Hex — Secondary Resource

### Earned from
Dangerous rolls only. Scaled by hex streak (consecutive fails).

### Hex income formula (TBD balance)
Base hex × hex streak mult × hex multi.
Maybe bonus for number of individual dice that showed multiples of 3
(incentivizes keeping dangerous faces across many dice).

### Hex is spent on TWO things:

**1. Hex Shop (~4-5 upgrades, ~20% the size of Gold Shop)**
- Reforge cap increase (6 → 7 → 8 → ...)
- Hex multi (more hex per dangerous roll)
- Permanent stun reduction (persists through prestige)
- Maybe: starting reforge level for new dice
- Maybe: hex streak armor

**2. Prestige gate**
- Need a Hex THRESHOLD to access prestige (not spent, just reached)
- Once unlocked, prestiging awards prestige currency
- More lifetime Hex = more prestige currency on reset

---

## Upgrade Paths Summary

### Gold Shop (resets on prestige)
- Roll Speed (2s → 0.35s)
- Stun Recovery (5s → 0.6s)
- Gold Multi
- Streak Armor (% to survive danger)
- Reforge (per-face, +1/-1)
- Extra Dice (late-game)

### Hex Shop (persists through prestige)
- Reforge Cap (6 → 7 → 8...)
- Hex Multi
- Permanent Stun Reduction
- ~1-2 more TBD

### Prestige
- Requires Hex threshold to access
- Resets: gold, gold upgrades, reforges, dice
- Keeps: Hex shop upgrades
- Awards: prestige currency (scaled by total Hex)
- Prestige currency buys: TBD (phase 5+)

---

## The Farming Inversion (Key Design Moment)

Early game: 3s are terrifying. You reforge away from them ASAP.
Mid game: You're safe, printing gold, but Hex-starved.
Late game: You NEED Hex to prestige. You deliberately:
  - Stop reforging new dice (keep them dangerous)
  - Add MORE dice (more Hex sources)
  - Reforge faces BACK to multiples of 3
  - Accept stun cost as the price of progress

Fear → safety → voluntarily returning to danger. That's the hook.

---

## Open Questions

1. Hex streak scaling formula — same √ as gold? flatter? steeper?
2. Hex income — base amount? proportional to how many 3-multiples hit?
3. Prestige currency and what it buys (punt to phase 6)
4. Reforge UI on mobile — tap face, +1/-1 buttons? face picker?
5. Multi-dice visual display — grid? row? stack?
6. Target first-run length: 15 min? 30 min? 1 hr?

---

## Implementation Phases

**Phase 1**: Multiples-of-3 danger rule (replaces single-3 check)
**Phase 2**: Reforging system (+1/-1, cap 6, per-face costs)
**Phase 3**: Hex resource + hex streak + header display
**Phase 4**: Hex shop (3-4 upgrades incl. reforge cap)
**Phase 5**: Multiple dice + sum rule + visual display
**Phase 6**: Prestige rework (Hex threshold gate)

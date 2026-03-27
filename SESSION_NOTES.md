# NEVER THREE — Design Session Notes

These are key decisions and design insights from the initial prototyping
session, preserved for context. The game was designed collaboratively
through rapid iteration.

---

## Origin

Started as "roll dice, don't get a 3." The first prototype was a simple
incremental idle game where rolling a 3 was the only danger. This was
identified as too bland — buying bigger dice (d8, d20) just reduced the
danger probability and trivialized the game.

## Key Pivot: Multiples of 3

Instead of just 3, ALL multiples of 3 are dangerous. This means on any
size die, roughly 1/3 of outcomes are dangerous. Bigger dice no longer
cheese the risk — they yield more piplets per safe roll but the danger
ratio stays constant.

This created the need for a new upgrade path that isn't "buy bigger die."

## The Reforging Insight

Instead of changing the die size, you change what the faces SAY.
Reforging a face +1 lets you move it away from dangerous values. But
to go from 2 to 5, you must pass through 3. To go from 5 to 7, you
must pass through 6.

**The danger gauntlet**: every reforge path to safety passes through
danger. This creates a commitment/risk dynamic that's absent in most
incremental games.

### Reforge Down Through Danger
Going down is also strategic. If you're at 7 and want to be at 5, you
pass through 6. Going down is NOT free — it costs hex, and escaping
from 6 costs 4× the base price. This prevents casual repositioning
and makes every reforge a considered decision.

## The Two-Resource System

**Piplets** = earned from safe rolls. Spent on speed, auto-roll, multipliers.
Traditional incremental progression.

**Hex** = earned from dangerous rolls. Spent on reforging (the core
strategic mechanic). This was the critical design decision — making the
"punishment" resource also the "progression" resource.

### Why Hex Works
- Early game: danger is just punishment, hex accumulates passively
- Mid game: you've reforged away danger, piplets flow, but hex dries up
- Late game: you NEED hex and must deliberately court danger to get it
- This creates the "farming inversion" — the emotional relationship
  with danger flips over the course of a run

## The Two-Streak System

Piplet streak builds on consecutive safe rolls. Hex streak builds on
consecutive dangerous rolls. Each breaks the other.

This means a bad luck streak isn't wasted — it's GOOD for hex farming.
And a good luck streak is great for piplets. There are no dead rolls.

## Auto-Roll Design

Early version used setInterval which caused missed rolls when the timer
fired during cooldown. Redesigned to chain timeouts off cooldown
completion:

```
cooldown ends → auto delay starts → auto delay fires → roll → cooldown starts → repeat
```

Auto-roll delay is additive with cooldown, both independently upgradeable.
This feels more responsive and never wastes a cycle.

## Balance Philosophy

The game was intentionally undertuned during prototyping. Early upgrades
are very cheap (×2 multi costs about 5 piplets — roughly 2 taps) so the player feels
immediate progression. The philosophy: make it too easy first, then
tighten. The player should never feel stuck in the first 30 seconds.

Starting stun was reduced from 5s to 3s because at 33% danger rate,
you're getting stunned every ~3 rolls and a 5s stun felt miserable.

## Mobile-First UX Decisions

1. **Die at bottom**: thumb zone. Originally centered, moved to bottom
   dock after mobile testing showed it was uncomfortably far to reach.

2. **Whole row tappable**: not just the die visual — the entire bottom
   strip is a tap target.

3. **Stun bar in dock**: originally lived in RollTab, but was invisible
   on shop/forge tabs. Moved to BottomDock so it's always visible.

4. **Status badges**: replaced flat text line with pill badges on roll
   screen — easier to scan at a glance on small screens.

5. **Contrast**: went through multiple rounds of brightness increases.
   Dark theme on mobile screens requires higher contrast than expected.
   Ended up with #44ffbb green, #efae38 piplet accent (warm amber), #bb88ff purple.

## Future Design Ideas Discussed

### Multiple Dice + Sum Rule
Buy additional dice. Piplets = sum of all dice. But if ANY individual die
shows a multiple of 3, OR the sum is a multiple of 3, the entire roll
is dangerous. This means you can never fully engineer away danger with
multiple dice — the sum rule creates irreducible combinatorial risk.

### Hex Shop (Meta Layer)
Hex buys not just reforging but also meta-upgrades:
- Reforge cap increase (6 → 7 lets you reach safe values above 6)
- Hex multiplier
- Permanent stun reduction

### Prestige
Requires Hex threshold to access (not spent, just reached). Resets
piplets, upgrades, reforges, dice. Keeps hex shop upgrades. Awards
prestige currency.

### The Sum Rule and Reforging Interaction
With multiple dice, reforging individual faces to safe values doesn't
eliminate sum danger:
- All-5s across 3 dice: 5+5+5 = 15 (multiple of 3, DANGEROUS)
- All-7s across 3 dice: 7+7+7 = 21 (multiple of 3, DANGEROUS)
- This is the deep endgame puzzle: what face distributions minimize
  BOTH individual and sum danger?

### Deliberate Danger Farming
Late game players might:
- Keep new dice unforged to farm hex
- Reforge faces BACK to multiples of 3
- Stack dice specifically for hex income
- Accept stun cost as business cost of prestige progression

This inversion — where the player voluntarily seeks out the thing they
spent the early game fleeing — is the emotional hook of the game.

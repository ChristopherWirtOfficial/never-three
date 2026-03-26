import { useState, useEffect, useCallback, useRef } from "react";
import { SPEED, AUTO, MULTI, ARMOR, STUN, PRESTIGE_BASE, fmt, streakMultiplier, hexStreakMultiplier, makeDefaultDie, DEFAULT_REFORGE_CAP, reforgeCost } from "./constants";
import type { TabId, UpgradeType, Die } from "./types";

export function useGameState() {
  const [gold, setGold] = useState(0);
  const [earned, setEarned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [hex, setHex] = useState(0);
  const [hexStreak, setHexStreak] = useState(0);
  const [bestHexStreak, setBestHexStreak] = useState(0);
  const [roll, setRoll] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [stunned, setStunned] = useState(false);
  const [stunPct, setStunPct] = useState(0);
  const [cdPct, setCdPct] = useState(0);
  const [sLv, setSLv] = useState(0);
  const [aLv, setALv] = useState(0);
  const [mLv, setMLv] = useState(0);
  const [rLv, setRLv] = useState(0);
  const [tLv, setTLv] = useState(0);
  const [prestige, setPrestige] = useState(0);
  const [rolls, setRolls] = useState(0);
  const [threes, setThrees] = useState(0);
  const [shook, setShook] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<TabId>("roll");
  const [log, setLog] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [autoPct, setAutoPct] = useState(0);

  // Dice state
  const [dice, setDice] = useState<Die[]>([makeDefaultDie()]);
  const [totalReforges, setTotalReforges] = useState(0);
  const [reforgeCap, setReforgeCap] = useState(DEFAULT_REFORGE_CAP);

  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);
  const coolRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stunRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cdStartRef = useRef(0);
  const cdFrameRef = useRef(0);
  const stunStartRef = useRef(0);
  const stunFrameRef = useRef(0);
  const autoStartRef = useRef(0);
  const autoFrameRef = useRef(0);

  // Derived values
  const currentDie = dice[0] ?? makeDefaultDie(); // Phase 2: single die
  const multi = MULTI[mLv].x;
  const armor = ARMOR[rLv].pct;
  const pMult = 1 + prestige * 0.5;
  const cdMs = SPEED[sLv].ms;
  const stunMs = STUN[tLv].ms;
  const autoMs = AUTO[aLv].ms;
  const prestigeReq = PRESTIGE_BASE * Math.pow(2.5, prestige);
  const canPrestige = earned >= prestigeReq;
  const locked = cooldown || stunned || rolling;

  const pushLog = useCallback((m: string) => {
    setLog(p => [m, ...p].slice(0, 60));
  }, []);

  const startStun = useCallback(() => {
    lockRef.current = true;
    setStunned(true);
    setCooldown(false);
    stunStartRef.current = Date.now();
    stunRef.current = setTimeout(() => {
      setStunned(false);
      lockRef.current = false;
    }, stunMs);
  }, [stunMs]);

  const doRoll = useCallback(() => {
    if (lockRef.current) return;
    lockRef.current = true;
    setCooldown(true);
    setRolling(true);
    setSaved(false);
    if (!started) setStarted(true);

    setTimeout(() => {
      const faceIndex = Math.floor(Math.random() * currentDie.length);
      const v = currentDie[faceIndex];
      setRoll(v);
      setRolling(false);
      setRolls(p => p + 1);

      const dangerous = v % 3 === 0;

      if (dangerous) {
        const blocked = Math.random() * 100 < armor;
        if (blocked) {
          // Armor makes it effectively safe
          setSaved(true);
          setFlash("#ffaa00");
          setHexStreak(0); // safe outcome breaks hex streak
          setStreak(s => {
            const e = Math.floor(streakMultiplier(s) * multi * pMult);
            setGold(p => p + e);
            setEarned(p => p + e);
            pushLog(`🛡️ ${v} blocked! +${fmt(e)}g`);
            return s + 1;
          });
          setTimeout(() => setFlash(null), 300);
          cdStartRef.current = Date.now();
          coolRef.current = setTimeout(() => {
            lockRef.current = false;
            setCooldown(false);
          }, cdMs);
        } else {
          // Dangerous! Award hex, break gold streak, stun
          setShook(true);
          setFlash("#ff3355");
          setThrees(p => p + 1);
          setStreak(s => {
            pushLog(`💀 Rolled ${v}! Streak ${s} gone. Stunned ${STUN[tLv].name}`);
            return 0;
          });
          setHexStreak(hs => {
            const hm = hexStreakMultiplier(hs);
            const earned = Math.max(1, Math.floor(hm));
            setHex(p => p + earned);
            const nhs = hs + 1;
            setBestHexStreak(b => Math.max(b, nhs));
            pushLog(`🔮 +${earned} hex${hs > 1 ? ` (×${hm.toFixed(1)} streak)` : ""}`);
            return nhs;
          });
          setTimeout(() => { setShook(false); setFlash(null); }, 400);
          setCooldown(false);
          startStun();
        }
      } else {
        // Safe roll — award gold, break hex streak
        setHexStreak(0);
        setStreak(s => {
          const sm = streakMultiplier(s);
          const e = Math.floor(v * sm * multi * pMult);
          setGold(p => p + e);
          setEarned(p => p + e);
          const ns = s + 1;
          setBest(b => Math.max(b, ns));
          pushLog(`🎲 ${v} → +${fmt(e)}g${s > 2 ? ` (×${sm.toFixed(1)})` : ""}`);
          return ns;
        });
        setFlash("#44ffbb");
        setTimeout(() => setFlash(null), 200);
        cdStartRef.current = Date.now();
        coolRef.current = setTimeout(() => {
          lockRef.current = false;
          setCooldown(false);
        }, cdMs);
      }
    }, 160);
  }, [currentDie, multi, armor, pMult, cdMs, pushLog, startStun, started, tLv]);

  // Cleanup timers
  useEffect(() => () => {
    if (coolRef.current) clearTimeout(coolRef.current);
    if (stunRef.current) clearTimeout(stunRef.current);
  }, []);

  // Reset on speed change
  useEffect(() => {
    lockRef.current = false;
    setCooldown(false);
    setStunned(false);
    if (coolRef.current) clearTimeout(coolRef.current);
    if (stunRef.current) clearTimeout(stunRef.current);
  }, [sLv]);

  // Auto-roll: chains off cooldown/stun completion
  // When locked goes false and auto is enabled, start the auto delay, then roll
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const ms = AUTO[aLv].ms;
    // Clear any pending auto timer
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }

    if (ms === null || !started) {
      setAutoPct(0);
      return;
    }

    // If we're not locked, start the auto-roll countdown
    if (!locked) {
      autoStartRef.current = Date.now();
      if (ms === 0) {
        // Instant: roll on next tick
        autoTimerRef.current = setTimeout(() => {
          autoTimerRef.current = null;
          doRoll();
        }, 10);
      } else {
        autoTimerRef.current = setTimeout(() => {
          autoTimerRef.current = null;
          doRoll();
        }, ms);
      }
    }

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [aLv, locked, started, doRoll]);

  // Auto-roll progress animation
  useEffect(() => {
    const ms = AUTO[aLv].ms;
    if (ms === null || !started || locked) { setAutoPct(0); cancelAnimationFrame(autoFrameRef.current); return; }
    const tick = () => {
      const p = Math.min((Date.now() - autoStartRef.current) / ms, 1);
      setAutoPct(p);
      if (p < 1) autoFrameRef.current = requestAnimationFrame(tick);
    };
    autoFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(autoFrameRef.current);
  }, [aLv, locked, started]);

  // Cooldown bar animation
  useEffect(() => {
    if (cooldown && !stunned) {
      cdStartRef.current = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - cdStartRef.current) / cdMs, 1);
        setCdPct(p);
        if (p < 1) cdFrameRef.current = requestAnimationFrame(tick);
      };
      cdFrameRef.current = requestAnimationFrame(tick);
    } else if (!stunned) {
      setCdPct(0);
      cancelAnimationFrame(cdFrameRef.current);
    }
    return () => cancelAnimationFrame(cdFrameRef.current);
  }, [cooldown, stunned, cdMs]);

  // Stun bar animation
  useEffect(() => {
    if (stunned) {
      stunStartRef.current = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - stunStartRef.current) / stunMs, 1);
        setStunPct(p);
        if (p < 1) stunFrameRef.current = requestAnimationFrame(tick);
        else setStunPct(1);
      };
      stunFrameRef.current = requestAnimationFrame(tick);
    } else {
      setStunPct(0);
      cancelAnimationFrame(stunFrameRef.current);
    }
    return () => cancelAnimationFrame(stunFrameRef.current);
  }, [stunned, stunMs]);

  const doPrestige = useCallback(() => {
    if (!canPrestige) return;
    setPrestige(p => p + 1);
    setGold(0); setEarned(0); setStreak(0); setRoll(null);
    setHex(0); setHexStreak(0);
    setSLv(0); setALv(0); setMLv(0); setRLv(0); setTLv(0);
    setDice([makeDefaultDie()]); setTotalReforges(0);
    // reforgeCap persists through prestige (Hex upgrade in future)
    setLog([]);
    pushLog(`✨ PRESTIGE ${prestige + 1}! ×${(1 + (prestige + 1) * 0.5).toFixed(1)} forever`);
  }, [canPrestige, prestige, pushLog]);

  const buy = useCallback((type: UpgradeType) => {
    const cfg: Record<UpgradeType, [number, { cost: number }[], React.Dispatch<React.SetStateAction<number>>]> = {
      speed: [sLv, SPEED, setSLv],
      auto: [aLv, AUTO, setALv],
      multi: [mLv, MULTI, setMLv],
      armor: [rLv, ARMOR, setRLv],
      stun: [tLv, STUN, setTLv],
    };
    const [lv, arr, set] = cfg[type];
    if (lv >= arr.length - 1) return;
    const cost = arr[lv + 1].cost;
    if (gold < cost) return;
    setGold(p => p - cost);
    set(p => p + 1);
  }, [sLv, aLv, mLv, rLv, tLv, gold]);

  // ── Reforging ──

  const reforgeUp = useCallback((dieIndex: number, faceIndex: number) => {
    const die = dice[dieIndex];
    if (!die) return;
    const currentVal = die[faceIndex];
    if (currentVal >= reforgeCap) return;
    const target = currentVal + 1;
    const cost = reforgeCost(currentVal, target, totalReforges);
    if (hex < cost) return;
    setHex(p => p - cost);
    setTotalReforges(p => p + 1);
    setDice(prev => {
      const next = prev.map(d => [...d]);
      next[dieIndex][faceIndex] = target;
      return next;
    });
    pushLog(`🔥 Face ${faceIndex + 1}: ${currentVal} → ${target} (-${fmt(cost)} hex)`);
  }, [dice, reforgeCap, totalReforges, hex, pushLog]);

  const reforgeDown = useCallback((dieIndex: number, faceIndex: number) => {
    const die = dice[dieIndex];
    if (!die) return;
    const currentVal = die[faceIndex];
    if (currentVal <= 1) return;
    const target = currentVal - 1;
    const cost = reforgeCost(currentVal, target, totalReforges);
    if (hex < cost) return;
    setHex(p => p - cost);
    setTotalReforges(p => p + 1);
    setDice(prev => {
      const next = prev.map(d => [...d]);
      next[dieIndex][faceIndex] = target;
      return next;
    });
    pushLog(`🔥 Face ${faceIndex + 1}: ${currentVal} → ${target} (-${fmt(cost)} hex)`);
  }, [dice, totalReforges, hex, pushLog]);

  return {
    // State
    gold, earned, streak, best, hex, hexStreak, bestHexStreak,
    roll, rolling, cooldown, stunned, stunPct, cdPct, autoPct,
    sLv, aLv, mLv, rLv, tLv, prestige, rolls, threes, shook, flash, saved,
    tab, log, started, locked,
    // Dice
    dice, totalReforges, reforgeCap, currentDie,
    // Derived
    multi, armor, pMult, cdMs, stunMs, autoMs, prestigeReq, canPrestige,
    // Actions
    setTab, doRoll, doPrestige, buy, reforgeUp, reforgeDown,
  };
}

import React from "react";
import { AUTO, SPEED, fmt, streakMultiplier } from "./constants";
import type { Die } from "./types";

interface RollTabProps {
  aLv: number; sLv: number;
  multi: number; armor: number; pMult: number;
  roll: number | null; rolling: boolean; streak: number;
  saved: boolean; stunned: boolean;
  rolls: number; threes: number; started: boolean;
  autoPct: number; autoMs: number | null;
  currentDie: Die;
}

export function RollTab({
  aLv, sLv, multi, armor, pMult,
  roll, rolling, streak, saved, stunned,
  rolls, threes, started,
  autoPct, autoMs, currentDie,
}: RollTabProps) {
  const dangerous = roll !== null && roll % 3 === 0;
  const safe = roll !== null && roll % 3 !== 0;
  const dangerCount = currentDie.filter(f => f % 3 === 0).length;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100%", gap: 12, paddingBottom: 8,
    }}>
      {/* Status badges */}
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center",
      }}>
        <span style={{
          fontSize: 11, padding: "3px 10px",
          background: "#0e0e1c", borderRadius: 6, border: "1px solid #1a1a2e",
          color: dangerCount > 0 ? "#ff8899" : "#44ffbb",
        }}>
          [{currentDie.join(",")}]{dangerCount > 0 ? ` 💀${dangerCount}` : " ✓"}
        </span>
        <span style={{
          fontSize: 11, padding: "3px 10px",
          background: "#0e0e1c", borderRadius: 6, border: "1px solid #1a1a2e",
          color: aLv > 0 ? "#88ddcc" : "#99aabb",
        }}>
          {aLv > 0 ? `AUTO ${AUTO[aLv].name}` : `TAP ${SPEED[sLv].name}`}
        </span>
        <span style={{
          fontSize: 11, color: "#ffdd88", padding: "3px 10px",
          background: "#0e0e1c", borderRadius: 6, border: "1px solid #1a1a2e",
        }}>
          ×{multi}
        </span>
        {armor > 0 && (
          <span style={{
            fontSize: 11, color: "#99bbff", padding: "3px 10px",
            background: "#0e0e1c", borderRadius: 6, border: "1px solid #1a1a2e",
          }}>
            🛡{armor}%
          </span>
        )}
      </div>

      {/* Main feedback — big and centered */}
      <div style={{
        minHeight: 60, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        {saved && (
          <div style={{
            color: "#ffbb33", fontSize: 18, fontWeight: 700,
            textShadow: "0 0 14px #ffaa0066",
          }}>
            🛡️ ARMOR BLOCKED!
          </div>
        )}

        {dangerous && !saved && !rolling && !stunned && (
          <div style={{
            color: "#ff4466", fontSize: 28, fontWeight: 900,
            textShadow: "0 0 24px #ff335566", letterSpacing: 6,
          }}>
            {roll === 3 ? "T H R E E" : `÷ 3`}
          </div>
        )}

        {safe && !rolling && (
          <div style={{
            color: "#44ffbb", fontSize: 28, fontWeight: 900,
            textShadow: "0 0 20px #44ffbb44",
          }}>
            +{fmt(Math.floor(roll * streakMultiplier(Math.max(0, streak - 1)) * multi * pMult))}g
          </div>
        )}

        {safe && !rolling && streak > 2 && (
          <div style={{ color: "#44ffbb66", fontSize: 12, marginTop: 2 }}>
            streak ×{streakMultiplier(streak - 1).toFixed(2)}
          </div>
        )}
      </div>

      {/* Auto-roll countdown */}
      {autoMs !== null && autoMs > 0 && started && (
        <div style={{ width: "80%", maxWidth: 240, textAlign: "center" }}>
          <div style={{
            fontSize: 10, color: "#667", letterSpacing: 1, marginBottom: 4,
          }}>
            NEXT ROLL
          </div>
          <div style={{
            width: "100%", height: 8, borderRadius: 4,
            background: "#14142a", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 4,
              width: `${autoPct * 100}%`,
              background: "linear-gradient(90deg, #44ffbb33, #44ffbb99)",
              transition: autoPct < 0.05 ? "none" : "width 0.05s linear",
            }} />
          </div>
          <div style={{ fontSize: 11, color: "#556", marginTop: 4 }}>
            {((1 - autoPct) * autoMs / 1000).toFixed(1)}s
          </div>
        </div>
      )}

      {/* Pre-start hint */}
      {!started && (
        <div style={{
          fontSize: 13, color: "#99aabb", lineHeight: 1.7,
          textAlign: "center", maxWidth: 260, marginTop: 8,
        }}>
          Roll dice. Earn gold.<br />
          Don't roll a <span style={{ color: "#ff4466", fontWeight: 700 }}>multiple of 3</span>.
        </div>
      )}

      {/* Stats */}
      {started && (
        <div style={{ fontSize: 10, color: "#556" }}>
          {rolls} rolls · {threes} threes
          {rolls > 0 && ` · ${((1 - threes / rolls) * 100).toFixed(1)}% safe`}
        </div>
      )}
    </div>
  );
}

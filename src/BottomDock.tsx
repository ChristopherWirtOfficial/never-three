import React from "react";
import { DiceFace } from "./DiceFace";
import type { TabId } from "./types";

interface BottomDockProps {
  roll: number | null;
  sides: number;
  saved: boolean;
  stunned: boolean;
  stunPct: number;
  stunMs: number;
  rolling: boolean;
  locked: boolean;
  aLv: number;
  cdPct: number;
  tab: TabId;
  onRoll: () => void;
  onTabChange: (tab: TabId) => void;
}

const TABS: [TabId, string][] = [
  ["roll", "🎲 ROLL"],
  ["shop", "⬆ SHOP"],
  ["forge", "🔥 FORGE"],
  ["log", "📜 LOG"],
];

export function BottomDock({
  roll, sides, saved, stunned, stunPct, stunMs, rolling, locked, aLv,
  cdPct, tab, onRoll, onTabChange,
}: BottomDockProps) {
  return (
    <div style={{ flexShrink: 0, borderTop: "1px solid #141428", background: "#0a0a14" }}>
      {/* Die row — entire area is tappable */}
      <div
        onClick={onRoll}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "12px 18px 8px", gap: 6,
          cursor: locked ? "default" : "pointer",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <div
          style={{
            width: 148, height: 148, borderRadius: 24,
            background: stunned
              ? "linear-gradient(145deg,#2a0a12,#18060a)"
              : saved
                ? "linear-gradient(145deg,#2a2510,#181505)"
                : "linear-gradient(145deg,#16162a,#0d0d18)",
            border: stunned ? "2px solid #ff335566"
              : saved ? "2px solid #ffaa0044"
                : locked ? "2px solid #1a1a30" : "2px solid #44ffbb33",
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
            animation: rolling
              ? "spin .18s ease"
              : !locked && !aLv ? "pulse 2.5s ease infinite" : "none",
            opacity: locked && !rolling && !stunned ? 0.55 : 1,
            transition: "border-color .3s, background .3s, opacity .3s",
          }}
        >
          {roll === null ? (
            <div style={{
              color: "#889", fontSize: 15, textAlign: "center",
              lineHeight: 1.7, letterSpacing: 1,
            }}>
              TAP<br />TO<br />ROLL
            </div>
          ) : (
            <DiceFace
              value={roll}
              sides={sides}
              isThree={roll !== null && roll % 3 === 0 && !saved}
              rolling={rolling}
            />
          )}
        </div>

        {/* Progress bar: stun or cooldown */}
        {stunned ? (
          <div style={{ width: 160, textAlign: "center" }}>
            <div style={{
              width: "100%", height: 6, borderRadius: 3,
              background: "#1a0a10", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: 3,
                width: `${stunPct * 100}%`,
                background: "linear-gradient(90deg,#ff335566,#ff3355cc)",
              }} />
            </div>
            <div style={{
              fontSize: 12, color: "#ff6677", marginTop: 6,
              fontWeight: 700, animation: "stunPulse 1s ease infinite",
            }}>
              STUNNED {((1 - stunPct) * stunMs / 1000).toFixed(1)}s
            </div>
          </div>
        ) : (
          <div style={{
            width: 148, height: 4, borderRadius: 2,
            background: "#14142a", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 2,
              width: `${cdPct * 100}%`,
              background: cdPct < 1
                ? "linear-gradient(90deg,#44ffbb55,#44ffbbbb)"
                : "#44ffbb",
            }} />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderTop: "1px solid #141428" }}>
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            style={{
              flex: 1, padding: "12px 0", background: "transparent",
              border: "none",
              borderTop: tab === key ? "2px solid #44ffbb" : "2px solid transparent",
              color: tab === key ? "#44ffbb" : "#667",
              fontFamily: "monospace", fontSize: 12, fontWeight: 700,
              cursor: "pointer", letterSpacing: 1,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

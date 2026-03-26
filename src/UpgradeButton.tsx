import React from "react";
import { fmt } from "./constants";

interface UpgradeButtonProps {
  icon: string;
  label: string;
  current: string;
  next: string;
  cost: number;
  maxed: boolean;
  gold: number;
  onBuy: () => void;
}

export function UpgradeButton({ icon, label, current, next, cost, maxed, gold, onBuy }: UpgradeButtonProps) {
  const affordable = gold >= cost;
  return (
    <button onClick={onBuy} disabled={maxed || !affordable} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      width: "100%", padding: "12px 14px",
      background: maxed
        ? "#0e0e1a"
        : affordable
          ? "linear-gradient(135deg, #132e1e, #0b1a10)"
          : "#0e0e1a",
      border: maxed
        ? "1px solid #1a1a28"
        : affordable
          ? "1px solid #44ffbb55"
          : "1px solid #222238",
      borderRadius: 12,
      color: "#ddd",
      cursor: maxed || !affordable ? "default" : "pointer",
      opacity: maxed ? 0.35 : 1,
      fontFamily: "monospace",
      transition: "all .2s",
      textAlign: "left",
    }}>
      <div>
        <div style={{
          fontSize: 10,
          color: maxed ? "#556" : affordable ? "#88bbaa" : "#667788",
          marginBottom: 2,
        }}>
          {icon} {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>
          {maxed
            ? <span style={{ color: "#44ffbb" }}>MAX</span>
            : <>
                <span style={{ color: affordable ? "#dde" : "#889" }}>{current}</span>
                {" "}
                <span style={{ color: affordable ? "#44ffbb" : "#336655" }}>→ {next}</span>
              </>}
        </div>
      </div>
      {!maxed && (
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          whiteSpace: "nowrap",
          color: affordable ? "#ffdd33" : "#99aabb",
          opacity: affordable ? 1 : 0.7,
        }}>
          {fmt(cost)}g
        </div>
      )}
    </button>
  );
}

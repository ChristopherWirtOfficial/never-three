import React from "react";
import { SPEED, AUTO, MULTI, ARMOR, STUN, fmt } from "./constants";
import { UpgradeButton } from "./UpgradeButton";
import type { UpgradeType } from "./types";

interface ShopTabProps {
  gold: number;
  earned: number;
  sLv: number; aLv: number; mLv: number; rLv: number; tLv: number;
  prestige: number;
  prestigeReq: number;
  canPrestige: boolean;
  buy: (type: UpgradeType) => void;
  doPrestige: () => void;
}

interface UpgradeConfig {
  type: UpgradeType;
  icon: string;
  label: string;
  lv: number;
  arr: { cost: number; name?: string; x?: number; pct?: number; ms?: number | null }[];
  display: (item: UpgradeConfig["arr"][number]) => string;
}

export function ShopTab({
  gold, earned, sLv, aLv, mLv, rLv, tLv,
  prestige, prestigeReq, canPrestige, buy, doPrestige,
}: ShopTabProps) {
  const upgrades: UpgradeConfig[] = [
    { type: "multi", icon: "💰", label: "GOLD MULTI", lv: mLv, arr: MULTI, display: (i) => `×${i.x}` },
    { type: "speed", icon: "⚡", label: "ROLL SPEED", lv: sLv, arr: SPEED, display: (i) => i.name as string },
    { type: "auto", icon: "🔄", label: "AUTO-ROLL", lv: aLv, arr: AUTO, display: (i) => i.name as string },
    { type: "stun", icon: "💊", label: "STUN RECOVERY", lv: tLv, arr: STUN, display: (i) => i.name as string },
    { type: "armor", icon: "🛡️", label: "STREAK ARMOR", lv: rLv, arr: ARMOR, display: (i) => `${i.pct}%` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 12, paddingBottom: 12 }}>
      {upgrades.map(u => {
        const maxed = u.lv >= u.arr.length - 1;
        return (
          <UpgradeButton
            key={u.type}
            icon={u.icon}
            label={u.label}
            current={u.display(u.arr[u.lv])}
            next={maxed ? "" : u.display(u.arr[u.lv + 1])}
            cost={maxed ? 0 : u.arr[u.lv + 1].cost}
            maxed={maxed}
            gold={gold}
            onBuy={() => buy(u.type)}
          />
        );
      })}

      {/* Prestige */}
      <div style={{ marginTop: 6 }}>
        <div style={{ fontSize: 10, color: "#bb99ff", letterSpacing: 2, marginBottom: 6 }}>★ PRESTIGE</div>
        <button onClick={doPrestige} disabled={!canPrestige} style={{
          width: "100%", padding: 14, borderRadius: 12,
          border: canPrestige ? "1px solid #bb99ff55" : "1px solid #222238",
          background: canPrestige ? "linear-gradient(135deg,#1a0a2e,#0d051a)" : "#0e0e1a",
          color: canPrestige ? "#bb99ff" : "#99aabb",
          fontFamily: "monospace", fontSize: 13, fontWeight: 700,
          cursor: canPrestige ? "pointer" : "default",
          opacity: canPrestige ? 1 : 0.7,
        }}>
          {canPrestige
            ? <>PRESTIGE → ★{prestige + 1} (×{(1 + (prestige + 1) * 0.5).toFixed(1)})</>
            : <><span style={{ color: "#667" }}>{fmt(earned)}</span> / <span style={{ color: "#bb99ff88" }}>{fmt(prestigeReq)}g</span></>}
        </button>
      </div>
    </div>
  );
}

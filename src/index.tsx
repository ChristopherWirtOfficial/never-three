import React from "react";
import { GLOBAL_CSS } from "./styles";
import { useGameState } from "./useGameState";
import { RollTab } from "./RollTab";
import { ShopTab } from "./ShopTab";
import { LogTab } from "./LogTab";
import { ForgeTab } from "./ForgeTab";
import { BottomDock } from "./BottomDock";

export default function NeverThree() {
  const g = useGameState();

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* Screen flash overlay */}
      {g.flash && (
        <div style={{
          position: "fixed", inset: 0,
          background: g.flash + "1a",
          pointerEvents: "none", zIndex: 100,
        }} />
      )}

      <div style={{
        height: "100dvh", width: "100%",
        display: "flex", flexDirection: "column",
        background: "#08080f", color: "#ddd", fontFamily: "monospace",
        maxWidth: 480, margin: "0 auto", overflow: "hidden",
        animation: g.shook ? "shake .3s ease" : "none",
      }}>
        {/* ── TOP BAR ── */}
        <div style={{
          padding: "10px 18px", flexShrink: 0,
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          borderBottom: "1px solid #141428",
        }}>
          <div>
            <div style={{ fontSize: 9, color: "#bb9900", letterSpacing: 2, fontWeight: 700 }}>GOLD</div>
            <div style={{
              fontSize: 28, fontWeight: 900, color: "#ffdd33",
              textShadow: "0 0 16px #ffdd3344", lineHeight: 1.1,
            }}>
              {g.gold >= 1e3
                ? (g.gold >= 1e12 ? (g.gold / 1e12).toFixed(1) + "T"
                  : g.gold >= 1e9 ? (g.gold / 1e9).toFixed(1) + "B"
                  : g.gold >= 1e6 ? (g.gold / 1e6).toFixed(1) + "M"
                  : (g.gold / 1e3).toFixed(1) + "K")
                : Math.floor(g.gold).toString()}
            </div>
          </div>
          <div style={{ textAlign: "right", lineHeight: 1.5 }}>
            <div style={{ fontSize: 12, color: "#aab" }}>
              STREAK{" "}
              <span style={{
                color: g.streak > 0 ? "#44ffbb" : "#445",
                fontWeight: 900, fontSize: 16,
              }}>
                {g.streak}
              </span>
            </div>
            <div style={{ fontSize: 10, color: "#667" }}>
              BEST {g.best}
              {g.prestige > 0 && (
                <span style={{ color: "#bb99ff" }}>
                  {" "}· ★{g.prestige} ×{g.pMult.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── MIDDLE (scrollable) ── */}
        <div style={{ flex: 1, overflow: "auto", padding: "0 18px" }}>
          {g.tab === "roll" && (
            <RollTab
              aLv={g.aLv} sLv={g.sLv}
              multi={g.multi} armor={g.armor} pMult={g.pMult}
              roll={g.roll} rolling={g.rolling} streak={g.streak}
              saved={g.saved} stunned={g.stunned}
              rolls={g.rolls} threes={g.threes} started={g.started}
              autoPct={g.autoPct} autoMs={g.autoMs}
              currentDie={g.currentDie}
            />
          )}
          {g.tab === "shop" && (
            <ShopTab
              gold={g.gold} earned={g.earned}
              sLv={g.sLv} aLv={g.aLv} mLv={g.mLv} rLv={g.rLv} tLv={g.tLv}
              prestige={g.prestige} prestigeReq={g.prestigeReq} canPrestige={g.canPrestige}
              buy={g.buy} doPrestige={g.doPrestige}
            />
          )}
          {g.tab === "forge" && (
            <ForgeTab
              dice={g.dice}
              totalReforges={g.totalReforges}
              reforgeCap={g.reforgeCap}
              gold={g.gold}
              reforgeUp={g.reforgeUp}
              reforgeDown={g.reforgeDown}
            />
          )}
          {g.tab === "log" && <LogTab log={g.log} />}
        </div>

        {/* ── BOTTOM DOCK ── */}
        <BottomDock
          roll={g.roll} sides={g.currentDie.length} saved={g.saved}
          stunned={g.stunned} stunPct={g.stunPct} stunMs={g.stunMs}
          rolling={g.rolling} locked={g.locked}
          aLv={g.aLv} cdPct={g.cdPct}
          tab={g.tab}
          onRoll={() => { if (!g.locked) g.doRoll(); }}
          onTabChange={g.setTab}
        />
      </div>
    </>
  );
}

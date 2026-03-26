import React from "react";
import { reforgeCost, fmt } from "./constants";
import type { Die } from "./types";

interface ForgeTabProps {
  dice: Die[];
  totalReforges: number;
  reforgeCap: number;
  hex: number;
  reforgeUp: (dieIndex: number, faceIndex: number) => void;
  reforgeDown: (dieIndex: number, faceIndex: number) => void;
}

export function ForgeTab({
  dice, totalReforges, reforgeCap, hex,
  reforgeUp, reforgeDown,
}: ForgeTabProps) {
  return (
    <div style={{ paddingTop: 12, paddingBottom: 12 }}>
      {dice.map((die, dieIdx) => (
        <div key={dieIdx} style={{ marginBottom: 16 }}>
          {dice.length > 1 && (
            <div style={{
              fontSize: 11, color: "#88aacc", letterSpacing: 2,
              marginBottom: 8, fontWeight: 700,
            }}>
              DIE {dieIdx + 1}
            </div>
          )}

          <div style={{
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            {die.map((faceVal, faceIdx) => {
              const isDangerous = faceVal % 3 === 0;
              const atCap = faceVal >= reforgeCap;
              const atFloor = faceVal <= 1;
              const upCost = atCap ? 0 : reforgeCost(faceVal, faceVal + 1, totalReforges);
              const downCost = atFloor ? 0 : reforgeCost(faceVal, faceVal - 1, totalReforges);
              const canAffordUp = hex >= upCost && !atCap;
              const canAffordDown = hex >= downCost && !atFloor;
              const nextDangerous = !atCap && (faceVal + 1) % 3 === 0;
              const prevDangerous = !atFloor && (faceVal - 1) % 3 === 0;

              return (
                <div key={faceIdx} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "10px 12px",
                  background: isDangerous ? "#1a0e14" : "#0e0e1c",
                  border: isDangerous ? "1px solid #ff335533" : "1px solid #1a1a2e",
                  borderRadius: 10,
                }}>
                  {/* Face label */}
                  <div style={{ width: 18, textAlign: "center" }}>
                    <span style={{
                      fontSize: 10, color: "#667",
                    }}>
                      F{faceIdx + 1}
                    </span>
                  </div>

                  {/* Current value */}
                  <div style={{
                    width: 36, textAlign: "center",
                    fontSize: 20, fontWeight: 900,
                    color: isDangerous ? "#ff5577" : "#44ffbb",
                    textShadow: isDangerous
                      ? "0 0 10px #ff335544"
                      : "0 0 10px #44ffbb33",
                  }}>
                    {faceVal}
                  </div>

                  {/* Danger indicator */}
                  <div style={{ width: 20, textAlign: "center", fontSize: 12 }}>
                    {isDangerous ? "💀" : ""}
                  </div>

                  {/* Spacer */}
                  <div style={{ flex: 1 }} />

                  {/* Down button with cost */}
                  <button
                    onClick={() => reforgeDown(dieIdx, faceIdx)}
                    disabled={atFloor || !canAffordDown}
                    style={{
                      minWidth: 64, height: 36, borderRadius: 8, padding: "0 8px",
                      background: atFloor
                        ? "#0a0a14"
                        : canAffordDown
                          ? prevDangerous
                            ? "linear-gradient(135deg, #2a1a1e, #1a0e12)"
                            : isDangerous
                              ? "linear-gradient(135deg, #2a1a2e, #1a0e1a)"
                              : "#12121e"
                          : "#0e0e1c",
                      border: atFloor
                        ? "1px solid #181828"
                        : canAffordDown
                          ? isDangerous
                            ? "1px solid #bb88ff44"
                            : prevDangerous
                              ? "1px solid #ff335544"
                              : "1px solid #2a2a40"
                          : "1px solid #222238",
                      color: atFloor
                        ? "#333"
                        : canAffordDown
                          ? prevDangerous ? "#ff8899" : isDangerous ? "#bb88ff" : "#99aabb"
                          : "#556",
                      fontSize: 11, fontWeight: 700, fontFamily: "monospace",
                      cursor: atFloor || !canAffordDown ? "default" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 3,
                    }}
                  >
                    {atFloor ? "—" : (
                      <>
                        <span style={{ fontSize: 14 }}>−</span>
                        <span>{fmt(downCost)}🔮</span>
                      </>
                    )}
                  </button>

                  {/* Up button with cost */}
                  <button
                    onClick={() => reforgeUp(dieIdx, faceIdx)}
                    disabled={atCap || !canAffordUp}
                    style={{
                      minWidth: 80, height: 36, borderRadius: 8,
                      padding: "0 10px",
                      background: atCap
                        ? "#0a0a14"
                        : canAffordUp
                          ? isDangerous
                            ? "linear-gradient(135deg, #2a1a2e, #1a0e1a)"
                            : nextDangerous
                              ? "linear-gradient(135deg, #2a1a1e, #1a0e12)"
                              : "linear-gradient(135deg, #12261a, #0b1810)"
                          : "#0e0e1c",
                      border: atCap
                        ? "1px solid #181828"
                        : canAffordUp
                          ? isDangerous
                            ? "1px solid #bb88ff44"
                            : nextDangerous
                              ? "1px solid #ff335544"
                              : "1px solid #44ffbb33"
                          : "1px solid #222238",
                      color: atCap
                        ? "#333"
                        : canAffordUp
                          ? isDangerous ? "#bb88ff" : nextDangerous ? "#ff8899" : "#44ffbb"
                          : "#556",
                      fontSize: 11, fontWeight: 700, fontFamily: "monospace",
                      cursor: atCap || !canAffordUp ? "default" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    {atCap ? "MAX" : (
                      <>
                        <span style={{ fontSize: 14 }}>+</span>
                        <span>{fmt(upCost)}🔮</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Reforge info */}
          <div style={{
            marginTop: 10, padding: "8px 12px",
            background: "#0a0a14", borderRadius: 8,
            fontSize: 10, color: "#556", lineHeight: 1.6,
          }}>
            {totalReforges} total reforges · cap: {reforgeCap}
            <br />
            <span style={{ color: "#ff557766" }}>💀 = multiple of 3 (dangerous)</span>
            {reforgeCap < 7 && (
              <>
                <br />
                <span style={{ color: "#bb99ff66" }}>Raise cap above 6 to reach safe values</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

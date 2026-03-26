import React from "react";

interface DiceFaceProps {
  value: number;
  sides: number;
  isThree: boolean;
  rolling: boolean;
}

const DOT_PATTERNS: Record<number, number[]> = {
  1: [4], 2: [0, 8], 3: [0, 4, 8],
  4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
};

export function DiceFace({ value, sides, isThree, rolling }: DiceFaceProps) {
  const color = isThree ? "#ff3355" : "#44ffbb";
  const glow = isThree
    ? "0 0 12px #ff3355, 0 0 24px #ff335544"
    : "0 0 12px #44ffbb, 0 0 24px #44ffbb44";

  if (sides === 6 && !rolling) {
    const active = DOT_PATTERNS[value] ?? [];
    return (
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3,1fr)",
        gap: 10, width: "100%", height: "100%", padding: 18,
      }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{
            width: "100%", aspectRatio: "1", borderRadius: "50%",
            background: active.includes(i) ? color : "transparent",
            boxShadow: active.includes(i) ? glow : "none",
            transition: "all .15s",
          }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "monospace",
      fontSize: rolling ? 42 : value >= 100 ? 32 : 48,
      fontWeight: 900,
      color: rolling ? "#556" : color,
      textShadow: rolling ? "none" : `0 0 20px ${color}, 0 0 40px ${color}66`,
    }}>
      {rolling ? "?" : value}
    </div>
  );
}

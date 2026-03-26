import React from "react";

interface LogTabProps {
  log: string[];
}

export function LogTab({ log }: LogTabProps) {
  if (log.length === 0) {
    return (
      <div style={{ color: "#556", textAlign: "center", padding: 40, fontSize: 12 }}>
        Nothing yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {log.map((entry, i) => (
        <div key={i} style={{
          fontSize: 11,
          color: i === 0 ? "#ccd" : "#556",
          padding: "5px 0",
          borderBottom: "1px solid #111118",
          animation: i === 0 ? "fadeIn .2s ease" : "none",
        }}>
          {entry}
        </div>
      ))}
    </div>
  );
}

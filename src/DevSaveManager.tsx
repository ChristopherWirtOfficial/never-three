import React, { useState, useEffect, useCallback } from "react";
import {
  listProfiles,
  createProfile,
  deleteProfile,
  renameProfile,
  boot,
  loadProfile,
  setActiveProfileId,
  type SaveState,
} from "./game/saves";
import { fmt } from "./game/constants";

interface DevSaveManagerProps {
  visible: boolean;
  onClose: () => void;
  currentProfileId: string;
  currentProfileName: string;
  onLoadProfile: (id: string, name: string, state: SaveState) => void;
  onNewProfile: (id: string) => void;
}

interface ProfileInfo {
  id: string;
  name: string;
  lastPlayed: number;
}

export function DevSaveManager({
  visible,
  onClose,
  currentProfileId,
  currentProfileName,
  onLoadProfile,
  onNewProfile,
}: DevSaveManagerProps) {
  const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const list = await listProfiles();
    setProfiles(list);
  }, []);

  useEffect(() => {
    if (visible) refresh();
  }, [visible, refresh]);

  const handleCreate = async () => {
    const name = newName.trim() || `Run ${profiles.length + 1}`;
    const id = await createProfile(name);
    setNewName("");
    onNewProfile(id);
    await refresh();
  };

  const handleDelete = async (id: string) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }
    await deleteProfile(id);
    setConfirmDelete(null);
    if (id === currentProfileId) {
      // Reboot into whatever's left
      const result = await boot();
      onLoadProfile(result.id, result.name, result.state);
    }
    await refresh();
  };

  const handleRename = async (id: string) => {
    if (editName.trim()) {
      await renameProfile(id, editName.trim());
    }
    setEditingId(null);
    setEditName("");
    await refresh();
  };

  const handleLoad = async (id: string) => {
    const result = await loadProfile(id);
    const prof = profiles.find((p) => p.id === id);
    if (result && prof) {
      await setActiveProfileId(id);
      onLoadProfile(id, prof.name, result);
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#000000cc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          maxHeight: "80vh",
          background: "#0c0c1a",
          border: "1px solid #2a2a40",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: "monospace",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #1a1a2e",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#ffdd33",
              letterSpacing: 1,
            }}
          >
            🛠 DEV SAVES
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#889",
              fontSize: 18,
              cursor: "pointer",
              padding: "0 4px",
              fontFamily: "monospace",
            }}
          >
            ✕
          </button>
        </div>

        {/* Profile list */}
        <div style={{ flex: 1, overflow: "auto", padding: "8px 12px" }}>
          {profiles.map((p) => {
            const isActive = p.id === currentProfileId;
            const isEditing = editingId === p.id;
            const isConfirming = confirmDelete === p.id;

            return (
              <div
                key={p.id}
                style={{
                  padding: "10px 12px",
                  marginBottom: 6,
                  background: isActive ? "#141430" : "#0e0e1c",
                  border: isActive
                    ? "1px solid #44ffbb44"
                    : "1px solid #1a1a2e",
                  borderRadius: 10,
                }}
              >
                {/* Top row: name + active badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  {isEditing ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleRename(p.id)}
                      onBlur={() => handleRename(p.id)}
                      autoFocus
                      style={{
                        flex: 1,
                        background: "#1a1a30",
                        border: "1px solid #44ffbb44",
                        borderRadius: 6,
                        padding: "4px 8px",
                        color: "#ddd",
                        fontFamily: "monospace",
                        fontSize: 13,
                        outline: "none",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontWeight: 700,
                        color: isActive ? "#44ffbb" : "#bbc",
                      }}
                    >
                      {p.name}
                    </div>
                  )}
                  {isActive && (
                    <span
                      style={{
                        fontSize: 9,
                        color: "#44ffbb",
                        padding: "2px 6px",
                        background: "#44ffbb15",
                        borderRadius: 4,
                        letterSpacing: 1,
                      }}
                    >
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ fontSize: 10, color: "#556", marginBottom: 8 }}>
                  {new Date(p.lastPlayed).toLocaleString()}
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 6 }}>
                  {!isActive && (
                    <button
                      onClick={() => handleLoad(p.id)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: 6,
                        background: "#1a2a22",
                        border: "1px solid #44ffbb33",
                        color: "#44ffbb",
                        fontFamily: "monospace",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      LOAD
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(p.id);
                      setEditName(p.name);
                      setConfirmDelete(null);
                    }}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      borderRadius: 6,
                      background: "#1a1a2e",
                      border: "1px solid #333",
                      color: "#99aabb",
                      fontFamily: "monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    RENAME
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      borderRadius: 6,
                      background: isConfirming ? "#2a0a10" : "#1a1a2e",
                      border: isConfirming
                        ? "1px solid #ff335566"
                        : "1px solid #333",
                      color: isConfirming ? "#ff6677" : "#886666",
                      fontFamily: "monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {isConfirming ? "CONFIRM?" : "DELETE"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create new */}
        <div
          style={{
            padding: "12px 12px 14px",
            borderTop: "1px solid #1a1a2e",
            display: "flex",
            gap: 8,
          }}
        >
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="New profile name..."
            style={{
              flex: 1,
              background: "#0e0e1c",
              border: "1px solid #2a2a40",
              borderRadius: 8,
              padding: "8px 10px",
              color: "#bbc",
              fontFamily: "monospace",
              fontSize: 12,
              outline: "none",
            }}
          />
          <button
            onClick={handleCreate}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #132e1e, #0b1a10)",
              border: "1px solid #44ffbb44",
              color: "#44ffbb",
              fontFamily: "monospace",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            + NEW
          </button>
        </div>
      </div>
    </div>
  );
}

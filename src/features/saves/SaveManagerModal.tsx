import { Box, Flex, Text, VStack, chakra } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useGameSession } from "../../providers/GameSessionContext";
import { useSaveSlots } from "../../providers/SaveSlotsContext";
import { listProfiles, resolveProfileDisplayName } from "../../game/saves";

type ProfileRow = { id: string; name: string; lastPlayed: number };

export function SaveManagerModal() {
  const {
    saveManagerOpen,
    closeSaveManager,
    switchToProfile,
    createNewSave,
    duplicateProfile,
    deleteSave,
    renameSave,
  } = useSaveSlots();
  const { profileId: currentId } = useGameSession();

  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [newSaveName, setNewSaveName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [copyTargetId, setCopyTargetId] = useState<string | null>(null);
  const [copyName, setCopyName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const list = await listProfiles();
    setProfiles(list);
  }, []);

  useEffect(() => {
    if (saveManagerOpen) {
      void refresh();
      setCopyTargetId(null);
      setCopyName("");
      setConfirmDeleteId(null);
    }
  }, [saveManagerOpen, refresh]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  if (!saveManagerOpen) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={300}
      bg="#000000cc"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px="16px"
      onClick={() => !busy && closeSaveManager()}
    >
      <Box
        w="100%"
        maxW="400px"
        maxH="85dvh"
        bg="never.panel"
        border="1px solid"
        borderColor="never.panelBorder"
        borderRadius="16px"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        fontFamily="monospace"
        onClick={(e) => e.stopPropagation()}
      >
        <Flex
          px="16px"
          py="14px"
          borderBottom="1px solid"
          borderColor="never.border"
          align="center"
          justify="space-between"
        >
          <Text
            fontSize="14px"
            fontWeight={800}
            color="never.gold"
            letterSpacing="0.08em"
          >
            SAVES
          </Text>
          <chakra.button
            type="button"
            bg="transparent"
            border="none"
            color="never.dim"
            fontSize="18px"
            cursor={busy ? "default" : "pointer"}
            opacity={busy ? 0.4 : 1}
            onClick={() => !busy && closeSaveManager()}
            aria-label="Close"
          >
            ✕
          </chakra.button>
        </Flex>

        <Box flex={1} overflow="auto" px="12px" py="10px">
          <VStack align="stretch" gap="8px">
            {profiles.map((p) => {
              const display = resolveProfileDisplayName(p.name, p.lastPlayed);
              const isActive = p.id === currentId;
              const isEditing = editingId === p.id;
              const isCopying = copyTargetId === p.id;
              const isConfirmDelete = confirmDeleteId === p.id;

              return (
                <Box
                  key={p.id}
                  px="12px"
                  py="10px"
                  borderRadius="10px"
                  border="1px solid"
                  borderColor={
                    isActive ? "never.streakBorder" : "never.panelBorder"
                  }
                  bg={isActive ? "never.dock" : "never.bg"}
                >
                  {isEditing ? (
                    <chakra.input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          void run(async () => {
                            await renameSave(p.id, editName);
                            setEditingId(null);
                          });
                        }
                      }}
                      autoFocus
                      w="100%"
                      px="8px"
                      py="6px"
                      borderRadius="6px"
                      border="1px solid"
                      borderColor="never.streakBorder"
                      bg="never.bg"
                      color="never.text"
                      fontSize="13px"
                      fontFamily="monospace"
                    />
                  ) : (
                    <Text
                      fontSize="13px"
                      fontWeight={700}
                      color={isActive ? "never.streak" : "never.text"}
                    >
                      {display}
                    </Text>
                  )}
                  <Text fontSize="10px" color="never.stat" mt="4px">
                    Last played {new Date(p.lastPlayed).toLocaleString()}
                  </Text>
                  {isActive && (
                    <Text fontSize="9px" color="never.streakMuted" mt="2px">
                      Current · autosaves to this slot
                    </Text>
                  )}

                  {isCopying && (
                    <Box mt="8px">
                      <Text fontSize="10px" color="never.dim" mb="4px">
                        Name for copy (optional)
                      </Text>
                      <chakra.input
                        value={copyName}
                        onChange={(e) => setCopyName(e.target.value)}
                        placeholder="Defaults to “… (copy)”"
                        w="100%"
                        px="8px"
                        py="6px"
                        borderRadius="6px"
                        border="1px solid"
                        borderColor="never.rowBorder"
                        bg="never.bg"
                        color="never.text"
                        fontSize="12px"
                        fontFamily="monospace"
                        mb="6px"
                      />
                      <Flex gap="6px">
                        <chakra.button
                          type="button"
                          flex={1}
                          py="6px"
                          borderRadius="6px"
                          bg="never.panelMuted"
                          border="1px solid"
                          borderColor="never.rowBorder"
                          color="never.subtle"
                          fontSize="11px"
                          fontWeight={700}
                          disabled={busy}
                          onClick={() => {
                            setCopyTargetId(null);
                            setCopyName("");
                          }}
                        >
                          Cancel
                        </chakra.button>
                        <chakra.button
                          type="button"
                          flex={1}
                          py="6px"
                          borderRadius="6px"
                          bg="linear-gradient(135deg,#1a0a2e,#0d051a)"
                          border="1px solid"
                          borderColor="never.prestigeBorder"
                          color="never.prestige"
                          fontSize="11px"
                          fontWeight={700}
                          disabled={busy}
                          onClick={() =>
                            void run(async () => {
                              await duplicateProfile(
                                p.id,
                                copyName.trim() || undefined,
                              );
                              setCopyTargetId(null);
                              setCopyName("");
                              closeSaveManager();
                            })
                          }
                        >
                          Copy & play
                        </chakra.button>
                      </Flex>
                    </Box>
                  )}

                  {!isCopying && !isEditing && (
                    <Flex flexWrap="wrap" gap="6px" mt="8px">
                      {!isActive && (
                        <chakra.button
                          type="button"
                          flex={1}
                          minW="100px"
                          py="6px"
                          borderRadius="6px"
                          bg="#1a2a22"
                          border="1px solid"
                          borderColor="never.streakBorder"
                          color="never.streak"
                          fontSize="11px"
                          fontWeight={700}
                          disabled={busy}
                          onClick={() =>
                            void run(async () => {
                              await switchToProfile(p.id);
                              closeSaveManager();
                            })
                          }
                        >
                          Switch
                        </chakra.button>
                      )}
                      <chakra.button
                        type="button"
                        flex={1}
                        minW="100px"
                        py="6px"
                        borderRadius="6px"
                        bg="never.panelMuted"
                        border="1px solid"
                        borderColor="never.rowBorder"
                        color="never.subtle"
                        fontSize="11px"
                        fontWeight={700}
                        disabled={busy}
                        onClick={() => {
                          setEditingId(p.id);
                          setEditName(p.name.trim() ? p.name : display);
                          setConfirmDeleteId(null);
                          setCopyTargetId(null);
                        }}
                      >
                        Rename
                      </chakra.button>
                      <chakra.button
                        type="button"
                        flex={1}
                        minW="100px"
                        py="6px"
                        borderRadius="6px"
                        bg="never.panelMuted"
                        border="1px solid"
                        borderColor="never.rowBorder"
                        color="never.multi"
                        fontSize="11px"
                        fontWeight={700}
                        disabled={busy}
                        onClick={() => {
                          setCopyTargetId(p.id);
                          setCopyName("");
                          setConfirmDeleteId(null);
                          setEditingId(null);
                        }}
                      >
                        Copy…
                      </chakra.button>
                      <chakra.button
                        type="button"
                        flex={1}
                        minW="100px"
                        py="6px"
                        borderRadius="6px"
                        bg={isConfirmDelete ? "#2a0a12" : "never.panelMuted"}
                        border="1px solid"
                        borderColor={
                          isConfirmDelete ? "never.danger" : "never.rowBorder"
                        }
                        color={isConfirmDelete ? "never.danger" : "never.dim"}
                        fontSize="11px"
                        fontWeight={700}
                        disabled={busy}
                        onClick={() => {
                          if (!isConfirmDelete) {
                            setConfirmDeleteId(p.id);
                            return;
                          }
                          void run(async () => {
                            await deleteSave(p.id);
                            setConfirmDeleteId(null);
                          });
                        }}
                      >
                        {isConfirmDelete ? "Confirm delete" : "Delete"}
                      </chakra.button>
                    </Flex>
                  )}

                  {isEditing && (
                    <Flex gap="6px" mt="8px">
                      <chakra.button
                        type="button"
                        flex={1}
                        py="6px"
                        borderRadius="6px"
                        bg="never.streak"
                        color="never.bg"
                        fontSize="11px"
                        fontWeight={800}
                        disabled={busy}
                        onClick={() =>
                          void run(async () => {
                            await renameSave(p.id, editName);
                            setEditingId(null);
                          })
                        }
                      >
                        Save name
                      </chakra.button>
                      <chakra.button
                        type="button"
                        flex={1}
                        py="6px"
                        borderRadius="6px"
                        bg="never.panelMuted"
                        border="1px solid"
                        borderColor="never.rowBorder"
                        color="never.subtle"
                        fontSize="11px"
                        disabled={busy}
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </chakra.button>
                    </Flex>
                  )}
                </Box>
              );
            })}
          </VStack>
        </Box>

        <Box
          px="12px"
          py="12px"
          borderTop="1px solid"
          borderColor="never.border"
        >
          <Text
            fontSize="10px"
            color="never.dim"
            letterSpacing="0.06em"
            mb="6px"
          >
            NEW SAVE (FRESH RUN)
          </Text>
          <Flex gap="8px">
            <chakra.input
              flex={1}
              value={newSaveName}
              onChange={(e) => setNewSaveName(e.target.value)}
              placeholder="Optional name…"
              px="10px"
              py="8px"
              borderRadius="8px"
              border="1px solid"
              borderColor="never.rowBorder"
              bg="never.bg"
              color="never.text"
              fontSize="12px"
              fontFamily="monospace"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void run(async () => {
                    await createNewSave(newSaveName.trim() || undefined);
                    setNewSaveName("");
                    closeSaveManager();
                  });
                }
              }}
            />
            <chakra.button
              type="button"
              px="14px"
              py="8px"
              borderRadius="8px"
              bg="linear-gradient(135deg,#132e1e,#0b1a10)"
              border="1px solid"
              borderColor="never.streakBorder"
              color="never.streak"
              fontSize="12px"
              fontWeight={800}
              whiteSpace="nowrap"
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  await createNewSave(newSaveName.trim() || undefined);
                  setNewSaveName("");
                  closeSaveManager();
                })
              }
            >
              New save
            </chakra.button>
          </Flex>
          <Text fontSize="9px" color="never.stat" mt="8px" lineHeight={1.5}>
            Blank name → fresh run labeled with time. Most recent save loads on
            startup.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

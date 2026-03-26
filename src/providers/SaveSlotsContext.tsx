import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SaveSlotsContextValue = {
  saveManagerOpen: boolean;
  openSaveManager: () => void;
  closeSaveManager: () => void;
  switchToProfile: (id: string) => Promise<void>;
  createNewSave: (optionalDisplayName?: string) => Promise<void>;
  duplicateProfile: (
    sourceId: string,
    optionalDisplayName?: string,
  ) => Promise<void>;
  deleteSave: (id: string) => Promise<void>;
  renameSave: (id: string, newDisplayName: string) => Promise<void>;
};

const SaveSlotsContext = createContext<SaveSlotsContextValue | null>(null);

export function SaveSlotsProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: Omit<
    SaveSlotsContextValue,
    "saveManagerOpen" | "openSaveManager" | "closeSaveManager"
  >;
}) {
  const [saveManagerOpen, setSaveManagerOpen] = useState(false);

  const openSaveManager = useCallback(() => setSaveManagerOpen(true), []);
  const closeSaveManager = useCallback(() => setSaveManagerOpen(false), []);

  const merged = useMemo(
    () => ({
      ...value,
      saveManagerOpen,
      openSaveManager,
      closeSaveManager,
    }),
    [value, saveManagerOpen, openSaveManager, closeSaveManager],
  );

  return (
    <SaveSlotsContext.Provider value={merged}>
      {children}
    </SaveSlotsContext.Provider>
  );
}

export function useSaveSlots(): SaveSlotsContextValue {
  const ctx = useContext(SaveSlotsContext);
  if (!ctx) {
    throw new Error("useSaveSlots must be used under SaveSlotsProvider");
  }
  return ctx;
}

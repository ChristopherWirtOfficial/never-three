import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "jotai";
import {
  collectSaveStateFromStore,
  durableGameAtoms,
} from "../game/persistGameStore";
import { saveProfile } from "../game/saves";

type GameSessionValue = {
  profileId: string;
  profileName: string;
  setSessionProfile: (profileId: string, profileName: string) => void;
};

const GameSessionContext = createContext<GameSessionValue | null>(null);

export function useGameSession(): GameSessionValue {
  const value = useContext(GameSessionContext);
  if (!value) {
    throw new Error("useGameSession must be used under GameSessionProvider");
  }
  return value;
}

const AUTOSAVE_DEBOUNCE_MS = 1200;

function PersistGameAutosave() {
  const store = useStore();
  const { profileId, profileName } = useGameSession();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    const state = collectSaveStateFromStore(store);
    void saveProfile(profileId, profileName, state);
  }, [store, profileId, profileName]);

  useEffect(() => {
    const scheduleFlush = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        flush();
      }, AUTOSAVE_DEBOUNCE_MS);
    };

    const unsubs = durableGameAtoms.map((atom) =>
      store.sub(atom, scheduleFlush),
    );

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        flush();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      unsubs.forEach((unsub) => unsub());
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [store, flush]);

  return null;
}

export function GameSessionProvider({
  children,
  profileId: initialProfileId,
  profileName: initialProfileName,
}: {
  children: ReactNode;
  profileId: string;
  profileName: string;
}) {
  const [profileId, setProfileId] = useState(initialProfileId);
  const [profileName, setProfileName] = useState(initialProfileName);

  const setSessionProfile = useCallback((nextId: string, nextName: string) => {
    setProfileId(nextId);
    setProfileName(nextName);
  }, []);

  const value = useMemo(
    () => ({ profileId, profileName, setSessionProfile }),
    [profileId, profileName, setSessionProfile],
  );

  return (
    <GameSessionContext.Provider value={value}>
      <PersistGameAutosave />
      {children}
    </GameSessionContext.Provider>
  );
}

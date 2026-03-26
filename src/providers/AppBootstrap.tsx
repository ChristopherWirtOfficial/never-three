import { ChakraProvider } from "@chakra-ui/react";
import { Provider as JotaiProvider } from "jotai";
import { createStore } from "jotai/vanilla";
import type { Store } from "jotai/vanilla/store";
import { useEffect, useState, type ReactNode } from "react";
import { boot } from "../game/saves";
import { hydrateStoreFromSaveState } from "../game/persistGameStore";
import { system } from "../theme/system";
import { GameSessionProvider } from "./GameSessionContext";

type ReadyState = {
  store: Store;
  profileId: string;
  profileName: string;
};

/**
 * Loads save profile from localStorage, creates an isolated Jotai store, hydrates atoms, then mounts the app.
 */
export function AppBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState<ReadyState | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await boot();
      if (cancelled) return;
      const store = createStore();
      hydrateStoreFromSaveState(store, result.state);
      if (cancelled) return;
      setReady({
        store,
        profileId: result.id,
        profileName: result.name,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <JotaiProvider store={ready.store}>
      <GameSessionProvider
        profileId={ready.profileId}
        profileName={ready.profileName}
      >
        <ChakraProvider value={system}>{children}</ChakraProvider>
      </GameSessionProvider>
    </JotaiProvider>
  );
}

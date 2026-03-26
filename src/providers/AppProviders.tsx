import { ChakraProvider } from "@chakra-ui/react";
import { Provider as JotaiProvider } from "jotai";
import type { ReactNode } from "react";
import { system } from "../theme/system";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <JotaiProvider>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </JotaiProvider>
  );
}

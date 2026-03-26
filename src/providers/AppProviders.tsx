import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { system } from "../theme/system";

export function AppProviders({ children }: { children: ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}

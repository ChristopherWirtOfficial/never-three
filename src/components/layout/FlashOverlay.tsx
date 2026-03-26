import { Box } from "@chakra-ui/react";

export function FlashOverlay({ color }: { color: string }) {
  return (
    <Box
      position="fixed"
      inset={0}
      bg={`${color}1a`}
      pointerEvents="none"
      zIndex={100}
    />
  );
}

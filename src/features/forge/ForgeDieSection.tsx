import { Box, Text, VStack } from "@chakra-ui/react";
import type { Die } from "../../game/types";
import { ReforgeFaceRow } from "./ReforgeFaceRow";

interface ForgeDieSectionProps {
  die: Die;
  dieIdx: number;
  showDieLabel: boolean;
  totalReforges: number;
  reforgeCap: number;
  hex: number;
  reforgeUp: (dieIndex: number, faceIndex: number) => void;
  reforgeDown: (dieIndex: number, faceIndex: number) => void;
}

export function ForgeDieSection({
  die,
  dieIdx,
  showDieLabel,
  totalReforges,
  reforgeCap,
  hex,
  reforgeUp,
  reforgeDown,
}: ForgeDieSectionProps) {
  return (
    <Box>
      {showDieLabel && (
        <Text
          fontSize="11px"
          color="never.forgeLabel"
          letterSpacing="2px"
          mb={2}
          fontWeight={700}
        >
          DIE {dieIdx + 1}
        </Text>
      )}

      <VStack align="stretch" gap="6px">
        {die.map((faceVal, faceIdx) => (
          <ReforgeFaceRow
            key={`${dieIdx}-${faceIdx}-${faceVal}`}
            faceIdx={faceIdx}
            dieIdx={dieIdx}
            faceVal={faceVal}
            reforgeCap={reforgeCap}
            totalReforges={totalReforges}
            hex={hex}
            reforgeUp={reforgeUp}
            reforgeDown={reforgeDown}
          />
        ))}
      </VStack>
    </Box>
  );
}

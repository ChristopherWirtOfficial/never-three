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
  incrementDieFace: (dieIndex: number, faceIndex: number) => void;
  decrementDieFace: (dieIndex: number, faceIndex: number) => void;
}

export function ForgeDieSection({
  die,
  dieIdx,
  showDieLabel,
  totalReforges,
  reforgeCap,
  hex,
  incrementDieFace,
  decrementDieFace,
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
            incrementDieFace={incrementDieFace}
            decrementDieFace={decrementDieFace}
          />
        ))}
      </VStack>
    </Box>
  );
}

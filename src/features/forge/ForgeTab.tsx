import { Box } from "@chakra-ui/react";
import type { Die } from "../../game/types";
import { ForgeDieSection } from "./ForgeDieSection";
import { ForgeFooter } from "./ForgeFooter";

interface ForgeTabProps {
  dice: Die[];
  totalReforges: number;
  reforgeCap: number;
  hex: number;
  incrementDieFace: (dieIndex: number, faceIndex: number) => void;
  decrementDieFace: (dieIndex: number, faceIndex: number) => void;
}

export function ForgeTab({
  dice,
  totalReforges,
  reforgeCap,
  hex,
  incrementDieFace,
  decrementDieFace,
}: ForgeTabProps) {
  const multiDie = dice.length > 1;

  return (
    <Box py={3}>
      {dice.map((die, dieIdx) => (
        <Box key={dieIdx} mb={4}>
          <ForgeDieSection
            die={die}
            dieIdx={dieIdx}
            showDieLabel={multiDie}
            totalReforges={totalReforges}
            reforgeCap={reforgeCap}
            hex={hex}
            incrementDieFace={incrementDieFace}
            decrementDieFace={decrementDieFace}
          />
          <ForgeFooter totalReforges={totalReforges} reforgeCap={reforgeCap} />
        </Box>
      ))}
    </Box>
  );
}

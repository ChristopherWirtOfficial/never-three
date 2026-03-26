import { Box } from "@chakra-ui/react";
import type { Die } from "../../game/types";
import { ForgeDieSection } from "./ForgeDieSection";
import { ForgeFooter } from "./ForgeFooter";

interface ForgeTabProps {
  dice: Die[];
  totalDieReforgeCount: number;
  maxReforgeFaceValue: number;
  hexBalance: number;
  incrementDieFace: (dieIndex: number, faceIndex: number) => void;
  decrementDieFace: (dieIndex: number, faceIndex: number) => void;
}

export function ForgeTab({
  dice,
  totalDieReforgeCount,
  maxReforgeFaceValue,
  hexBalance,
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
            totalDieReforgeCount={totalDieReforgeCount}
            maxReforgeFaceValue={maxReforgeFaceValue}
            hexBalance={hexBalance}
            incrementDieFace={incrementDieFace}
            decrementDieFace={decrementDieFace}
          />
          <ForgeFooter
            totalDieReforgeCount={totalDieReforgeCount}
            maxReforgeFaceValue={maxReforgeFaceValue}
          />
        </Box>
      ))}
    </Box>
  );
}

import { Box } from "@chakra-ui/react";
import type { Die } from "../../game/types";
import { ForgeDieSection } from "./ForgeDieSection";
import { ForgeFooter } from "./ForgeFooter";

interface ForgeTabProps {
  dice: Die[];
  totalReforges: number;
  reforgeCap: number;
  hex: number;
  reforgeUp: (dieIndex: number, faceIndex: number) => void;
  reforgeDown: (dieIndex: number, faceIndex: number) => void;
}

export function ForgeTab({
  dice,
  totalReforges,
  reforgeCap,
  hex,
  reforgeUp,
  reforgeDown,
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
            reforgeUp={reforgeUp}
            reforgeDown={reforgeDown}
          />
          <ForgeFooter totalReforges={totalReforges} reforgeCap={reforgeCap} />
        </Box>
      ))}
    </Box>
  );
}

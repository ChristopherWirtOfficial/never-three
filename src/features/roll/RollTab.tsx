import { Text, VStack } from "@chakra-ui/react";
import type { Die } from "../../game/types";
import { AutoRollCountdown } from "./AutoRollCountdown";
import { RollBadges } from "./RollBadges";
import { RollFeedback } from "./RollFeedback";

interface RollTabProps {
  aLv: number;
  sLv: number;
  multi: number;
  armor: number;
  pMult: number;
  roll: number | null;
  rolling: boolean;
  streak: number;
  saved: boolean;
  stunned: boolean;
  rolls: number;
  threes: number;
  started: boolean;
  autoPct: number;
  autoMs: number | null;
  currentDie: Die;
}

export function RollTab({
  aLv,
  sLv,
  multi,
  armor,
  pMult,
  roll,
  rolling,
  streak,
  saved,
  stunned,
  rolls,
  threes,
  started,
  autoPct,
  autoMs,
  currentDie,
}: RollTabProps) {
  return (
    <VStack align="center" justify="center" minH="100%" gap={3} pb="8px">
      <RollBadges
        currentDie={currentDie}
        aLv={aLv}
        sLv={sLv}
        multi={multi}
        armor={armor}
      />

      <RollFeedback
        roll={roll}
        rolling={rolling}
        saved={saved}
        stunned={stunned}
        streak={streak}
        multi={multi}
        pMult={pMult}
      />

      {autoMs !== null && autoMs > 0 && started && (
        <AutoRollCountdown
          autoPct={autoPct}
          autoMs={autoMs}
          started={started}
        />
      )}

      {!started && (
        <Text
          fontSize="13px"
          color="never.subtle"
          lineHeight={1.7}
          textAlign="center"
          maxW="260px"
          mt="8px"
        >
          Roll dice. Earn gold.
          <br />
          Don&apos;t roll a{" "}
          <Text as="span" color="never.danger" fontWeight={700}>
            multiple of 3
          </Text>
          .
        </Text>
      )}

      {started && (
        <Text fontSize="10px" color="never.stat">
          {rolls} rolls · {threes} threes
          {rolls > 0 && ` · ${((1 - threes / rolls) * 100).toFixed(1)}% safe`}
        </Text>
      )}
    </VStack>
  );
}

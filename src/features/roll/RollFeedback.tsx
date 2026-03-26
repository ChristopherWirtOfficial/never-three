import { Text, VStack } from "@chakra-ui/react";
import { fmt, streakMultiplier } from "../../game/constants";

interface RollFeedbackProps {
  roll: number | null;
  rolling: boolean;
  stunned: boolean;
  streak: number;
  multi: number;
  pMult: number;
}

export function RollFeedback({
  roll,
  rolling,
  stunned,
  streak,
  multi,
  pMult,
}: RollFeedbackProps) {
  const dangerous = roll !== null && roll % 3 === 0;
  const safe = roll !== null && roll % 3 !== 0;

  return (
    <VStack minH="60px" align="center" justify="center" gap={0}>
      {dangerous && !rolling && !stunned && (
        <Text
          color="never.danger"
          fontSize="28px"
          fontWeight={900}
          textShadow="0 0 24px rgba(255, 51, 85, 0.4)"
          letterSpacing="6px"
        >
          {roll === 3 ? "T H R E E" : `÷ 3`}
        </Text>
      )}

      {safe && !rolling && roll != null && (
        <Text
          color="never.streak"
          fontSize="28px"
          fontWeight={900}
          textShadow="0 0 20px rgba(68, 255, 187, 0.27)"
        >
          +
          {fmt(
            Math.floor(
              roll * streakMultiplier(Math.max(0, streak - 1)) * multi * pMult,
            ),
          )}
          g
        </Text>
      )}

      {safe && !rolling && streak > 2 && (
        <Text color="never.streakMuted" fontSize="12px" mt="2px">
          streak ×{streakMultiplier(streak - 1).toFixed(2)}
        </Text>
      )}
    </VStack>
  );
}

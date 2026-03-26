import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { AUTO, SPEED, fmt, streakMultiplier } from "./constants";
import type { Die } from "./types";

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
  const dangerous = roll !== null && roll % 3 === 0;
  const safe = roll !== null && roll % 3 !== 0;
  const dangerCount = currentDie.filter((f) => f % 3 === 0).length;

  const badge = (child: ReactNode, c: string) => (
    <Text
      as="span"
      display="inline-block"
      fontSize="11px"
      px="10px"
      py="3px"
      bg="never.panel"
      borderRadius="6px"
      border="1px solid"
      borderColor="never.panelBorder"
      color={c}
    >
      {child}
    </Text>
  );

  return (
    <VStack align="center" justify="center" minH="100%" gap={3} pb="8px">
      <Flex gap={2} flexWrap="wrap" justify="center">
        {badge(
          <>
            [{currentDie.join(",")}]
            {dangerCount > 0 ? ` 💀${dangerCount}` : " ✓"}
          </>,
          dangerCount > 0 ? "never.dangerBadge" : "never.streak",
        )}
        {badge(
          <>{aLv > 0 ? `AUTO ${AUTO[aLv].name}` : `TAP ${SPEED[sLv].name}`}</>,
          aLv > 0 ? "never.autoTeal" : "never.subtle",
        )}
        {badge(<>×{multi}</>, "never.multi")}
        {armor > 0 && badge(<>🛡{armor}%</>, "never.armorBlue")}
      </Flex>

      <VStack minH="60px" align="center" justify="center" gap={0}>
        {saved && (
          <Text
            color="never.armor"
            fontSize="18px"
            fontWeight={700}
            textShadow="0 0 14px rgba(255, 170, 0, 0.4)"
          >
            🛡️ ARMOR BLOCKED!
          </Text>
        )}

        {dangerous && !saved && !rolling && !stunned && (
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

        {safe && !rolling && (
          <Text
            color="never.streak"
            fontSize="28px"
            fontWeight={900}
            textShadow="0 0 20px rgba(68, 255, 187, 0.27)"
          >
            +
            {fmt(
              Math.floor(
                roll *
                  streakMultiplier(Math.max(0, streak - 1)) *
                  multi *
                  pMult,
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

      {autoMs !== null && autoMs > 0 && started && (
        <Box w="80%" maxW="240px" textAlign="center">
          <Text fontSize="10px" color="never.dim" letterSpacing="1px" mb="4px">
            NEXT ROLL
          </Text>
          <Box
            w="100%"
            h="8px"
            borderRadius="4px"
            bg="never.cooldownTrack"
            overflow="hidden"
          >
            <Box
              h="100%"
              borderRadius="4px"
              w={`${autoPct * 100}%`}
              bg="linear-gradient(90deg, #44ffbb33, #44ffbb99)"
              transition={autoPct < 0.05 ? "none" : "width 0.05s linear"}
            />
          </Box>
          <Text fontSize="11px" color="never.stat" mt="4px">
            {(((1 - autoPct) * autoMs) / 1000).toFixed(1)}s
          </Text>
        </Box>
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

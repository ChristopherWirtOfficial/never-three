import { Box, Flex, Text } from "@chakra-ui/react";
import { formatGold } from "../../game/format-gold";

interface TopBarProps {
  gold: number;
  hex: number;
  streak: number;
  hexStreak: number;
  best: number;
  prestige: number;
  pMult: number;
}

export function TopBar({
  gold,
  hex,
  streak,
  hexStreak,
  best,
  prestige,
  pMult,
}: TopBarProps) {
  return (
    <Flex
      px="18px"
      py="10px"
      flexShrink={0}
      justify="space-between"
      align="baseline"
      borderBottom="1px solid"
      borderColor="never.border"
    >
      <Flex gap={4} align="baseline">
        <Box>
          <Text
            fontSize="9px"
            color="never.goldMuted"
            letterSpacing="2px"
            fontWeight={700}
          >
            GOLD
          </Text>
          <Text
            fontSize="26px"
            fontWeight={900}
            color="never.gold"
            textShadow="0 0 16px rgba(255, 221, 51, 0.27)"
            lineHeight={1.1}
          >
            {formatGold(gold)}
          </Text>
        </Box>
        <Box>
          <Text
            fontSize="9px"
            color="never.hexMuted"
            letterSpacing="2px"
            fontWeight={700}
          >
            HEX
          </Text>
          <Text
            fontSize="20px"
            fontWeight={900}
            color="never.hex"
            textShadow="0 0 12px rgba(187, 136, 255, 0.2)"
            lineHeight={1.1}
          >
            {Math.floor(hex)}
          </Text>
        </Box>
      </Flex>
      <Box textAlign="right" lineHeight={1.5}>
        <Text fontSize="12px" color="never.muted">
          STREAK{" "}
          <Text
            as="span"
            color={streak > 0 ? "never.streak" : "never.streakDim"}
            fontWeight={900}
            fontSize="16px"
          >
            {streak}
          </Text>
        </Text>
        {hexStreak > 0 && (
          <Text fontSize="11px" color="never.hexStreak">
            🔮 ×{hexStreak}
          </Text>
        )}
        <Text fontSize="10px" color="never.dim">
          BEST {best}
          {prestige > 0 && (
            <Text as="span" color="never.prestige">
              {" "}
              · ★{prestige} ×{pMult.toFixed(1)}
            </Text>
          )}
        </Text>
      </Box>
    </Flex>
  );
}

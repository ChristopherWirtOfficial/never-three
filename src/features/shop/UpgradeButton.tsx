import { Box, Text, chakra } from "@chakra-ui/react";
import { fmt } from "../../game/constants";

interface UpgradeButtonProps {
  icon: string;
  label: string;
  current: string;
  next: string;
  cost: number;
  maxed: boolean;
  gold: number;
  onBuy: () => void;
}

export function UpgradeButton({
  icon,
  label,
  current,
  next,
  cost,
  maxed,
  gold,
  onBuy,
}: UpgradeButtonProps) {
  const affordable = gold >= cost;
  return (
    <chakra.button
      type="button"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      py="12px"
      px="14px"
      bg={
        maxed
          ? "never.panelMuted"
          : affordable
            ? "linear-gradient(135deg, #132e1e, #0b1a10)"
            : "never.panelMuted"
      }
      border="1px solid"
      borderColor={
        maxed
          ? "never.panelBorderMuted"
          : affordable
            ? "never.streakBorder"
            : "never.rowBorder"
      }
      borderRadius="12px"
      color="never.text"
      cursor={maxed || !affordable ? "default" : "pointer"}
      opacity={maxed ? 0.35 : 1}
      fontFamily="monospace"
      transition="background 0.2s, border-color 0.2s, opacity 0.2s"
      textAlign="left"
      onClick={onBuy}
      disabled={maxed || !affordable}
    >
      <Box>
        <Text
          fontSize="10px"
          color={
            maxed
              ? "never.stat"
              : affordable
                ? "never.upgradeLabel"
                : "never.dim"
          }
          mb="2px"
        >
          {icon} {label}
        </Text>
        <Text fontSize="14px" fontWeight={700}>
          {maxed ? (
            <Text as="span" color="never.streak">
              MAX
            </Text>
          ) : (
            <>
              <Text
                as="span"
                color={affordable ? "never.textFaint" : "never.costMuted"}
              >
                {current}
              </Text>{" "}
              <Text
                as="span"
                color={affordable ? "never.streak" : "never.upgradeArrow"}
              >
                → {next}
              </Text>
            </>
          )}
        </Text>
      </Box>
      {!maxed && (
        <Text
          fontSize="13px"
          fontWeight={700}
          whiteSpace="nowrap"
          color={affordable ? "never.gold" : "never.subtle"}
          opacity={affordable ? 1 : 0.7}
        >
          {fmt(cost)}g
        </Text>
      )}
    </chakra.button>
  );
}

import { Box, Flex, Text, chakra } from "@chakra-ui/react";
import { fmt, reforgeCost } from "../../game/constants";

interface ReforgeFaceRowProps {
  faceIdx: number;
  dieIdx: number;
  faceVal: number;
  reforgeCap: number;
  totalReforges: number;
  hex: number;
  incrementDieFace: (dieIndex: number, faceIndex: number) => void;
  decrementDieFace: (dieIndex: number, faceIndex: number) => void;
}

export function ReforgeFaceRow({
  faceIdx,
  dieIdx,
  faceVal,
  reforgeCap,
  totalReforges,
  hex,
  incrementDieFace,
  decrementDieFace,
}: ReforgeFaceRowProps) {
  const isDangerous = faceVal % 3 === 0;
  const atCap = faceVal >= reforgeCap;
  const atFloor = faceVal <= 1;
  const upCost = atCap ? 0 : reforgeCost(faceVal, faceVal + 1, totalReforges);
  const downCost = atFloor
    ? 0
    : reforgeCost(faceVal, faceVal - 1, totalReforges);
  const canAffordUp = hex >= upCost && !atCap;
  const canAffordDown = hex >= downCost && !atFloor;
  const nextDangerous = !atCap && (faceVal + 1) % 3 === 0;
  const prevDangerous = !atFloor && (faceVal - 1) % 3 === 0;

  return (
    <Flex
      align="center"
      gap="6px"
      py="10px"
      px="12px"
      bg={isDangerous ? "never.forgeDangerBg" : "never.panel"}
      border="1px solid"
      borderColor={isDangerous ? "#ff335533" : "never.panelBorder"}
      borderRadius="10px"
    >
      <Box w="18px" textAlign="center">
        <Text fontSize="10px" color="never.dim">
          F{faceIdx + 1}
        </Text>
      </Box>

      <Box w="36px" textAlign="center">
        <Text
          fontSize="20px"
          fontWeight={900}
          color={isDangerous ? "never.dangerSoft" : "never.streak"}
          textShadow={
            isDangerous
              ? "0 0 10px rgba(255, 51, 85, 0.27)"
              : "0 0 10px rgba(68, 255, 187, 0.2)"
          }
        >
          {faceVal}
        </Text>
      </Box>

      <Box w="20px" textAlign="center" fontSize="12px">
        {isDangerous ? "💀" : ""}
      </Box>

      <Box flex={1} />

      <chakra.button
        type="button"
        minW="64px"
        h="36px"
        borderRadius="8px"
        px="8px"
        bg={
          atFloor
            ? "never.btnDisabledBg"
            : canAffordDown
              ? prevDangerous
                ? "linear-gradient(135deg, #2a1a1e, #1a0e12)"
                : isDangerous
                  ? "linear-gradient(135deg, #2a1a2e, #1a0e1a)"
                  : "never.rowDeep"
              : "never.panel"
        }
        border="1px solid"
        borderColor={
          atFloor
            ? "never.panelBorderDim"
            : canAffordDown
              ? isDangerous
                ? "#bb88ff44"
                : prevDangerous
                  ? "#ff335544"
                  : "never.rowDeep2"
              : "never.rowBorder"
        }
        color={
          atFloor
            ? "never.btnDisabledFg"
            : canAffordDown
              ? prevDangerous
                ? "never.dangerBadge"
                : isDangerous
                  ? "never.hex"
                  : "never.subtle"
              : "never.stat"
        }
        fontSize="11px"
        fontWeight={700}
        fontFamily="monospace"
        cursor={atFloor || !canAffordDown ? "default" : "pointer"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="3px"
        onClick={() => decrementDieFace(dieIdx, faceIdx)}
        disabled={atFloor || !canAffordDown}
      >
        {atFloor ? (
          "—"
        ) : (
          <>
            <Text as="span" fontSize="14px">
              −
            </Text>
            <span>{fmt(downCost)}🔮</span>
          </>
        )}
      </chakra.button>

      <chakra.button
        type="button"
        minW="80px"
        h="36px"
        borderRadius="8px"
        px="10px"
        bg={
          atCap
            ? "never.btnDisabledBg"
            : canAffordUp
              ? isDangerous
                ? "linear-gradient(135deg, #2a1a2e, #1a0e1a)"
                : nextDangerous
                  ? "linear-gradient(135deg, #2a1a1e, #1a0e12)"
                  : "linear-gradient(135deg, #12261a, #0b1810)"
              : "never.panel"
        }
        border="1px solid"
        borderColor={
          atCap
            ? "never.panelBorderDim"
            : canAffordUp
              ? isDangerous
                ? "#bb88ff44"
                : nextDangerous
                  ? "#ff335544"
                  : "never.streakBorder"
              : "never.rowBorder"
        }
        color={
          atCap
            ? "never.btnDisabledFg"
            : canAffordUp
              ? isDangerous
                ? "never.hex"
                : nextDangerous
                  ? "never.dangerBadge"
                  : "never.streak"
              : "never.stat"
        }
        fontSize="11px"
        fontWeight={700}
        fontFamily="monospace"
        cursor={atCap || !canAffordUp ? "default" : "pointer"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="4px"
        onClick={() => incrementDieFace(dieIdx, faceIdx)}
        disabled={atCap || !canAffordUp}
      >
        {atCap ? (
          "MAX"
        ) : (
          <>
            <Text as="span" fontSize="14px">
              +
            </Text>
            <span>{fmt(upCost)}🔮</span>
          </>
        )}
      </chakra.button>
    </Flex>
  );
}

import { Box, Flex, Text, chakra } from "@chakra-ui/react";
import { DiceFace } from "./DiceFace";
import type { TabId } from "./types";

interface BottomDockProps {
  roll: number | null;
  sides: number;
  saved: boolean;
  stunned: boolean;
  stunPct: number;
  stunMs: number;
  rolling: boolean;
  locked: boolean;
  aLv: number;
  cdPct: number;
  tab: TabId;
  onRoll: () => void;
  onTabChange: (tab: TabId) => void;
}

const TABS: [TabId, string][] = [
  ["roll", "🎲 ROLL"],
  ["shop", "⬆ SHOP"],
  ["forge", "🔥 FORGE"],
  ["log", "📜 LOG"],
];

export function BottomDock({
  roll,
  sides,
  saved,
  stunned,
  stunPct,
  stunMs,
  rolling,
  locked,
  aLv,
  cdPct,
  tab,
  onRoll,
  onTabChange,
}: BottomDockProps) {
  return (
    <Box
      flexShrink={0}
      borderTop="1px solid"
      borderColor="never.border"
      bg="never.dock"
    >
      <Flex
        direction="column"
        align="center"
        py="12px"
        px="18px"
        pb="8px"
        gap="6px"
        cursor={locked ? "default" : "pointer"}
        userSelect="none"
        css={{ WebkitTapHighlightColor: "transparent" }}
        onClick={() => {
          if (!locked) onRoll();
        }}
        onKeyDown={(e) => {
          if (locked) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRoll();
          }
        }}
        role="button"
        tabIndex={locked ? -1 : 0}
        aria-label="Roll die"
      >
        <Box
          w="148px"
          h="148px"
          borderRadius="24px"
          bg={
            stunned
              ? "linear-gradient(145deg,#2a0a12,#18060a)"
              : saved
                ? "linear-gradient(145deg,#2a2510,#181505)"
                : "linear-gradient(145deg,#16162a,#0d0d18)"
          }
          border="2px solid"
          borderColor={
            stunned
              ? "#ff335566"
              : saved
                ? "#ffaa0044"
                : locked
                  ? "never.dieBorderLocked"
                  : "never.streakBorder"
          }
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
          animation={
            rolling
              ? "neverSpin 0.18s ease"
              : !locked && !aLv
                ? "neverPulse 2.5s ease infinite"
                : undefined
          }
          opacity={locked && !rolling && !stunned ? 0.55 : 1}
          transition="border-color 0.3s, background 0.3s, opacity 0.3s"
        >
          {roll === null ? (
            <Text
              color="never.hint"
              fontSize="15px"
              textAlign="center"
              lineHeight={1.7}
              letterSpacing="1px"
            >
              TAP
              <br />
              TO
              <br />
              ROLL
            </Text>
          ) : (
            <DiceFace
              value={roll}
              sides={sides}
              isThree={roll !== null && roll % 3 === 0 && !saved}
              rolling={rolling}
            />
          )}
        </Box>

        {stunned ? (
          <Box w="160px" textAlign="center">
            <Box
              w="100%"
              h="6px"
              borderRadius="3px"
              bg="never.stunTrack"
              overflow="hidden"
            >
              <Box
                h="100%"
                borderRadius="3px"
                w={`${stunPct * 100}%`}
                bg="linear-gradient(90deg,#ff335566,#ff3355cc)"
              />
            </Box>
            <Text
              fontSize="12px"
              color="never.stun"
              mt="6px"
              fontWeight={700}
              animation="neverStunPulse 1s ease infinite"
            >
              STUNNED {(((1 - stunPct) * stunMs) / 1000).toFixed(1)}s
            </Text>
          </Box>
        ) : (
          <Box
            w="148px"
            h="4px"
            borderRadius="2px"
            bg="never.cooldownTrack"
            overflow="hidden"
          >
            <Box
              h="100%"
              borderRadius="2px"
              w={`${cdPct * 100}%`}
              bg={
                cdPct < 1
                  ? "linear-gradient(90deg,#44ffbb55,#44ffbbbb)"
                  : "never.streak"
              }
            />
          </Box>
        )}
      </Flex>

      <Flex borderTop="1px solid" borderColor="never.border">
        {TABS.map(([key, label]) => (
          <chakra.button
            key={key}
            type="button"
            flex={1}
            py={3}
            bg="transparent"
            border="none"
            borderTop="2px solid"
            borderTopColor={tab === key ? "never.streak" : "transparent"}
            color={tab === key ? "never.streak" : "never.tabInactive"}
            fontFamily="monospace"
            fontSize="12px"
            fontWeight={700}
            cursor="pointer"
            letterSpacing="1px"
            onClick={() => onTabChange(key)}
          >
            {label}
          </chakra.button>
        ))}
      </Flex>
    </Box>
  );
}

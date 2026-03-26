import { Box, Flex, Text } from "@chakra-ui/react";
import { useGameState } from "./useGameState";
import { RollTab } from "./RollTab";
import { ShopTab } from "./ShopTab";
import { LogTab } from "./LogTab";
import { ForgeTab } from "./ForgeTab";
import { BottomDock } from "./BottomDock";

function formatGold(gold: number): string {
  if (gold < 1e3) return Math.floor(gold).toString();
  if (gold >= 1e12) return (gold / 1e12).toFixed(1) + "T";
  if (gold >= 1e9) return (gold / 1e9).toFixed(1) + "B";
  if (gold >= 1e6) return (gold / 1e6).toFixed(1) + "M";
  return (gold / 1e3).toFixed(1) + "K";
}

export default function NeverThree() {
  const g = useGameState();

  return (
    <>
      {g.flash && (
        <Box
          position="fixed"
          inset={0}
          bg={`${g.flash}1a`}
          pointerEvents="none"
          zIndex={100}
        />
      )}

      <Box
        h="100dvh"
        w="100%"
        maxW="480px"
        mx="auto"
        display="flex"
        flexDirection="column"
        bg="never.bg"
        color="never.text"
        fontFamily="monospace"
        overflow="hidden"
        animation={g.shook ? "neverShake 0.3s ease" : undefined}
      >
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
                {formatGold(g.gold)}
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
                {Math.floor(g.hex)}
              </Text>
            </Box>
          </Flex>
          <Box textAlign="right" lineHeight={1.5}>
            <Text fontSize="12px" color="never.muted">
              STREAK{" "}
              <Text
                as="span"
                color={g.streak > 0 ? "never.streak" : "never.streakDim"}
                fontWeight={900}
                fontSize="16px"
              >
                {g.streak}
              </Text>
            </Text>
            {g.hexStreak > 0 && (
              <Text fontSize="11px" color="never.hexStreak">
                🔮 ×{g.hexStreak}
              </Text>
            )}
            <Text fontSize="10px" color="never.dim">
              BEST {g.best}
              {g.prestige > 0 && (
                <Text as="span" color="never.prestige">
                  {" "}
                  · ★{g.prestige} ×{g.pMult.toFixed(1)}
                </Text>
              )}
            </Text>
          </Box>
        </Flex>

        <Box flex={1} overflow="auto" px="18px">
          {g.tab === "roll" && (
            <RollTab
              aLv={g.aLv}
              sLv={g.sLv}
              multi={g.multi}
              armor={g.armor}
              pMult={g.pMult}
              roll={g.roll}
              rolling={g.rolling}
              streak={g.streak}
              saved={g.saved}
              stunned={g.stunned}
              rolls={g.rolls}
              threes={g.threes}
              started={g.started}
              autoPct={g.autoPct}
              autoMs={g.autoMs}
              currentDie={g.currentDie}
            />
          )}
          {g.tab === "shop" && (
            <ShopTab
              gold={g.gold}
              earned={g.earned}
              sLv={g.sLv}
              aLv={g.aLv}
              mLv={g.mLv}
              rLv={g.rLv}
              tLv={g.tLv}
              prestige={g.prestige}
              prestigeReq={g.prestigeReq}
              canPrestige={g.canPrestige}
              buy={g.buy}
              doPrestige={g.doPrestige}
            />
          )}
          {g.tab === "forge" && (
            <ForgeTab
              dice={g.dice}
              totalReforges={g.totalReforges}
              reforgeCap={g.reforgeCap}
              hex={g.hex}
              reforgeUp={g.reforgeUp}
              reforgeDown={g.reforgeDown}
            />
          )}
          {g.tab === "log" && <LogTab log={g.log} />}
        </Box>

        <BottomDock
          roll={g.roll}
          sides={g.currentDie.length}
          saved={g.saved}
          stunned={g.stunned}
          stunPct={g.stunPct}
          stunMs={g.stunMs}
          rolling={g.rolling}
          locked={g.locked}
          aLv={g.aLv}
          cdPct={g.cdPct}
          tab={g.tab}
          onRoll={() => {
            if (!g.locked) g.doRoll();
          }}
          onTabChange={g.setTab}
        />
      </Box>
    </>
  );
}

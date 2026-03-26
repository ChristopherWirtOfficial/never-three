import { Box } from "@chakra-ui/react";
import { BottomDock } from "../components/layout/BottomDock";
import { FlashOverlay } from "../components/layout/FlashOverlay";
import { TopBar } from "../components/layout/TopBar";
import { ForgeTab } from "../features/forge/ForgeTab";
import { LogTab } from "../features/log/LogTab";
import { RollTab } from "../features/roll/RollTab";
import { ShopTab } from "../features/shop/ShopTab";
import { useGameState } from "../game/useGameState";

export default function NeverThree() {
  const g = useGameState();

  return (
    <>
      {g.flash && <FlashOverlay color={g.flash} />}

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
        <TopBar
          gold={g.gold}
          hex={g.hex}
          streak={g.streak}
          hexStreak={g.hexStreak}
          best={g.best}
          prestige={g.prestige}
          pMult={g.pMult}
        />

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

import { Box, Text, VStack, chakra } from "@chakra-ui/react";
import { SPEED, AUTO, MULTI, ARMOR, STUN, fmt } from "../../game/constants";
import type { UpgradeType } from "../../game/types";
import { UpgradeButton } from "./UpgradeButton";

interface ShopTabProps {
  gold: number;
  earned: number;
  sLv: number;
  aLv: number;
  mLv: number;
  rLv: number;
  tLv: number;
  prestige: number;
  prestigeReq: number;
  canPrestige: boolean;
  buy: (type: UpgradeType) => void;
  doPrestige: () => void;
}

interface UpgradeConfig {
  type: UpgradeType;
  icon: string;
  label: string;
  lv: number;
  arr: {
    cost: number;
    name?: string;
    x?: number;
    pct?: number;
    ms?: number | null;
  }[];
  display: (item: UpgradeConfig["arr"][number]) => string;
}

export function ShopTab({
  gold,
  earned,
  sLv,
  aLv,
  mLv,
  rLv,
  tLv,
  prestige,
  prestigeReq,
  canPrestige,
  buy,
  doPrestige,
}: ShopTabProps) {
  const upgrades: UpgradeConfig[] = [
    {
      type: "multi",
      icon: "💰",
      label: "GOLD MULTI",
      lv: mLv,
      arr: MULTI,
      display: (i) => `×${i.x}`,
    },
    {
      type: "speed",
      icon: "⚡",
      label: "ROLL SPEED",
      lv: sLv,
      arr: SPEED,
      display: (i) => i.name as string,
    },
    {
      type: "auto",
      icon: "🔄",
      label: "AUTO-ROLL",
      lv: aLv,
      arr: AUTO,
      display: (i) => i.name as string,
    },
    {
      type: "stun",
      icon: "💊",
      label: "STUN RECOVERY",
      lv: tLv,
      arr: STUN,
      display: (i) => i.name as string,
    },
    {
      type: "armor",
      icon: "🛡️",
      label: "STREAK ARMOR",
      lv: rLv,
      arr: ARMOR,
      display: (i) => `${i.pct}%`,
    },
  ];

  return (
    <VStack align="stretch" gap={2} py={3}>
      {upgrades.map((u) => {
        const maxed = u.lv >= u.arr.length - 1;
        return (
          <UpgradeButton
            key={u.type}
            icon={u.icon}
            label={u.label}
            current={u.display(u.arr[u.lv])}
            next={maxed ? "" : u.display(u.arr[u.lv + 1])}
            cost={maxed ? 0 : u.arr[u.lv + 1].cost}
            maxed={maxed}
            gold={gold}
            onBuy={() => buy(u.type)}
          />
        );
      })}

      <Box mt="6px">
        <Text
          fontSize="10px"
          color="never.prestige"
          letterSpacing="2px"
          mb="6px"
        >
          ★ PRESTIGE
        </Text>
        <chakra.button
          type="button"
          w="100%"
          py="14px"
          borderRadius="12px"
          border="1px solid"
          borderColor={canPrestige ? "never.prestigeBorder" : "never.rowBorder"}
          bg={
            canPrestige
              ? "linear-gradient(135deg,#1a0a2e,#0d051a)"
              : "never.panelMuted"
          }
          color={canPrestige ? "never.prestige" : "never.subtle"}
          fontFamily="monospace"
          fontSize="13px"
          fontWeight={700}
          cursor={canPrestige ? "pointer" : "default"}
          opacity={canPrestige ? 1 : 0.7}
          onClick={doPrestige}
          disabled={!canPrestige}
        >
          {canPrestige ? (
            <>
              PRESTIGE → ★{prestige + 1} (×
              {(1 + (prestige + 1) * 0.5).toFixed(1)})
            </>
          ) : (
            <>
              <Text as="span" color="never.dim">
                {fmt(earned)}
              </Text>{" "}
              /{" "}
              <Text as="span" color="never.prestigeMuted">
                {fmt(prestigeReq)}g
              </Text>
            </>
          )}
        </chakra.button>
      </Box>
    </VStack>
  );
}

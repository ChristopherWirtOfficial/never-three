import { Box, Text, VStack, chakra } from "@chakra-ui/react";
import {
  SPEED,
  AUTO,
  MULTI,
  STREAK_RETENTION,
  STUN,
  fmt,
} from "../../game/constants";
import type { UpgradeType } from "../../game/types";
import { UpgradeButton } from "./UpgradeButton";

interface ShopTabProps {
  gold: number;
  lifetimeGoldEarned: number;
  speedUpgradeLevel: number;
  autoRollUpgradeLevel: number;
  multiplierUpgradeLevel: number;
  streakRetentionUpgradeLevel: number;
  stunUpgradeLevel: number;
  prestige: number;
  prestigeReq: number;
  canPrestige: boolean;
  purchaseUpgrade: (type: UpgradeType) => void;
  commitPrestige: () => void;
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
  lifetimeGoldEarned,
  speedUpgradeLevel,
  autoRollUpgradeLevel,
  multiplierUpgradeLevel,
  streakRetentionUpgradeLevel,
  stunUpgradeLevel,
  prestige,
  prestigeReq,
  canPrestige,
  purchaseUpgrade,
  commitPrestige,
}: ShopTabProps) {
  const upgrades: UpgradeConfig[] = [
    {
      type: "multi",
      icon: "💰",
      label: "GOLD MULTI",
      lv: multiplierUpgradeLevel,
      arr: MULTI,
      display: (i) => `×${i.x}`,
    },
    {
      type: "speed",
      icon: "⚡",
      label: "ROLL SPEED",
      lv: speedUpgradeLevel,
      arr: SPEED,
      display: (i) => i.name as string,
    },
    {
      type: "auto",
      icon: "🔄",
      label: "AUTO-ROLL",
      lv: autoRollUpgradeLevel,
      arr: AUTO,
      display: (i) => i.name as string,
    },
    {
      type: "stun",
      icon: "💊",
      label: "STUN RECOVERY",
      lv: stunUpgradeLevel,
      arr: STUN,
      display: (i) => i.name as string,
    },
    {
      type: "retention",
      icon: "🔒",
      label: "STREAK RETENTION",
      lv: streakRetentionUpgradeLevel,
      arr: STREAK_RETENTION,
      display: (i) => `${i.pct}% kept`,
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
            onBuy={() => purchaseUpgrade(u.type)}
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
          onClick={commitPrestige}
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
                {fmt(lifetimeGoldEarned)}
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

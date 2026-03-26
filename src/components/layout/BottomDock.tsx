import { Box } from "@chakra-ui/react";
import type { TabId } from "../../game/types";
import { DockRollZone } from "./DockRollZone";
import { DockTabBar } from "./DockTabBar";

interface BottomDockProps {
  roll: number | null;
  sides: number;
  stunned: boolean;
  stunPct: number;
  /** Denominator for stunned countdown bar (locked at stun apply, not live shop tier). */
  stunActiveDurationMs: number;
  rolling: boolean;
  locked: boolean;
  aLv: number;
  cdPct: number;
  tab: TabId;
  onRoll: () => void;
  onTabChange: (tab: TabId) => void;
}

export function BottomDock(props: BottomDockProps) {
  const { tab, onTabChange, onRoll, ...rollZone } = props;
  return (
    <Box
      flexShrink={0}
      borderTop="1px solid"
      borderColor="never.border"
      bg="never.dock"
    >
      <DockRollZone {...rollZone} onRoll={onRoll} />
      <DockTabBar tab={tab} onTabChange={onTabChange} />
    </Box>
  );
}

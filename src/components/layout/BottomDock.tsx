import { Box } from '@chakra-ui/react'
import type { TabId } from '../../game/types'
import { DockRollZone } from './DockRollZone'
import { DockTabBar } from './DockTabBar'

interface BottomDockProps {
	lastRolledFace: number | null
	sides: number
	isStunned: boolean
	stunRecoveryProgress: number
	/** Denominator for stunned countdown (locked at stun apply, not live shop tier). */
	stunActiveDurationMs: number
	isRolling: boolean
	locked: boolean
	autoRollUpgradeLevel: number
	isRollCooldownActive: boolean
	rollCooldownProgress: number
	cdMs: number
	autoRollProgress: number
	autoMs: number | null
	runStarted: boolean
	goldStreak: number
	goldStreakMult: number
	hexRewardStreak: number
	hexStreakMult: number
	bestGoldStreak: number
	bestHexRewardStreak: number
	activeGameTab: TabId
	onRoll: () => void
	onTabChange: (tab: TabId) => void
}

export function BottomDock(props: BottomDockProps) {
	const { activeGameTab, onTabChange, onRoll, ...rollZone } = props
	return (
		<Box
			flexShrink={0}
			borderTop='1px solid'
			borderColor='never.border'
			bg='never.dock'
		>
			<DockRollZone
				{...rollZone}
				onRoll={onRoll}
			/>
			<DockTabBar
				activeGameTab={activeGameTab}
				onTabChange={onTabChange}
			/>
		</Box>
	)
}

import { Box } from '@chakra-ui/react'
import type { TabId } from '../../game/types'
import { DockRollZone } from './DockRollZone'
import { DockTabBar } from './DockTabBar'

interface BottomDockProps {
	lastRolledFace: number | null
	dieValues: number[]
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
	pipletStreak: number
	pipletStreakMult: number
	hexRewardStreak: number
	hexStreakMult: number
	bestPipletStreak: number
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
			borderColor='app.border'
			bg='app.dock'
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

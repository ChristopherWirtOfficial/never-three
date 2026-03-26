import { Text, VStack } from '@chakra-ui/react'
import type { Die } from '../../game/types'
import { AutoRollCountdown } from './AutoRollCountdown'
import { RollBadges } from './RollBadges'
import { RollFeedback } from './RollFeedback'

interface RollTabProps {
	autoRollUpgradeLevel: number
	speedUpgradeLevel: number
	multi: number
	streakRetentionPct: number
	prestigeGoldMultiplier: number
	lastRolledFace: number | null
	isRolling: boolean
	goldStreak: number
	isStunned: boolean
	totalRollCount: number
	multipleOfThreeRollCount: number
	runStarted: boolean
	autoRollProgress: number
	autoMs: number | null
	currentDie: Die
}

export function RollTab({
	autoRollUpgradeLevel,
	speedUpgradeLevel,
	multi,
	streakRetentionPct,
	prestigeGoldMultiplier,
	lastRolledFace,
	isRolling,
	goldStreak,
	isStunned,
	totalRollCount,
	multipleOfThreeRollCount,
	runStarted,
	autoRollProgress,
	autoMs,
	currentDie,
}: RollTabProps) {
	return (
		<VStack
			align='center'
			justify='center'
			minH='100%'
			gap={3}
			pb='8px'
		>
			<RollBadges
				currentDie={currentDie}
				autoRollUpgradeLevel={autoRollUpgradeLevel}
				speedUpgradeLevel={speedUpgradeLevel}
				multi={multi}
				streakRetentionPct={streakRetentionPct}
			/>

			<RollFeedback
				lastRolledFace={lastRolledFace}
				isRolling={isRolling}
				isStunned={isStunned}
				goldStreak={goldStreak}
				multi={multi}
				prestigeGoldMultiplier={prestigeGoldMultiplier}
			/>

			{autoMs !== null && autoMs > 0 && runStarted && (
				<AutoRollCountdown
					autoRollProgress={autoRollProgress}
					autoMs={autoMs}
					runStarted={runStarted}
				/>
			)}

			{!runStarted && (
				<Text
					fontSize='13px'
					color='never.subtle'
					lineHeight={1.7}
					textAlign='center'
					maxW='260px'
					mt='8px'
				>
					Roll dice. Earn gold.
					<br />
					Don&apos;t roll a{' '}
					<Text
						as='span'
						color='never.danger'
						fontWeight={700}
					>
						multiple of 3
					</Text>
					.
				</Text>
			)}

			{runStarted && (
				<Text
					fontSize='10px'
					color='never.stat'
				>
					{totalRollCount} rolls · {multipleOfThreeRollCount} threes
					{totalRollCount > 0 &&
						` · ${((1 - multipleOfThreeRollCount / totalRollCount) * 100).toFixed(1)}% safe`}
				</Text>
			)}
		</VStack>
	)
}

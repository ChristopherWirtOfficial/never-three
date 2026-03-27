import { Text, VStack } from '@chakra-ui/react'
import { RollFeedback } from './RollFeedback'

interface RollTabProps {
	prestigeGoldMultiplier: number
	lastRolledFace: number | null
	isRolling: boolean
	goldStreak: number
	isStunned: boolean
	goldMultiplier: number
	totalRollCount: number
	multipleOfThreeRollCount: number
	runStarted: boolean
}

export function RollTab({
	prestigeGoldMultiplier,
	lastRolledFace,
	isRolling,
	goldStreak,
	isStunned,
	goldMultiplier,
	totalRollCount,
	multipleOfThreeRollCount,
	runStarted,
}: RollTabProps) {
	return (
		<VStack
			align='center'
			justify='center'
			minH='100%'
			gap={3}
			pb='8px'
		>
			<RollFeedback
				lastRolledFace={lastRolledFace}
				isRolling={isRolling}
				isStunned={isStunned}
				goldStreak={goldStreak}
				goldMultiplier={goldMultiplier}
				prestigeGoldMultiplier={prestigeGoldMultiplier}
			/>

			{!runStarted && (
				<Text
					fontSize='13px'
					color='app.subtle'
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
						color='app.danger'
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
					color='app.stat'
				>
					{totalRollCount} rolls · {multipleOfThreeRollCount} threes
					{totalRollCount > 0 &&
						` · ${((1 - multipleOfThreeRollCount / totalRollCount) * 100).toFixed(1)}% safe`}
				</Text>
			)}
		</VStack>
	)
}

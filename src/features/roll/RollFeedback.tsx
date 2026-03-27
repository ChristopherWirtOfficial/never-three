import { Text, VStack } from '@chakra-ui/react'
import { streakMultiplier } from '../../game/balanceConfig'
import { formatCompactNumber } from '../../game/constants'
import { useBalanceConfig } from '../../game/useBalanceConfig'

interface RollFeedbackProps {
	lastRolledFace: number | null
	isRolling: boolean
	isStunned: boolean
	pipletStreak: number
	pipletMultiplier: number
	prestigePipletMultiplier: number
}

export function RollFeedback({
	lastRolledFace,
	isRolling,
	isStunned,
	pipletStreak,
	pipletMultiplier,
	prestigePipletMultiplier,
}: RollFeedbackProps) {
	const balance = useBalanceConfig()
	const dangerous = lastRolledFace !== null && lastRolledFace % 3 === 0
	const safe = lastRolledFace !== null && lastRolledFace % 3 !== 0

	return (
		<VStack
			minH='60px'
			align='center'
			justify='center'
			gap={0}
		>
			{dangerous && !isRolling && !isStunned && (
				<Text
					color='app.danger'
					fontSize='28px'
					fontWeight={900}
					textShadow='0 0 24px rgba(255, 51, 85, 0.4)'
					letterSpacing='6px'
				>
					{lastRolledFace === 3 ? 'T H R E E' : `÷ 3`}
				</Text>
			)}

			{safe && !isRolling && lastRolledFace != null && (
				<Text
					color='app.streak'
					fontSize='28px'
					fontWeight={900}
					textShadow='0 0 20px rgba(68, 255, 187, 0.27)'
				>
					+
					{formatCompactNumber(
						Math.floor(
							lastRolledFace *
								streakMultiplier(Math.max(0, pipletStreak - 1), balance) *
								pipletMultiplier *
								prestigePipletMultiplier
						)
					)}
					pl
				</Text>
			)}

			{safe && !isRolling && pipletStreak > 2 && (
				<Text
					color='app.streakMuted'
					fontSize='12px'
					mt='2px'
				>
					streak ×{streakMultiplier(pipletStreak - 1, balance).toFixed(2)}
				</Text>
			)}
		</VStack>
	)
}

import { Flex, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { AUTO, SPEED } from '../../game/constants'
import type { Die } from '../../game/types'

interface RollBadgesProps {
	currentDie: Die
	autoRollUpgradeLevel: number
	speedUpgradeLevel: number
	multi: number
	streakRetentionPct: number
}

export function RollBadges({
	currentDie,
	autoRollUpgradeLevel,
	speedUpgradeLevel,
	multi,
	streakRetentionPct,
}: RollBadgesProps) {
	const dangerCount = currentDie.filter(f => f % 3 === 0).length

	const badge = (child: ReactNode, c: string) => (
		<Text
			as='span'
			display='inline-block'
			fontSize='11px'
			px='10px'
			py='3px'
			bg='never.panel'
			borderRadius='6px'
			border='1px solid'
			borderColor='never.panelBorder'
			color={c}
		>
			{child}
		</Text>
	)

	return (
		<Flex
			gap={2}
			flexWrap='wrap'
			justify='center'
		>
			{badge(
				<>
					[{currentDie.join(',')}]{dangerCount > 0 ? ` 💀${dangerCount}` : ' ✓'}
				</>,
				dangerCount > 0 ? 'never.dangerBadge' : 'never.streak'
			)}
			{badge(
				<>
					{autoRollUpgradeLevel > 0
						? `AUTO ${AUTO[autoRollUpgradeLevel].name}`
						: `TAP ${SPEED[speedUpgradeLevel].name}`}
				</>,
				autoRollUpgradeLevel > 0 ? 'never.autoTeal' : 'never.subtle'
			)}
			{badge(<>×{multi}</>, 'never.multi')}
			{streakRetentionPct > 0 && badge(<>🔒{streakRetentionPct}% streak</>, 'never.armorBlue')}
		</Flex>
	)
}

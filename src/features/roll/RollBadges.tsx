import { Flex, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { AUTO, SPEED } from '../../game/constants'
import type { Die } from '../../game/types'

interface RollBadgesProps {
	currentDie: Die
	autoRollUpgradeLevel: number
	speedUpgradeLevel: number
	goldMultiplier: number
	streakRetentionPct: number
}

export function RollBadges({
	currentDie,
	autoRollUpgradeLevel,
	speedUpgradeLevel,
	goldMultiplier,
	streakRetentionPct,
}: RollBadgesProps) {
	const dangerCount = currentDie.filter(face => face % 3 === 0).length

	const badge = (child: ReactNode, colorToken: string) => (
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
			color={colorToken}
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
			{badge(<>×{goldMultiplier}</>, 'never.multi')}
			{streakRetentionPct > 0 && badge(<>🔒{streakRetentionPct}% streak</>, 'never.armorBlue')}
		</Flex>
	)
}

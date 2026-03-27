import { Flex, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { clampUpgradeLevel } from '../../game/balanceConfig'
import { useBalanceConfig } from '../../game/useBalanceConfig'
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
	const balance = useBalanceConfig()
	const dangerCount = currentDie.filter(face => face % 3 === 0).length

	const autoLv = clampUpgradeLevel(autoRollUpgradeLevel, balance.auto.length)
	const speedLv = clampUpgradeLevel(speedUpgradeLevel, balance.speed.length)
	const autoName = balance.auto[autoLv].name
	const speedName = balance.speed[speedLv].name

	const badge = (child: ReactNode, colorToken: string) => (
		<Text
			as='span'
			display='inline-block'
			fontSize='11px'
			px='10px'
			py='3px'
			bg='app.panel'
			borderRadius='6px'
			border='1px solid'
			borderColor='app.panelBorder'
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
				dangerCount > 0 ? 'app.dangerBadge' : 'app.streak'
			)}
			{badge(
				<>{autoRollUpgradeLevel > 0 ? `AUTO ${autoName}` : `TAP ${speedName}`}</>,
				autoRollUpgradeLevel > 0 ? 'app.autoTeal' : 'app.subtle'
			)}
			{badge(<>×{goldMultiplier}</>, 'app.multi')}
			{streakRetentionPct > 0 && badge(<>🔒{streakRetentionPct}% streak</>, 'app.armorBlue')}
		</Flex>
	)
}

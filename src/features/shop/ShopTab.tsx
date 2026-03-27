import { Box, Text, VStack, chakra } from '@chakra-ui/react'
import { clampUpgradeLevel } from '../../game/balanceConfig'
import { formatCompactNumber } from '../../game/constants'
import type { UpgradeType } from '../../game/types'
import { useBalanceConfig } from '../../game/useBalanceConfig'
import { UpgradeButton } from './UpgradeButton'

interface ShopTabProps {
	piplets: number
	lifetimePipletsEarned: number
	speedUpgradeLevel: number
	autoRollUpgradeLevel: number
	multiplierUpgradeLevel: number
	streakRetentionUpgradeLevel: number
	stunUpgradeLevel: number
	prestige: number
	prestigeReq: number
	canPrestige: boolean
	purchaseUpgrade: (type: UpgradeType) => void
	commitPrestige: () => void
}

interface UpgradeConfig {
	type: UpgradeType
	icon: string
	label: string
	tierIndex: number
	arr: {
		cost: number
		name?: string
		x?: number
		pct?: number
		ms?: number | null
	}[]
	display: (item: UpgradeConfig['arr'][number]) => string
}

export function ShopTab({
	piplets,
	lifetimePipletsEarned,
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
	const balance = useBalanceConfig()

	// Upgrade order is mirrored in BalanceTab tier sections — keep both in sync when reordering.
	const upgrades: UpgradeConfig[] = [
		{
			type: 'multi',
			icon: '💰',
			label: 'PIPLET MULTI',
			tierIndex: clampUpgradeLevel(multiplierUpgradeLevel, balance.multi.length),
			arr: balance.multi,
			display: tier => `×${tier.x}`,
		},
		{
			type: 'speed',
			icon: '⚡',
			label: 'ROLL SPEED',
			tierIndex: clampUpgradeLevel(speedUpgradeLevel, balance.speed.length),
			arr: balance.speed,
			display: tier => tier.name as string,
		},
		{
			type: 'auto',
			icon: '🔄',
			label: 'AUTO-ROLL',
			tierIndex: clampUpgradeLevel(autoRollUpgradeLevel, balance.auto.length),
			arr: balance.auto,
			display: tier => tier.name as string,
		},
		{
			type: 'stun',
			icon: '💊',
			label: 'STUN RECOVERY',
			tierIndex: clampUpgradeLevel(stunUpgradeLevel, balance.stun.length),
			arr: balance.stun,
			display: tier => tier.name as string,
		},
		{
			type: 'retention',
			icon: '🔒',
			label: 'STREAK RETENTION',
			tierIndex: clampUpgradeLevel(streakRetentionUpgradeLevel, balance.streakRetention.length),
			arr: balance.streakRetention,
			display: tier => `${tier.pct}% kept`,
		},
	]

	const prestigeMultNext = 1 + (prestige + 1) * balance.prestigePipletMultPerLevel

	return (
		<VStack
			align='stretch'
			gap={2}
			py={3}
		>
			{upgrades.map(upgrade => {
				const maxed = upgrade.tierIndex >= upgrade.arr.length - 1
				return (
					<UpgradeButton
						key={upgrade.type}
						icon={upgrade.icon}
						label={upgrade.label}
						current={upgrade.display(upgrade.arr[upgrade.tierIndex])}
						next={maxed ? '' : upgrade.display(upgrade.arr[upgrade.tierIndex + 1])}
						cost={maxed ? 0 : upgrade.arr[upgrade.tierIndex + 1].cost}
						maxed={maxed}
						piplets={piplets}
						onBuy={() => purchaseUpgrade(upgrade.type)}
					/>
				)
			})}

			<Box mt='6px'>
				<Text
					fontSize='10px'
					color='app.prestige'
					letterSpacing='2px'
					mb='6px'
				>
					★ PRESTIGE
				</Text>
				<chakra.button
					type='button'
					w='100%'
					py='14px'
					borderRadius='12px'
					border='1px solid'
					borderColor={canPrestige ? 'app.prestigeBorder' : 'app.rowBorder'}
					bg={canPrestige ? 'linear-gradient(135deg,#1a0a2e,#0d051a)' : 'app.panelMuted'}
					color={canPrestige ? 'app.prestige' : 'app.subtle'}
					fontFamily='monospace'
					fontSize='13px'
					fontWeight={700}
					cursor={canPrestige ? 'pointer' : 'default'}
					opacity={canPrestige ? 1 : 0.7}
					onClick={commitPrestige}
					disabled={!canPrestige}
				>
					{canPrestige ? (
						<>
							PRESTIGE → ★{prestige + 1} (×{prestigeMultNext.toFixed(1)})
						</>
					) : (
						<>
							<Text
								as='span'
								color='app.dim'
							>
								{formatCompactNumber(lifetimePipletsEarned)}
							</Text>{' '}
							/{' '}
							<Text
								as='span'
								color='app.prestigeMuted'
							>
								{formatCompactNumber(prestigeReq)} pl
							</Text>
						</>
					)}
				</chakra.button>
			</Box>
		</VStack>
	)
}

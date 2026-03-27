import { Box, Text, chakra } from '@chakra-ui/react'
import { formatCompactNumber } from '../../game/constants'

interface UpgradeButtonProps {
	icon: string
	label: string
	current: string
	next: string
	cost: number
	maxed: boolean
	gold: number
	onBuy: () => void
}

export function UpgradeButton({
	icon,
	label,
	current,
	next,
	cost,
	maxed,
	gold,
	onBuy,
}: UpgradeButtonProps) {
	const affordable = gold >= cost
	return (
		<chakra.button
			type='button'
			display='flex'
			alignItems='center'
			justifyContent='space-between'
			w='100%'
			py='12px'
			px='14px'
			bg={
				maxed
					? 'app.panelMuted'
					: affordable
						? 'linear-gradient(135deg, #132e1e, #0b1a10)'
						: 'app.panelMuted'
			}
			border='1px solid'
			borderColor={
				maxed ? 'app.panelBorderMuted' : affordable ? 'app.streakBorder' : 'app.rowBorder'
			}
			borderRadius='12px'
			color='app.text'
			cursor={maxed || !affordable ? 'default' : 'pointer'}
			opacity={maxed ? 0.35 : 1}
			fontFamily='monospace'
			transition='background 0.2s, border-color 0.2s, opacity 0.2s'
			textAlign='left'
			onClick={onBuy}
			disabled={maxed || !affordable}
		>
			<Box>
				<Text
					fontSize='10px'
					color={maxed ? 'app.stat' : affordable ? 'app.upgradeLabel' : 'app.dim'}
					mb='2px'
				>
					{icon} {label}
				</Text>
				<Text
					fontSize='14px'
					fontWeight={700}
				>
					{maxed ? (
						<Text
							as='span'
							color='app.streak'
						>
							MAX
						</Text>
					) : (
						<>
							<Text
								as='span'
								color={affordable ? 'app.textFaint' : 'app.costMuted'}
							>
								{current}
							</Text>{' '}
							<Text
								as='span'
								color={affordable ? 'app.streak' : 'app.upgradeArrow'}
							>
								→ {next}
							</Text>
						</>
					)}
				</Text>
			</Box>
			{!maxed && (
				<Text
					fontSize='13px'
					fontWeight={700}
					whiteSpace='nowrap'
					color={affordable ? 'app.gold' : 'app.subtle'}
					opacity={affordable ? 1 : 0.7}
				>
					{formatCompactNumber(cost)}g
				</Text>
			)}
		</chakra.button>
	)
}

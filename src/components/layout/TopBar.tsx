import { Box, Flex, Text, chakra } from '@chakra-ui/react'
import { formatGold } from '../../game/format-gold'

interface TopBarProps {
	gold: number
	hexBalance: number
	goldStreak: number
	bestGoldStreak: number
	goldStreakMult: number
	hexStreakMult: number
	prestige: number
	prestigeGoldMultiplier: number
	onOpenSaves?: () => void
}

export function TopBar({
	gold,
	hexBalance,
	goldStreak,
	bestGoldStreak,
	goldStreakMult,
	hexStreakMult,
	prestige,
	prestigeGoldMultiplier,
	onOpenSaves,
}: TopBarProps) {
	return (
		<Flex
			px='18px'
			py='10px'
			flexShrink={0}
			justify='space-between'
			align='baseline'
			borderBottom='1px solid'
			borderColor='never.border'
		>
			<Flex
				gap={4}
				align='baseline'
			>
				<Box>
					<Text
						fontSize='9px'
						color='never.goldMuted'
						letterSpacing='2px'
						fontWeight={700}
					>
						GOLD
					</Text>
					<Text
						fontSize='26px'
						fontWeight={900}
						color='never.gold'
						textShadow='0 0 16px rgba(255, 221, 51, 0.27)'
						lineHeight={1.1}
					>
						{formatGold(gold)}
					</Text>
				</Box>
				<Box>
					<Text
						fontSize='9px'
						color='never.hexMuted'
						letterSpacing='2px'
						fontWeight={700}
					>
						HEX
					</Text>
					<Text
						fontSize='20px'
						fontWeight={900}
						color='never.hex'
						textShadow='0 0 12px rgba(187, 136, 255, 0.2)'
						lineHeight={1.1}
					>
						{Math.floor(hexBalance)}
					</Text>
				</Box>
			</Flex>
			<Box
				textAlign='right'
				lineHeight={1.5}
			>
				{onOpenSaves && (
					<chakra.button
						type='button'
						display='block'
						ml='auto'
						mb='4px'
						px='8px'
						py='2px'
						borderRadius='4px'
						border='1px solid'
						borderColor='never.rowBorder'
						bg='transparent'
						color='never.dim'
						fontSize='9px'
						fontWeight={700}
						letterSpacing='0.12em'
						cursor='pointer'
						fontFamily='monospace'
						onClick={onOpenSaves}
					>
						SAVES
					</chakra.button>
				)}
				<Text
					fontSize='12px'
					color='never.muted'
				>
					STREAK{' '}
					<Text
						as='span'
						color={goldStreak > 0 ? 'never.streak' : 'never.streakDim'}
						fontWeight={900}
						fontSize='16px'
					>
						{goldStreak}
					</Text>
				</Text>
				<Text
					fontSize='11px'
					fontWeight={700}
					mb='2px'
					letterSpacing='0.02em'
				>
					<Text
						as='span'
						color='never.goldMuted'
						fontSize='9px'
						fontWeight={600}
						mr='3px'
					>
						G
					</Text>
					<Text
						as='span'
						color='never.streak'
					>
						×{goldStreakMult.toFixed(2)}
					</Text>
					<Text
						as='span'
						color='never.muted'
						mx='6px'
					>
						·
					</Text>
					<Text
						as='span'
						color='never.hexMuted'
						fontSize='9px'
						fontWeight={600}
						mr='3px'
					>
						H
					</Text>
					<Text
						as='span'
						color='never.hexStreak'
					>
						×{hexStreakMult.toFixed(2)}
					</Text>
				</Text>
				<Text
					fontSize='10px'
					color='never.dim'
				>
					BEST {bestGoldStreak}
					{prestige > 0 && (
						<Text
							as='span'
							color='never.prestige'
						>
							{' '}
							· ★{prestige} ×{prestigeGoldMultiplier.toFixed(1)}
						</Text>
					)}
				</Text>
			</Box>
		</Flex>
	)
}

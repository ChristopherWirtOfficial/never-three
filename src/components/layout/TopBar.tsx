import { Box, Flex, Text, chakra } from '@chakra-ui/react'
import { formatPiplets } from '../../game/format-piplets'

interface TopBarProps {
	piplets: number
	hexBalance: number
	prestige: number
	prestigePipletMultiplier: number
	onOpenSaves?: () => void
}

export function TopBar({
	piplets,
	hexBalance,
	prestige,
	prestigePipletMultiplier,
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
			borderColor='app.border'
		>
			<Flex
				gap={4}
				align='baseline'
			>
				<Box>
					<Text
						fontSize='9px'
						color='app.pipletMuted'
						letterSpacing='2px'
						fontWeight={700}
					>
						PIPLETS
					</Text>
					<Text
						fontSize='26px'
						fontWeight={900}
						color='app.piplet'
						textShadow='0 0 16px rgba(239, 174, 56, 0.3)'
						lineHeight={1.1}
					>
						{formatPiplets(piplets)}
					</Text>
				</Box>
				<Box>
					<Text
						fontSize='9px'
						color='app.hexMuted'
						letterSpacing='2px'
						fontWeight={700}
					>
						HEX
					</Text>
					<Text
						fontSize='20px'
						fontWeight={900}
						color='app.hex'
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
						mb={prestige > 0 ? '4px' : 0}
						px='8px'
						py='2px'
						borderRadius='4px'
						border='1px solid'
						borderColor='app.rowBorder'
						bg='transparent'
						color='app.dim'
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
				{prestige > 0 && (
					<Text
						fontSize='10px'
						color='app.dim'
					>
						<Text
							as='span'
							color='app.prestige'
						>
							★{prestige} ×{prestigePipletMultiplier.toFixed(1)}
						</Text>
					</Text>
				)}
			</Box>
		</Flex>
	)
}

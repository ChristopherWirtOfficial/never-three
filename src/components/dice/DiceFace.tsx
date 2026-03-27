import { Box, SimpleGrid } from '@chakra-ui/react'

interface DiceFaceProps {
	value: number
	sides: number
	isThree: boolean
	/** Muted rendering during the roll cycle — no glow, low contrast. */
	dimmed?: boolean
}

const DOT_PATTERNS: Record<number, number[]> = {
	1: [4],
	2: [0, 8],
	3: [0, 4, 8],
	4: [0, 2, 6, 8],
	5: [0, 2, 4, 6, 8],
	6: [0, 2, 3, 5, 6, 8],
}

export function DiceFace({ value, sides, isThree, dimmed = false }: DiceFaceProps) {
	const liveColor = isThree ? 'app.dangerFace' : 'app.streak'
	const liveGlow = isThree
		? '0 0 12px #ff3355, 0 0 24px #ff335544'
		: '0 0 12px #44ffbb, 0 0 24px #44ffbb44'

	const dotColor = dimmed
		? isThree
			? 'rgba(255, 51, 85, 0.32)'
			: 'rgba(68, 255, 187, 0.28)'
		: liveColor
	const dotGlow = dimmed ? 'none' : liveGlow

	if (sides === 6) {
		const active = DOT_PATTERNS[value] ?? []
		return (
			<SimpleGrid
				columns={3}
				gap='10px'
				w='100%'
				h='100%'
				p='18px'
			>
				{Array.from({ length: 9 }).map((_, i) => (
					<Box
						key={`dot-${i}`}
						w='100%'
						aspectRatio={1}
						borderRadius='50%'
						bg={active.includes(i) ? dotColor : 'transparent'}
						boxShadow={active.includes(i) ? dotGlow : 'none'}
					/>
				))}
			</SimpleGrid>
		)
	}

	const numColor = dimmed
		? isThree
			? 'rgba(255, 51, 85, 0.35)'
			: 'rgba(68, 255, 187, 0.30)'
		: liveColor

	const numShadow = dimmed
		? 'none'
		: isThree
			? '0 0 20px #ff3355, 0 0 40px #ff335566'
			: '0 0 20px #44ffbb, 0 0 40px #44ffbb44'

	return (
		<Box
			w='100%'
			h='100%'
			display='flex'
			alignItems='center'
			justifyContent='center'
			fontFamily='monospace'
			fontSize={value >= 100 ? '32px' : '48px'}
			fontWeight={900}
			color={numColor}
			textShadow={numShadow}
		>
			{value}
		</Box>
	)
}

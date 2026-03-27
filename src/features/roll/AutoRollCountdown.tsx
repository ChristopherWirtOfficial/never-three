import { Box, Text } from '@chakra-ui/react'

interface AutoRollCountdownProps {
	autoRollProgress: number
	autoMs: number
	runStarted: boolean
}

export function AutoRollCountdown({
	autoRollProgress,
	autoMs,
	runStarted,
}: AutoRollCountdownProps) {
	if (autoMs <= 0 || !runStarted) return null

	return (
		<Box
			w='80%'
			maxW='240px'
			textAlign='center'
		>
			<Text
				fontSize='10px'
				color='app.dim'
				letterSpacing='1px'
				mb='4px'
			>
				NEXT ROLL
			</Text>
			<Box
				w='100%'
				h='8px'
				borderRadius='4px'
				bg='app.cooldownTrack'
				overflow='hidden'
			>
				<Box
					h='100%'
					borderRadius='4px'
					w={`${autoRollProgress * 100}%`}
					bg='linear-gradient(90deg, #44ffbb33, #44ffbb99)'
					transition={autoRollProgress < 0.05 ? 'none' : 'width 0.05s linear'}
				/>
			</Box>
			<Text
				fontSize='11px'
				color='app.stat'
				mt='4px'
			>
				{(((1 - autoRollProgress) * autoMs) / 1000).toFixed(1)}s
			</Text>
		</Box>
	)
}

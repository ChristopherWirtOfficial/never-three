import { Box, Text, VStack } from '@chakra-ui/react'

interface LogTabProps {
	gameEventLog: string[]
}

export function LogTab({ gameEventLog }: LogTabProps) {
	if (gameEventLog.length === 0) {
		return (
			<Text
				color='never.stat'
				textAlign='center'
				py={10}
				fontSize='12px'
			>
				Nothing yet.
			</Text>
		)
	}

	return (
		<VStack
			align='stretch'
			gap='1px'
		>
			{gameEventLog.map((entry, i) => (
				<Box
					key={`${i}-${entry.slice(0, 24)}`}
					fontSize='11px'
					color={i === 0 ? 'never.logHead' : 'never.stat'}
					py='5px'
					borderBottom='1px solid'
					borderColor='never.logBorder'
					animation={i === 0 ? 'neverFadeIn 0.2s ease' : undefined}
				>
					{entry}
				</Box>
			))}
		</VStack>
	)
}

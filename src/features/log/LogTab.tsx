import { Box, Text, VStack } from '@chakra-ui/react'

interface LogTabProps {
	gameEventLog: string[]
}

export function LogTab({ gameEventLog }: LogTabProps) {
	if (gameEventLog.length === 0) {
		return (
			<Text
				color='app.stat'
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
			{gameEventLog.map((entry, index) => (
				<Box
					key={`${index}-${entry.slice(0, 24)}`}
					fontSize='11px'
					color={index === 0 ? 'app.logHead' : 'app.stat'}
					py='5px'
					borderBottom='1px solid'
					borderColor='app.logBorder'
					animation={index === 0 ? 'appFadeIn 0.2s ease' : undefined}
				>
					{entry}
				</Box>
			))}
		</VStack>
	)
}

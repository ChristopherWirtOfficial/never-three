import { Box, Text } from '@chakra-ui/react'

interface ForgeFooterProps {
	totalDieReforgeCount: number
	maxReforgeFaceValue: number
}

export function ForgeFooter({ totalDieReforgeCount, maxReforgeFaceValue }: ForgeFooterProps) {
	return (
		<Box
			mt='10px'
			py='8px'
			px='12px'
			bg='never.dock'
			borderRadius='8px'
			fontSize='10px'
			color='never.stat'
			lineHeight={1.6}
		>
			{totalDieReforgeCount} total reforges · cap: {maxReforgeFaceValue}
			<br />
			<Text
				as='span'
				color='#ff557766'
			>
				💀 = multiple of 3 (dangerous)
			</Text>
			{maxReforgeFaceValue < 7 && (
				<>
					<br />
					<Text
						as='span'
						color='#bb99ff66'
					>
						Raise cap above 6 to reach safe values
					</Text>
				</>
			)}
		</Box>
	)
}

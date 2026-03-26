import { Box, Text, VStack } from '@chakra-ui/react'
import type { Die } from '../../game/types'
import { ReforgeFaceRow } from './ReforgeFaceRow'

interface ForgeDieSectionProps {
	die: Die
	dieIdx: number
	showDieLabel: boolean
	totalDieReforgeCount: number
	maxReforgeFaceValue: number
	hexBalance: number
	incrementDieFace: (dieIndex: number, faceIndex: number) => void
	decrementDieFace: (dieIndex: number, faceIndex: number) => void
}

export function ForgeDieSection({
	die,
	dieIdx,
	showDieLabel,
	totalDieReforgeCount,
	maxReforgeFaceValue,
	hexBalance,
	incrementDieFace,
	decrementDieFace,
}: ForgeDieSectionProps) {
	return (
		<Box>
			{showDieLabel && (
				<Text
					fontSize='11px'
					color='never.forgeLabel'
					letterSpacing='2px'
					mb={2}
					fontWeight={700}
				>
					DIE {dieIdx + 1}
				</Text>
			)}

			<VStack
				align='stretch'
				gap='6px'
			>
				{die.map((faceVal, faceIdx) => (
					<ReforgeFaceRow
						key={`${dieIdx}-${faceIdx}-${faceVal}`}
						faceIdx={faceIdx}
						dieIdx={dieIdx}
						faceVal={faceVal}
						maxReforgeFaceValue={maxReforgeFaceValue}
						totalDieReforgeCount={totalDieReforgeCount}
						hexBalance={hexBalance}
						incrementDieFace={incrementDieFace}
						decrementDieFace={decrementDieFace}
					/>
				))}
			</VStack>
		</Box>
	)
}

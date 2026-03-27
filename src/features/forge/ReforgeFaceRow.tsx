import { Box, Flex, Text, chakra } from '@chakra-ui/react'
import { reforgeCost } from '../../game/balanceConfig'
import { formatCompactNumber } from '../../game/constants'
import { useBalanceConfig } from '../../game/useBalanceConfig'

interface ReforgeFaceRowProps {
	faceIndex: number
	dieIndex: number
	faceValue: number
	maxReforgeFaceValue: number
	totalDieReforgeCount: number
	hexBalance: number
	incrementDieFace: (dieIndex: number, faceIndex: number) => void
	decrementDieFace: (dieIndex: number, faceIndex: number) => void
}

export function ReforgeFaceRow({
	faceIndex,
	dieIndex,
	faceValue,
	maxReforgeFaceValue,
	totalDieReforgeCount,
	hexBalance,
	incrementDieFace,
	decrementDieFace,
}: ReforgeFaceRowProps) {
	const balance = useBalanceConfig()
	const isDangerous = faceValue % 3 === 0
	const atCap = faceValue >= maxReforgeFaceValue
	const atFloor = faceValue <= 1
	const upCost = atCap ? 0 : reforgeCost(faceValue, faceValue + 1, totalDieReforgeCount, balance)
	const downCost = atFloor
		? 0
		: reforgeCost(faceValue, faceValue - 1, totalDieReforgeCount, balance)
	const canAffordUp = hexBalance >= upCost && !atCap
	const canAffordDown = hexBalance >= downCost && !atFloor
	const nextDangerous = !atCap && (faceValue + 1) % 3 === 0
	const prevDangerous = !atFloor && (faceValue - 1) % 3 === 0

	return (
		<Flex
			align='center'
			gap='6px'
			py='10px'
			px='12px'
			bg={isDangerous ? 'app.forgeDangerBg' : 'app.panel'}
			border='1px solid'
			borderColor={isDangerous ? '#ff335533' : 'app.panelBorder'}
			borderRadius='10px'
		>
			<Box
				w='18px'
				textAlign='center'
			>
				<Text
					fontSize='10px'
					color='app.dim'
				>
					F{faceIndex + 1}
				</Text>
			</Box>

			<Box
				w='36px'
				textAlign='center'
			>
				<Text
					fontSize='20px'
					fontWeight={900}
					color={isDangerous ? 'app.dangerSoft' : 'app.streak'}
					textShadow={
						isDangerous ? '0 0 10px rgba(255, 51, 85, 0.27)' : '0 0 10px rgba(68, 255, 187, 0.2)'
					}
				>
					{faceValue}
				</Text>
			</Box>

			<Box
				w='20px'
				textAlign='center'
				fontSize='12px'
			>
				{isDangerous ? '💀' : ''}
			</Box>

			<Box flex={1} />

			<chakra.button
				type='button'
				minW='64px'
				h='36px'
				borderRadius='8px'
				px='8px'
				bg={
					atFloor
						? 'app.btnDisabledBg'
						: canAffordDown
							? prevDangerous
								? 'linear-gradient(135deg, #2a1a1e, #1a0e12)'
								: isDangerous
									? 'linear-gradient(135deg, #2a1a2e, #1a0e1a)'
									: 'app.rowDeep'
							: 'app.panel'
				}
				border='1px solid'
				borderColor={
					atFloor
						? 'app.panelBorderDim'
						: canAffordDown
							? isDangerous
								? '#bb88ff44'
								: prevDangerous
									? '#ff335544'
									: 'app.rowDeep2'
							: 'app.rowBorder'
				}
				color={
					atFloor
						? 'app.btnDisabledFg'
						: canAffordDown
							? prevDangerous
								? 'app.dangerBadge'
								: isDangerous
									? 'app.hex'
									: 'app.subtle'
							: 'app.stat'
				}
				fontSize='11px'
				fontWeight={700}
				fontFamily='monospace'
				cursor={atFloor || !canAffordDown ? 'default' : 'pointer'}
				display='flex'
				alignItems='center'
				justifyContent='center'
				gap='3px'
				onClick={() => decrementDieFace(dieIndex, faceIndex)}
				disabled={atFloor || !canAffordDown}
			>
				{atFloor ? (
					'—'
				) : (
					<>
						<Text
							as='span'
							fontSize='14px'
						>
							−
						</Text>
						<span>{formatCompactNumber(downCost)}🔮</span>
					</>
				)}
			</chakra.button>

			<chakra.button
				type='button'
				minW='80px'
				h='36px'
				borderRadius='8px'
				px='10px'
				bg={
					atCap
						? 'app.btnDisabledBg'
						: canAffordUp
							? isDangerous
								? 'linear-gradient(135deg, #2a1a2e, #1a0e1a)'
								: nextDangerous
									? 'linear-gradient(135deg, #2a1a1e, #1a0e12)'
									: 'linear-gradient(135deg, #12261a, #0b1810)'
							: 'app.panel'
				}
				border='1px solid'
				borderColor={
					atCap
						? 'app.panelBorderDim'
						: canAffordUp
							? isDangerous
								? '#bb88ff44'
								: nextDangerous
									? '#ff335544'
									: 'app.streakBorder'
							: 'app.rowBorder'
				}
				color={
					atCap
						? 'app.btnDisabledFg'
						: canAffordUp
							? isDangerous
								? 'app.hex'
								: nextDangerous
									? 'app.dangerBadge'
									: 'app.streak'
							: 'app.stat'
				}
				fontSize='11px'
				fontWeight={700}
				fontFamily='monospace'
				cursor={atCap || !canAffordUp ? 'default' : 'pointer'}
				display='flex'
				alignItems='center'
				justifyContent='center'
				gap='4px'
				onClick={() => incrementDieFace(dieIndex, faceIndex)}
				disabled={atCap || !canAffordUp}
			>
				{atCap ? (
					'MAX'
				) : (
					<>
						<Text
							as='span'
							fontSize='14px'
						>
							+
						</Text>
						<span>{formatCompactNumber(upCost)}🔮</span>
					</>
				)}
			</chakra.button>
		</Flex>
	)
}

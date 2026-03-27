import { Box, Flex, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { DiceFace } from '../dice/DiceFace'
import { RollRewardBubbles } from './RollRewardBubbles'

/** Die block (~20% up from original 120px). */
const DIE_SIZE = Math.round(120 * 1.2)
const STROKE_WIDTH = Math.round(4 * 1.2)
const DIE_RADIUS = Math.round(22 * 1.2)
/**
 * Clear space from the die’s farthest corner (half-diagonal) to the ring stroke’s inner edge.
 * Large enough that the circle reads as wrapping air, not hugging the die.
 */
const RING_INNER_GAP = 12

const dieHalfDiagonal = (DIE_SIZE / 2) * Math.SQRT2
/** Inner ring: stun + roll cooldown (stroke centerline radius). */
const INNER_RING_RADIUS = dieHalfDiagonal + RING_INNER_GAP + STROKE_WIDTH / 2

/** Gap between inner stroke outer edge and outer stroke inner edge. */
const AUTO_RING_GAP = 4
/** Outer ring: auto-roll countdown only. */
const OUTER_RING_RADIUS = INNER_RING_RADIUS + STROKE_WIDTH + AUTO_RING_GAP

const ringOuterExtent = OUTER_RING_RADIUS + STROKE_WIDTH / 2
/** Padding past the outer stroke for the timer label and edges. */
const SVG_EDGE_PAD = 14
const SVG_SIZE = Math.ceil(2 * (ringOuterExtent + SVG_EDGE_PAD))
const CX = SVG_SIZE / 2
const CY = SVG_SIZE / 2

const INNER_COOLDOWN_STROKE = '#44ffbb'
const OUTER_AUTO_STROKE = '#5ae0ff'

/**
 * Annulus progress via conic-gradient + radial mask (reliable; SVG stroke-dash was rendering
 * as a full circle in this app).
 */
function ConicRingDonut({
	centerlineRadius,
	strokeWidth,
	remaining01,
	color,
	zIndex,
}: {
	centerlineRadius: number
	strokeWidth: number
	/** 1 = full ring, 0 = empty (time left, same as arc-remaining in prior math). */
	remaining01: number
	color: string
	zIndex: number
}) {
	const outerR = centerlineRadius + strokeWidth / 2
	const innerR = Math.max(0, centerlineRadius - strokeWidth / 2)
	const rem = Math.max(0, Math.min(1, remaining01))
	/** Degrees of “time gone” (elapsed); empty region grows clockwise from 12 o’clock. */
	const emptyDeg = (1 - rem) * 360
	const mask = `radial-gradient(circle at center, transparent ${innerR}px, black ${innerR + 1}px)`

	return (
		<Box
			position='absolute'
			left='50%'
			top='50%'
			w={`${2 * outerR}px`}
			h={`${2 * outerR}px`}
			marginLeft={`-${outerR}px`}
			marginTop={`-${outerR}px`}
			borderRadius='50%'
			pointerEvents='none'
			zIndex={zIndex}
			background={
				rem <= 0
					? 'transparent'
					: `conic-gradient(from 0deg, transparent 0deg, transparent ${emptyDeg}deg, ${color} ${emptyDeg}deg, ${color} 360deg)`
			}
			style={{
				WebkitMask: mask,
				mask,
			}}
		/>
	)
}

interface DockRollZoneProps {
	lastRolledFace: number | null
	dieValues: number[]
	sides: number
	isStunned: boolean
	stunRecoveryProgress: number
	/** Denominator for stunned countdown (locked at stun apply). */
	stunActiveDurationMs: number
	isRolling: boolean
	locked: boolean
	autoRollUpgradeLevel: number
	isRollCooldownActive: boolean
	rollCooldownProgress: number
	cdMs: number
	autoRollProgress: number
	autoMs: number | null
	runStarted: boolean
	goldStreak: number
	goldStreakMult: number
	hexRewardStreak: number
	hexStreakMult: number
	bestGoldStreak: number
	bestHexRewardStreak: number
	onRoll: () => void
}

export function DockRollZone({
	lastRolledFace,
	dieValues,
	sides,
	isStunned,
	stunRecoveryProgress,
	stunActiveDurationMs,
	isRolling,
	locked,
	autoRollUpgradeLevel,
	isRollCooldownActive,
	rollCooldownProgress,
	cdMs,
	autoRollProgress,
	autoMs,
	runStarted,
	goldStreak,
	goldStreakMult,
	hexRewardStreak,
	hexStreakMult,
	bestGoldStreak,
	bestHexRewardStreak,
	onRoll,
}: DockRollZoneProps) {
	const autoEnabled = autoRollUpgradeLevel > 0 && autoMs !== null && autoMs > 0 && runStarted

	// Cycle through the die's actual face values while rolling (correct probability distribution).
	const [cyclingFace, setCyclingFace] = useState<number | null>(null)
	useEffect(() => {
		if (!isRolling || dieValues.length === 0) {
			setCyclingFace(null)
			return
		}
		const pick = () => setCyclingFace(dieValues[Math.floor(Math.random() * dieValues.length)])
		pick()
		const id = setInterval(pick, 90)
		return () => clearInterval(id)
	}, [isRolling, dieValues])

	const displayFace = isRolling && cyclingFace !== null ? cyclingFace : lastRolledFace

	// Fire a brief reveal animation the moment rolling stops.
	const [justRevealed, setJustRevealed] = useState(false)
	const prevIsRollingRef = useRef(isRolling)
	useEffect(() => {
		if (prevIsRollingRef.current && !isRolling && lastRolledFace !== null) {
			setJustRevealed(true)
			const t = setTimeout(() => setJustRevealed(false), 300)
			return () => clearTimeout(t)
		}
		prevIsRollingRef.current = isRolling
	}, [isRolling, lastRolledFace])

	let innerRingActive = false
	let innerRingElapsed = 0
	let innerRingStroke = INNER_COOLDOWN_STROKE
	let isStunRing = false

	if (isStunned) {
		innerRingActive = true
		isStunRing = true
		innerRingStroke = '#ff3355'
		innerRingElapsed = stunRecoveryProgress
	} else if (isRollCooldownActive && !isRolling) {
		innerRingActive = true
		innerRingElapsed = rollCooldownProgress
	}

	const innerRemaining = innerRingActive ? 1 - innerRingElapsed : 0

	const outerRingActive = autoEnabled && !isStunned && !isRollCooldownActive && autoRollProgress > 0
	const outerRingElapsed = autoRollProgress
	const outerRemaining = outerRingActive ? 1 - outerRingElapsed : 0

	const rollCooldownTotalMs = cdMs
	const innerTimerText = isStunned
		? ((1 - stunRecoveryProgress) * (stunActiveDurationMs / 1000)).toFixed(1) + 's'
		: isRollCooldownActive
			? ((1 - rollCooldownProgress) * (rollCooldownTotalMs / 1000)).toFixed(1) + 's'
			: ''
	const outerTimerText = outerRingActive
		? ((1 - autoRollProgress) * ((autoMs as number) / 1000)).toFixed(1) + 's'
		: ''

	const showTimer = innerRingActive || outerRingActive || isRolling
	const timerIsInner = innerRingActive || isRolling
	const timerText = timerIsInner ? innerTimerText : outerTimerText

	return (
		<Flex
			direction='column'
			align='center'
			py='10px'
			pb='8px'
			gap='6px'
			cursor={locked ? 'default' : 'pointer'}
			userSelect='none'
			css={{ WebkitTapHighlightColor: 'transparent' }}
			onClick={() => {
				if (!locked) onRoll()
			}}
			onKeyDown={e => {
				if (locked) return
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					onRoll()
				}
			}}
			role='button'
			tabIndex={locked ? -1 : 0}
			aria-label='Roll die'
		>
			<Box
				position='relative'
				w={`${SVG_SIZE}px`}
				h={`${SVG_SIZE}px`}
			>
				{/* Faint tracks only — progress is CSS conic donuts below */}
				<svg
					width={SVG_SIZE}
					height={SVG_SIZE}
					viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
					preserveAspectRatio='xMidYMid meet'
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						pointerEvents: 'none',
						display: 'block',
						zIndex: 0,
					}}
				>
					{autoEnabled && (
						<circle
							cx={CX}
							cy={CY}
							r={OUTER_RING_RADIUS}
							fill='none'
							stroke='rgba(255,255,255,0.05)'
							strokeWidth={STROKE_WIDTH}
						/>
					)}
					<circle
						cx={CX}
						cy={CY}
						r={INNER_RING_RADIUS}
						fill='none'
						stroke='rgba(255,255,255,0.07)'
						strokeWidth={STROKE_WIDTH}
					/>
				</svg>

				{outerRingActive && (
					<ConicRingDonut
						centerlineRadius={OUTER_RING_RADIUS}
						strokeWidth={STROKE_WIDTH}
						remaining01={outerRemaining}
						color={OUTER_AUTO_STROKE}
						zIndex={1}
					/>
				)}
				{innerRingActive && (
					<ConicRingDonut
						centerlineRadius={INNER_RING_RADIUS}
						strokeWidth={STROKE_WIDTH}
						remaining01={innerRemaining}
						color={innerRingStroke}
						zIndex={2}
					/>
				)}

				<RollRewardBubbles
					centerX={CX}
					centerY={CY}
				/>

				{showTimer && (
					<Box
						position='absolute'
						top='-1px'
						left='50%'
						transform='translateX(-50%)'
						zIndex={4}
						px='4px'
						bg='app.dock'
					>
						<Text
							fontSize='11px'
							fontWeight={800}
							color={timerIsInner ? (isStunRing ? 'app.stun' : 'app.streak') : 'app.autoTeal'}
							lineHeight={1.3}
							whiteSpace='nowrap'
							animation={timerIsInner && isStunRing ? 'appStunPulse 1s ease infinite' : undefined}
						>
							{timerText}
						</Text>
					</Box>
				)}

				<Box
					position='absolute'
					inset={0}
					display='flex'
					alignItems='center'
					justifyContent='center'
					pointerEvents='none'
					zIndex={3}
				>
					<Box
						w={`${DIE_SIZE}px`}
						h={`${DIE_SIZE}px`}
						borderRadius={`${DIE_RADIUS}px`}
						bg={
							isStunned
								? 'linear-gradient(145deg,#2a0a12,#18060a)'
								: 'linear-gradient(145deg,#16162a,#0d0d18)'
						}
						border='2px solid'
						borderColor={
							isStunned ? '#ff335566' : locked ? 'app.dieBorderLocked' : 'app.streakBorder'
						}
						display='flex'
						alignItems='center'
						justifyContent='center'
						animation={
							isRolling
								? 'appRollWobble 0.38s ease-in-out infinite'
								: !locked && !isStunned && !autoRollUpgradeLevel
									? 'appPulse 2.5s ease infinite'
									: undefined
						}
						opacity={locked && !isRolling && !isStunned ? 0.55 : 1}
						transition='border-color 0.3s, background 0.3s, opacity 0.3s'
					>
						{displayFace === null ? (
							<Text
								color='app.hint'
								fontSize='15px'
								textAlign='center'
								lineHeight={1.5}
								letterSpacing='1px'
							>
								TAP
								<br />
								TO
								<br />
								ROLL
							</Text>
						) : (
							<Box
								w='100%'
								h='100%'
								animation={justRevealed ? 'appReveal 0.28s ease-out forwards' : undefined}
							>
								<DiceFace
									value={displayFace}
									sides={sides}
									isThree={displayFace % 3 === 0}
									dimmed={isRolling}
								/>
							</Box>
						)}
					</Box>
				</Box>
			</Box>

			<Flex
				direction='row'
				justify='center'
				gap='28px'
				pointerEvents='none'
				pb='2px'
			>
				{/* Gold streak */}
				<Flex
					direction='column'
					align='center'
					gap='1px'
				>
					<Text
						fontSize='9px'
						color='app.goldMuted'
						letterSpacing='0.1em'
						fontWeight={700}
					>
						GOLD STREAK
					</Text>
					<Text
						fontSize='26px'
						fontWeight={900}
						lineHeight={1}
						color={goldStreak > 0 ? 'app.streak' : 'app.streakDim'}
					>
						{goldStreak}
					</Text>
					<Text
						fontSize='11px'
						fontWeight={600}
						color={goldStreak > 0 ? 'app.streak' : 'app.streakDim'}
						opacity={goldStreak > 0 ? 0.6 : 0.3}
						letterSpacing='0.03em'
					>
						mult ×{goldStreakMult.toFixed(2)}
					</Text>
					<Text
						fontSize='9px'
						color='app.dim'
						mt='1px'
					>
						best {bestGoldStreak}
					</Text>
				</Flex>

				{/* Hex streak */}
				<Flex
					direction='column'
					align='center'
					gap='1px'
				>
					<Text
						fontSize='9px'
						color='app.hexMuted'
						letterSpacing='0.1em'
						fontWeight={700}
					>
						HEX STREAK
					</Text>
					<Text
						fontSize='26px'
						fontWeight={900}
						lineHeight={1}
						color={hexRewardStreak > 0 ? 'app.hex' : 'app.streakDim'}
					>
						{hexRewardStreak}
					</Text>
					<Text
						fontSize='11px'
						fontWeight={600}
						color={hexRewardStreak > 0 ? 'app.hexStreak' : 'app.streakDim'}
						opacity={hexRewardStreak > 0 ? 0.6 : 0.3}
						letterSpacing='0.03em'
					>
						mult ×{hexStreakMult.toFixed(2)}
					</Text>
					<Text
						fontSize='9px'
						color='app.dim'
						mt='1px'
					>
						best {bestHexRewardStreak}
					</Text>
				</Flex>
			</Flex>
		</Flex>
	)
}

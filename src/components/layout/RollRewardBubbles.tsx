import { Box, Text } from '@chakra-ui/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { rollRewardPopupsAtom } from '../../game/atoms/primitives'
import { formatCompactNumber } from '../../game/constants'

/** Start above die center so text sits in open ring / tab area, not on the face. */
const ANCHOR_OFFSET_Y = -58

const DURATION_MS = 1150

function driftFromId(id: string): { dx: number; dy: number } {
	let h = 0
	for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
	const u1 = (Math.abs(h) % 1000) / 1000
	const u2 = (Math.abs(h >> 11) % 1000) / 1000
	const u3 = (Math.abs(h >> 22) % 1000) / 1000
	const angle = (u1 - 0.5) * 1.15
	const dist = 82 + u2 * 52
	const dx = Math.sin(angle) * dist * 0.9
	const dy = -Math.cos(angle) * dist - u3 * 14
	return { dx, dy }
}

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t
}

interface RollRewardBubblesProps {
	/** Pixel center of the die in this stacking context (matches ring SVG center). */
	centerX: number
	centerY: number
}

function BubbleLine({
	popup,
	removeById,
}: {
	popup: { id: string; kind: 'gold' | 'hex'; amount: number }
	removeById: (id: string) => void
}) {
	const drift = useMemo(() => driftFromId(popup.id), [popup.id])
	const [visual, setVisual] = useState({ x: 0, y: 0, opacity: 0, scale: 0.92 })

	useEffect(() => {
		let cancelled = false
		let raf = 0
		const id = popup.id
		const t0 = performance.now()

		const tick = (now: number) => {
			if (cancelled) return
			const elapsed = now - t0
			const u = Math.min(1, elapsed / DURATION_MS)

			const x = lerp(0, drift.dx, u)
			const y = lerp(0, drift.dy, u)

			let opacity = 1
			const fadeInEnd = 0.11
			const fadeOutStart = 0.72
			if (u < fadeInEnd) opacity = lerp(0, 1, u / fadeInEnd)
			else if (u > fadeOutStart) opacity = lerp(1, 0, (u - fadeOutStart) / (1 - fadeOutStart))

			const scaleUpEnd = 0.14
			const scale = u < scaleUpEnd ? lerp(0.92, 1, u / scaleUpEnd) : 1

			setVisual({ x, y, opacity, scale })

			if (u < 1) {
				raf = requestAnimationFrame(tick)
			} else if (!cancelled) {
				removeById(id)
			}
		}

		raf = requestAnimationFrame(tick)
		return () => {
			cancelled = true
			cancelAnimationFrame(raf)
		}
	}, [popup.id, drift.dx, drift.dy, removeById])

	const label =
		popup.kind === 'gold'
			? `+${formatCompactNumber(popup.amount)}g`
			: `+${formatCompactNumber(popup.amount)} hex`

	const textShadow =
		popup.kind === 'gold'
			? '0 0 18px rgba(255, 221, 51, 0.45), 0 0 42px rgba(68, 255, 187, 0.2)'
			: '0 0 20px rgba(187, 136, 255, 0.5), 0 0 48px rgba(153, 102, 204, 0.25)'

	return (
		<Box
			position='absolute'
			left={0}
			top={0}
			transform='translate(-50%, -50%)'
			pointerEvents='none'
		>
			<Text
				as='span'
				display='block'
				whiteSpace='nowrap'
				fontSize={popup.kind === 'gold' ? '19px' : '17px'}
				fontWeight={900}
				letterSpacing={popup.kind === 'gold' ? '0.02em' : '0.04em'}
				color={popup.kind === 'gold' ? 'never.gold' : 'never.hex'}
				lineHeight={1}
				style={
					{
						transform: `translate(${visual.x}px, ${visual.y}px) scale(${visual.scale})`,
						opacity: visual.opacity,
						textShadow,
						willChange: 'transform, opacity',
					} as CSSProperties
				}
			>
				{label}
			</Text>
		</Box>
	)
}

export function RollRewardBubbles({ centerX, centerY }: RollRewardBubblesProps) {
	const popups = useAtomValue(rollRewardPopupsAtom)
	const setPopups = useSetAtom(rollRewardPopupsAtom)
	const removeById = useCallback(
		(id: string) => {
			setPopups(prev => prev.filter(x => x.id !== id))
		},
		[setPopups]
	)

	return (
		<Box
			position='absolute'
			left={`${centerX}px`}
			top={`${centerY + ANCHOR_OFFSET_Y}px`}
			w={0}
			h={0}
			zIndex={12}
			pointerEvents='none'
		>
			{popups.map(p => (
				<BubbleLine
					key={p.id}
					popup={p}
					removeById={removeById}
				/>
			))}
		</Box>
	)
}

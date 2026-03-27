import { Box, Flex, Text, chakra } from '@chakra-ui/react'
import { useEffect, useState, type ReactNode } from 'react'
import type { BalanceConfig } from '../../game/balanceConfig'
import type { BalanceTierDragState } from './balanceTabUtils'

export function NumInput({
	value,
	onCommit,
	w = '72px',
}: {
	value: number
	onCommit: (n: number) => void
	w?: string
}) {
	const [text, setText] = useState(String(value))
	useEffect(() => {
		setText(String(value))
	}, [value])
	return (
		<chakra.input
			value={text}
			onChange={e => setText(e.target.value)}
			onBlur={() => {
				const n = Number(text)
				if (!Number.isFinite(n)) setText(String(value))
				else onCommit(n)
			}}
			w={w}
			px='6px'
			py='4px'
			fontSize='11px'
			fontFamily='monospace'
			bg='app.panelMuted'
			border='1px solid'
			borderColor='app.rowBorder'
			borderRadius='6px'
			color='app.text'
		/>
	)
}

export function ResetChip({ onClick }: { onClick: () => void }) {
	return (
		<chakra.button
			type='button'
			fontSize='10px'
			px='6px'
			py='1px'
			borderRadius='4px'
			border='1px solid'
			borderColor='app.rowBorder'
			bg='app.panel'
			color='app.dim'
			onClick={onClick}
			title='Reset to default'
		>
			↺
		</chakra.button>
	)
}

export function CollapsibleSection({
	title,
	defaultOpen = true,
	onResetSection,
	children,
}: {
	title: string
	defaultOpen?: boolean
	onResetSection?: () => void
	children: ReactNode
}) {
	const [open, setOpen] = useState(defaultOpen)
	return (
		<Box
			borderBottom='1px solid'
			borderColor='app.panelBorder'
			py='10px'
		>
			<Flex
				align='center'
				gap='8px'
				minH='32px'
			>
				<chakra.button
					type='button'
					flex={1}
					display='flex'
					alignItems='center'
					gap='8px'
					py='6px'
					px='2px'
					bg='transparent'
					border='none'
					color='app.text'
					textAlign='left'
					aria-expanded={open}
					onClick={() => setOpen(o => !o)}
				>
					<Text
						fontSize='10px'
						color='app.dim'
						w='14px'
						flexShrink={0}
					>
						{open ? '▼' : '▶'}
					</Text>
					<Text
						fontSize='10px'
						letterSpacing='2px'
						color='app.hexMuted'
					>
						{title}
					</Text>
				</chakra.button>
				{onResetSection && <ResetChip onClick={onResetSection} />}
			</Flex>
			{open && <Box mt='10px'>{children}</Box>}
		</Box>
	)
}

export function ScalarRow({
	label,
	children,
	onReset,
}: {
	label: string
	children: ReactNode
	onReset: () => void
}) {
	return (
		<Box
			mb='8px'
			p='8px'
			bg='app.panelMuted'
			borderRadius='8px'
			border='1px solid'
			borderColor='app.panelBorderDim'
		>
			<Flex
				align='center'
				justify='space-between'
				mb='4px'
			>
				<Text
					fontSize='10px'
					color='app.muted'
				>
					{label}
				</Text>
				<ResetChip onClick={onReset} />
			</Flex>
			{children}
		</Box>
	)
}

type TierKey = keyof Pick<BalanceConfig, 'speed' | 'auto' | 'multi' | 'streakRetention' | 'stun'>

export function TierTable<T extends object>({
	rows,
	columns,
	renderRow,
	onReorder,
	onRemove,
	onAdd,
	onPatchRow,
	dragTier,
	setDragTier,
	tierKey,
}: {
	rows: T[]
	columns?: string[]
	renderRow: (row: T, index: number, onPatch: (p: Partial<T>) => void) => ReactNode
	onReorder: (from: number, to: number) => void
	onRemove: (index: number) => void
	onAdd: () => void
	onPatchRow: (index: number, partial: Partial<T>) => void
	dragTier: BalanceTierDragState
	setDragTier: (v: BalanceTierDragState) => void
	tierKey: TierKey
}) {
	const headers = columns ?? ['ms', 'name', 'cost']

	const isDragging = (i: number) => dragTier?.key === tierKey && dragTier.index === i

	return (
		<Box>
			<Box
				overflow='auto'
				border='1px solid'
				borderColor='app.panelBorder'
				borderRadius='8px'
			>
				<chakra.table
					fontSize='10px'
					w='100%'
					style={{ borderCollapse: 'collapse' }}
				>
					<chakra.thead>
						<chakra.tr>
							{['', ...headers, ''].map((h, idx) => (
								<chakra.th
									key={idx}
									textAlign='left'
									p='6px'
									color='app.dim'
									borderBottom='1px solid'
									borderColor='app.rowBorder'
								>
									{h}
								</chakra.th>
							))}
						</chakra.tr>
					</chakra.thead>
					<chakra.tbody>
						{rows.map((row, i) => (
							<chakra.tr
								key={i}
								draggable
								opacity={isDragging(i) ? 0.5 : 1}
								onDragStart={() => setDragTier({ key: tierKey, index: i })}
								onDragEnd={() => setDragTier(null)}
								onDragOver={e => e.preventDefault()}
								onDrop={() => {
									if (dragTier && dragTier.key === tierKey && dragTier.index !== i) {
										onReorder(dragTier.index, i)
									}
									setDragTier(null)
								}}
							>
								<chakra.td
									p='4px'
									color='app.dim'
									cursor='grab'
								>
									⋮⋮
								</chakra.td>
								{renderRow(row, i, p => onPatchRow(i, p))}
								<chakra.td p='4px'>
									<chakra.button
										type='button'
										fontSize='10px'
										color='app.dangerSoft'
										onClick={() => onRemove(i)}
										disabled={rows.length <= 1}
									>
										×
									</chakra.button>
								</chakra.td>
							</chakra.tr>
						))}
					</chakra.tbody>
				</chakra.table>
			</Box>
			<chakra.button
				type='button'
				mt='6px'
				fontSize='10px'
				color='app.streak'
				onClick={onAdd}
			>
				+ Add tier
			</chakra.button>
		</Box>
	)
}

import { Box, Flex, Text, chakra } from '@chakra-ui/react'
import type { BalanceProfileMeta } from '../../game/balanceConfig'
import { BALANCE_EDITOR_TEMPLATE } from './balanceTabUtils'

export interface BalanceSaveLoadSectionProps {
	selectedSlot: string
	profiles: BalanceProfileMeta[]
	presetNameDraft: string
	onPresetNameChange: (value: string) => void
	onPresetNameBlur: () => void
	busy: boolean
	isTemplate: boolean
	onSelectSlot: (value: string) => void
	onApply: () => void
	onReload: () => void
	onDuplicate: () => void
	onExport: () => void
	onImportClick: () => void
	onDeleteClick: () => void
}

export function BalanceSaveLoadSection({
	selectedSlot,
	profiles,
	presetNameDraft,
	onPresetNameChange,
	onPresetNameBlur,
	busy,
	isTemplate,
	onSelectSlot,
	onApply,
	onReload,
	onDuplicate,
	onExport,
	onImportClick,
	onDeleteClick,
}: BalanceSaveLoadSectionProps) {
	return (
		<Box
			border='1px solid'
			borderColor='app.panelBorder'
			borderRadius='10px'
			bg='app.panelMuted'
			p='10px'
		>
			<Text
				fontSize='10px'
				color='app.muted'
				mb='8px'
				textTransform='uppercase'
				letterSpacing='0.08em'
			>
				Save / load config
			</Text>
			<Flex
				direction='column'
				gap='8px'
			>
				<chakra.select
					value={selectedSlot}
					onChange={e => onSelectSlot(e.target.value)}
					disabled={busy}
					fontSize='12px'
					bg='app.bg'
					border='1px solid'
					borderColor='app.rowBorder'
					borderRadius='8px'
					color='app.text'
					p='6px 8px'
				>
					<option value={BALANCE_EDITOR_TEMPLATE}>Built-in defaults (template)</option>
					{profiles.map(p => (
						<option
							key={p.id}
							value={p.id}
						>
							{p.name}
						</option>
					))}
				</chakra.select>
				<Box>
					<Text
						fontSize='10px'
						color='app.muted'
						mb='4px'
					>
						Preset name
					</Text>
					<chakra.input
						type='text'
						value={presetNameDraft}
						onChange={e => onPresetNameChange(e.target.value)}
						onBlur={onPresetNameBlur}
						disabled={busy}
						placeholder={
							isTemplate
								? 'Name for new preset (default filled; edit anytime before Apply)'
								: undefined
						}
						fontSize='12px'
						bg='app.bg'
						border='1px solid'
						borderColor='app.rowBorder'
						borderRadius='8px'
						color='app.text'
						p='6px 8px'
						w='100%'
					/>
				</Box>
				<Flex
					gap='6px'
					flexWrap='wrap'
				>
					<chakra.button
						type='button'
						px='10px'
						py='6px'
						fontSize='11px'
						bg='app.streak'
						color='app.bg'
						borderRadius='8px'
						onClick={onApply}
						disabled={busy}
					>
						Apply
					</chakra.button>
					<chakra.button
						type='button'
						px='10px'
						py='6px'
						fontSize='11px'
						bg='app.panel'
						color='app.subtle'
						border='1px solid'
						borderColor='app.rowBorder'
						borderRadius='8px'
						onClick={onReload}
						disabled={busy}
					>
						Reload
					</chakra.button>
					{!isTemplate && (
						<chakra.button
							type='button'
							px='10px'
							py='6px'
							fontSize='11px'
							bg='app.panel'
							color='app.subtle'
							border='1px solid'
							borderColor='app.rowBorder'
							borderRadius='8px'
							onClick={onDuplicate}
							disabled={busy}
						>
							Duplicate
						</chakra.button>
					)}
					<chakra.button
						type='button'
						px='10px'
						py='6px'
						fontSize='11px'
						bg='app.panel'
						color='app.subtle'
						border='1px solid'
						borderColor='app.rowBorder'
						borderRadius='8px'
						onClick={onExport}
						disabled={busy}
					>
						Export
					</chakra.button>
					<chakra.button
						type='button'
						px='10px'
						py='6px'
						fontSize='11px'
						bg='app.panel'
						color='app.subtle'
						border='1px solid'
						borderColor='app.rowBorder'
						borderRadius='8px'
						onClick={onImportClick}
						disabled={busy}
					>
						Import
					</chakra.button>
					<chakra.button
						type='button'
						px='10px'
						py='6px'
						fontSize='11px'
						bg='app.panel'
						color='app.dangerSoft'
						border='1px solid'
						borderColor='#442222'
						borderRadius='8px'
						onClick={onDeleteClick}
						disabled={busy || isTemplate}
					>
						Delete
					</chakra.button>
				</Flex>
			</Flex>
		</Box>
	)
}

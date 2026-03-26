import { Text, chakra } from '@chakra-ui/react'
import type { Dispatch, SetStateAction } from 'react'
import {
	DEFAULT_BALANCE_CONFIG,
	cloneBalanceConfig,
	type BalanceConfig,
} from '../../game/balanceConfig'
import { moveRow, type BalanceTierDragState } from './balanceTabUtils'
import { CollapsibleSection, NumInput, ScalarRow, TierTable } from './BalanceEditorPrimitives'

export interface BalanceConfigSectionsProps {
	draft: BalanceConfig
	setDraft: Dispatch<SetStateAction<BalanceConfig>>
	dragTier: BalanceTierDragState
	setDragTier: Dispatch<SetStateAction<BalanceTierDragState>>
}

/**
 * Shop-facing tier blocks follow `ShopTab`’s `upgrades` order (multi → speed → auto → stun → retention),
 * then prestige, forge/hex, and formulas. Reorder both files together when changing the shop layout.
 */
export function BalanceConfigSections({
	draft,
	setDraft,
	dragTier,
	setDragTier,
}: BalanceConfigSectionsProps) {
	const updateSpeed = (next: BalanceConfig['speed']) => setDraft(d => ({ ...d, speed: next }))
	const updateAuto = (next: BalanceConfig['auto']) => setDraft(d => ({ ...d, auto: next }))
	const updateMulti = (next: BalanceConfig['multi']) => setDraft(d => ({ ...d, multi: next }))
	const updateRetention = (next: BalanceConfig['streakRetention']) =>
		setDraft(d => ({ ...d, streakRetention: next }))
	const updateStun = (next: BalanceConfig['stun']) => setDraft(d => ({ ...d, stun: next }))

	const d = cloneBalanceConfig(DEFAULT_BALANCE_CONFIG)

	return (
		<>
			{/* Shop order: multi → speed → auto → stun → retention (see ShopTab `upgrades`) */}
			<CollapsibleSection
				title='💰 GOLD MULTI'
				onResetSection={() => updateMulti(d.multi)}
			>
				<TierTable
					rows={draft.multi}
					dragTier={dragTier}
					setDragTier={setDragTier}
					tierKey='multi'
					onReorder={(from, to) => updateMulti(moveRow(draft.multi, from, to))}
					onRemove={i => updateMulti(draft.multi.filter((_, j) => j !== i))}
					onAdd={() => updateMulti([...draft.multi, { x: 1, cost: 0 }])}
					onPatchRow={(i, p) =>
						updateMulti(draft.multi.map((row, j) => (j === i ? { ...row, ...p } : row)))
					}
					renderRow={(row, _i, onPatch) => (
						<>
							<chakra.td p='4px'>
								<NumInput
									value={row.x}
									onCommit={n => onPatch({ x: Math.max(1, Math.floor(n)) })}
								/>
							</chakra.td>
							<chakra.td p='4px'>
								<NumInput
									value={row.cost}
									onCommit={n => onPatch({ cost: Math.max(0, Math.floor(n)) })}
								/>
							</chakra.td>
						</>
					)}
					columns={['×', 'cost']}
				/>
			</CollapsibleSection>

			<CollapsibleSection
				title='⚡ ROLL SPEED'
				onResetSection={() => updateSpeed(d.speed)}
			>
				<TierTable
					rows={draft.speed}
					dragTier={dragTier}
					setDragTier={setDragTier}
					tierKey='speed'
					onReorder={(from, to) => updateSpeed(moveRow(draft.speed, from, to))}
					onRemove={i => updateSpeed(draft.speed.filter((_, j) => j !== i))}
					onAdd={() => updateSpeed([...draft.speed, { ms: 1000, name: '1.0s', cost: 0 }])}
					onPatchRow={(i, p) =>
						updateSpeed(draft.speed.map((row, j) => (j === i ? { ...row, ...p } : row)))
					}
					renderRow={(row, _i, onPatch) => (
						<>
							<chakra.td p='4px'>
								<NumInput
									value={row.ms}
									onCommit={n => onPatch({ ms: Math.max(0, Math.floor(n)) })}
								/>
							</chakra.td>
							<chakra.td p='4px'>
								<chakra.input
									value={row.name}
									onChange={e => onPatch({ name: e.target.value })}
									fontSize='11px'
									px='6px'
									py='4px'
									w='100%'
									minW='40px'
									bg='never.panelMuted'
									border='1px solid'
									borderColor='never.rowBorder'
									borderRadius='6px'
									color='never.text'
								/>
							</chakra.td>
							<chakra.td p='4px'>
								<NumInput
									value={row.cost}
									onCommit={n => onPatch({ cost: Math.max(0, Math.floor(n)) })}
								/>
							</chakra.td>
						</>
					)}
				/>
			</CollapsibleSection>

			<CollapsibleSection
				title='🔄 AUTO-ROLL'
				onResetSection={() => updateAuto(d.auto)}
			>
				<Text
					fontSize='9px'
					color='never.dim'
					mb='4px'
				>
					Leave ms empty for Off (null). Use 0 for instant.
				</Text>
				<TierTable
					rows={draft.auto}
					dragTier={dragTier}
					setDragTier={setDragTier}
					tierKey='auto'
					onReorder={(from, to) => updateAuto(moveRow(draft.auto, from, to))}
					onRemove={i => updateAuto(draft.auto.filter((_, j) => j !== i))}
					onAdd={() => updateAuto([...draft.auto, { ms: 1000, name: '1s', cost: 0 }])}
					onPatchRow={(i, p) =>
						updateAuto(draft.auto.map((row, j) => (j === i ? { ...row, ...p } : row)))
					}
					renderRow={(row, _i, onPatch) => (
						<>
							<chakra.td p='4px'>
								<chakra.input
									value={row.ms === null ? '' : String(row.ms)}
									onChange={e => {
										const t = e.target.value.trim()
										if (t === '') onPatch({ ms: null })
										else {
											const n = Number(t)
											if (Number.isFinite(n)) onPatch({ ms: Math.max(0, Math.floor(n)) })
										}
									}}
									placeholder='null'
									w='72px'
									fontSize='11px'
									px='6px'
									py='4px'
									bg='never.panelMuted'
									border='1px solid'
									borderColor='never.rowBorder'
									borderRadius='6px'
									color='never.text'
								/>
							</chakra.td>
							<chakra.td p='4px'>
								<chakra.input
									value={row.name}
									onChange={e => onPatch({ name: e.target.value })}
									fontSize='11px'
									px='6px'
									py='4px'
									w='100%'
									minW='40px'
									bg='never.panelMuted'
									border='1px solid'
									borderColor='never.rowBorder'
									borderRadius='6px'
									color='never.text'
								/>
							</chakra.td>
							<chakra.td p='4px'>
								<NumInput
									value={row.cost}
									onCommit={n => onPatch({ cost: Math.max(0, Math.floor(n)) })}
								/>
							</chakra.td>
						</>
					)}
				/>
			</CollapsibleSection>

			<CollapsibleSection
				title='💊 STUN RECOVERY'
				onResetSection={() => updateStun(d.stun)}
			>
				<TierTable
					rows={draft.stun}
					dragTier={dragTier}
					setDragTier={setDragTier}
					tierKey='stun'
					onReorder={(from, to) => updateStun(moveRow(draft.stun, from, to))}
					onRemove={i => updateStun(draft.stun.filter((_, j) => j !== i))}
					onAdd={() => updateStun([...draft.stun, { ms: 1000, name: '1.0s', cost: 0 }])}
					onPatchRow={(i, p) =>
						updateStun(draft.stun.map((row, j) => (j === i ? { ...row, ...p } : row)))
					}
					renderRow={(row, _i, onPatch) => (
						<>
							<chakra.td p='4px'>
								<NumInput
									value={row.ms}
									onCommit={n => onPatch({ ms: Math.max(0, Math.floor(n)) })}
								/>
							</chakra.td>
							<chakra.td p='4px'>
								<chakra.input
									value={row.name}
									onChange={e => onPatch({ name: e.target.value })}
									fontSize='11px'
									px='6px'
									py='4px'
									w='100%'
									minW='40px'
									bg='never.panelMuted'
									border='1px solid'
									borderColor='never.rowBorder'
									borderRadius='6px'
									color='never.text'
								/>
							</chakra.td>
							<chakra.td p='4px'>
								<NumInput
									value={row.cost}
									onCommit={n => onPatch({ cost: Math.max(0, Math.floor(n)) })}
								/>
							</chakra.td>
						</>
					)}
				/>
			</CollapsibleSection>

			<CollapsibleSection
				title='🔒 STREAK RETENTION'
				onResetSection={() => updateRetention(d.streakRetention)}
			>
				<TierTable
					rows={draft.streakRetention}
					dragTier={dragTier}
					setDragTier={setDragTier}
					tierKey='streakRetention'
					onReorder={(from, to) => updateRetention(moveRow(draft.streakRetention, from, to))}
					onRemove={i => updateRetention(draft.streakRetention.filter((_, j) => j !== i))}
					onAdd={() => updateRetention([...draft.streakRetention, { pct: 0, cost: 0 }])}
					onPatchRow={(i, p) =>
						updateRetention(
							draft.streakRetention.map((row, j) => (j === i ? { ...row, ...p } : row))
						)
					}
					renderRow={(row, _i, onPatch) => (
						<>
							<chakra.td p='4px'>
								<NumInput
									value={row.pct}
									onCommit={n => onPatch({ pct: Math.max(0, Math.min(100, n)) })}
								/>
							</chakra.td>
							<chakra.td p='4px'>
								<NumInput
									value={row.cost}
									onCommit={n => onPatch({ cost: Math.max(0, Math.floor(n)) })}
								/>
							</chakra.td>
						</>
					)}
					columns={['%', 'cost']}
				/>
			</CollapsibleSection>

			<CollapsibleSection
				title='★ PRESTIGE (shop)'
				onResetSection={() =>
					setDraft(prev => ({
						...prev,
						prestigeBase: d.prestigeBase,
						prestigeGoldMultPerLevel: d.prestigeGoldMultPerLevel,
					}))
				}
			>
				<ScalarRow
					label='Prestige base gold'
					onReset={() => setDraft(prev => ({ ...prev, prestigeBase: d.prestigeBase }))}
				>
					<NumInput
						value={draft.prestigeBase}
						onCommit={n =>
							setDraft(prev => ({ ...prev, prestigeBase: Math.max(1, Math.floor(n)) }))
						}
						w='100%'
					/>
				</ScalarRow>
				<ScalarRow
					label='Prestige gold mult per level (× per ★)'
					onReset={() =>
						setDraft(prev => ({ ...prev, prestigeGoldMultPerLevel: d.prestigeGoldMultPerLevel }))
					}
				>
					<NumInput
						value={draft.prestigeGoldMultPerLevel}
						onCommit={n =>
							setDraft(prev => ({ ...prev, prestigeGoldMultPerLevel: Math.max(0, n) }))
						}
						w='100%'
					/>
				</ScalarRow>
			</CollapsibleSection>

			<CollapsibleSection
				title='🔥 FORGE & HEX'
				onResetSection={() =>
					setDraft(prev => ({
						...prev,
						hexBase: d.hexBase,
						reforgeBase: d.reforgeBase,
						dangerEscapeMult: d.dangerEscapeMult,
						defaultReforgeCap: d.defaultReforgeCap,
					}))
				}
			>
				<ScalarRow
					label='Hex base (per danger unit)'
					onReset={() => setDraft(prev => ({ ...prev, hexBase: d.hexBase }))}
				>
					<NumInput
						value={draft.hexBase}
						onCommit={n => setDraft(prev => ({ ...prev, hexBase: Math.max(0, n) }))}
						w='100%'
					/>
				</ScalarRow>
				<ScalarRow
					label='Reforge base'
					onReset={() => setDraft(prev => ({ ...prev, reforgeBase: d.reforgeBase }))}
				>
					<NumInput
						value={draft.reforgeBase}
						onCommit={n => setDraft(prev => ({ ...prev, reforgeBase: Math.max(0, n) }))}
						w='100%'
					/>
				</ScalarRow>
				<ScalarRow
					label='Danger escape mult (× cost leaving ÷3 face)'
					onReset={() => setDraft(prev => ({ ...prev, dangerEscapeMult: d.dangerEscapeMult }))}
				>
					<NumInput
						value={draft.dangerEscapeMult}
						onCommit={n => setDraft(prev => ({ ...prev, dangerEscapeMult: Math.max(1, n) }))}
						w='100%'
					/>
				</ScalarRow>
				<ScalarRow
					label='Default max reforge face value'
					onReset={() => setDraft(prev => ({ ...prev, defaultReforgeCap: d.defaultReforgeCap }))}
				>
					<NumInput
						value={draft.defaultReforgeCap}
						onCommit={n =>
							setDraft(prev => ({ ...prev, defaultReforgeCap: Math.max(1, Math.floor(n)) }))
						}
						w='100%'
					/>
				</ScalarRow>
			</CollapsibleSection>

			<CollapsibleSection
				title='FORMULA COEFFICIENTS'
				onResetSection={() =>
					setDraft(prev => ({
						...prev,
						streakMultSlope: d.streakMultSlope,
						hexStreakMultSlope: d.hexStreakMultSlope,
						reforgeScalingPerCount: d.reforgeScalingPerCount,
					}))
				}
			>
				<ScalarRow
					label='Gold streak: 1 + √streak × slope'
					onReset={() => setDraft(prev => ({ ...prev, streakMultSlope: d.streakMultSlope }))}
				>
					<NumInput
						value={draft.streakMultSlope}
						onCommit={n => setDraft(prev => ({ ...prev, streakMultSlope: Math.max(0, n) }))}
						w='100%'
					/>
				</ScalarRow>
				<ScalarRow
					label='Hex streak: 1 + √streak × slope'
					onReset={() => setDraft(prev => ({ ...prev, hexStreakMultSlope: d.hexStreakMultSlope }))}
				>
					<NumInput
						value={draft.hexStreakMultSlope}
						onCommit={n => setDraft(prev => ({ ...prev, hexStreakMultSlope: Math.max(0, n) }))}
						w='100%'
					/>
				</ScalarRow>
				<ScalarRow
					label='Reforge scaling per prior reforge (in 1 + count×…)'
					onReset={() =>
						setDraft(prev => ({ ...prev, reforgeScalingPerCount: d.reforgeScalingPerCount }))
					}
				>
					<NumInput
						value={draft.reforgeScalingPerCount}
						onCommit={n => setDraft(prev => ({ ...prev, reforgeScalingPerCount: Math.max(0, n) }))}
						w='100%'
					/>
				</ScalarRow>
			</CollapsibleSection>
		</>
	)
}

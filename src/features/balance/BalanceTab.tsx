import { Flex, Text, VStack, chakra } from '@chakra-ui/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	BALANCE_CONFIG_VERSION,
	DEFAULT_BALANCE_CONFIG,
	cloneBalanceConfig,
	mergeWithDefaults,
	type BalanceProfileMeta,
	createBalanceProfile,
	deleteBalanceProfile,
	getActiveBalanceProfileId,
	listBalanceProfiles,
	loadBalanceProfile,
	parseBalanceConfigJson,
	renameBalanceProfile,
	saveBalanceProfile,
	setActiveBalanceProfileId,
	formatDefaultBalancePresetName,
} from '../../game/balanceConfig'
import { balanceConfigAtom } from '../../game/atoms/primitives'
import { BalanceConfigSections } from './BalanceConfigSections'
import { BalanceConfirmModal } from './BalanceConfirmModal'
import { BalanceExportFallbackModal } from './BalanceExportFallbackModal'
import { BalanceImportModal } from './BalanceImportModal'
import { BalanceSaveLoadSection } from './BalanceSaveLoadSection'
import {
	BALANCE_EDITOR_TEMPLATE,
	configFingerprint,
	type BalanceTierDragState,
} from './balanceTabUtils'

export function BalanceTab() {
	const applied = useAtomValue(balanceConfigAtom)
	const setApplied = useSetAtom(balanceConfigAtom)

	const [draft, setDraft] = useState(() => cloneBalanceConfig(applied))
	const [profiles, setProfiles] = useState<BalanceProfileMeta[]>([])
	const [selectedSlot, setSelectedSlot] = useState<string>(() => {
		try {
			const id = localStorage.getItem('nt-active-balance')
			return id && id !== '' ? id : BALANCE_EDITOR_TEMPLATE
		} catch {
			return BALANCE_EDITOR_TEMPLATE
		}
	})
	const [presetNameDraft, setPresetNameDraft] = useState(() =>
		selectedSlot === BALANCE_EDITOR_TEMPLATE ? formatDefaultBalancePresetName() : ''
	)
	const [importOpen, setImportOpen] = useState(false)
	const [importText, setImportText] = useState('')
	const [importError, setImportError] = useState<string | null>(null)
	const [busy, setBusy] = useState(false)
	const [dragTier, setDragTier] = useState<BalanceTierDragState>(null)
	const [pendingSlot, setPendingSlot] = useState<string | null>(null)
	const [discardOpen, setDiscardOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [exportFallbackJson, setExportFallbackJson] = useState<string | null>(null)
	const prevSlotRef = useRef<string | null>(null)

	const isTemplate = selectedSlot === BALANCE_EDITOR_TEMPLATE

	const refreshProfiles = useCallback(async () => {
		const list = await listBalanceProfiles()
		setProfiles(list)
	}, [])

	const run = async (fn: () => Promise<void>) => {
		setBusy(true)
		try {
			await fn()
			await refreshProfiles()
		} finally {
			setBusy(false)
		}
	}

	useEffect(() => {
		void refreshProfiles()
		void (async () => {
			const activeId = await getActiveBalanceProfileId()
			const slot = activeId && activeId !== '' ? activeId : BALANCE_EDITOR_TEMPLATE
			setSelectedSlot(slot)
		})()
	}, [refreshProfiles])

	// Keep preset name in sync when the slot changes; fill from index once profiles load.
	useEffect(() => {
		const slotChanged = prevSlotRef.current !== selectedSlot
		prevSlotRef.current = selectedSlot

		if (selectedSlot === BALANCE_EDITOR_TEMPLATE) {
			if (slotChanged) setPresetNameDraft(formatDefaultBalancePresetName())
			return
		}

		const p = profiles.find(x => x.id === selectedSlot)
		if (!p) {
			if (slotChanged) setPresetNameDraft('')
			return
		}

		if (slotChanged) {
			setPresetNameDraft(p.name)
			return
		}

		setPresetNameDraft(prev => (prev === '' ? p.name : prev))
	}, [selectedSlot, profiles])

	const dirty = useMemo(
		() => configFingerprint(draft) !== configFingerprint(applied),
		[draft, applied]
	)

	useEffect(() => {
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			if (!dirty) return
			e.preventDefault()
			e.returnValue = ''
		}
		window.addEventListener('beforeunload', onBeforeUnload)
		return () => window.removeEventListener('beforeunload', onBeforeUnload)
	}, [dirty])

	const applySlotChange = useCallback(async (value: string) => {
		if (value === BALANCE_EDITOR_TEMPLATE) {
			setSelectedSlot(BALANCE_EDITOR_TEMPLATE)
			setDraft(cloneBalanceConfig(DEFAULT_BALANCE_CONFIG))
			return
		}
		setSelectedSlot(value)
		const loaded = await loadBalanceProfile(value)
		setDraft(cloneBalanceConfig(loaded ?? DEFAULT_BALANCE_CONFIG))
	}, [])

	const handleSelectSlot = async (value: string) => {
		if (value === selectedSlot) return
		if (dirty) {
			setPendingSlot(value)
			setDiscardOpen(true)
			return
		}
		await applySlotChange(value)
	}

	const confirmDiscardSwitch = async () => {
		if (!pendingSlot) return
		const next = pendingSlot
		setPendingSlot(null)
		setDiscardOpen(false)
		await applySlotChange(next)
	}

	const handlePresetNameBlur = () => {
		if (isTemplate || busy) return
		const trimmed = presetNameDraft.trim()
		const current = profiles.find(p => p.id === selectedSlot)?.name
		if (!trimmed || trimmed === current) return
		void run(async () => {
			await renameBalanceProfile(selectedSlot, trimmed)
			setPresetNameDraft(trimmed)
		})
	}

	const handleApply = () =>
		run(async () => {
			const merged = mergeWithDefaults(draft)
			merged._v = BALANCE_CONFIG_VERSION
			setApplied(merged)
			setDraft(cloneBalanceConfig(merged))

			if (isTemplate) {
				const name = presetNameDraft.trim() || formatDefaultBalancePresetName()
				const { id } = await createBalanceProfile(name, merged)
				setSelectedSlot(id)
				setPresetNameDraft(name)
			} else {
				const fallback =
					profiles.find(p => p.id === selectedSlot)?.name ?? formatDefaultBalancePresetName()
				const name = presetNameDraft.trim() || fallback
				await saveBalanceProfile(selectedSlot, name, merged, true)
				setPresetNameDraft(name)
			}
		})

	const handleReload = () => {
		if (isTemplate) {
			setDraft(cloneBalanceConfig(DEFAULT_BALANCE_CONFIG))
			return
		}
		setDraft(cloneBalanceConfig(applied))
	}

	const handleDuplicate = () =>
		run(async () => {
			const merged = mergeWithDefaults(draft)
			merged._v = BALANCE_CONFIG_VERSION
			const baseName =
				presetNameDraft.trim() ||
				profiles.find(p => p.id === selectedSlot)?.name ||
				formatDefaultBalancePresetName()
			const { id } = await createBalanceProfile(`Copy · ${baseName}`, merged)
			setSelectedSlot(id)
			setPresetNameDraft(`Copy · ${baseName}`)
			setDraft(cloneBalanceConfig(merged))
		})

	const handleDeleteConfirm = () =>
		run(async () => {
			if (isTemplate) return
			await deleteBalanceProfile(selectedSlot)
			await setActiveBalanceProfileId(null)
			setDeleteOpen(false)
			setSelectedSlot(BALANCE_EDITOR_TEMPLATE)
			setDraft(cloneBalanceConfig(DEFAULT_BALANCE_CONFIG))
			setApplied(cloneBalanceConfig(DEFAULT_BALANCE_CONFIG))
		})

	const handleExport = async () => {
		const json = JSON.stringify(mergeWithDefaults(draft), null, 2)
		try {
			await navigator.clipboard.writeText(json)
		} catch {
			setExportFallbackJson(json)
		}
	}

	const handleImportConfirm = () => {
		setImportError(null)
		try {
			const parsed = JSON.parse(importText) as unknown
			const cfg = parseBalanceConfigJson(parsed)
			if (!cfg) {
				setImportError('Invalid JSON')
				return
			}
			setDraft(cloneBalanceConfig(cfg))
			setImportOpen(false)
			setImportText('')
		} catch {
			setImportError('Could not parse JSON')
		}
	}

	const handleResetAllDraft = () => {
		setDraft(cloneBalanceConfig(DEFAULT_BALANCE_CONFIG))
	}

	const deleteTargetName = profiles.find(p => p.id === selectedSlot)?.name ?? 'this preset'

	return (
		<VStack
			data-balance-editor
			align='stretch'
			gap={0}
			py={3}
			pb='100px'
			fontFamily='monospace'
		>
			<Text
				fontSize='11px'
				color='never.dim'
				mb='8px'
			>
				Tune costs, tiers, and formulas. Apply saves to a named preset and updates the running game.
				Built-in defaults are a template only — applying always creates or updates a saved preset.
			</Text>

			{dirty && (
				<Text
					fontSize='10px'
					color='never.goldMuted'
					mb='6px'
				>
					● Unapplied edits (not in the live game yet)
				</Text>
			)}

			<BalanceSaveLoadSection
				selectedSlot={selectedSlot}
				profiles={profiles}
				presetNameDraft={presetNameDraft}
				onPresetNameChange={setPresetNameDraft}
				onPresetNameBlur={handlePresetNameBlur}
				busy={busy}
				isTemplate={isTemplate}
				onSelectSlot={v => void handleSelectSlot(v)}
				onApply={() => void handleApply()}
				onReload={handleReload}
				onDuplicate={() => void handleDuplicate()}
				onExport={() => void handleExport()}
				onImportClick={() => setImportOpen(true)}
				onDeleteClick={() => setDeleteOpen(true)}
			/>

			<BalanceConfigSections
				draft={draft}
				setDraft={setDraft}
				dragTier={dragTier}
				setDragTier={setDragTier}
			/>

			<Flex
				gap='10px'
				mt='20px'
				pt='12px'
				borderTop='1px solid'
				borderColor='never.panelBorder'
			>
				<chakra.button
					type='button'
					flex={1}
					py='12px'
					borderRadius='10px'
					bg='never.panelMuted'
					border='1px solid'
					borderColor='never.rowBorder'
					color='never.subtle'
					fontWeight={700}
					fontSize='12px'
					onClick={handleResetAllDraft}
					disabled={busy}
				>
					Reset draft to defaults
				</chakra.button>
				<chakra.button
					type='button'
					flex={1}
					py='12px'
					borderRadius='10px'
					bg='linear-gradient(135deg,#1a2a1e,#0d1810)'
					border='1px solid'
					borderColor='never.streakBorder'
					color='never.streak'
					fontWeight={700}
					fontSize='12px'
					onClick={() => void handleApply()}
					disabled={busy}
				>
					Apply to game
				</chakra.button>
			</Flex>

			<BalanceImportModal
				open={importOpen}
				busy={busy}
				importText={importText}
				importError={importError}
				onImportTextChange={setImportText}
				onClose={() => setImportOpen(false)}
				onConfirm={handleImportConfirm}
			/>

			<BalanceConfirmModal
				open={discardOpen}
				title='Discard unapplied edits?'
				description='You have changes in the editor that are not applied to the game yet. Switch preset anyway? Those edits will be lost.'
				confirmLabel='Discard and switch'
				cancelLabel='Keep editing'
				destructive
				busy={busy}
				onClose={() => {
					setDiscardOpen(false)
					setPendingSlot(null)
				}}
				onConfirm={() => void confirmDiscardSwitch()}
			/>

			<BalanceConfirmModal
				open={deleteOpen}
				title='Delete preset?'
				description={`Delete “${deleteTargetName}” from this browser? The running game will switch to built-in defaults until you apply another preset.`}
				confirmLabel='Delete'
				cancelLabel='Cancel'
				destructive
				busy={busy}
				onClose={() => setDeleteOpen(false)}
				onConfirm={() => void handleDeleteConfirm()}
			/>

			<BalanceExportFallbackModal
				open={exportFallbackJson !== null}
				json={exportFallbackJson ?? ''}
				onClose={() => setExportFallbackJson(null)}
			/>
		</VStack>
	)
}

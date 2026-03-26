import { ChakraProvider } from '@chakra-ui/react'
import { Provider as JotaiProvider } from 'jotai'
import { createStore } from 'jotai/vanilla'
import type { Store } from 'jotai/vanilla/store'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SaveManagerModal } from '../features/saves/SaveManagerModal'
import { loadResolvedActiveBalanceConfig } from '../game/balanceConfig'
import { collectSaveStateFromStore, hydrateStoreFromSaveState } from '../game/persistGameStore'
import * as P from '../game/atoms/primitives'
import {
	boot,
	createProfile,
	DEFAULT_STATE,
	duplicateProfile,
	formatUnnamedSaveLabel,
	listProfiles,
	loadProfile,
	renameProfile,
	saveProfile,
	deleteProfile,
	setActiveProfileId,
	type SaveState,
} from '../game/saves'
import { system } from '../theme/system'
import { GameSessionProvider } from './GameSessionContext'
import { SaveSlotsProvider } from './SaveSlotsContext'

type SessionState = {
	store: Store
	profileId: string
	profileName: string
}

async function createHydratedGameStore(state: SaveState): Promise<Store> {
	const store = createStore()
	const balanceConfig = await loadResolvedActiveBalanceConfig()
	store.set(P.balanceConfigAtom, balanceConfig)
	hydrateStoreFromSaveState(store, state)
	return store
}

/**
 * Loads save profile from localStorage, creates an isolated Jotai store, hydrates atoms, then mounts the app.
 */
export function AppBootstrap({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<SessionState | null>(null)
	const sessionRef = useRef<SessionState | null>(null)
	sessionRef.current = session

	useEffect(() => {
		let cancelled = false
		void (async () => {
			const result = await boot()
			if (cancelled) return
			const store = await createHydratedGameStore(result.state)
			setSession({
				store,
				profileId: result.id,
				profileName: result.name,
			})
		})()
		return () => {
			cancelled = true
		}
	}, [])

	const flushCurrent = useCallback(async () => {
		const session = sessionRef.current
		if (!session) return
		const state = collectSaveStateFromStore(session.store)
		await saveProfile(session.profileId, session.profileName, state)
	}, [])

	const switchToProfile = useCallback(
		async (id: string) => {
			await flushCurrent()
			const next = await loadProfile(id)
			if (!next) return
			const meta = (await listProfiles()).find(profile => profile.id === id)
			const store = await createHydratedGameStore(next)
			await setActiveProfileId(id)
			setSession({
				store,
				profileId: id,
				profileName: meta?.name ?? '',
			})
		},
		[flushCurrent]
	)

	const createNewSave = useCallback(
		async (optionalDisplayName?: string) => {
			await flushCurrent()
			const { id, name } = await createProfile(optionalDisplayName)
			const store = await createHydratedGameStore(DEFAULT_STATE)
			setSession({ store, profileId: id, profileName: name })
		},
		[flushCurrent]
	)

	const duplicateProfileSlot = useCallback(
		async (sourceId: string, optionalDisplayName?: string) => {
			await flushCurrent()
			const dup = await duplicateProfile(sourceId, optionalDisplayName)
			if (!dup) return
			const store = await createHydratedGameStore(dup.state)
			await setActiveProfileId(dup.id)
			setSession({
				store,
				profileId: dup.id,
				profileName: dup.name,
			})
		},
		[flushCurrent]
	)

	const deleteSave = useCallback(
		async (id: string) => {
			const current = sessionRef.current
			const isCurrent = current?.profileId === id
			if (!isCurrent) {
				await flushCurrent()
			}
			await deleteProfile(id)
			if (isCurrent) {
				const next = await boot()
				const store = await createHydratedGameStore(next.state)
				setSession({
					store,
					profileId: next.id,
					profileName: next.name,
				})
			}
		},
		[flushCurrent]
	)

	const renameSave = useCallback(async (id: string, newDisplayName: string) => {
		const trimmed = newDisplayName.trim()
		const name = trimmed.length > 0 ? trimmed : formatUnnamedSaveLabel()
		await renameProfile(id, name)
		const current = sessionRef.current
		if (current?.profileId === id) {
			setSession(prev => (prev ? { ...prev, profileName: name } : prev))
		}
	}, [])

	const slotsValue = useMemo(
		() => ({
			switchToProfile,
			createNewSave,
			duplicateProfile: duplicateProfileSlot,
			deleteSave,
			renameSave,
		}),
		[switchToProfile, createNewSave, duplicateProfileSlot, deleteSave, renameSave]
	)

	if (!session) {
		return null
	}

	return (
		<JotaiProvider
			key={session.profileId}
			store={session.store}
		>
			<GameSessionProvider
				key={session.profileId}
				profileId={session.profileId}
				profileName={session.profileName}
			>
				<SaveSlotsProvider value={slotsValue}>
					<ChakraProvider value={system}>
						{children}
						<SaveManagerModal />
					</ChakraProvider>
				</SaveSlotsProvider>
			</GameSessionProvider>
		</JotaiProvider>
	)
}

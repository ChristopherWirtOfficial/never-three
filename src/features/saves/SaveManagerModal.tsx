import { Box, Flex, Text, VStack, chakra } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useGameSession } from '../../providers/GameSessionContext'
import { useSaveSlots } from '../../providers/SaveSlotsContext'
import { listProfiles, resolveProfileDisplayName } from '../../game/saves'

type ProfileRow = { id: string; name: string; lastPlayed: number }

export function SaveManagerModal() {
	const {
		saveManagerOpen,
		closeSaveManager,
		switchToProfile,
		createNewSave,
		duplicateProfile,
		deleteSave,
		renameSave,
	} = useSaveSlots()
	const { profileId: currentId } = useGameSession()

	const [profiles, setProfiles] = useState<ProfileRow[]>([])
	const [newSaveName, setNewSaveName] = useState('')
	const [editingId, setEditingId] = useState<string | null>(null)
	const [editName, setEditName] = useState('')
	const [copyTargetId, setCopyTargetId] = useState<string | null>(null)
	const [copyName, setCopyName] = useState('')
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
	const [busy, setBusy] = useState(false)

	const refresh = useCallback(async () => {
		const list = await listProfiles()
		setProfiles(list)
	}, [])

	useEffect(() => {
		if (saveManagerOpen) {
			void refresh()
			setCopyTargetId(null)
			setCopyName('')
			setConfirmDeleteId(null)
		}
	}, [saveManagerOpen, refresh])

	const run = async (fn: () => Promise<void>) => {
		setBusy(true)
		try {
			await fn()
			await refresh()
		} finally {
			setBusy(false)
		}
	}

	if (!saveManagerOpen) return null

	return (
		<Box
			position='fixed'
			inset={0}
			zIndex={300}
			bg='#000000cc'
			display='flex'
			alignItems='center'
			justifyContent='center'
			px='16px'
			onClick={() => !busy && closeSaveManager()}
		>
			<Box
				w='100%'
				maxW='400px'
				maxH='85dvh'
				bg='app.panel'
				border='1px solid'
				borderColor='app.panelBorder'
				borderRadius='16px'
				overflow='hidden'
				display='flex'
				flexDirection='column'
				fontFamily='monospace'
				onClick={e => e.stopPropagation()}
			>
				<Flex
					px='16px'
					py='14px'
					borderBottom='1px solid'
					borderColor='app.border'
					align='center'
					justify='space-between'
				>
					<Text
						fontSize='14px'
						fontWeight={800}
						color='app.piplet'
						letterSpacing='0.08em'
					>
						SAVES
					</Text>
					<chakra.button
						type='button'
						bg='transparent'
						border='none'
						color='app.dim'
						fontSize='18px'
						cursor={busy ? 'default' : 'pointer'}
						opacity={busy ? 0.4 : 1}
						onClick={() => !busy && closeSaveManager()}
						aria-label='Close'
					>
						✕
					</chakra.button>
				</Flex>

				<Box
					flex={1}
					overflow='auto'
					px='12px'
					py='10px'
				>
					<VStack
						align='stretch'
						gap='8px'
					>
						{profiles.map(profile => {
							const display = resolveProfileDisplayName(profile.name, profile.lastPlayed)
							const isActive = profile.id === currentId
							const isEditing = editingId === profile.id
							const isCopying = copyTargetId === profile.id
							const isConfirmDelete = confirmDeleteId === profile.id

							return (
								<Box
									key={profile.id}
									px='12px'
									py='10px'
									borderRadius='10px'
									border='1px solid'
									borderColor={isActive ? 'app.streakBorder' : 'app.panelBorder'}
									bg={isActive ? 'app.dock' : 'app.bg'}
								>
									{isEditing ? (
										<chakra.input
											value={editName}
											onChange={e => setEditName(e.target.value)}
											onKeyDown={e => {
												if (e.key === 'Enter') {
													void run(async () => {
														await renameSave(profile.id, editName)
														setEditingId(null)
													})
												}
											}}
											autoFocus
											w='100%'
											px='8px'
											py='6px'
											borderRadius='6px'
											border='1px solid'
											borderColor='app.streakBorder'
											bg='app.bg'
											color='app.text'
											fontSize='13px'
											fontFamily='monospace'
										/>
									) : (
										<Text
											fontSize='13px'
											fontWeight={700}
											color={isActive ? 'app.streak' : 'app.text'}
										>
											{display}
										</Text>
									)}
									<Text
										fontSize='10px'
										color='app.stat'
										mt='4px'
									>
										Last played {new Date(profile.lastPlayed).toLocaleString()}
									</Text>
									{isActive && (
										<Text
											fontSize='9px'
											color='app.streakMuted'
											mt='2px'
										>
											Current · autosaves to this slot
										</Text>
									)}

									{isCopying && (
										<Box mt='8px'>
											<Text
												fontSize='10px'
												color='app.dim'
												mb='4px'
											>
												Name for copy (optional)
											</Text>
											<chakra.input
												value={copyName}
												onChange={e => setCopyName(e.target.value)}
												placeholder='Defaults to “… (copy)”'
												w='100%'
												px='8px'
												py='6px'
												borderRadius='6px'
												border='1px solid'
												borderColor='app.rowBorder'
												bg='app.bg'
												color='app.text'
												fontSize='12px'
												fontFamily='monospace'
												mb='6px'
											/>
											<Flex gap='6px'>
												<chakra.button
													type='button'
													flex={1}
													py='6px'
													borderRadius='6px'
													bg='app.panelMuted'
													border='1px solid'
													borderColor='app.rowBorder'
													color='app.subtle'
													fontSize='11px'
													fontWeight={700}
													disabled={busy}
													onClick={() => {
														setCopyTargetId(null)
														setCopyName('')
													}}
												>
													Cancel
												</chakra.button>
												<chakra.button
													type='button'
													flex={1}
													py='6px'
													borderRadius='6px'
													bg='linear-gradient(135deg,#1a0a2e,#0d051a)'
													border='1px solid'
													borderColor='app.prestigeBorder'
													color='app.prestige'
													fontSize='11px'
													fontWeight={700}
													disabled={busy}
													onClick={() =>
														void run(async () => {
															await duplicateProfile(profile.id, copyName.trim() || undefined)
															setCopyTargetId(null)
															setCopyName('')
															closeSaveManager()
														})
													}
												>
													Copy & play
												</chakra.button>
											</Flex>
										</Box>
									)}

									{!isCopying && !isEditing && (
										<Flex
											flexWrap='wrap'
											gap='6px'
											mt='8px'
										>
											{!isActive && (
												<chakra.button
													type='button'
													flex={1}
													minW='100px'
													py='6px'
													borderRadius='6px'
													bg='#1a2a22'
													border='1px solid'
													borderColor='app.streakBorder'
													color='app.streak'
													fontSize='11px'
													fontWeight={700}
													disabled={busy}
													onClick={() =>
														void run(async () => {
															await switchToProfile(profile.id)
															closeSaveManager()
														})
													}
												>
													Switch
												</chakra.button>
											)}
											<chakra.button
												type='button'
												flex={1}
												minW='100px'
												py='6px'
												borderRadius='6px'
												bg='app.panelMuted'
												border='1px solid'
												borderColor='app.rowBorder'
												color='app.subtle'
												fontSize='11px'
												fontWeight={700}
												disabled={busy}
												onClick={() => {
													setEditingId(profile.id)
													setEditName(profile.name.trim() ? profile.name : display)
													setConfirmDeleteId(null)
													setCopyTargetId(null)
												}}
											>
												Rename
											</chakra.button>
											<chakra.button
												type='button'
												flex={1}
												minW='100px'
												py='6px'
												borderRadius='6px'
												bg='app.panelMuted'
												border='1px solid'
												borderColor='app.rowBorder'
												color='app.multi'
												fontSize='11px'
												fontWeight={700}
												disabled={busy}
												onClick={() => {
													setCopyTargetId(profile.id)
													setCopyName('')
													setConfirmDeleteId(null)
													setEditingId(null)
												}}
											>
												Copy…
											</chakra.button>
											<chakra.button
												type='button'
												flex={1}
												minW='100px'
												py='6px'
												borderRadius='6px'
												bg={isConfirmDelete ? '#2a0a12' : 'app.panelMuted'}
												border='1px solid'
												borderColor={isConfirmDelete ? 'app.danger' : 'app.rowBorder'}
												color={isConfirmDelete ? 'app.danger' : 'app.dim'}
												fontSize='11px'
												fontWeight={700}
												disabled={busy}
												onClick={() => {
													if (!isConfirmDelete) {
														setConfirmDeleteId(profile.id)
														return
													}
													void run(async () => {
														await deleteSave(profile.id)
														setConfirmDeleteId(null)
													})
												}}
											>
												{isConfirmDelete ? 'Confirm delete' : 'Delete'}
											</chakra.button>
										</Flex>
									)}

									{isEditing && (
										<Flex
											gap='6px'
											mt='8px'
										>
											<chakra.button
												type='button'
												flex={1}
												py='6px'
												borderRadius='6px'
												bg='app.streak'
												color='app.bg'
												fontSize='11px'
												fontWeight={800}
												disabled={busy}
												onClick={() =>
													void run(async () => {
														await renameSave(profile.id, editName)
														setEditingId(null)
													})
												}
											>
												Save name
											</chakra.button>
											<chakra.button
												type='button'
												flex={1}
												py='6px'
												borderRadius='6px'
												bg='app.panelMuted'
												border='1px solid'
												borderColor='app.rowBorder'
												color='app.subtle'
												fontSize='11px'
												disabled={busy}
												onClick={() => setEditingId(null)}
											>
												Cancel
											</chakra.button>
										</Flex>
									)}
								</Box>
							)
						})}
					</VStack>
				</Box>

				<Box
					px='12px'
					py='12px'
					borderTop='1px solid'
					borderColor='app.border'
				>
					<Text
						fontSize='10px'
						color='app.dim'
						letterSpacing='0.06em'
						mb='6px'
					>
						NEW SAVE (FRESH RUN)
					</Text>
					<Flex gap='8px'>
						<chakra.input
							flex={1}
							value={newSaveName}
							onChange={e => setNewSaveName(e.target.value)}
							placeholder='Optional name…'
							px='10px'
							py='8px'
							borderRadius='8px'
							border='1px solid'
							borderColor='app.rowBorder'
							bg='app.bg'
							color='app.text'
							fontSize='12px'
							fontFamily='monospace'
							onKeyDown={e => {
								if (e.key === 'Enter') {
									void run(async () => {
										await createNewSave(newSaveName.trim() || undefined)
										setNewSaveName('')
										closeSaveManager()
									})
								}
							}}
						/>
						<chakra.button
							type='button'
							px='14px'
							py='8px'
							borderRadius='8px'
							bg='linear-gradient(135deg,#132e1e,#0b1a10)'
							border='1px solid'
							borderColor='app.streakBorder'
							color='app.streak'
							fontSize='12px'
							fontWeight={800}
							whiteSpace='nowrap'
							disabled={busy}
							onClick={() =>
								void run(async () => {
									await createNewSave(newSaveName.trim() || undefined)
									setNewSaveName('')
									closeSaveManager()
								})
							}
						>
							New save
						</chakra.button>
					</Flex>
					<Text
						fontSize='9px'
						color='app.stat'
						mt='8px'
						lineHeight={1.5}
					>
						Blank name → fresh run labeled with time. Most recent save loads on startup.
					</Text>
				</Box>
			</Box>
		</Box>
	)
}

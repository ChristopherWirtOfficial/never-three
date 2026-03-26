import { Box, Flex, Text, chakra } from '@chakra-ui/react'

export interface BalanceImportModalProps {
	open: boolean
	busy: boolean
	importText: string
	importError: string | null
	onImportTextChange: (value: string) => void
	onClose: () => void
	onConfirm: () => void
}

export function BalanceImportModal({
	open,
	busy,
	importText,
	importError,
	onImportTextChange,
	onClose,
	onConfirm,
}: BalanceImportModalProps) {
	if (!open) return null

	return (
		<Box
			position='fixed'
			inset={0}
			zIndex={400}
			bg='#000000cc'
			display='flex'
			alignItems='center'
			justifyContent='center'
			px='16px'
			onClick={() => !busy && onClose()}
		>
			<Box
				w='100%'
				maxW='400px'
				bg='never.panel'
				border='1px solid'
				borderColor='never.panelBorder'
				borderRadius='12px'
				p='16px'
				onClick={e => e.stopPropagation()}
			>
				<Text
					fontSize='12px'
					mb='8px'
					color='never.text'
				>
					Paste balance JSON
				</Text>
				<chakra.textarea
					value={importText}
					onChange={e => onImportTextChange(e.target.value)}
					rows={12}
					w='100%'
					fontSize='10px'
					fontFamily='monospace'
					bg='never.bg'
					border='1px solid'
					borderColor='never.rowBorder'
					borderRadius='8px'
					color='never.text'
					p='8px'
				/>
				{importError && (
					<Text
						color='never.danger'
						fontSize='11px'
						mt='6px'
					>
						{importError}
					</Text>
				)}
				<Flex
					gap='8px'
					mt='12px'
				>
					<chakra.button
						type='button'
						flex={1}
						py='10px'
						onClick={onClose}
					>
						Cancel
					</chakra.button>
					<chakra.button
						type='button'
						flex={1}
						py='10px'
						bg='never.streak'
						color='never.bg'
						borderRadius='8px'
						onClick={onConfirm}
					>
						Import
					</chakra.button>
				</Flex>
			</Box>
		</Box>
	)
}

import { Box, Flex, Text, chakra } from '@chakra-ui/react'

export interface BalanceConfirmModalProps {
	open: boolean
	title: string
	description: string
	confirmLabel: string
	cancelLabel?: string
	destructive?: boolean
	busy?: boolean
	onConfirm: () => void
	onClose: () => void
}

export function BalanceConfirmModal({
	open,
	title,
	description,
	confirmLabel,
	cancelLabel = 'Cancel',
	destructive,
	busy,
	onConfirm,
	onClose,
}: BalanceConfirmModalProps) {
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
				maxW='380px'
				bg='never.panel'
				border='1px solid'
				borderColor='never.panelBorder'
				borderRadius='12px'
				p='16px'
				onClick={e => e.stopPropagation()}
			>
				<Text
					fontSize='14px'
					fontWeight={700}
					mb='8px'
					color='never.text'
				>
					{title}
				</Text>
				<Text
					fontSize='12px'
					color='never.muted'
					mb='16px'
					lineHeight={1.5}
				>
					{description}
				</Text>
				<Flex
					gap='8px'
					justify='flex-end'
				>
					<chakra.button
						type='button'
						px='14px'
						py='8px'
						fontSize='12px'
						borderRadius='8px'
						border='1px solid'
						borderColor='never.rowBorder'
						bg='never.panelMuted'
						color='never.subtle'
						onClick={onClose}
						disabled={busy}
					>
						{cancelLabel}
					</chakra.button>
					<chakra.button
						type='button'
						px='14px'
						py='8px'
						fontSize='12px'
						borderRadius='8px'
						border='1px solid'
						borderColor={destructive ? '#552222' : 'never.streakBorder'}
						bg={destructive ? '#2a1010' : 'never.streak'}
						color={destructive ? 'never.dangerSoft' : 'never.bg'}
						onClick={onConfirm}
						disabled={busy}
					>
						{confirmLabel}
					</chakra.button>
				</Flex>
			</Box>
		</Box>
	)
}

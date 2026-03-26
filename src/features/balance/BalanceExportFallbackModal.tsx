import { Box, Flex, Text, chakra } from '@chakra-ui/react'

export interface BalanceExportFallbackModalProps {
	open: boolean
	json: string
	onClose: () => void
}

export function BalanceExportFallbackModal({
	open,
	json,
	onClose,
}: BalanceExportFallbackModalProps) {
	if (!open) return null

	const copy = () => {
		void navigator.clipboard.writeText(json)
	}

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
			onClick={onClose}
		>
			<Box
				w='100%'
				maxW='440px'
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
					Clipboard unavailable — copy JSON manually:
				</Text>
				<chakra.textarea
					value={json}
					readOnly
					rows={14}
					w='100%'
					fontSize='10px'
					fontFamily='monospace'
					bg='never.bg'
					border='1px solid'
					borderColor='never.rowBorder'
					borderRadius='8px'
					color='never.text'
					p='8px'
					mb='12px'
				/>
				<Flex
					gap='8px'
					justify='flex-end'
				>
					<chakra.button
						type='button'
						px='12px'
						py='8px'
						fontSize='12px'
						onClick={onClose}
					>
						Close
					</chakra.button>
					<chakra.button
						type='button'
						px='12px'
						py='8px'
						fontSize='12px'
						bg='never.streak'
						color='never.bg'
						borderRadius='8px'
						onClick={copy}
					>
						Copy again
					</chakra.button>
				</Flex>
			</Box>
		</Box>
	)
}

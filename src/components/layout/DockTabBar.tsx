import { Flex, chakra } from '@chakra-ui/react'
import type { TabId } from '../../game/types'

const TABS: [TabId, string][] = [
	['roll', '🎲 ROLL'],
	['shop', '⬆ SHOP'],
	['forge', '🔥 FORGE'],
	['log', '📜 LOG'],
]

interface DockTabBarProps {
	activeGameTab: TabId
	onTabChange: (tab: TabId) => void
}

export function DockTabBar({ activeGameTab, onTabChange }: DockTabBarProps) {
	return (
		<Flex
			borderTop='1px solid'
			borderColor='never.border'
		>
			{TABS.map(([key, label]) => (
				<chakra.button
					key={key}
					type='button'
					flex={1}
					py={3}
					bg='transparent'
					border='none'
					borderTop='2px solid'
					borderTopColor={activeGameTab === key ? 'never.streak' : 'transparent'}
					color={activeGameTab === key ? 'never.streak' : 'never.tabInactive'}
					fontFamily='monospace'
					fontSize='12px'
					fontWeight={700}
					cursor='pointer'
					letterSpacing='1px'
					onClick={() => onTabChange(key)}
				>
					{label}
				</chakra.button>
			))}
		</Flex>
	)
}

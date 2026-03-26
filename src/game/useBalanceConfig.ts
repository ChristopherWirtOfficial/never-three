import { useAtomValue } from 'jotai'
import { balanceConfigAtom } from './atoms/primitives'

export function useBalanceConfig() {
	return useAtomValue(balanceConfigAtom)
}

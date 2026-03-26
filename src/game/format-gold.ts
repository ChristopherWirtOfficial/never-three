/** Compact gold display for the header (differs from `formatCompactNumber` for small values). */
export function formatGold(gold: number): string {
	if (gold < 1e3) return Math.floor(gold).toString()
	if (gold >= 1e12) return (gold / 1e12).toFixed(1) + 'T'
	if (gold >= 1e9) return (gold / 1e9).toFixed(1) + 'B'
	if (gold >= 1e6) return (gold / 1e6).toFixed(1) + 'M'
	return (gold / 1e3).toFixed(1) + 'K'
}

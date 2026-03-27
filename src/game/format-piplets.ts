/** Compact piplets display for the header (differs from `formatCompactNumber` for small values). */
export function formatPiplets(piplets: number): string {
	if (piplets < 1e3) return Math.floor(piplets).toString()
	if (piplets >= 1e12) return (piplets / 1e12).toFixed(1) + 'T'
	if (piplets >= 1e9) return (piplets / 1e9).toFixed(1) + 'B'
	if (piplets >= 1e6) return (piplets / 1e6).toFixed(1) + 'M'
	return (piplets / 1e3).toFixed(1) + 'K'
}

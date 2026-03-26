/** Abbreviated number for UI (K / M / B / T). */
export function formatCompactNumber(value: number): string {
	if (value >= 1e12) return (value / 1e12).toFixed(1) + 'T'
	if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B'
	if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M'
	if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K'
	return Math.floor(value).toString()
}

/** For a multiple-of-3 face, how many danger units (3→1, 6→2, …). */
export function dangerousFaceHexUnits(faceValue: number): number {
	return Math.floor(faceValue / 3)
}

export function makeDefaultDie(): number[] {
	return [1, 2, 3, 4, 5, 6]
}

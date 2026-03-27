import { useCallback, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
	clampUpgradeLevel,
	hexStreakMultiplier,
	streakMultiplier,
	type BalanceConfig,
} from './balanceConfig'
import { dangerousFaceHexUnits, formatCompactNumber } from './constants'
import { currentDieAtom, gameLockedAtom } from './atoms/derived'
import { rollTimers } from './rollTimers'
import * as P from './atoms/primitives'

type RollSnap = {
	locked: boolean
	currentDie: number[]
	totalRollCount: number
	pendingSafeFirstRoll: boolean
	pipletMultiplier: number
	streakRetentionPct: number
	prestigePipletMultiplier: number
	rollCooldownMs: number
	stunMs: number
	stunTierName: string
	hexBase: number
	balance: BalanceConfig
}

function randomFaceIndexAvoidingMultiplesOfThree(faces: number[]): number | null {
	const safe = faces.map((v, i) => (v % 3 !== 0 ? i : -1)).filter((i): i is number => i >= 0)
	if (safe.length === 0) return null
	return safe[Math.floor(Math.random() * safe.length)]
}

/**
 * Roll the current die: reads/writes game atoms via Jotai hooks.
 * A ref keeps values fresh for `setTimeout` handlers (no store threading).
 */
export function useDiceRoll(): () => void {
	const locked = useAtomValue(gameLockedAtom)
	const currentDie = useAtomValue(currentDieAtom)
	const balance = useAtomValue(P.balanceConfigAtom)
	const multiplierUpgradeLevel = useAtomValue(P.multiplierUpgradeLevelAtom)
	const streakRetentionUpgradeLevel = useAtomValue(P.streakRetentionUpgradeLevelAtom)
	const prestige = useAtomValue(P.prestigeAtom)
	const totalRollCount = useAtomValue(P.totalRollCountAtom)
	const pendingSafeFirstRoll = useAtomValue(P.pendingSafeFirstRollAtom)
	const speedUpgradeLevel = useAtomValue(P.speedUpgradeLevelAtom)
	const stunUpgradeLevel = useAtomValue(P.stunUpgradeLevelAtom)

	const multiplierTierIndex = clampUpgradeLevel(multiplierUpgradeLevel, balance.multi.length)
	const streakRetentionTierIndex = clampUpgradeLevel(
		streakRetentionUpgradeLevel,
		balance.streakRetention.length
	)
	const speedTierIndex = clampUpgradeLevel(speedUpgradeLevel, balance.speed.length)
	const stunTierIndex = clampUpgradeLevel(stunUpgradeLevel, balance.stun.length)

	const snapRef = useRef<RollSnap>({
		locked,
		currentDie,
		totalRollCount,
		pendingSafeFirstRoll,
		pipletMultiplier: balance.multi[multiplierTierIndex].x,
		streakRetentionPct: balance.streakRetention[streakRetentionTierIndex].pct,
		prestigePipletMultiplier: 1 + prestige * balance.prestigePipletMultPerLevel,
		rollCooldownMs: balance.speed[speedTierIndex].ms,
		stunMs: balance.stun[stunTierIndex].ms,
		stunTierName: balance.stun[stunTierIndex].name,
		hexBase: balance.hexBase,
		balance,
	})
	snapRef.current = {
		locked,
		currentDie,
		totalRollCount,
		pendingSafeFirstRoll,
		pipletMultiplier: balance.multi[multiplierTierIndex].x,
		streakRetentionPct: balance.streakRetention[streakRetentionTierIndex].pct,
		prestigePipletMultiplier: 1 + prestige * balance.prestigePipletMultPerLevel,
		rollCooldownMs: balance.speed[speedTierIndex].ms,
		stunMs: balance.stun[stunTierIndex].ms,
		stunTierName: balance.stun[stunTierIndex].name,
		hexBase: balance.hexBase,
		balance,
	}

	const setRollCooldownActive = useSetAtom(P.isRollCooldownActiveAtom)
	const setRolling = useSetAtom(P.isRollingAtom)
	const setRunStarted = useSetAtom(P.runStartedAtom)
	const setLastRolledFace = useSetAtom(P.lastRolledFaceAtom)
	const setTotalRollCount = useSetAtom(P.totalRollCountAtom)
	const setHexRewardStreak = useSetAtom(P.hexRewardStreakAtom)
	const setPipletStreak = useSetAtom(P.pipletStreakAtom)
	const setPiplets = useSetAtom(P.pipletsAtom)
	const setLifetimePipletsEarned = useSetAtom(P.lifetimePipletsEarnedAtom)
	const setDieShakeActive = useSetAtom(P.dieShakeActiveAtom)
	const setMultipleOfThreeRollCount = useSetAtom(P.multipleOfThreeRollCountAtom)
	const setHexBalance = useSetAtom(P.hexBalanceAtom)
	const setBestHexRewardStreak = useSetAtom(P.bestHexRewardStreakAtom)
	const setBestPipletStreak = useSetAtom(P.bestPipletStreakAtom)
	const setStunned = useSetAtom(P.isStunnedAtom)
	const setActiveStunWindow = useSetAtom(P.activeStunWindowAtom)
	const setGameEventLog = useSetAtom(P.gameEventLogAtom)
	const setPendingSafeFirstRoll = useSetAtom(P.pendingSafeFirstRollAtom)
	const setRollRewardPopups = useSetAtom(P.rollRewardPopupsAtom)

	return useCallback(() => {
		if (snapRef.current.locked) return

		// Capture cdMs at roll time — the spin lasts this long before the face reveals.
		const spinMs = snapRef.current.rollCooldownMs

		setRollCooldownActive(true)
		setRolling(true)
		setRunStarted(runAlreadyStarted => (runAlreadyStarted ? runAlreadyStarted : true))

		setTimeout(() => {
			const {
				currentDie: dieFaces,
				totalRollCount: rollsSoFar,
				pendingSafeFirstRoll: prestigeSafePending,
				pipletMultiplier,
				streakRetentionPct,
				prestigePipletMultiplier,
				stunMs,
				stunTierName,
				hexBase,
				balance,
			} = snapRef.current

			const guaranteeSafe = rollsSoFar === 0 || prestigeSafePending
			const safeIndex = guaranteeSafe ? randomFaceIndexAvoidingMultiplesOfThree(dieFaces) : null
			const faceIndex = safeIndex !== null ? safeIndex : Math.floor(Math.random() * dieFaces.length)
			const rolledValue = dieFaces[faceIndex]
			setLastRolledFace(rolledValue)
			setRolling(false)
			setTotalRollCount((count: number) => count + 1)
			if (prestigeSafePending) setPendingSafeFirstRoll(false)

			const dangerous = rolledValue % 3 === 0

			if (dangerous) {
				setDieShakeActive(true)
				setMultipleOfThreeRollCount((count: number) => count + 1)
				setPipletStreak((priorPipletStreak: number) => {
					const kept = Math.floor((priorPipletStreak * streakRetentionPct) / 100)
					let line: string
					if (priorPipletStreak === 0) {
						line = `💀 Rolled ${rolledValue}! Stunned ${stunTierName}`
					} else if (kept >= priorPipletStreak) {
						line = `💀 Rolled ${rolledValue}! Streak ${priorPipletStreak} held. Stunned ${stunTierName}`
					} else if (streakRetentionPct > 0) {
						line = `💀 Rolled ${rolledValue}! Streak ${priorPipletStreak} → ${kept} (${streakRetentionPct}% kept). Stunned ${stunTierName}`
					} else {
						line = `💀 Rolled ${rolledValue}! Streak gone. Stunned ${stunTierName}`
					}
					setGameEventLog((prevLog: string[]) => [line, ...prevLog].slice(0, 60))
					return kept
				})
				setHexRewardStreak((priorHexStreak: number) => {
					const dangerUnits = Math.max(1, dangerousFaceHexUnits(rolledValue))
					const hexStreakMult = hexStreakMultiplier(priorHexStreak, balance)
					const earnedHex = Math.floor(hexBase * dangerUnits * hexStreakMult)
					setRollRewardPopups(prev =>
						[
							...prev,
							{
								id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
								kind: 'hex' as const,
								amount: earnedHex,
							},
						].slice(-14)
					)
					setHexBalance((hex: number) => hex + earnedHex)
					const nextHexStreak = priorHexStreak + dangerUnits
					setBestHexRewardStreak((previousBest: number) => Math.max(previousBest, nextHexStreak))
					const parts: string[] = []
					if (dangerUnits > 1) parts.push(`${dangerUnits}× danger`)
					if (priorHexStreak > 0) parts.push(`×${hexStreakMult.toFixed(1)} streak`)
					const suffix = parts.length ? ` (${parts.join(', ')})` : ''
					setGameEventLog((prevLog: string[]) =>
						[`🔮 +${earnedHex} hex${suffix}`, ...prevLog].slice(0, 60)
					)
					return nextHexStreak
				})
				setTimeout(() => {
					setDieShakeActive(false)
				}, 400)
				setRollCooldownActive(false)
				setActiveStunWindow({ startMs: Date.now(), durationMs: stunMs })
				setStunned(true)
				if (rollTimers.stun) clearTimeout(rollTimers.stun)
				rollTimers.stun = setTimeout(() => {
					rollTimers.stun = null
					setActiveStunWindow(null)
					setStunned(false)
				}, stunMs)
			} else {
				setHexRewardStreak(0)
				setPipletStreak((priorPipletStreak: number) => {
					const pipletStreakMult = streakMultiplier(priorPipletStreak, balance)
					const earnedPiplets = Math.floor(
						rolledValue * pipletStreakMult * pipletMultiplier * prestigePipletMultiplier
					)
					setRollRewardPopups(prev =>
						[
							...prev,
							{
								id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
								kind: 'piplet' as const,
								amount: earnedPiplets,
							},
						].slice(-14)
					)
					setPiplets((p: number) => p + earnedPiplets)
					setLifetimePipletsEarned((lifetimeTotal: number) => lifetimeTotal + earnedPiplets)
					const nextPipletStreak = priorPipletStreak + 1
					setBestPipletStreak((previousBest: number) => Math.max(previousBest, nextPipletStreak))
					setGameEventLog((prevLog: string[]) =>
						[
							`🎲 ${rolledValue} → +${formatCompactNumber(earnedPiplets)} pl${
								priorPipletStreak > 2 ? ` (×${pipletStreakMult.toFixed(1)})` : ''
							}`,
							...prevLog,
						].slice(0, 60)
					)
					return nextPipletStreak
				})
				setRollCooldownActive(false)
			}
		}, spinMs)
	}, [
		setRollCooldownActive,
		setRolling,
		setRunStarted,
		setLastRolledFace,
		setTotalRollCount,
		setHexRewardStreak,
		setPipletStreak,
		setPiplets,
		setLifetimePipletsEarned,
		setDieShakeActive,
		setMultipleOfThreeRollCount,
		setHexBalance,
		setBestHexRewardStreak,
		setBestPipletStreak,
		setStunned,
		setActiveStunWindow,
		setGameEventLog,
		setPendingSafeFirstRoll,
		setRollRewardPopups,
	])
}

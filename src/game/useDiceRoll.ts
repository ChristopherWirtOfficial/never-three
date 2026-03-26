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
	goldMultiplier: number
	streakRetentionPct: number
	prestigeGoldMultiplier: number
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

	const mLv = clampUpgradeLevel(multiplierUpgradeLevel, balance.multi.length)
	const rLv = clampUpgradeLevel(streakRetentionUpgradeLevel, balance.streakRetention.length)
	const sLv = clampUpgradeLevel(speedUpgradeLevel, balance.speed.length)
	const tLv = clampUpgradeLevel(stunUpgradeLevel, balance.stun.length)

	const snapRef = useRef<RollSnap>({
		locked,
		currentDie,
		totalRollCount,
		pendingSafeFirstRoll,
		goldMultiplier: balance.multi[mLv].x,
		streakRetentionPct: balance.streakRetention[rLv].pct,
		prestigeGoldMultiplier: 1 + prestige * balance.prestigeGoldMultPerLevel,
		rollCooldownMs: balance.speed[sLv].ms,
		stunMs: balance.stun[tLv].ms,
		stunTierName: balance.stun[tLv].name,
		hexBase: balance.hexBase,
		balance,
	})
	snapRef.current = {
		locked,
		currentDie,
		totalRollCount,
		pendingSafeFirstRoll,
		goldMultiplier: balance.multi[mLv].x,
		streakRetentionPct: balance.streakRetention[rLv].pct,
		prestigeGoldMultiplier: 1 + prestige * balance.prestigeGoldMultPerLevel,
		rollCooldownMs: balance.speed[sLv].ms,
		stunMs: balance.stun[tLv].ms,
		stunTierName: balance.stun[tLv].name,
		hexBase: balance.hexBase,
		balance,
	}

	const setRollCooldownActive = useSetAtom(P.isRollCooldownActiveAtom)
	const setRolling = useSetAtom(P.isRollingAtom)
	const setRunStarted = useSetAtom(P.runStartedAtom)
	const setLastRolledFace = useSetAtom(P.lastRolledFaceAtom)
	const setTotalRollCount = useSetAtom(P.totalRollCountAtom)
	const setScreenFlashColor = useSetAtom(P.screenFlashColorAtom)
	const setHexRewardStreak = useSetAtom(P.hexRewardStreakAtom)
	const setGoldStreak = useSetAtom(P.goldStreakAtom)
	const setGold = useSetAtom(P.goldAtom)
	const setLifetimeGoldEarned = useSetAtom(P.lifetimeGoldEarnedAtom)
	const setDieShakeActive = useSetAtom(P.dieShakeActiveAtom)
	const setMultipleOfThreeRollCount = useSetAtom(P.multipleOfThreeRollCountAtom)
	const setHexBalance = useSetAtom(P.hexBalanceAtom)
	const setBestHexRewardStreak = useSetAtom(P.bestHexRewardStreakAtom)
	const setBestGoldStreak = useSetAtom(P.bestGoldStreakAtom)
	const setStunned = useSetAtom(P.isStunnedAtom)
	const setActiveStunWindow = useSetAtom(P.activeStunWindowAtom)
	const setGameEventLog = useSetAtom(P.gameEventLogAtom)
	const setPendingSafeFirstRoll = useSetAtom(P.pendingSafeFirstRollAtom)

	return useCallback(() => {
		if (snapRef.current.locked) return

		setRollCooldownActive(true)
		setRolling(true)
		setRunStarted(runAlreadyStarted => (runAlreadyStarted ? runAlreadyStarted : true))

		setTimeout(() => {
			const {
				currentDie: dieFaces,
				totalRollCount: rollsSoFar,
				pendingSafeFirstRoll: prestigeSafePending,
				goldMultiplier,
				streakRetentionPct,
				prestigeGoldMultiplier,
				rollCooldownMs,
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
				setScreenFlashColor('#ff3355')
				setMultipleOfThreeRollCount((count: number) => count + 1)
				setGoldStreak((priorGoldStreak: number) => {
					const kept = Math.floor((priorGoldStreak * streakRetentionPct) / 100)
					let line: string
					if (priorGoldStreak === 0) {
						line = `💀 Rolled ${rolledValue}! Stunned ${stunTierName}`
					} else if (kept >= priorGoldStreak) {
						line = `💀 Rolled ${rolledValue}! Streak ${priorGoldStreak} held. Stunned ${stunTierName}`
					} else if (streakRetentionPct > 0) {
						line = `💀 Rolled ${rolledValue}! Streak ${priorGoldStreak} → ${kept} (${streakRetentionPct}% kept). Stunned ${stunTierName}`
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
					setScreenFlashColor(null)
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
				setGoldStreak((priorGoldStreak: number) => {
					const goldStreakMult = streakMultiplier(priorGoldStreak, balance)
					const earnedGold = Math.floor(
						rolledValue * goldStreakMult * goldMultiplier * prestigeGoldMultiplier
					)
					setGold((gold: number) => gold + earnedGold)
					setLifetimeGoldEarned((lifetimeTotal: number) => lifetimeTotal + earnedGold)
					const nextGoldStreak = priorGoldStreak + 1
					setBestGoldStreak((previousBest: number) => Math.max(previousBest, nextGoldStreak))
					setGameEventLog((prevLog: string[]) =>
						[
							`🎲 ${rolledValue} → +${formatCompactNumber(earnedGold)}g${
								priorGoldStreak > 2 ? ` (×${goldStreakMult.toFixed(1)})` : ''
							}`,
							...prevLog,
						].slice(0, 60)
					)
					return nextGoldStreak
				})
				setScreenFlashColor('#44ffbb')
				setTimeout(() => setScreenFlashColor(null), 200)
				if (rollTimers.cool) clearTimeout(rollTimers.cool)
				rollTimers.cool = setTimeout(() => {
					rollTimers.cool = null
					setRollCooldownActive(false)
				}, rollCooldownMs)
			}
		}, 160)
	}, [
		setRollCooldownActive,
		setRolling,
		setRunStarted,
		setLastRolledFace,
		setTotalRollCount,
		setScreenFlashColor,
		setHexRewardStreak,
		setGoldStreak,
		setGold,
		setLifetimeGoldEarned,
		setDieShakeActive,
		setMultipleOfThreeRollCount,
		setHexBalance,
		setBestHexRewardStreak,
		setBestGoldStreak,
		setStunned,
		setActiveStunWindow,
		setGameEventLog,
		setPendingSafeFirstRoll,
	])
}

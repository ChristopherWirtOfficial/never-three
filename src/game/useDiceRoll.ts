import { useCallback, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
	MULTI,
	SPEED,
	STREAK_RETENTION,
	STUN,
	dangerousFaceHexUnits,
	formatCompactNumber,
	HEX_BASE,
	hexStreakMultiplier,
	streakMultiplier,
} from './constants'
import { currentDieAtom, gameLockedAtom } from './atoms/derived'
import { rollTimers } from './rollTimers'
import * as P from './atoms/primitives'

type RollSnap = {
	locked: boolean
	currentDie: number[]
	goldMultiplier: number
	streakRetentionPct: number
	prestigeGoldMultiplier: number
	rollCooldownMs: number
	stunMs: number
	stunTier: (typeof STUN)[number]
}

/**
 * Roll the current die: reads/writes game atoms via Jotai hooks.
 * A ref keeps values fresh for `setTimeout` handlers (no store threading).
 */
export function useDiceRoll(): () => void {
	const locked = useAtomValue(gameLockedAtom)
	const currentDie = useAtomValue(currentDieAtom)
	const multiplierUpgradeLevel = useAtomValue(P.multiplierUpgradeLevelAtom)
	const streakRetentionUpgradeLevel = useAtomValue(P.streakRetentionUpgradeLevelAtom)
	const prestige = useAtomValue(P.prestigeAtom)
	const speedUpgradeLevel = useAtomValue(P.speedUpgradeLevelAtom)
	const stunUpgradeLevel = useAtomValue(P.stunUpgradeLevelAtom)

	const snapRef = useRef<RollSnap>({
		locked,
		currentDie,
		goldMultiplier: MULTI[multiplierUpgradeLevel].x,
		streakRetentionPct: STREAK_RETENTION[streakRetentionUpgradeLevel].pct,
		prestigeGoldMultiplier: 1 + prestige * 0.5,
		rollCooldownMs: SPEED[speedUpgradeLevel].ms,
		stunMs: STUN[stunUpgradeLevel].ms,
		stunTier: STUN[stunUpgradeLevel],
	})
	snapRef.current = {
		locked,
		currentDie,
		goldMultiplier: MULTI[multiplierUpgradeLevel].x,
		streakRetentionPct: STREAK_RETENTION[streakRetentionUpgradeLevel].pct,
		prestigeGoldMultiplier: 1 + prestige * 0.5,
		rollCooldownMs: SPEED[speedUpgradeLevel].ms,
		stunMs: STUN[stunUpgradeLevel].ms,
		stunTier: STUN[stunUpgradeLevel],
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

	return useCallback(() => {
		if (snapRef.current.locked) return

		setRollCooldownActive(true)
		setRolling(true)
		setRunStarted(runAlreadyStarted => (runAlreadyStarted ? runAlreadyStarted : true))

		setTimeout(() => {
			const {
				currentDie: dieFaces,
				goldMultiplier,
				streakRetentionPct,
				prestigeGoldMultiplier,
				rollCooldownMs,
				stunMs,
				stunTier,
			} = snapRef.current

			const faceIndex = Math.floor(Math.random() * dieFaces.length)
			const rolledValue = dieFaces[faceIndex]
			setLastRolledFace(rolledValue)
			setRolling(false)
			setTotalRollCount((count: number) => count + 1)

			const dangerous = rolledValue % 3 === 0

			if (dangerous) {
				setDieShakeActive(true)
				setScreenFlashColor('#ff3355')
				setMultipleOfThreeRollCount((count: number) => count + 1)
				setGoldStreak((priorGoldStreak: number) => {
					const kept = Math.floor((priorGoldStreak * streakRetentionPct) / 100)
					let line: string
					if (priorGoldStreak === 0) {
						line = `💀 Rolled ${rolledValue}! Stunned ${stunTier.name}`
					} else if (kept >= priorGoldStreak) {
						line = `💀 Rolled ${rolledValue}! Streak ${priorGoldStreak} held. Stunned ${stunTier.name}`
					} else if (streakRetentionPct > 0) {
						line = `💀 Rolled ${rolledValue}! Streak ${priorGoldStreak} → ${kept} (${streakRetentionPct}% kept). Stunned ${stunTier.name}`
					} else {
						line = `💀 Rolled ${rolledValue}! Streak gone. Stunned ${stunTier.name}`
					}
					setGameEventLog((prevLog: string[]) => [line, ...prevLog].slice(0, 60))
					return kept
				})
				setHexRewardStreak((priorHexStreak: number) => {
					const dangerUnits = Math.max(1, dangerousFaceHexUnits(rolledValue))
					const hexStreakMult = hexStreakMultiplier(priorHexStreak)
					const earnedHex = Math.floor(HEX_BASE * dangerUnits * hexStreakMult)
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
					const goldStreakMult = streakMultiplier(priorGoldStreak)
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
	])
}

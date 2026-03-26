import { useEffect, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { clampUpgradeLevel } from './balanceConfig'
import {
	autoRollProgressAtom,
	autoRollUpgradeLevelAtom,
	balanceConfigAtom,
	isRollCooldownActiveAtom,
	isStunnedAtom,
	rollCooldownProgressAtom,
	runStartedAtom,
	speedUpgradeLevelAtom,
	stunRecoveryProgressAtom,
	activeStunWindowAtom,
} from './atoms/primitives'
import { cdMsAtom, gameLockedAtom } from './atoms/derived'
import { clearRollTimeouts } from './rollTimers'

/**
 * Timers and RAF progress tied to roll phase atoms. Mount once under the Jotai provider.
 */
export function useGameLoop(rollDice: () => void): void {
	const balance = useAtomValue(balanceConfigAtom)
	const autoRollUpgradeLevel = useAtomValue(autoRollUpgradeLevelAtom)
	const speedUpgradeLevel = useAtomValue(speedUpgradeLevelAtom)
	const runStarted = useAtomValue(runStartedAtom)
	const locked = useAtomValue(gameLockedAtom)
	const isRollCooldownActive = useAtomValue(isRollCooldownActiveAtom)
	const isStunned = useAtomValue(isStunnedAtom)
	const cdMs = useAtomValue(cdMsAtom)
	const activeStunWindow = useAtomValue(activeStunWindowAtom)

	const setRollCooldownActive = useSetAtom(isRollCooldownActiveAtom)
	const setStunned = useSetAtom(isStunnedAtom)
	const setActiveStunWindow = useSetAtom(activeStunWindowAtom)
	const setAutoRollProgress = useSetAtom(autoRollProgressAtom)
	const setRollCooldownProgress = useSetAtom(rollCooldownProgressAtom)
	const setStunRecoveryProgress = useSetAtom(stunRecoveryProgressAtom)

	const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const autoStartRef = useRef(0)
	const autoFrameRef = useRef(0)
	const cdFrameRef = useRef(0)
	const stunFrameRef = useRef(0)

	const autoLv = clampUpgradeLevel(autoRollUpgradeLevel, balance.auto.length)
	const autoMs = balance.auto[autoLv].ms

	useEffect(
		() => () => {
			clearRollTimeouts()
			setActiveStunWindow(null)
		},
		[setActiveStunWindow]
	)

	useEffect(() => {
		clearRollTimeouts()
		setRollCooldownActive(false)
		setStunned(false)
		setActiveStunWindow(null)
	}, [speedUpgradeLevel, setRollCooldownActive, setStunned, setActiveStunWindow])

	useEffect(() => {
		if (autoTimerRef.current) {
			clearTimeout(autoTimerRef.current)
			autoTimerRef.current = null
		}

		if (autoMs === null || !runStarted) {
			setAutoRollProgress(0)
			return
		}

		if (!locked) {
			autoStartRef.current = Date.now()
			const delay = autoMs === 0 ? 10 : autoMs
			autoTimerRef.current = setTimeout(() => {
				autoTimerRef.current = null
				rollDice()
			}, delay)
		}

		return () => {
			if (autoTimerRef.current) {
				clearTimeout(autoTimerRef.current)
				autoTimerRef.current = null
			}
		}
	}, [autoRollUpgradeLevel, balance, autoMs, locked, runStarted, rollDice, setAutoRollProgress])

	useEffect(() => {
		if (autoMs === null || autoMs <= 0 || !runStarted || locked) {
			setAutoRollProgress(0)
			cancelAnimationFrame(autoFrameRef.current)
			return
		}
		const tick = () => {
			const progress = Math.min((Date.now() - autoStartRef.current) / autoMs, 1)
			setAutoRollProgress(progress)
			if (progress < 1) autoFrameRef.current = requestAnimationFrame(tick)
		}
		autoFrameRef.current = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(autoFrameRef.current)
	}, [autoRollUpgradeLevel, balance, autoMs, locked, runStarted, setAutoRollProgress])

	useEffect(() => {
		if (isRollCooldownActive && !isStunned) {
			const cdStart = Date.now()
			const tick = () => {
				const progress = Math.min((Date.now() - cdStart) / cdMs, 1)
				setRollCooldownProgress(progress)
				if (progress < 1) cdFrameRef.current = requestAnimationFrame(tick)
			}
			cdFrameRef.current = requestAnimationFrame(tick)
		} else if (!isStunned) {
			setRollCooldownProgress(0)
			cancelAnimationFrame(cdFrameRef.current)
		}
		return () => cancelAnimationFrame(cdFrameRef.current)
	}, [isRollCooldownActive, isStunned, cdMs, setRollCooldownProgress])

	useEffect(() => {
		if (isStunned && activeStunWindow) {
			const { startMs, durationMs } = activeStunWindow
			const tick = () => {
				const progress = Math.min((Date.now() - startMs) / durationMs, 1)
				setStunRecoveryProgress(progress)
				if (progress < 1) stunFrameRef.current = requestAnimationFrame(tick)
				else setStunRecoveryProgress(1)
			}
			stunFrameRef.current = requestAnimationFrame(tick)
		} else if (!isStunned) {
			setStunRecoveryProgress(0)
			cancelAnimationFrame(stunFrameRef.current)
		}
		return () => cancelAnimationFrame(stunFrameRef.current)
	}, [isStunned, activeStunWindow, setStunRecoveryProgress])
}

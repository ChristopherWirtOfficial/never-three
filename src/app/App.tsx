import { Box } from '@chakra-ui/react'
import { BottomDock } from '../components/layout/BottomDock'
import { FlashOverlay } from '../components/layout/FlashOverlay'
import { TopBar } from '../components/layout/TopBar'
import { ForgeTab } from '../features/forge/ForgeTab'
import { LogTab } from '../features/log/LogTab'
import { RollTab } from '../features/roll/RollTab'
import { ShopTab } from '../features/shop/ShopTab'
import { useGameSurface } from '../game/useGameSurface'
import { useSaveSlots } from '../providers/SaveSlotsContext'

export default function NeverThree() {
	const g = useGameSurface()
	const { openSaveManager } = useSaveSlots()

	return (
		<>
			{g.screenFlashColor && <FlashOverlay color={g.screenFlashColor} />}

			<Box
				h='100dvh'
				w='100%'
				maxW='480px'
				mx='auto'
				display='flex'
				flexDirection='column'
				bg='never.bg'
				color='never.text'
				fontFamily='monospace'
				overflow='hidden'
				animation={g.dieShakeActive ? 'neverShake 0.3s ease' : undefined}
			>
				<TopBar
					gold={g.gold}
					hexBalance={g.hexBalance}
					goldStreak={g.goldStreak}
					hexRewardStreak={g.hexRewardStreak}
					bestGoldStreak={g.bestGoldStreak}
					prestige={g.prestige}
					prestigeGoldMultiplier={g.prestigeGoldMultiplier}
					onOpenSaves={openSaveManager}
				/>

				<Box
					flex={1}
					overflow='auto'
					px='18px'
				>
					{g.activeGameTab === 'roll' && (
						<RollTab
							autoRollUpgradeLevel={g.autoRollUpgradeLevel}
							speedUpgradeLevel={g.speedUpgradeLevel}
							multi={g.multi}
							streakRetentionPct={g.streakRetentionPct}
							prestigeGoldMultiplier={g.prestigeGoldMultiplier}
							lastRolledFace={g.lastRolledFace}
							isRolling={g.isRolling}
							goldStreak={g.goldStreak}
							isStunned={g.isStunned}
							totalRollCount={g.totalRollCount}
							multipleOfThreeRollCount={g.multipleOfThreeRollCount}
							runStarted={g.runStarted}
							autoRollProgress={g.autoRollProgress}
							autoMs={g.autoMs}
							currentDie={g.currentDie}
						/>
					)}
					{g.activeGameTab === 'shop' && (
						<ShopTab
							gold={g.gold}
							lifetimeGoldEarned={g.lifetimeGoldEarned}
							speedUpgradeLevel={g.speedUpgradeLevel}
							autoRollUpgradeLevel={g.autoRollUpgradeLevel}
							multiplierUpgradeLevel={g.multiplierUpgradeLevel}
							streakRetentionUpgradeLevel={g.streakRetentionUpgradeLevel}
							stunUpgradeLevel={g.stunUpgradeLevel}
							prestige={g.prestige}
							prestigeReq={g.prestigeReq}
							canPrestige={g.canPrestige}
							purchaseUpgrade={g.purchaseUpgrade}
							commitPrestige={g.commitPrestige}
						/>
					)}
					{g.activeGameTab === 'forge' && (
						<ForgeTab
							dice={g.dice}
							totalDieReforgeCount={g.totalDieReforgeCount}
							maxReforgeFaceValue={g.maxReforgeFaceValue}
							hexBalance={g.hexBalance}
							incrementDieFace={g.incrementDieFace}
							decrementDieFace={g.decrementDieFace}
						/>
					)}
					{g.activeGameTab === 'log' && <LogTab gameEventLog={g.gameEventLog} />}
				</Box>

				<BottomDock
					lastRolledFace={g.lastRolledFace}
					sides={g.currentDie.length}
					isStunned={g.isStunned}
					stunRecoveryProgress={g.stunRecoveryProgress}
					stunActiveDurationMs={g.stunActiveDurationMs}
					isRolling={g.isRolling}
					locked={g.locked}
					autoRollUpgradeLevel={g.autoRollUpgradeLevel}
					rollCooldownProgress={g.rollCooldownProgress}
					activeGameTab={g.activeGameTab}
					onRoll={() => {
						if (!g.locked) g.rollDice()
					}}
					onTabChange={g.setActiveGameTab}
				/>
			</Box>
		</>
	)
}

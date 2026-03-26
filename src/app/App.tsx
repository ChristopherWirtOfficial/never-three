import { Box } from '@chakra-ui/react'
import { BottomDock } from '../components/layout/BottomDock'
import { TopBar } from '../components/layout/TopBar'
import { BalanceTab } from '../features/balance/BalanceTab'
import { ForgeTab } from '../features/forge/ForgeTab'
import { LogTab } from '../features/log/LogTab'
import { RollTab } from '../features/roll/RollTab'
import { ShopTab } from '../features/shop/ShopTab'
import { useGameSurface } from '../game/useGameSurface'
import { useSaveSlots } from '../providers/SaveSlotsContext'

export default function NeverThree() {
	const game = useGameSurface()
	const { openSaveManager } = useSaveSlots()

	return (
		<>
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
				animation={game.dieShakeActive ? 'neverShake 0.3s ease' : undefined}
			>
				<TopBar
					gold={game.gold}
					hexBalance={game.hexBalance}
					prestige={game.prestige}
					prestigeGoldMultiplier={game.prestigeGoldMultiplier}
					onOpenSaves={openSaveManager}
				/>

				<Box
					flex={1}
					overflow='auto'
					px='18px'
				>
					{game.activeGameTab === 'roll' && (
						<RollTab
							prestigeGoldMultiplier={game.prestigeGoldMultiplier}
							lastRolledFace={game.lastRolledFace}
							isRolling={game.isRolling}
							goldStreak={game.goldStreak}
							isStunned={game.isStunned}
							goldMultiplier={game.goldMultiplier}
							totalRollCount={game.totalRollCount}
							multipleOfThreeRollCount={game.multipleOfThreeRollCount}
							runStarted={game.runStarted}
						/>
					)}
					{game.activeGameTab === 'shop' && (
						<ShopTab
							gold={game.gold}
							lifetimeGoldEarned={game.lifetimeGoldEarned}
							speedUpgradeLevel={game.speedUpgradeLevel}
							autoRollUpgradeLevel={game.autoRollUpgradeLevel}
							multiplierUpgradeLevel={game.multiplierUpgradeLevel}
							streakRetentionUpgradeLevel={game.streakRetentionUpgradeLevel}
							stunUpgradeLevel={game.stunUpgradeLevel}
							prestige={game.prestige}
							prestigeReq={game.prestigeReq}
							canPrestige={game.canPrestige}
							purchaseUpgrade={game.purchaseUpgrade}
							commitPrestige={game.commitPrestige}
						/>
					)}
					{game.activeGameTab === 'forge' && (
						<ForgeTab
							dice={game.dice}
							totalDieReforgeCount={game.totalDieReforgeCount}
							maxReforgeFaceValue={game.maxReforgeFaceValue}
							hexBalance={game.hexBalance}
							incrementDieFace={game.incrementDieFace}
							decrementDieFace={game.decrementDieFace}
						/>
					)}
					{game.activeGameTab === 'log' && <LogTab gameEventLog={game.gameEventLog} />}
					{game.activeGameTab === 'balance' && <BalanceTab />}
				</Box>

				<BottomDock
					lastRolledFace={game.lastRolledFace}
					sides={game.currentDie.length}
					isStunned={game.isStunned}
					stunRecoveryProgress={game.stunRecoveryProgress}
					stunActiveDurationMs={game.stunActiveDurationMs}
					isRolling={game.isRolling}
					locked={game.locked}
					autoRollUpgradeLevel={game.autoRollUpgradeLevel}
					isRollCooldownActive={game.isRollCooldownActive}
					rollCooldownProgress={game.rollCooldownProgress}
					cdMs={game.cdMs}
					autoRollProgress={game.autoRollProgress}
					autoMs={game.autoMs}
					runStarted={game.runStarted}
					goldStreak={game.goldStreak}
					goldStreakMult={game.goldStreakMult}
					hexRewardStreak={game.hexRewardStreak}
					hexStreakMult={game.hexStreakMult}
					bestGoldStreak={game.bestGoldStreak}
					bestHexRewardStreak={game.bestHexRewardStreak}
					activeGameTab={game.activeGameTab}
					onRoll={() => {
						if (!game.locked) game.rollDice()
					}}
					onTabChange={game.setActiveGameTab}
				/>
			</Box>
		</>
	)
}

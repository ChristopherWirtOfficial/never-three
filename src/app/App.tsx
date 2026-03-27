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
				bg='app.bg'
				color='app.text'
				fontFamily='monospace'
				overflow='hidden'
				animation={game.dieShakeActive ? 'appShake 0.3s ease' : undefined}
			>
				<TopBar
					piplets={game.piplets}
					hexBalance={game.hexBalance}
					prestige={game.prestige}
					prestigePipletMultiplier={game.prestigePipletMultiplier}
					onOpenSaves={openSaveManager}
				/>

				<Box
					flex={1}
					overflow='auto'
					px='18px'
				>
					{game.activeGameTab === 'roll' && (
						<RollTab
							prestigePipletMultiplier={game.prestigePipletMultiplier}
							lastRolledFace={game.lastRolledFace}
							isRolling={game.isRolling}
							pipletStreak={game.pipletStreak}
							isStunned={game.isStunned}
							pipletMultiplier={game.pipletMultiplier}
							totalRollCount={game.totalRollCount}
							multipleOfThreeRollCount={game.multipleOfThreeRollCount}
							runStarted={game.runStarted}
						/>
					)}
					{game.activeGameTab === 'shop' && (
						<ShopTab
							piplets={game.piplets}
							lifetimePipletsEarned={game.lifetimePipletsEarned}
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
					dieValues={game.currentDie}
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
					pipletStreak={game.pipletStreak}
					pipletStreakMult={game.pipletStreakMult}
					hexRewardStreak={game.hexRewardStreak}
					hexStreakMult={game.hexStreakMult}
					bestPipletStreak={game.bestPipletStreak}
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

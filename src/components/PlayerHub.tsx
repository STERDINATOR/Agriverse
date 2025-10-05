import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Home, 
  Sprout, 
  Wrench, 
  Map, 
  Droplets, 
  Wind, 
  Thermometer,
  Bot,
  ArrowLeft,
  Sword,
  Users,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';
import { CharacterPetDisplay } from './CharacterPetDisplay';

interface PlayerHubProps {
  onNavigate: (screen: string) => void;
}

export function PlayerHub({ onNavigate }: PlayerHubProps) {
  const { gameState, getCurrentShard, updateResources } = useGame();
  const currentShard = getCurrentShard();

  const handlePlantSapling = () => {
    if (gameState.resources.seeds < 1) {
      toast.error('Not enough seeds!');
      return;
    }
    updateResources({ seeds: gameState.resources.seeds - 1, ecoPoints: gameState.resources.ecoPoints + 10 });
    toast.success('Sapling planted in base garden!');
  };

  const handleIrrigate = () => {
    if (gameState.resources.water < 10) {
      toast.error('Not enough water!');
      return;
    }
    updateResources({ water: gameState.resources.water - 10 });
    toast.success('Base fields irrigated!');
  };

  const handleUpgradeTools = () => {
    if (gameState.resources.ecoPoints < 50) {
      toast.error('Need 50 Eco Points to upgrade!');
      return;
    }
    updateResources({ ecoPoints: gameState.resources.ecoPoints - 50, energy: gameState.resources.energy + 20 });
    toast.success('Tools upgraded! +20 Energy');
  };

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1593545390068-c497133ab618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc29tZXRyaWMlMjBmYXJtJTIwdmlld3xlbnwxfHx8fDE3NTk1NTY5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/80 to-black/70" />

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <Button
          onClick={() => onNavigate('startPage')}
          variant="ghost"
          className="text-[#E5E7EB] hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Exit Dashboard
        </Button>
        
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-[#FFD369]" />
          <h1 className="text-xl text-[#E5E7EB]">Farm Base Alpha-7</h1>
        </div>

        <Badge className="bg-[#73C783] text-black">
          Shard: {currentShard.name} {currentShard.emoji}
        </Badge>
      </div>

      <div className="relative z-10 flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Stats */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-80 p-6 space-y-4"
        >
          {/* Environmental Stats */}
          <Card className="p-4 bg-black/40 border-[#73C783]/30 backdrop-blur-sm">
            <h3 className="text-[#FFD369] mb-4 flex items-center gap-2">
              <Wind className="w-4 h-4" />
              Environmental Status
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#E5E7EB] text-sm">Soil Health</span>
                  <span className="text-[#73C783] text-sm">{currentShard.soilHealth}%</span>
                </div>
                <Progress value={currentShard.soilHealth} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#E5E7EB] text-sm">Water Level</span>
                  <span className="text-[#6EE7B7] text-sm">{currentShard.waterLevel}%</span>
                </div>
                <Progress value={currentShard.waterLevel} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#E5E7EB] text-sm">Air Quality</span>
                  <span className="text-[#FFD369] text-sm">{currentShard.airQuality}%</span>
                </div>
                <Progress value={currentShard.airQuality} className="h-2" />
              </div>
            </div>
          </Card>

          {/* AI Assistant */}
          <Card className="p-4 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6EE7B7] to-[#73C783] flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="text-[#E5E7EB]">TERRA-AI</h4>
                <p className="text-xs text-[#E5E7EB]/70">Climate Assistant</p>
              </div>
            </div>
            <p className="text-sm text-[#E5E7EB]/90 mb-3">
              "Recent NASA data shows optimal planting conditions. Consider expanding your tomato crops."
            </p>
            <Button 
              onClick={() => onNavigate('terraAI')}
              size="sm" 
              variant="outline" 
              className="w-full border-[#6EE7B7] text-[#6EE7B7]"
            >
              View Recommendations
            </Button>
          </Card>

          {/* Current Resources */}
          <Card className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
            <h3 className="text-[#FFD369] mb-3">Resources</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-[#E5E7EB]">
                <div>Seeds: <span className="text-[#73C783]">{gameState.resources.seeds}</span></div>
                <div>Water: <span className="text-[#6EE7B7]">{gameState.resources.water}L</span></div>
                <div>XP: <span className="text-[#FFD369]">{gameState.resources.xp}</span></div>
              </div>
              <div className="text-[#E5E7EB]">
                <div>Energy: <span className="text-[#FFD369]">{gameState.resources.energy}</span></div>
                <div>Eco Points: <span className="text-[#73C783]">{gameState.resources.ecoPoints.toLocaleString()}</span></div>
                <div>Level: <span className="text-[#6EE7B7]">{gameState.playerLevel}</span></div>
              </div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-[#E5E7EB]/70 mb-1">
                <span>Level {gameState.playerLevel}</span>
                <span>{gameState.playerXP} / {gameState.xpToNextLevel} XP</span>
              </div>
              <Progress 
                value={(gameState.playerXP / gameState.xpToNextLevel) * 100} 
                className="h-2"
              />
            </div>
          </Card>
        </motion.div>

        {/* Main Character & Pet View */}
        <div className="flex-1 p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full"
          >
            <CharacterPetDisplay onNavigate={onNavigate} />
          </motion.div>
        </div>

        {/* Right Panel - Actions */}
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-80 p-6 space-y-4"
        >
          {/* Core Farm Actions */}
          <Card className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
            <h3 className="text-[#FFD369] mb-4">Core Farm Actions</h3>
            <div className="space-y-3">
              <Button 
                onClick={() => onNavigate('farmDashboard')}
                className="w-full bg-gradient-to-r from-[#FFD369] to-[#FF8C42] text-black hover:from-[#FF8C42] hover:to-[#FFD369]"
              >
                <Target className="w-4 h-4 mr-2" />
                Farm Command Center
              </Button>
              
              <Button 
                onClick={() => onNavigate('farmingGameplay')}
                className="w-full bg-gradient-to-r from-[#73C783] to-[#6EE7B7] text-black hover:from-[#6EE7B7] hover:to-[#73C783]"
              >
                <Sprout className="w-4 h-4 mr-2" />
                Interactive Farm
              </Button>
              
              <Button 
                onClick={() => onNavigate('animatedFarming')}
                className="w-full bg-gradient-to-r from-[#6EE7B7] to-[#73C783] text-black hover:from-[#73C783] hover:to-[#6EE7B7]"
              >
                🌾 Animated Farm View
              </Button>
              
              <Button 
                onClick={() => onNavigate('guidedFarmingPractice')}
                variant="outline" 
                className="w-full border-[#6EE7B7] text-[#6EE7B7]"
              >
                <Droplets className="w-4 h-4 mr-2" />
                Guided Practice
              </Button>
            </div>
          </Card>

          {/* Quick Farm Actions */}
          <Card className="p-4 bg-black/40 border-[#73C783]/30 backdrop-blur-sm">
            <h3 className="text-[#73C783] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                onClick={handlePlantSapling}
                size="sm"
                className="w-full bg-[#73C783]/20 text-[#73C783] border border-[#73C783]/40 hover:bg-[#73C783]/30"
                disabled={gameState.resources.seeds < 1}
              >
                <Sprout className="w-3 h-3 mr-2" />
                Plant Sapling (-1 Seed)
              </Button>
              
              <Button 
                onClick={handleIrrigate}
                size="sm"
                className="w-full bg-[#6EE7B7]/20 text-[#6EE7B7] border border-[#6EE7B7]/40 hover:bg-[#6EE7B7]/30"
                disabled={gameState.resources.water < 10}
              >
                <Droplets className="w-3 h-3 mr-2" />
                Irrigate (-10 Water)
              </Button>
              
              <Button 
                onClick={handleUpgradeTools}
                size="sm"
                className="w-full bg-[#FFD369]/20 text-[#FFD369] border border-[#FFD369]/40 hover:bg-[#FFD369]/30"
                disabled={gameState.resources.ecoPoints < 50}
              >
                <Wrench className="w-3 h-3 mr-2" />
                Upgrade (-50 EP)
              </Button>
            </div>
          </Card>

          {/* Climate & Data Actions */}
          <Card className="p-4 bg-black/40 border-[#1E3A8A]/50 backdrop-blur-sm">
            <h3 className="text-[#6EE7B7] mb-4">Climate & Analysis</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => onNavigate('nasaData')}
                className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#6EE7B7] text-white hover:from-[#6EE7B7] hover:to-[#1E3A8A]"
              >
                🛰️ NASA Climate Data
              </Button>
              <Button 
                onClick={() => onNavigate('terraAI')}
                className="w-full bg-gradient-to-r from-[#6EE7B7] to-[#73C783] text-black hover:from-[#73C783] hover:to-[#6EE7B7]"
              >
                🤖 TERRA-AI Advisor
              </Button>
              <Button 
                onClick={() => onNavigate('shardExplorer')}
                className="w-full bg-[#1E3A8A] text-[#6EE7B7] hover:bg-[#1E3A8A]/80"
              >
                <Map className="w-4 h-4 mr-2" />
                Climate Shards
              </Button>
              <Button 
                onClick={() => onNavigate('googleMapsExplorer')}
                variant="outline"
                className="w-full border-[#6EE7B7] text-[#6EE7B7]"
              >
                🗺️ World Explorer
              </Button>
            </div>
          </Card>

          {/* Learning & Skills */}
          <Card className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
            <h3 className="text-[#FFD369] mb-4">Learning & Skills</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => onNavigate('learningHub')}
                className="w-full bg-gradient-to-r from-[#FFD369] to-[#73C783] text-black hover:from-[#73C783] hover:to-[#FFD369]"
              >
                🎓 Learning Hub
              </Button>
              <Button 
                onClick={() => onNavigate('guidedFarmingPractice')}
                className="w-full bg-gradient-to-r from-[#73C783] to-[#6EE7B7] text-black hover:from-[#6EE7B7] hover:to-[#73C783]"
              >
                🐰 Guided Practice
              </Button>
              <Button 
                onClick={() => onNavigate('farmShop')}
                className="w-full bg-gradient-to-r from-[#FFD369] to-[#FF8C42] text-black hover:from-[#FF8C42] hover:to-[#FFD369]"
              >
                🛒 Farm Shop ({gameState.resources.xp} XP)
              </Button>
            </div>
          </Card>

          {/* Battle & Competition */}
          <Card className="p-4 bg-black/40 border-[#FF6B6B]/30 backdrop-blur-sm">
            <h3 className="text-[#FF6B6B] mb-4">Battle & Competition</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => onNavigate('bossBattle')}
                className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8C42] text-white hover:from-[#FF8C42] hover:to-[#FF6B6B]"
              >
                ⚔️ Boss Battles
              </Button>
              <Button 
                onClick={() => onNavigate('arenaMode')}
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white hover:from-[#EC4899] hover:to-[#8B5CF6]"
              >
                🏟️ Arena Mode
              </Button>
              <Button 
                onClick={() => onNavigate('squadLobby')}
                variant="outline"
                className="w-full border-[#FF6B6B] text-[#FF6B6B]"
              >
                👥 Squad Co-op
              </Button>
            </div>
          </Card>

          {/* Trading & Economy */}
          <Card className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
            <h3 className="text-[#FFD369] mb-4">Trading & Economy</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => onNavigate('globalMarketplace')}
                className="w-full bg-gradient-to-r from-[#FFD369] to-[#6EE7B7] text-black hover:from-[#6EE7B7] hover:to-[#FFD369]"
              >
                💰 Global Marketplace
              </Button>
              <Button 
                onClick={() => onNavigate('farmCards')}
                variant="outline"
                className="w-full border-[#FFD369] text-[#FFD369]"
              >
                🃏 Farm Cards Trading
              </Button>
              <Button 
                onClick={() => onNavigate('featuresOverview')}
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white hover:from-[#7C3AED] hover:to-[#DB2777]"
              >
                ✨ All Features
              </Button>
            </div>
          </Card>

          {/* Companions & Cards */}
          <Card className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
            <h3 className="text-[#FFD369] mb-4">Companions</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => onNavigate('mentorSelection')}
                variant="outline"
                className="w-full border-[#73C783] text-[#73C783]"
              >
                🧙 Farm Guardian: {gameState.selectedMentor?.name || 'None'}
              </Button>
              <Button 
                onClick={() => onNavigate('petCompanion')}
                variant="outline"
                className="w-full border-[#6EE7B7] text-[#6EE7B7]"
              >
                🐾 Companion: {gameState.selectedPet?.name || 'None'}
              </Button>
              <Button 
                onClick={() => onNavigate('farmCards')}
                variant="outline"
                className="w-full border-[#FFD369] text-[#FFD369]"
              >
                🃏 Farm Cards
              </Button>
            </div>
          </Card>

          {/* Today's Mission */}
          {gameState.missions.map(mission => (
            <Card key={mission.id} className="p-4 bg-black/40 border-[#73C783]/30 backdrop-blur-sm">
              <h3 className="text-[#73C783] mb-3">{mission.title}</h3>
              <p className="text-sm text-[#E5E7EB]/90 mb-3">
                {mission.description}
              </p>
              <div className="flex justify-between items-center">
                <Progress value={(mission.progress / mission.target) * 100} className="flex-1 mr-3 h-2" />
                <span className="text-xs text-[#73C783]">{mission.progress}/{mission.target}</span>
              </div>
              {mission.completed && (
                <Badge className="bg-[#73C783] text-black mt-2">Completed! ✓</Badge>
              )}
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
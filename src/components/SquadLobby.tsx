import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Users, Crown, Shield, Zap, Trophy, Clock, MapPin } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface SquadLobbyProps {
  onNavigate: (screen: any) => void;
}

const squadMissions = [
  {
    id: 'desert-rescue',
    name: 'Desert Rescue Operation',
    emoji: '🏜️',
    description: 'A village is suffering from severe drought. Team up to design an irrigation system.',
    difficulty: 'Medium',
    players: '2-4 players',
    duration: '15 min',
    rewards: { ecoPoints: 500, seeds: 100, water: 50 },
    roles: ['Water Engineer', 'Soil Expert', 'Crop Specialist']
  },
  {
    id: 'flood-defense',
    name: 'Flood Defense Protocol',
    emoji: '🌊',
    description: 'Rising waters threaten farmlands. Work together to build drainage systems.',
    difficulty: 'Hard',
    players: '3-5 players',
    duration: '20 min',
    rewards: { ecoPoints: 750, seeds: 150, water: 75 },
    roles: ['Drainage Planner', 'Crop Mover', 'Terrain Designer']
  },
  {
    id: 'pest-invasion',
    name: 'Pest Swarm Defense',
    emoji: '🦗',
    description: 'Locust swarms are approaching! Set up natural defenses and protect crops.',
    difficulty: 'Extreme',
    players: '4-6 players',
    duration: '25 min',
    rewards: { ecoPoints: 1000, seeds: 200, water: 100 },
    roles: ['Pest Tracker', 'Companion Planter', 'Defense Coordinator']
  },
  {
    id: 'soil-restoration',
    name: 'Contaminated Soil Revival',
    emoji: '☠️',
    description: 'Industrial pollution has destroyed the soil. Use phytoremediation together.',
    difficulty: 'Hard',
    players: '2-4 players',
    duration: '18 min',
    rewards: { ecoPoints: 850, seeds: 175, water: 85 },
    roles: ['Soil Tester', 'Plant Healer', 'Nutrient Manager']
  },
  {
    id: 'climate-adaptation',
    name: 'Climate Adaptation Challenge',
    emoji: '🌡️',
    description: 'Extreme weather is coming. Prepare the farm to survive temperature swings.',
    difficulty: 'Medium',
    players: '3-4 players',
    duration: '15 min',
    rewards: { ecoPoints: 600, seeds: 120, water: 60 },
    roles: ['Weather Forecaster', 'Crop Adapter', 'Resource Manager']
  },
  {
    id: 'biodiversity-boost',
    name: 'Biodiversity Restoration',
    emoji: '🦋',
    description: 'Bring life back to a barren ecosystem by introducing diverse species.',
    difficulty: 'Easy',
    players: '2-3 players',
    duration: '12 min',
    rewards: { ecoPoints: 400, seeds: 80, water: 40 },
    roles: ['Pollinator Scout', 'Companion Planner', 'Habitat Builder']
  }
];

const mockPlayers = [
  { id: 1, name: 'EcoWarrior', level: 15, avatar: '🌱', status: 'ready', role: 'Water Engineer' },
  { id: 2, name: 'GreenThumb', level: 12, avatar: '🌿', status: 'ready', role: 'Soil Expert' },
  { id: 3, name: 'FarmHero', level: 18, avatar: '🚜', status: 'not-ready', role: 'Crop Specialist' },
];

const difficultyColors = {
  'Easy': '#73C783',
  'Medium': '#FFD369',
  'Hard': '#FF6B35',
  'Extreme': '#FF1744'
};

export function SquadLobby({ onNavigate }: SquadLobbyProps) {
  const { gameState } = useGame();
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [isInLobby, setIsInLobby] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const handleJoinMission = () => {
    setIsInLobby(true);
    toast.success('Joined squad lobby!', {
      description: 'Waiting for other players...'
    });
  };

  const handleToggleReady = () => {
    setPlayerReady(!playerReady);
    toast.info(!playerReady ? 'You are ready!' : 'Not ready', {
      description: !playerReady ? 'Waiting for others...' : 'Click when ready to start'
    });
  };

  const handleLeaveLobby = () => {
    setIsInLobby(false);
    setPlayerReady(false);
    setSelectedMission(null);
    toast.info('Left the lobby');
  };

  const handleStartMission = () => {
    toast.success('Mission starting!', {
      description: 'Feature coming soon in multiplayer mode'
    });
  };

  if (isInLobby) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#0F172A] to-black relative overflow-hidden">
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl mb-2 text-[#6EE7B7]">Squad Lobby</h1>
            <p className="text-lg text-[#E5E7EB]/80">
              {squadMissions.find(m => m.id === selectedMission)?.name}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Players Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h2 className="text-2xl mb-6 text-[#FFD369]">Team Members (3/4)</h2>
                
                <div className="space-y-4 mb-6">
                  {/* Current Player */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-r from-[#6EE7B7]/20 to-[#73C783]/20 border-2 border-[#6EE7B7] rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{gameState.selectedPet?.emoji || '👤'}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg text-[#E5E7EB]">You</h3>
                            <Crown className="w-4 h-4 text-[#FFD369]" />
                          </div>
                          <p className="text-sm text-[#E5E7EB]/60">Level {gameState.playerLevel}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-4 py-2 rounded-full ${playerReady ? 'bg-green-500/30 text-green-400' : 'bg-yellow-500/30 text-yellow-400'}`}>
                          {playerReady ? 'Ready' : 'Not Ready'}
                        </div>
                        <p className="text-xs text-[#E5E7EB]/60 mt-1">Leader</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Other Players */}
                  {mockPlayers.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + 1) * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{player.avatar}</div>
                          <div>
                            <h3 className="text-lg text-[#E5E7EB]">{player.name}</h3>
                            <p className="text-sm text-[#E5E7EB]/60">Level {player.level}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-4 py-2 rounded-full ${player.status === 'ready' ? 'bg-green-500/30 text-green-400' : 'bg-yellow-500/30 text-yellow-400'}`}>
                            {player.status === 'ready' ? 'Ready' : 'Not Ready'}
                          </div>
                          <p className="text-xs text-[#E5E7EB]/60 mt-1">{player.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleToggleReady}
                    className={`flex-1 py-6 ${playerReady ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/50' : 'bg-gradient-to-r from-[#6EE7B7] to-[#73C783] hover:from-[#73C783] hover:to-[#6EE7B7] text-black'}`}
                  >
                    {playerReady ? 'Not Ready' : 'Ready Up'}
                  </Button>
                  <Button
                    onClick={handleLeaveLobby}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 px-8 py-6"
                  >
                    Leave
                  </Button>
                </div>
              </div>
            </div>

            {/* Mission Info Panel */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
              >
                <h2 className="text-xl mb-4 text-[#FFD369]">Mission Briefing</h2>
                {selectedMission && (
                  <>
                    <div className="text-6xl mb-4 text-center">
                      {squadMissions.find(m => m.id === selectedMission)?.emoji}
                    </div>
                    <p className="text-sm text-[#E5E7EB]/80 mb-4">
                      {squadMissions.find(m => m.id === selectedMission)?.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-[#E5E7EB]/70">
                        <Clock className="w-4 h-4" />
                        {squadMissions.find(m => m.id === selectedMission)?.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#E5E7EB]/70">
                        <Users className="w-4 h-4" />
                        {squadMissions.find(m => m.id === selectedMission)?.players}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
              >
                <h2 className="text-xl mb-4 text-[#FFD369]">Rewards</h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#E5E7EB]/70">Eco-Points</span>
                    <span className="text-[#6EE7B7]">+{squadMissions.find(m => m.id === selectedMission)?.rewards.ecoPoints}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#E5E7EB]/70">Seeds</span>
                    <span className="text-[#FFD369]">+{squadMissions.find(m => m.id === selectedMission)?.rewards.seeds}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#E5E7EB]/70">Water</span>
                    <span className="text-[#4ECDC4]">+{squadMissions.find(m => m.id === selectedMission)?.rewards.water}</span>
                  </div>
                </div>
              </motion.div>

              {playerReady && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Button
                    onClick={handleStartMission}
                    className="w-full bg-gradient-to-r from-[#FFD369] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD369] text-black py-6"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Start Mission
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#0F172A] to-black relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-4 inline-block"
          >
            <Users className="w-16 h-16 text-[#6EE7B7]" />
          </motion.div>
          <h1 className="text-5xl mb-4 text-[#6EE7B7]">Squad Co-op Missions</h1>
          <p className="text-xl text-[#E5E7EB]/80 max-w-2xl mx-auto">
            Team up with other farmers to solve global agricultural challenges
          </p>
        </motion.div>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {squadMissions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  bg-white/10 backdrop-blur-md border-2 rounded-2xl p-6 cursor-pointer h-full
                  ${selectedMission === mission.id ? 'border-[#6EE7B7]' : 'border-white/20'}
                `}
                onClick={() => setSelectedMission(mission.id)}
              >
                {/* Difficulty Badge */}
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `${difficultyColors[mission.difficulty as keyof typeof difficultyColors]}40`,
                    color: difficultyColors[mission.difficulty as keyof typeof difficultyColors],
                    border: `1px solid ${difficultyColors[mission.difficulty as keyof typeof difficultyColors]}`
                  }}
                >
                  {mission.difficulty}
                </div>

                <div className="text-6xl mb-4 text-center">{mission.emoji}</div>
                <h3 className="text-xl mb-2 text-center text-[#FFD369]">{mission.name}</h3>
                <p className="text-sm text-[#E5E7EB]/70 mb-4 line-clamp-3">{mission.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#E5E7EB]/70">
                    <Users className="w-4 h-4" />
                    {mission.players}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#E5E7EB]/70">
                    <Clock className="w-4 h-4" />
                    {mission.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#E5E7EB]/70">
                    <Trophy className="w-4 h-4" />
                    {mission.rewards.ecoPoints} Eco-Points
                  </div>
                </div>

                {selectedMission === mission.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button
                      onClick={handleJoinMission}
                      className="w-full bg-gradient-to-r from-[#6EE7B7] to-[#73C783] hover:from-[#73C783] hover:to-[#6EE7B7] text-black"
                    >
                      Join Mission
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => onNavigate('playerHub')}
            className="bg-white/10 hover:bg-white/20 text-[#E5E7EB] border border-white/20 px-12 py-6"
          >
            Back to Hub
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

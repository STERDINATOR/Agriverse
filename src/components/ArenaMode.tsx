import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Plane, Users, Trophy, Clock, Target, Zap, Sprout, Droplets } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface ArenaModeProps {
  onNavigate: (screen: any) => void;
}

const arenaPlayers = [
  { id: 1, name: 'You', avatar: '🌱', score: 0, plots: 0, sustainability: 100, position: { x: 50, y: 50 } },
  { id: 2, name: 'GreenFarmer', avatar: '🌿', score: 0, plots: 0, sustainability: 100, position: { x: 30, y: 40 } },
  { id: 3, name: 'EcoMaster', avatar: '🚜', score: 0, plots: 0, sustainability: 100, position: { x: 70, y: 60 } },
  { id: 4, name: 'PlantHero', avatar: '🌾', score: 0, plots: 0, sustainability: 100, position: { x: 40, y: 70 } },
];

const farmingTools = [
  { id: 'seeds', name: 'Seeds', emoji: '🌱', points: 10 },
  { id: 'water', name: 'Water', emoji: '💧', points: 15 },
  { id: 'compost', name: 'Compost', emoji: '♻️', points: 20 },
  { id: 'pollinator', name: 'Pollinator', emoji: '🦋', points: 25 },
];

export function ArenaMode({ onNavigate }: ArenaModeProps) {
  const { gameState, updateEcoImpact } = useGame();
  const [gamePhase, setGamePhase] = useState<'lobby' | 'dropping' | 'playing' | 'ended'>('lobby');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [playerScore, setPlayerScore] = useState(0);
  const [collectedTools, setCollectedTools] = useState<string[]>([]);
  const [plots, setPlots] = useState(0);
  const [leaderboard, setLeaderboard] = useState(arenaPlayers);
  const [dropProgress, setDropProgress] = useState(0);

  useEffect(() => {
    if (gamePhase === 'dropping') {
      const interval = setInterval(() => {
        setDropProgress(prev => {
          if (prev >= 100) {
            setGamePhase('playing');
            toast.success('Landed! Start farming!');
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [gamePhase]);

  useEffect(() => {
    if (gamePhase === 'playing' && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGamePhase('ended');
            updateEcoImpact(playerScore);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gamePhase, timeLeft]);

  useEffect(() => {
    if (gamePhase === 'playing') {
      // Simulate other players' progress
      const interval = setInterval(() => {
        setLeaderboard(prev => prev.map(player => ({
          ...player,
          score: player.id === 1 ? playerScore : player.score + Math.floor(Math.random() * 15),
          plots: player.id === 1 ? plots : player.plots + (Math.random() > 0.7 ? 1 : 0),
          sustainability: Math.max(50, Math.min(100, player.sustainability + (Math.random() - 0.5) * 10))
        })).sort((a, b) => b.score - a.score));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [gamePhase, playerScore, plots]);

  const handleStartGame = () => {
    setGamePhase('dropping');
    toast.info('Deploying to farming arena!');
  };

  const handleCollectTool = (toolId: string) => {
    const tool = farmingTools.find(t => t.id === toolId);
    if (tool && !collectedTools.includes(toolId)) {
      setCollectedTools([...collectedTools, toolId]);
      setPlayerScore(prev => prev + tool.points);
      toast.success(`Collected ${tool.name}!`, {
        description: `+${tool.points} points`
      });
    }
  };

  const handlePlantCrop = () => {
    if (collectedTools.includes('seeds') && collectedTools.includes('water')) {
      setPlots(prev => prev + 1);
      const points = collectedTools.includes('compost') ? 50 : 30;
      setPlayerScore(prev => prev + points);
      toast.success('Sustainable farm plot created!', {
        description: `+${points} points`
      });
    } else {
      toast.error('Need seeds and water to plant!');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Lobby Phase
  if (gamePhase === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#0F172A] to-black relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-6 inline-block"
            >
              <Plane className="w-24 h-24 text-[#6EE7B7]" />
            </motion.div>
            <h1 className="text-5xl mb-4 text-[#6EE7B7]">Farming Arena</h1>
            <p className="text-xl text-[#E5E7EB]/80 mb-2">
              Drop-In Battle Royale Style Farming
            </p>
            <p className="text-lg text-[#E5E7EB]/60">
              Compete to create the most sustainable farm in 5 minutes!
            </p>
          </motion.div>

          {/* Game Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
            >
              <Users className="w-12 h-12 text-[#FFD369] mx-auto mb-3" />
              <h3 className="text-lg mb-2 text-[#FFD369]">Players</h3>
              <p className="text-3xl text-[#E5E7EB]">{arenaPlayers.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
            >
              <Clock className="w-12 h-12 text-[#6EE7B7] mx-auto mb-3" />
              <h3 className="text-lg mb-2 text-[#FFD369]">Duration</h3>
              <p className="text-3xl text-[#E5E7EB]">5:00</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
            >
              <Trophy className="w-12 h-12 text-[#FF6B35] mx-auto mb-3" />
              <h3 className="text-lg mb-2 text-[#FFD369]">Win Condition</h3>
              <p className="text-xl text-[#E5E7EB]">Best Farm</p>
            </motion.div>
          </div>

          {/* How to Play */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl mb-6 text-[#FFD369] text-center">How to Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg mb-3 text-[#6EE7B7]">Objective</h3>
                <ul className="space-y-2 text-sm text-[#E5E7EB]/80">
                  <li>• Collect farming tools scattered across the map</li>
                  <li>• Create sustainable farm plots</li>
                  <li>• Score points through eco-friendly practices</li>
                  <li>• Be the most sustainable farmer!</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg mb-3 text-[#6EE7B7]">Scoring</h3>
                <ul className="space-y-2 text-sm text-[#E5E7EB]/80">
                  <li>• Seeds collected: +10 points</li>
                  <li>• Water secured: +15 points</li>
                  <li>• Compost used: +20 points</li>
                  <li>• Sustainable plot: +30-50 points</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => onNavigate('playerHub')}
              className="bg-white/10 hover:bg-white/20 text-[#E5E7EB] border border-white/20 px-8 py-6"
            >
              Back to Hub
            </Button>
            <Button
              onClick={handleStartGame}
              className="bg-gradient-to-r from-[#6EE7B7] to-[#73C783] hover:from-[#73C783] hover:to-[#6EE7B7] text-black px-12 py-6"
            >
              <Plane className="w-5 h-5 mr-2" />
              Drop Into Arena
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Dropping Phase
  if (gamePhase === 'dropping') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-500 via-blue-600 to-[#1E3A8A] relative overflow-hidden">
        {/* Clouds */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-6xl opacity-70"
              style={{
                left: `${Math.random() * 120 - 10}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                x: [0, -100],
                opacity: [0.7, 0.3, 0.7]
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              ☁️
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-9xl mb-8"
            >
              🪂
            </motion.div>
            <h2 className="text-4xl mb-4 text-white">Dropping into Arena...</h2>
            <div className="max-w-md mx-auto mb-4">
              <Progress value={dropProgress} className="h-4 bg-white/20">
                <div
                  className="h-full bg-gradient-to-r from-[#6EE7B7] to-[#73C783] transition-all duration-100 rounded-full"
                  style={{ width: `${dropProgress}%` }}
                />
              </Progress>
            </div>
            <p className="text-xl text-white/80">{Math.floor(dropProgress)}%</p>
          </div>
        </div>
      </div>
    );
  }

  // Playing Phase
  if (gamePhase === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2C5F2D] via-[#0F172A] to-black relative overflow-hidden">
        {/* HUD */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/20 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FFD369]" />
                <span className="text-2xl text-[#FFD369]">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#6EE7B7]" />
                <span className="text-xl text-[#E5E7EB]">{playerScore} pts</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#73C783]" />
                <span className="text-xl text-[#E5E7EB]">{plots} plots</span>
              </div>
            </div>
            <div className="text-sm text-[#E5E7EB]/70">
              Rank: #{leaderboard.findIndex(p => p.id === 1) + 1} / {leaderboard.length}
            </div>
          </div>
        </div>

        <div className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Farming Tools */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl mb-4 text-[#FFD369]">Collect Farming Tools</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {farmingTools.map(tool => (
                    <motion.button
                      key={tool.id}
                      onClick={() => handleCollectTool(tool.id)}
                      disabled={collectedTools.includes(tool.id)}
                      whileHover={!collectedTools.includes(tool.id) ? { scale: 1.05 } : {}}
                      whileTap={!collectedTools.includes(tool.id) ? { scale: 0.95 } : {}}
                      className={`p-6 rounded-xl text-center transition-all ${
                        collectedTools.includes(tool.id)
                          ? 'bg-green-500/20 border-2 border-green-500'
                          : 'bg-white/5 border-2 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-5xl mb-2">{tool.emoji}</div>
                      <p className="text-sm text-[#E5E7EB]">{tool.name}</p>
                      {collectedTools.includes(tool.id) && (
                        <p className="text-xs text-green-400 mt-1">✓ Collected</p>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl mb-4 text-[#FFD369]">Farming Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handlePlantCrop}
                    className="bg-gradient-to-r from-[#73C783] to-[#6EE7B7] hover:from-[#6EE7B7] hover:to-[#73C783] text-black py-8"
                  >
                    <Sprout className="w-5 h-5 mr-2" />
                    Plant Sustainable Crop
                  </Button>
                  <Button
                    onClick={() => toast.info('Feature coming soon!')}
                    className="bg-gradient-to-r from-[#4ECDC4] to-[#45B7D1] hover:from-[#45B7D1] hover:to-[#4ECDC4] text-black py-8"
                  >
                    <Droplets className="w-5 h-5 mr-2" />
                    Install Irrigation
                  </Button>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sticky top-24">
                <h3 className="text-xl mb-4 text-[#FFD369]">Live Leaderboard</h3>
                <div className="space-y-3">
                  {leaderboard.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-xl ${
                        player.id === 1
                          ? 'bg-gradient-to-r from-[#6EE7B7]/20 to-[#73C783]/20 border border-[#6EE7B7]'
                          : 'bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}</span>
                          <span className="text-xl">{player.avatar}</span>
                          <span className="text-sm text-[#E5E7EB]">{player.name}</span>
                        </div>
                        <span className="text-sm text-[#6EE7B7]">{player.score}</span>
                      </div>
                      <Progress value={player.sustainability} className="h-2 bg-black/40">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{ width: `${player.sustainability}%` }}
                        />
                      </Progress>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Ended
  const finalRank = leaderboard.findIndex(p => p.id === 1) + 1;
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#0F172A] to-black relative overflow-hidden flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-2xl text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-8xl mb-6"
        >
          {finalRank === 1 ? '🏆' : finalRank === 2 ? '🥈' : finalRank === 3 ? '🥉' : '🌱'}
        </motion.div>
        <h2 className="text-4xl mb-4 text-[#6EE7B7]">
          {finalRank === 1 ? 'Victory!' : `${finalRank}${finalRank === 2 ? 'nd' : finalRank === 3 ? 'rd' : 'th'} Place`}
        </h2>
        <p className="text-2xl text-[#E5E7EB] mb-8">Final Score: {playerScore} points</p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-sm text-[#E5E7EB]/60 mb-1">Rank</p>
            <p className="text-2xl text-[#FFD369]">#{finalRank}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-sm text-[#E5E7EB]/60 mb-1">Plots</p>
            <p className="text-2xl text-[#73C783]">{plots}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-sm text-[#E5E7EB]/60 mb-1">Tools</p>
            <p className="text-2xl text-[#6EE7B7]">{collectedTools.length}</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => onNavigate('playerHub')}
            className="bg-white/10 hover:bg-white/20 text-[#E5E7EB] border border-white/20 px-8 py-6"
          >
            Exit Arena
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#6EE7B7] to-[#73C783] hover:from-[#73C783] hover:to-[#6EE7B7] text-black px-12 py-6"
          >
            Play Again
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

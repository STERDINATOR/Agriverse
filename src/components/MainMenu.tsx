import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Satellite, Play, Settings, RotateCcw, Database, Sparkles } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { APIConfiguration } from './APIConfiguration';

interface MainMenuProps {
  onNavigate: (screen: string) => void;
}

export function MainMenu({ onNavigate }: MainMenuProps) {
  const { gameState } = useGame();
  const [showAPIConfig, setShowAPIConfig] = useState(false);
  const completedShards = Object.values(gameState.shards).filter(s => s.completionProgress >= 80).length;
  const totalShards = Object.values(gameState.shards).length;

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Background Earth Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1574786199452-c7a5f69fb6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMHNwYWNlJTIwc2F0ZWxsaXRlJTIwdmlld3xlbnwxfHx8fDE3NTk1NTY5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Animated floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#73C783] rounded-full opacity-70"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          style={{
            left: `${10 + i * 10}%`,
            top: `${20 + i * 8}%`,
          }}
        />
      ))}
      
      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Satellite className="w-8 h-8 text-[#FFD369]" />
            <Badge variant="secondary" className="bg-[#1E3A8A]/80 text-[#6EE7B7] border-[#73C783]/30">
              NASA CLIMATE DATA
            </Badge>
          </div>
          
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-b from-[#FFD369] to-[#73C783] bg-clip-text text-transparent">
            AgriVerse
          </h1>
          <h2 className="text-2xl text-[#E5E7EB] mb-2">
            The Climate Survival Shards
          </h2>
          <p className="text-[#E5E7EB]/70 max-w-2xl leading-relaxed">
            Journey across climate-affected worlds to restore ecological balance through 
            sustainable farming powered by real NASA Earth data.
          </p>
        </motion.div>

        {/* Menu Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <Button
            onClick={() => onNavigate('playerHub')}
            className="bg-gradient-to-r from-[#73C783] to-[#6EE7B7] hover:from-[#6EE7B7] hover:to-[#73C783] text-black h-14 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Journey
          </Button>
          
          <Button
            onClick={() => onNavigate('animatedFarming')}
            className="bg-gradient-to-r from-[#FFD369] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FFD369] text-black h-12 rounded-xl transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Animated Farm
          </Button>
          
          <Button
            onClick={() => onNavigate('shardExplorer')}
            variant="outline"
            className="border-[#FFD369] text-[#FFD369] hover:bg-[#FFD369] hover:text-black h-12 rounded-xl transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Continue
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onNavigate('aiCharacterCreator')}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white h-12 rounded-xl transition-all duration-300"
            >
              ✨ AI Creator
            </Button>
            
            <Button
              onClick={() => onNavigate('enhancedAICharacterCreator')}
              className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white h-12 rounded-xl transition-all duration-300"
            >
              🧠 Enhanced AI
            </Button>
          </div>

          {/* NASA Education Section */}
          <div className="bg-[#1E3A8A]/20 border border-[#1E3A8A]/40 rounded-xl p-4 mb-4">
            <h3 className="text-[#6EE7B7] text-sm mb-3">🎓 NASA Agricultural Education</h3>
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={() => onNavigate('accessibilityTutorial')}
                className="bg-[#6EE7B7]/20 text-[#6EE7B7] border border-[#6EE7B7]/40 hover:bg-[#6EE7B7]/30 h-10 rounded-lg text-sm"
              >
                📚 Getting Started Tutorial
              </Button>
              <Button
                onClick={() => onNavigate('nasaEducationalHub')}
                className="bg-[#73C783]/20 text-[#73C783] border border-[#73C783]/40 hover:bg-[#73C783]/30 h-10 rounded-lg text-sm"
              >
                🎯 NASA Data Academy
              </Button>
              <Button
                onClick={() => onNavigate('dataVisualizationCenter')}
                className="bg-[#FFD369]/20 text-[#FFD369] border border-[#FFD369]/40 hover:bg-[#FFD369]/30 h-10 rounded-lg text-sm"
              >
                📊 Data Visualization Center
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onNavigate('mentorSelection')}
              variant="ghost"
              className="text-[#E5E7EB] hover:bg-white/10 h-12 rounded-xl"
            >
              🧙 Mentors
            </Button>
            
            <Button
              onClick={() => onNavigate('petCompanion')}
              variant="ghost"
              className="text-[#E5E7EB] hover:bg-white/10 h-12 rounded-xl"
            >
              🐾 Pets
            </Button>
            
            <Button
              onClick={() => onNavigate('enhancedCharacterChat')}
              variant="ghost"
              className="text-[#E5E7EB] hover:bg-white/10 h-12 rounded-xl"
            >
              🧠 AI Chat
            </Button>
            
            <Button
              onClick={() => onNavigate('squadLobby')}
              variant="ghost"
              className="text-[#E5E7EB] hover:bg-white/10 h-12 rounded-xl"
            >
              👥 Squad
            </Button>
          </div>
          
          <Button
            onClick={() => onNavigate('arenaMode')}
            className="bg-gradient-to-r from-[#FF6B35] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FF6B35] text-black h-12 rounded-xl transition-all duration-300"
          >
            🪂 Arena Mode
          </Button>
          
          <Button
            onClick={() => onNavigate('terraAI')}
            className="bg-gradient-to-r from-[#6EE7B7] to-[#4ECDC4] hover:from-[#4ECDC4] hover:to-[#6EE7B7] text-black h-12 rounded-xl transition-all duration-300 mb-3"
          >
            🤖 TERRA-AI Assistant
          </Button>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setShowAPIConfig(true)}
              variant="ghost"
              className="flex-1 text-[#E5E7EB] hover:bg-white/10 h-12 rounded-xl"
            >
              <Settings className="w-4 h-4 mr-2" />
              API Settings
            </Button>
            
            <Button
              onClick={() => onNavigate('enhancedNASADataService')}
              variant="ghost"
              className="flex-1 text-[#E5E7EB] hover:bg-white/10 h-12 rounded-xl"
            >
              <Database className="w-4 h-4 mr-2" />
              NASA Data Pro
            </Button>
          </div>
        </motion.div>

        {/* Stats & Version Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 right-6 flex flex-col gap-2 items-end"
        >
          <Badge variant="outline" className="border-[#FFD369]/30 text-[#FFD369]">
            Eco Points: {gameState.resources.ecoPoints.toLocaleString()}
          </Badge>
          <Badge variant="outline" className="border-[#6EE7B7]/30 text-[#6EE7B7]">
            Shards Restored: {completedShards}/{totalShards}
          </Badge>
          <Badge variant="outline" className="border-[#73C783]/30 text-[#73C783]">
            v1.0.0 Alpha
          </Badge>
        </motion.div>
      </div>

      {/* API Configuration Modal */}
      {showAPIConfig && (
        <APIConfiguration onClose={() => setShowAPIConfig(false)} />
      )}
    </div>
  );
}
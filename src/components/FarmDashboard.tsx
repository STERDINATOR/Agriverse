import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

import { 
  ArrowLeft,
  Sprout, 
  Wrench, 
  Map, 
  Droplets, 
  Wind, 
  Thermometer,
  Bot,
  Zap,
  Target,
  TrendingUp,
  Sword,
  Users,
  ShoppingCart,
  BookOpen,
  Globe,
  Compass,
  Activity,
  Star,
  Award,
  Gamepad2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface FarmDashboardProps {
  onNavigate: (screen: string) => void;
}

export function FarmDashboard({ onNavigate }: FarmDashboardProps) {
  const { gameState, getCurrentShard, updateResources } = useGame();
  const currentShard = getCurrentShard();

  const handleQuickPlant = () => {
    if (gameState.resources.seeds < 1) {
      toast.error('Not enough seeds!');
      return;
    }
    updateResources({ seeds: gameState.resources.seeds - 1, ecoPoints: gameState.resources.ecoPoints + 10 });
    toast.success('Quick planted! +10 Eco Points');
  };

  const handleQuickWater = () => {
    if (gameState.resources.water < 5) {
      toast.error('Not enough water!');
      return;
    }
    updateResources({ water: gameState.resources.water - 5, energy: gameState.resources.energy + 5 });
    toast.success('Quick watered! +5 Energy');
  };

  const farmingActions = [
    { 
      id: 'farmingGameplay', 
      name: 'Interactive Farm', 
      icon: Sprout, 
      description: 'Full farming simulation with crop management',
      color: 'from-[#73C783] to-[#6EE7B7]'
    },
    { 
      id: 'animatedFarming', 
      name: 'Animated Farm View', 
      icon: Activity, 
      description: 'Beautiful animated farming experience',
      color: 'from-[#6EE7B7] to-[#73C783]'
    },
    { 
      id: 'guidedFarmingPractice', 
      name: 'Guided Practice', 
      icon: Target, 
      description: 'Learn farming with companion guidance',
      color: 'from-[#FFD369] to-[#73C783]'
    },
    { 
      id: 'farmShop', 
      name: 'Farm Shop', 
      icon: ShoppingCart, 
      description: 'Buy tools, seeds, and upgrades',
      color: 'from-[#FFD369] to-[#FF8C42]'
    }
  ];

  const dataActions = [
    { 
      id: 'nasaData', 
      name: 'NASA Climate Data', 
      icon: Globe, 
      description: 'Real-time satellite climate monitoring',
      color: 'from-[#1E3A8A] to-[#6EE7B7]'
    },
    { 
      id: 'terraAI', 
      name: 'TERRA-AI Advisor', 
      icon: Bot, 
      description: 'AI-powered farming recommendations',
      color: 'from-[#6EE7B7] to-[#73C783]'
    },
    { 
      id: 'shardExplorer', 
      name: 'Climate Shards', 
      icon: Map, 
      description: 'Explore different climate zones',
      color: 'from-[#1E3A8A] to-[#8B5CF6]'
    },
    { 
      id: 'googleMapsExplorer', 
      name: 'World Explorer', 
      icon: Compass, 
      description: 'Discover real locations worldwide',
      color: 'from-[#73C783] to-[#6EE7B7]'
    }
  ];

  const learningActions = [
    { 
      id: 'learningHub', 
      name: 'Learning Hub', 
      icon: BookOpen, 
      description: 'Skill tree and knowledge system',
      color: 'from-[#FFD369] to-[#73C783]'
    },
    { 
      id: 'enhancedCharacterChat', 
      name: 'Character Chat', 
      icon: Users, 
      description: 'Interactive AI character conversations',
      color: 'from-[#8B5CF6] to-[#EC4899]'
    },
    { 
      id: 'mentorSelection', 
      name: 'Farm Guardians', 
      icon: Star, 
      description: 'Anime-style farming mentors',
      color: 'from-[#73C783] to-[#6EE7B7]'
    },
    { 
      id: 'petCompanion', 
      name: 'Eco Companions', 
      icon: Award, 
      description: 'Magical farming companion pets',
      color: 'from-[#6EE7B7] to-[#FFD369]'
    }
  ];

  const battleActions = [
    { 
      id: 'bossBattle', 
      name: 'Crisis Boss Battles', 
      icon: Sword, 
      description: 'Fight against farming disasters',
      color: 'from-[#FF6B6B] to-[#FF8C42]'
    },
    { 
      id: 'arenaMode', 
      name: 'Farming Arena', 
      icon: Gamepad2, 
      description: 'Competitive farming battles',
      color: 'from-[#8B5CF6] to-[#EC4899]'
    },
    { 
      id: 'squadLobby', 
      name: 'Squad Co-op', 
      icon: Users, 
      description: 'Team up for farming missions',
      color: 'from-[#6EE7B7] to-[#73C783]'
    },
    { 
      id: 'globalMarketplace', 
      name: 'Global Marketplace', 
      icon: TrendingUp, 
      description: 'Trade resources with other players',
      color: 'from-[#FFD369] to-[#6EE7B7]'
    }
  ];

  const ActionGrid = ({ actions, title }: { actions: any[], title: string }) => (
    <div className="space-y-4">
      <h3 className="text-xl text-[#E5E7EB] mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <motion.div
            key={action.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="p-4 bg-black/40 border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-300 cursor-pointer"
                  onClick={() => onNavigate(action.id)}>
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-black`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[#E5E7EB] font-medium mb-1">{action.name}</h4>
                  <p className="text-sm text-[#E5E7EB]/70 leading-tight">{action.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full relative overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1E3A8A]/90 to-black/80 -z-10" />

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center border-b border-white/10">
        <Button
          onClick={() => onNavigate('playerHub')}
          variant="ghost"
          className="text-[#E5E7EB] hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hub
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#73C783]/50">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1700996003686-327c5bf8d926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGdpcmwlMjBmYXJtZXIlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzU5NjU1NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Player Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#73C783] rounded-full flex items-center justify-center">
              <Sprout className="w-3 h-3 text-black" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl text-[#E5E7EB]">AgriVerse Farm Hub</h1>
            <p className="text-sm text-[#73C783]">Your Central Farming Operations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-[#73C783]/20 text-[#73C783] border-[#73C783]/40">
            Level {gameState.playerLevel}
          </Badge>
          <Badge className="bg-[#FFD369]/20 text-[#FFD369] border-[#FFD369]/40">
            {gameState.resources.ecoPoints.toLocaleString()} EP
          </Badge>
        </div>
      </div>

      <div className="relative z-10 h-[calc(100vh-80px)] overflow-auto">
        {/* Quick Actions Bar */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-[#E5E7EB]">Quick Farm Actions:</h3>
            <Button 
              onClick={handleQuickPlant}
              size="sm"
              className="bg-[#73C783]/20 text-[#73C783] border border-[#73C783]/40 hover:bg-[#73C783]/30"
              disabled={gameState.resources.seeds < 1}
            >
              <Sprout className="w-3 h-3 mr-1" />
              Plant ({gameState.resources.seeds})
            </Button>
            <Button 
              onClick={handleQuickWater}
              size="sm"
              className="bg-[#6EE7B7]/20 text-[#6EE7B7] border border-[#6EE7B7]/40 hover:bg-[#6EE7B7]/30"
              disabled={gameState.resources.water < 5}
            >
              <Droplets className="w-3 h-3 mr-1" />
              Water ({gameState.resources.water})
            </Button>
            <div className="ml-auto flex gap-2">
              <Button 
                onClick={() => onNavigate('playerHub')}
                size="sm"
                variant="outline"
                className="border-[#FFD369] text-[#FFD369]"
              >
                <Zap className="w-3 h-3 mr-1" />
                Hub
              </Button>
              <Button
                onClick={() => onNavigate('comprehensiveFeaturesShowcase')}
                size="sm"
                className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white"
              >
                <Star className="w-3 h-3 mr-1" />
                All Features
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Primary Farm Actions */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#73C783]/30">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1721907043490-d51705da24fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYW5pbWUlMjBwZXQlMjBjb21wYW5pb258ZW58MXx8fHwxNzU5NjU1NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Farm Companion"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-[#E5E7EB]">Core Farm Operations</h3>
                <p className="text-sm text-[#73C783]">Your farming companion is ready to help!</p>
              </div>
            </div>
            <ActionGrid actions={farmingActions} title="Essential Farming Tools" />
          </div>

          {/* Farm Command Center */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#E5E7EB] text-xl">🏛️ Farm Command Center</h3>
              <Badge className="bg-[#73C783]/20 text-[#73C783]">All Systems Active</Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Climate & Data Systems */}
              <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-[#1E3A8A]/20">
                      <Globe className="w-5 h-5 text-[#6EE7B7]" />
                    </div>
                    <h4 className="text-[#E5E7EB]">Climate & Analysis</h4>
                  </div>
                  <div className="space-y-2">
                    {dataActions.map((action) => (
                      <Button
                        key={action.id}
                        onClick={() => onNavigate(action.id)}
                        variant="ghost"
                        className="w-full justify-start text-[#94A3B8] hover:text-[#6EE7B7] hover:bg-[#6EE7B7]/10"
                      >
                        <action.icon className="w-4 h-4 mr-2" />
                        {action.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Learning & Characters */}
              <Card className="bg-[#1E293B]/50 border-[#FFD369]/30 overflow-hidden">
                <div className="relative">
                  {/* Anime Character Background */}
                  <div className="absolute inset-0 opacity-10">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1700996003686-327c5bf8d926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGdpcmwlMjBmYXJtZXIlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzU5NjU1NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Anime Farm Character"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-[#1E293B]/80 to-transparent" />
                  </div>
                  
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-[#FFD369]/20 backdrop-blur-sm">
                        <BookOpen className="w-5 h-5 text-[#FFD369]" />
                      </div>
                      <h4 className="text-[#E5E7EB]">Learning & Companions</h4>
                    </div>
                    
                    {/* Character & Pet Preview */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-2 p-2 bg-[#FFD369]/10 rounded-lg backdrop-blur-sm">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#FFD369]/30">
                          <ImageWithFallback
                            src="https://images.unsplash.com/photo-1720636440389-2429e032e39d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMG1lbnRvciUyMGNoYXJhY3RlciUyMGZhcm1pbmd8ZW58MXx8fHwxNzU5NjU1NDA3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Farm Guardian"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs text-[#FFD369]">Guardian</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-[#6EE7B7]/10 rounded-lg backdrop-blur-sm">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#6EE7B7]/30">
                          <ImageWithFallback
                            src="https://images.unsplash.com/photo-1565721270644-5a417d0e5c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGVjbyUyMHNwaXJpdCUyMGNvbXBhbmlvbnxlbnwxfHx8fDE3NTk2NTU0MDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Eco Companion"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs text-[#6EE7B7]">Pet</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {learningActions.map((action) => (
                        <Button
                          key={action.id}
                          onClick={() => onNavigate(action.id)}
                          variant="ghost"
                          className="w-full justify-start text-[#94A3B8] hover:text-[#FFD369] hover:bg-[#FFD369]/10 backdrop-blur-sm"
                        >
                          <action.icon className="w-4 h-4 mr-2" />
                          {action.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Battle & Trading */}
              <Card className="bg-[#1E293B]/50 border-[#FF6B6B]/30">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative p-2 rounded-lg bg-[#FF6B6B]/20">
                      <Sword className="w-5 h-5 text-[#FF6B6B]" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD369] rounded-full animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-[#E5E7EB]">Battle & Economy</h4>
                      <p className="text-xs text-[#FF6B6B]">Combat & Trading Ready</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {battleActions.map((action) => (
                      <Button
                        key={action.id}
                        onClick={() => onNavigate(action.id)}
                        variant="ghost"
                        className="w-full justify-start text-[#94A3B8] hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10"
                      >
                        <action.icon className="w-4 h-4 mr-2" />
                        {action.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Footer Features Links */}
          <div className="mt-8">
            <h3 className="text-[#E5E7EB] text-center mb-4">Explore All Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => onNavigate('comprehensiveFeaturesShowcase')}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white hover:from-[#7C3AED] hover:to-[#DB2777]"
              >
                <Star className="w-4 h-4 mr-2" />
                Complete Showcase
              </Button>
              <Button 
                onClick={() => onNavigate('gameFeaturesHub')}
                className="bg-gradient-to-r from-[#6EE7B7] to-[#FFD369] text-black hover:from-[#73C783] hover:to-[#FF8C42]"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Features Hub
              </Button>
              <Button 
                onClick={() => onNavigate('featuresOverview')}
                className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:from-[#4F46E5] hover:to-[#7C3AED]"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Overview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  Sparkles,
  ShoppingCart,
  Star,
  Brain,
  User,
  Gamepad2,
  Database,
  Heart,
  Zap,
  Crown,
  Target,
  Globe,
  Bot,
  Palette,
  MessageCircle,
  Trophy,
  Map,
  Users,
  Coins,
  BookOpen,
  Atom,
  Satellite,
  Wand2,
  Play,
  ChevronRight,
  Info
} from 'lucide-react';

interface FeaturesOverviewProps {
  onNavigate: (screen: string) => void;
}

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  badge?: string;
  color: string;
  gradient: string;
}

interface FeatureCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: FeatureItem[];
}

export function FeaturesOverview({ onNavigate }: FeaturesOverviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const categories: FeatureCategory[] = [
    {
      id: 'ai-features',
      title: 'AI Features',
      description: 'Cutting-edge AI technology for character creation and interaction',
      icon: <Brain className="w-8 h-8" />,
      color: '#8B5CF6',
      features: [
        {
          id: 'ai-character-creator',
          title: 'AI Character Creator',
          description: 'Create unique anime-style characters with AI assistance',
          icon: <Sparkles className="w-5 h-5" />,
          action: 'aiCharacterCreator',
          badge: 'Popular',
          color: '#8B5CF6',
          gradient: 'from-[#8B5CF6] to-[#EC4899]'
        },
        {
          id: 'enhanced-ai-creator',
          title: 'Enhanced AI Creator',
          description: 'Advanced character generation with personality traits',
          icon: <Wand2 className="w-5 h-5" />,
          action: 'enhancedAICharacterCreator',
          badge: 'New',
          color: '#6366F1',
          gradient: 'from-[#6366F1] to-[#8B5CF6]'
        },
        {
          id: 'character-chat',
          title: 'AI Character Chat',
          description: 'Engage in realistic conversations with AI characters',
          icon: <MessageCircle className="w-5 h-5" />,
          action: 'characterChat',
          color: '#FF69B4',
          gradient: 'from-[#FF69B4] to-[#9D4EDD]'
        },
        {
          id: 'enhanced-chat',
          title: 'Enhanced AI Chat',
          description: 'Advanced dialogue system with emotional intelligence',
          icon: <Bot className="w-5 h-5" />,
          action: 'enhancedCharacterChat',
          badge: 'Premium',
          color: '#EC4899',
          gradient: 'from-[#EC4899] to-[#BE185D]'
        }
      ]
    },
    {
      id: 'market-skills',
      title: 'Market & Skills',
      description: 'Economic systems and character progression mechanics',
      icon: <ShoppingCart className="w-8 h-8" />,
      color: '#FFD369',
      features: [
        {
          id: 'global-marketplace',
          title: 'Global Marketplace',
          description: 'Trade crops and resources with players worldwide',
          icon: <Globe className="w-5 h-5" />,
          action: 'globalMarketplace',
          color: '#FFD369',
          gradient: 'from-[#FFD369] to-[#FF8C42]'
        },
        {
          id: 'skill-tree',
          title: 'Skill Tree System',
          description: 'Master specialized farming classes and abilities',
          icon: <Star className="w-5 h-5" />,
          action: 'skillTree',
          badge: 'Core',
          color: '#8B5CF6',
          gradient: 'from-[#8B5CF6] to-[#EC4899]'
        },
        {
          id: 'dialogue-learning',
          title: 'Interactive Learning',
          description: 'Learn farming through engaging dialogue systems',
          icon: <BookOpen className="w-5 h-5" />,
          action: 'dialogueLearning',
          badge: 'Educational',
          color: '#6EE7B7',
          gradient: 'from-[#6EE7B7] to-[#73C783]'
        }
      ]
    },
    {
      id: 'character',
      title: 'Character',
      description: 'Customize your farmer avatar and personal style',
      icon: <User className="w-8 h-8" />,
      color: '#6EE7B7',
      features: [
        {
          id: 'character-customization',
          title: 'Character Appearance',
          description: 'Customize your farmer with anime-style options',
          icon: <Palette className="w-5 h-5" />,
          action: 'characterCustomization',
          color: '#6EE7B7',
          gradient: 'from-[#6EE7B7] to-[#4ECDC4]'
        },
        {
          id: 'pet-customization',
          title: 'Pet Design Studio',
          description: 'Create and customize your magical eco-companion',
          icon: <Heart className="w-5 h-5" />,
          action: 'petCustomization',
          badge: 'Fun',
          color: '#73C783',
          gradient: 'from-[#73C783] to-[#6EE7B7]'
        }
      ]
    },
    {
      id: 'game-modes',
      title: 'Game Modes',
      description: 'Various gameplay experiences and farming simulations',
      icon: <Gamepad2 className="w-8 h-8" />,
      color: '#FF8C42',
      features: [
        {
          id: 'animated-farming',
          title: 'Animated Farm Mode',
          description: 'Visual farming simulation with 3D effects',
          icon: <Play className="w-5 h-5" />,
          action: 'animatedFarming',
          badge: 'Popular',
          color: '#FFD369',
          gradient: 'from-[#FFD369] to-[#FF8C42]'
        },
        {
          id: 'classic-farming',
          title: 'Classic Farming',
          description: 'Traditional farming gameplay mechanics',
          icon: <Target className="w-5 h-5" />,
          action: 'farmingGameplay',
          color: '#73C783',
          gradient: 'from-[#73C783] to-[#6EE7B7]'
        },
        {
          id: 'world-map',
          title: 'World Map & PvP',
          description: 'Explore climate shards and compete with other farmers',
          icon: <Map className="w-5 h-5" />,
          action: 'worldMap',
          badge: 'Multiplayer',
          color: '#73C783',
          gradient: 'from-[#73C783] to-[#6EE7B7]'
        },
        {
          id: 'arena-mode',
          title: 'Arena Battle Royale',
          description: 'Fast-paced farming competition arena',
          icon: <Trophy className="w-5 h-5" />,
          action: 'arenaMode',
          badge: 'Competitive',
          color: '#FF6B35',
          gradient: 'from-[#FF6B35] to-[#FFA500]'
        },
        {
          id: 'squad-missions',
          title: 'Squad Missions',
          description: 'Cooperative farming challenges with friends',
          icon: <Users className="w-5 h-5" />,
          action: 'squadLobby',
          color: '#6EE7B7',
          gradient: 'from-[#6EE7B7] to-[#4ECDC4]'
        }
      ]
    },
    {
      id: 'data-ai',
      title: 'Data & AI Assistance',
      description: 'Real-time climate data and intelligent farming guidance',
      icon: <Database className="w-8 h-8" />,
      color: '#1E3A8A',
      features: [
        {
          id: 'terra-ai',
          title: 'TERRA-AI Advisor',
          description: 'AI-powered farming recommendations and insights',
          icon: <Bot className="w-5 h-5" />,
          action: 'terraAI',
          badge: 'Smart',
          color: '#00D4FF',
          gradient: 'from-[#00D4FF] to-[#5A67D8]'
        },
        {
          id: 'nasa-data',
          title: 'NASA Climate Data',
          description: 'Real-time satellite data for informed farming decisions',
          icon: <Satellite className="w-5 h-5" />,
          action: 'nasaData',
          badge: 'Live Data',
          color: '#1E3A8A',
          gradient: 'from-[#1E3A8A] to-[#3B82F6]'
        }
      ]
    },
    {
      id: 'companions',
      title: 'Companions',
      description: 'AI mentors, magical pets, and collectible farm cards',
      icon: <Heart className="w-8 h-8" />,
      color: '#73C783',
      features: [
        {
          id: 'mentor-selection',
          title: 'Farm Guardian Mentors',
          description: 'Choose from anime-style AI mentors to guide your journey',
          icon: <Crown className="w-5 h-5" />,
          action: 'mentorSelection',
          color: '#73C783',
          gradient: 'from-[#73C783] to-[#6EE7B7]'
        },
        {
          id: 'pet-companion',
          title: 'Eco-Companion Pets',
          description: 'Magical creatures that help with farming tasks',
          icon: <Sparkles className="w-5 h-5" />,
          action: 'petCompanion',
          badge: 'Magical',
          color: '#6EE7B7',
          gradient: 'from-[#6EE7B7] to-[#4ECDC4]'
        },
        {
          id: 'farm-cards',
          title: 'Farm Card Collection',
          description: 'Collectible knowledge-powered cards for farming',
          icon: <Coins className="w-5 h-5" />,
          action: 'farmCards',
          color: '#FFD369',
          gradient: 'from-[#FFD369] to-[#FF8C42]'
        }
      ]
    }
  ];

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  if (selectedCategory && selectedCategoryData) {
    return (
      <div className="min-h-screen w-full relative overflow-auto">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 via-[#1E1B4B]/80 to-[#0F172A]/90" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              animate={{
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 12 + Math.random() * 8,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 flex justify-between items-center border-b border-white/10">
          <Button
            onClick={() => setSelectedCategory(null)}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: selectedCategoryData.color }}
            >
              {selectedCategoryData.icon}
            </div>
            <div>
              <h1 className="text-2xl text-white">{selectedCategoryData.title}</h1>
              <p className="text-sm text-white/70">{selectedCategoryData.description}</p>
            </div>
          </div>

          <Badge className="bg-white/10 text-white border-white/20">
            {selectedCategoryData.features.length} Features
          </Badge>
        </div>

        {/* Features Grid */}
        <div className="relative z-10 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {selectedCategoryData.features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredFeature(feature.id)}
              onHoverEnd={() => setHoveredFeature(null)}
            >
              <Card 
                className={`p-6 bg-black/40 backdrop-blur-sm border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer h-full ${
                  hoveredFeature === feature.id ? 'transform scale-105' : ''
                }`}
                onClick={() => onNavigate(feature.action)}
              >
                {feature.badge && (
                  <div className="flex justify-between items-start mb-4">
                    <Badge className={`bg-gradient-to-r ${feature.gradient} text-white border-0 text-xs`}>
                      {feature.badge}
                    </Badge>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white`}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-lg mb-2">{feature.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>

                <Button 
                  className={`w-full bg-gradient-to-r ${feature.gradient} text-white hover:opacity-90 border-0`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(feature.action);
                  }}
                >
                  Launch Feature
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 via-[#1E1B4B]/80 to-[#0F172A]/90" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(110, 231, 183, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(110, 231, 183, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center border-b border-white/10">
        <Button
          onClick={() => onNavigate('playerHub')}
          variant="ghost"
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl text-white mb-2">AgriVerse Features</h1>
          <p className="text-white/70">Explore all the amazing features of your farming adventure</p>
        </div>

        <Badge className="bg-[#6EE7B7]/20 text-[#6EE7B7] border-[#6EE7B7]/40">
          Complete Suite
        </Badge>
      </div>

      {/* Categories Grid */}
      <div className="relative z-10 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {categories.map((category, index) => {
          const featuresCount = category.features.length;
          const premiumFeatures = category.features.filter(f => f.badge === 'Premium' || f.badge === 'New').length;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="p-6 bg-black/40 backdrop-blur-sm border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer h-full"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-xl mb-2">{category.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{category.description}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/10 text-white border-white/20 text-xs">
                      {featuresCount} Features
                    </Badge>
                    {premiumFeatures > 0 && (
                      <Badge className="bg-[#FFD369]/20 text-[#FFD369] border-[#FFD369]/40 text-xs">
                        {premiumFeatures} Premium
                      </Badge>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/50" />
                </div>

                {/* Feature preview */}
                <div className="space-y-2">
                  {category.features.slice(0, 3).map((feature) => (
                    <div key={feature.id} className="flex items-center gap-2 text-sm text-white/60">
                      <div className="w-1 h-1 bg-white/40 rounded-full" />
                      <span>{feature.title}</span>
                    </div>
                  ))}
                  {category.features.length > 3 && (
                    <div className="text-xs text-white/40">
                      +{category.features.length - 3} more features
                    </div>
                  )}
                </div>

                <Button 
                  variant="outline"
                  className="w-full mt-4 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(category.id);
                  }}
                >
                  Explore {category.title}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom stats */}
      <div className="relative z-10 p-6">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl text-[#73C783] mb-1">25+</div>
              <div className="text-sm text-white/70">Total Features</div>
            </div>
            <div>
              <div className="text-2xl text-[#6EE7B7] mb-1">6</div>
              <div className="text-sm text-white/70">Categories</div>
            </div>
            <div>
              <div className="text-2xl text-[#FFD369] mb-1">8</div>
              <div className="text-sm text-white/70">AI Features</div>
            </div>
            <div>
              <div className="text-2xl text-[#FF8C42] mb-1">5</div>
              <div className="text-sm text-white/70">Game Modes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
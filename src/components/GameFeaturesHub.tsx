import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  GraduationCap, 
  Sword, 
  ShoppingBag, 
  Users,
  BookOpen,
  Target,
  Zap,
  Trophy,
  TrendingUp,
  Store,
  DollarSign,
  Package,
  Heart,
  MessageCircle,
  Sparkles,
  Gamepad2,
  Swords,
  Crown,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface GameFeaturesHubProps {
  onNavigate: (screen: string) => void;
}

export function GameFeaturesHub({ onNavigate }: GameFeaturesHubProps) {
  const [activeCategory, setActiveCategory] = useState('learning');

  const featureCategories = {
    learning: {
      title: 'Learning & Skills',
      icon: GraduationCap,
      color: '#6EE7B7',
      description: 'Master farming techniques and unlock new abilities',
      features: [
        {
          id: 'learningHub',
          title: 'Learning Hub',
          description: 'Interactive lessons on sustainable farming and NASA data',
          icon: BookOpen,
          route: 'learningHub',
          badge: 'Core Learning'
        },
        {
          id: 'guidedPractice',
          title: 'Guided Practice',
          description: 'Practice farming with companion guidance and real-time feedback',
          icon: Target,
          route: 'guidedFarmingPractice',
          badge: 'Hands-On'
        },
        {
          id: 'nasaEducation',
          title: 'NASA Data Academy',
          description: 'Learn to interpret and apply satellite data',
          icon: GraduationCap,
          route: 'nasaEducationalHub',
          badge: 'Advanced'
        },
        {
          id: 'dataViz',
          title: 'Data Visualization',
          description: 'Explore NASA data with interactive charts and tools',
          icon: TrendingUp,
          route: 'dataVisualizationCenter',
          badge: 'Pro Tools'
        }
      ]
    },
    battle: {
      title: 'Battle & Competition',
      icon: Sword,
      color: '#FFD369',
      description: 'Challenge farming crises and compete with other farmers',
      features: [
        {
          id: 'bossBattle',
          title: 'Boss Battles',
          description: 'Face major farming crises like drought titans and pest invasions',
          icon: Swords,
          route: 'bossBattle',
          badge: 'Epic Challenges'
        },
        {
          id: 'arenaMode',
          title: 'Arena Mode',
          description: 'Compete in farming battle royale with other players',
          icon: Crown,
          route: 'arenaMode',
          badge: 'PvP'
        },
        {
          id: 'squadLobby',
          title: 'Squad Co-op',
          description: 'Team up for cooperative farming missions',
          icon: Users,
          route: 'squadLobby',
          badge: 'Multiplayer'
        },
        {
          id: 'farmCards',
          title: 'Farm Cards',
          description: 'Collect and use knowledge-powered farming cards',
          icon: Gamepad2,
          route: 'farmCards',
          badge: 'Collectibles'
        }
      ]
    },
    economy: {
      title: 'Trading & Economy',
      icon: ShoppingBag,
      color: '#73C783',
      description: 'Trade resources and manage your farming economy',
      features: [
        {
          id: 'marketplace',
          title: 'Global Marketplace',
          description: 'Trade crops and resources with farmers worldwide',
          icon: Store,
          route: 'globalMarketplace',
          badge: 'Trading'
        },
        {
          id: 'farmShop',
          title: 'Farm Shop',
          description: 'Buy and upgrade tools, seeds, and equipment',
          icon: ShoppingBag,
          route: 'farmShop',
          badge: 'Shopping'
        },
        {
          id: 'worldMap',
          title: 'World Regions',
          description: 'Explore and trade with different climate regions',
          icon: Package,
          route: 'enhancedWorldMap',
          badge: 'Exploration'
        }
      ]
    },
    companions: {
      title: 'Companions & Social',
      icon: Heart,
      color: '#F59E0B',
      description: 'Interact with mentors, pets, and other characters',
      features: [
        {
          id: 'mentors',
          title: 'Farm Guardians',
          description: 'Choose and interact with anime-style farming mentors',
          icon: Sparkles,
          route: 'mentorSelection',
          badge: 'Mentors'
        },
        {
          id: 'pets',
          title: 'Eco-Companions',
          description: 'Adopt and customize magical farming companion pets',
          icon: Heart,
          route: 'petCompanion',
          badge: 'Pets'
        },
        {
          id: 'characterChat',
          title: 'AI Character Chat',
          description: 'Chat with AI-powered characters for advice and stories',
          icon: MessageCircle,
          route: 'enhancedCharacterChat',
          badge: 'AI Chat'
        },
        {
          id: 'characterCreator',
          title: 'Character Creator',
          description: 'Create custom AI characters with unique personalities',
          icon: Sparkles,
          route: 'enhancedAICharacterCreator',
          badge: 'Creation'
        },
        {
          id: 'customization',
          title: 'Customization',
          description: 'Customize your character appearance and style',
          icon: Users,
          route: 'characterCustomization',
          badge: 'Appearance'
        },
        {
          id: 'petCustomization',
          title: 'Pet Customization',
          description: 'Customize your companion pet\'s traits and appearance',
          icon: Heart,
          route: 'petCustomization',
          badge: 'Pet Style'
        }
      ]
    }
  };

  const getCategoryColor = (category: string) => {
    return featureCategories[category]?.color || '#6EE7B7';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Button
          onClick={() => onNavigate('farmDashboard')}
          className="mb-6 bg-[#1E3A8A]/20 text-[#6EE7B7] border border-[#1E3A8A]/40 hover:bg-[#1E3A8A]/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-5xl mb-4 bg-gradient-to-r from-[#6EE7B7] via-[#FFD369] to-[#F59E0B] bg-clip-text text-transparent">
            Game Features Hub
          </h1>
          <p className="text-[#E5E7EB] text-lg max-w-3xl mx-auto">
            Access all AgriVerse game features - learning, battles, trading, and companions
          </p>
        </div>

        {/* Category Quick Nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(featureCategories).map(([key, category]) => {
            const Icon = category.icon;
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-opacity-60 scale-105'
                    : 'bg-[#1E293B]/30 border-[#374151] hover:border-opacity-40 hover:scale-102'
                }`}
                style={{
                  borderColor: isActive ? category.color : undefined
                }}
              >
                <div 
                  className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: category.color }} />
                </div>
                <h3 className="text-[#E5E7EB] text-sm mb-1">{category.title}</h3>
                <p className="text-[#94A3B8] text-xs">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 flex items-center gap-3">
            {(() => {
              const Icon = featureCategories[activeCategory].icon;
              return (
                <>
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${getCategoryColor(activeCategory)}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: getCategoryColor(activeCategory) }} />
                  </div>
                  <div>
                    <h2 className="text-2xl text-[#E5E7EB]">
                      {featureCategories[activeCategory].title}
                    </h2>
                    <p className="text-[#94A3B8] text-sm">
                      {featureCategories[activeCategory].description}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCategories[activeCategory].features.map((feature) => {
              const FeatureIcon = feature.icon;
              return (
                <Card 
                  key={feature.id}
                  className="bg-[#1E293B]/50 border-[#374151] hover:border-opacity-60 transition-all hover:scale-102 cursor-pointer group"
                  style={{
                    borderColor: `${getCategoryColor(activeCategory)}40`
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${getCategoryColor(activeCategory)}20` }}
                      >
                        <FeatureIcon className="w-6 h-6" style={{ color: getCategoryColor(activeCategory) }} />
                      </div>
                      <Badge 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${getCategoryColor(activeCategory)}20`,
                          color: getCategoryColor(activeCategory)
                        }}
                      >
                        {feature.badge}
                      </Badge>
                    </div>

                    <h3 className="text-[#E5E7EB] text-lg mb-2">{feature.title}</h3>
                    <p className="text-[#94A3B8] text-sm mb-4">{feature.description}</p>

                    <Button
                      onClick={() => onNavigate(feature.route)}
                      className="w-full group-hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: `${getCategoryColor(activeCategory)}20`,
                        color: getCategoryColor(activeCategory),
                        borderColor: `${getCategoryColor(activeCategory)}40`
                      }}
                    >
                      Launch Feature
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto mt-12 p-6 bg-[#1E293B]/30 rounded-xl border border-[#374151]">
        <h3 className="text-[#6EE7B7] mb-4 text-center">Quick Navigation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => onNavigate('farmDashboard')}
            className="bg-[#1E3A8A]/20 text-[#6EE7B7] border border-[#1E3A8A]/40 hover:bg-[#1E3A8A]/30"
          >
            Farm Dashboard
          </Button>
          <Button
            onClick={() => onNavigate('mainMenu')}
            className="bg-[#374151] text-[#E5E7EB] border border-[#4B5563] hover:bg-[#4B5563]"
          >
            Main Menu
          </Button>
          <Button
            onClick={() => onNavigate('featuresOverview')}
            className="bg-[#FFD369]/20 text-[#FFD369] border border-[#FFD369]/40 hover:bg-[#FFD369]/30"
          >
            Features Overview
          </Button>
          <Button
            onClick={() => onNavigate('accessibilityTutorial')}
            className="bg-[#73C783]/20 text-[#73C783] border border-[#73C783]/40 hover:bg-[#73C783]/30"
          >
            Tutorial
          </Button>
        </div>
      </div>

      {/* Feature Stats */}
      <div className="max-w-7xl mx-auto mt-8 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#6EE7B7]/10 rounded-lg border border-[#6EE7B7]/20">
            <div className="text-2xl text-[#6EE7B7] mb-1">
              {featureCategories.learning.features.length}
            </div>
            <div className="text-[#94A3B8] text-sm">Learning Features</div>
          </div>
          <div className="p-4 bg-[#FFD369]/10 rounded-lg border border-[#FFD369]/20">
            <div className="text-2xl text-[#FFD369] mb-1">
              {featureCategories.battle.features.length}
            </div>
            <div className="text-[#94A3B8] text-sm">Battle Features</div>
          </div>
          <div className="p-4 bg-[#73C783]/10 rounded-lg border border-[#73C783]/20">
            <div className="text-2xl text-[#73C783] mb-1">
              {featureCategories.economy.features.length}
            </div>
            <div className="text-[#94A3B8] text-sm">Economy Features</div>
          </div>
          <div className="p-4 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20">
            <div className="text-2xl text-[#F59E0B] mb-1">
              {featureCategories.companions.features.length}
            </div>
            <div className="text-[#94A3B8] text-sm">Companion Features</div>
          </div>
        </div>
      </div>
    </div>
  );
}
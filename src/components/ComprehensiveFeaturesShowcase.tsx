import React, { useState, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ShoppingCart,
  GraduationCap,
  Bot,
  User,
  Gamepad2,
  Database,
  Heart,
  CloudRain,
  BookOpen,
  Swords,
  TrendingUp,
  Sparkles,
  Target,
  Zap,
  Brain,
  MessageCircle,
  Palette,
  Trophy,
  Users,
  Crown,
  Store,
  Package,
  Globe,
  Satellite,
  BarChart3,
  Eye,
  Leaf,
  Wind,
  Thermometer,
  Droplets,
  ArrowLeft,
  ChevronRight,
  Info,
  Star
} from 'lucide-react';

interface ComprehensiveFeaturesShowcaseProps {
  onNavigate: (screen: string) => void;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  highlights: string[];
  status: 'active' | 'beta' | 'new';
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  features: Feature[];
}

export function ComprehensiveFeaturesShowcase({ onNavigate }: ComprehensiveFeaturesShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('learning-skills');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setExpandedFeature(null);
  }, []);

  const categories: Category[] = useMemo(() => [
    {
      id: 'learning-skills',
      name: 'Learning & Skills',
      description: 'Master sustainable farming techniques with NASA data',
      icon: GraduationCap,
      color: '#6EE7B7',
      gradient: 'from-[#6EE7B7] to-[#73C783]',
      features: [
        {
          id: 'learning-hub',
          name: 'Learning Hub',
          description: 'Interactive farming education system with XP rewards',
          icon: BookOpen,
          route: 'learningHub',
          highlights: [
            'Learn sustainable farming practices',
            'Earn XP and unlock new skills',
            'Track your learning progress',
            'Apply skills for bonuses in battles'
          ],
          status: 'active'
        },
        {
          id: 'nasa-academy',
          name: 'NASA Data Academy',
          description: 'Comprehensive satellite data interpretation training',
          icon: Satellite,
          route: 'nasaEducationalHub',
          highlights: [
            'Understand satellite data limitations',
            'Learn data quality assessment',
            'Real-world farming applications',
            'Interactive modules and quizzes'
          ],
          status: 'new'
        },
        {
          id: 'guided-practice',
          name: 'Guided Farming Practice',
          description: 'Practice farming with AI companion guidance',
          icon: Target,
          route: 'guidedFarmingPractice',
          highlights: [
            'Companion-guided farming sessions',
            'Real-time feedback and tips',
            'Practice without consequences',
            'Build confidence and skills'
          ],
          status: 'active'
        },
        {
          id: 'accessibility-tutorial',
          name: 'Getting Started Tutorial',
          description: 'Beginner-friendly introduction for all backgrounds',
          icon: Info,
          route: 'accessibilityTutorial',
          highlights: [
            'Personalized learning paths',
            'Audio explanations available',
            'No technical background needed',
            'Step-by-step guidance'
          ],
          status: 'new'
        }
      ]
    },
    {
      id: 'data-ai',
      name: 'Data & AI',
      description: 'Advanced NASA data analysis and AI assistants',
      icon: Database,
      color: '#3B82F6',
      gradient: 'from-[#3B82F6] to-[#1E3A8A]',
      features: [
        {
          id: 'nasa-data-service',
          name: 'Enhanced NASA Data Service',
          description: 'Professional satellite data with quality assessment',
          icon: Satellite,
          route: 'enhancedNASADataService',
          highlights: [
            'Real-time satellite data feeds',
            'Quality indicators and confidence scores',
            'Dataset limitations explained',
            'Best practices guidance'
          ],
          status: 'new'
        },
        {
          id: 'data-visualization',
          name: 'Data Visualization Center',
          description: 'Interactive charts and analysis tools',
          icon: BarChart3,
          route: 'dataVisualizationCenter',
          highlights: [
            'Time series analysis',
            'Regional comparisons',
            'Quality overlay visualization',
            'Export and share data'
          ],
          status: 'new'
        },
        {
          id: 'terra-ai',
          name: 'TERRA-AI Assistant',
          description: 'AI-powered farming advisor and helper',
          icon: Bot,
          route: 'terraAI',
          highlights: [
            'Real-time farming advice',
            'Climate data interpretation',
            'Personalized recommendations',
            '24/7 AI assistance'
          ],
          status: 'active'
        },
        {
          id: 'nasa-panel',
          name: 'NASA Live Feed',
          description: 'Real-time climate data monitoring',
          icon: Globe,
          route: 'nasaData',
          highlights: [
            'Live satellite imagery',
            'Climate indicators',
            'Weather patterns',
            'Updates every 30 seconds'
          ],
          status: 'active'
        }
      ]
    },
    {
      id: 'battle-competition',
      name: 'Battle & Competition',
      description: 'Challenge farming crises and compete globally',
      icon: Swords,
      color: '#FFD369',
      gradient: 'from-[#FFD369] to-[#FF8C42]',
      features: [
        {
          id: 'boss-battles',
          name: 'Boss Battles',
          description: 'Face epic farming crises with knowledge and skills',
          icon: Swords,
          route: 'bossBattle',
          highlights: [
            'Epic boss encounters (Drought Titan, etc.)',
            'Use learned skills for bonus damage',
            'Strategic farming combat',
            'Unlock rare rewards'
          ],
          status: 'active'
        },
        {
          id: 'arena-mode',
          name: 'Battle Royale Arena',
          description: 'Competitive farming PvP mode',
          icon: Crown,
          route: 'arenaMode',
          highlights: [
            '100-player farming competition',
            'Last farmer standing wins',
            'Seasonal leaderboards',
            'Exclusive arena rewards'
          ],
          status: 'beta'
        },
        {
          id: 'squad-coop',
          name: 'Squad Co-op Missions',
          description: 'Team up for cooperative farming challenges',
          icon: Users,
          route: 'squadLobby',
          highlights: [
            'Form 4-player squads',
            'Cooperative missions',
            'Shared rewards and XP',
            'Voice chat support'
          ],
          status: 'active'
        },
        {
          id: 'farm-cards',
          name: 'Farm Card Collection',
          description: 'Collectible knowledge-powered farming cards',
          icon: Gamepad2,
          route: 'farmCards',
          highlights: [
            'Collect rare farming cards',
            'Strategic card battles',
            'Combine cards for combos',
            'Trade with other players'
          ],
          status: 'active'
        }
      ]
    },
    {
      id: 'trading-economy',
      name: 'Trading & Economy',
      description: 'Global marketplace and resource management',
      icon: TrendingUp,
      color: '#73C783',
      gradient: 'from-[#73C783] to-[#6EE7B7]',
      features: [
        {
          id: 'global-marketplace',
          name: 'Global Marketplace',
          description: 'Trade crops and resources worldwide',
          icon: Store,
          route: 'globalMarketplace',
          highlights: [
            'Dynamic pricing based on supply/demand',
            'Trade with farmers globally',
            'Regional price variations',
            'Market trend analytics'
          ],
          status: 'active'
        },
        {
          id: 'farm-shop',
          name: 'Farm Shop',
          description: 'Purchase tools, seeds, and upgrades',
          icon: ShoppingCart,
          route: 'farmShop',
          highlights: [
            'Buy farming equipment',
            'Upgrade tools for efficiency',
            'Special seed varieties',
            'Spend earned XP points'
          ],
          status: 'active'
        },
        {
          id: 'world-regions',
          name: 'World Map Trading',
          description: 'Explore and trade across climate regions',
          icon: Globe,
          route: 'enhancedWorldMap',
          highlights: [
            'Visit different climate zones',
            'Region-specific crops',
            'Trade route optimization',
            'Real NASA climate data'
          ],
          status: 'active'
        }
      ]
    },
    {
      id: 'companions',
      name: 'Companions',
      description: 'AI characters, mentors, and magical pets',
      icon: Heart,
      color: '#F59E0B',
      gradient: 'from-[#F59E0B] to-[#EF4444]',
      features: [
        {
          id: 'farm-guardians',
          name: 'Farm Guardian Mentors',
          description: 'Anime-style AI mentors with unique personalities',
          icon: Sparkles,
          route: 'mentorSelection',
          highlights: [
            'Choose from diverse mentors',
            'Dynamic mood-based dialogues',
            'Personalized farming guidance',
            'Story-driven interactions'
          ],
          status: 'active'
        },
        {
          id: 'eco-companions',
          name: 'Eco-Companion Pets',
          description: 'Magical farming companion creatures',
          icon: Heart,
          route: 'petCompanion',
          highlights: [
            'Adopt magical farming pets',
            'Mood states and interactions',
            'Pet abilities and bonuses',
            'Evolve and customize pets'
          ],
          status: 'active'
        },
        {
          id: 'ai-chat',
          name: 'AI Character Chat',
          description: 'Deep conversations with AI-powered characters',
          icon: MessageCircle,
          route: 'enhancedCharacterChat',
          highlights: [
            'Natural conversations with DeepSeek AI',
            'Character memory and context',
            'Farming advice and stories',
            'Emotional intelligence'
          ],
          status: 'new'
        },
        {
          id: 'character-creator',
          name: 'AI Character Creator',
          description: 'Generate custom AI characters with unique traits',
          icon: Palette,
          route: 'enhancedAICharacterCreator',
          highlights: [
            'AI-generated anime characters',
            'Customize personality traits',
            'Design unique appearances',
            'Create companion backstories'
          ],
          status: 'new'
        },
        {
          id: 'character-custom',
          name: 'Character Customization',
          description: 'Customize your player avatar',
          icon: User,
          route: 'characterCustomization',
          highlights: [
            'Detailed avatar creator',
            'Clothing and accessories',
            'Unlock cosmetic rewards',
            'Express your style'
          ],
          status: 'active'
        },
        {
          id: 'pet-custom',
          name: 'Pet Customization',
          description: 'Personalize your companion pet',
          icon: Heart,
          route: 'petCustomization',
          highlights: [
            'Customize pet appearance',
            'Modify traits and abilities',
            'Unlock pet accessories',
            'Create unique companions'
          ],
          status: 'active'
        }
      ]
    },
    {
      id: 'climate-analysis',
      name: 'Climate & Analysis',
      description: 'Real-time climate monitoring and farming scenarios',
      icon: CloudRain,
      color: '#6366F1',
      gradient: 'from-[#6366F1] to-[#8B5CF6]',
      features: [
        {
          id: 'climate-shards',
          name: 'Climate Scenario Shards',
          description: 'Explore different climate change scenarios',
          icon: Globe,
          route: 'shardExplorer',
          highlights: [
            'Visit unique climate scenarios',
            'Restore ecological balance',
            'Learn adaptation strategies',
            'Track restoration progress'
          ],
          status: 'active'
        },
        {
          id: 'world-explorer',
          name: 'World Map Explorer',
          description: 'Interactive global climate exploration',
          icon: Globe,
          route: 'enhancedWorldMap',
          highlights: [
            'Real-time NASA climate overlays',
            'Regional climate patterns',
            'Historical data comparison',
            'Future projection scenarios'
          ],
          status: 'active'
        },
        {
          id: 'location-shards',
          name: 'Real Location Analysis',
          description: 'Analyze real-world farming locations',
          icon: Target,
          route: 'googleMapsExplorer',
          highlights: [
            'Select any global location',
            'NASA data for specific sites',
            'Local climate assessment',
            'Farming suitability analysis'
          ],
          status: 'beta'
        }
      ]
    },
    {
      id: 'game-modes',
      name: 'Game Modes',
      description: 'Multiple ways to play and experience farming',
      icon: Gamepad2,
      color: '#EC4899',
      gradient: 'from-[#EC4899] to-[#8B5CF6]',
      features: [
        {
          id: 'interactive-farm',
          name: 'Interactive Farming',
          description: 'Full-featured farming simulation',
          icon: Leaf,
          route: 'farmingGameplay',
          highlights: [
            'Plant and harvest crops',
            'Manage water and resources',
            'Weather impact simulation',
            'Realistic growth cycles'
          ],
          status: 'active'
        },
        {
          id: 'animated-farm',
          name: 'Animated Farm View',
          description: 'Beautiful visual farming experience',
          icon: Sparkles,
          route: 'animatedFarming',
          highlights: [
            'Stunning animations',
            'Dynamic weather effects',
            'Seasonal changes',
            'Relaxing gameplay'
          ],
          status: 'active'
        },
        {
          id: 'shard-explorer',
          name: 'Shard Explorer Mode',
          description: 'Adventure through climate scenarios',
          icon: Zap,
          route: 'shardExplorer',
          highlights: [
            'Story-driven missions',
            'Unlock new regions',
            'Progress tracking',
            'Multiple endings'
          ],
          status: 'active'
        }
      ]
    }
  ], []);

  const currentCategory = useMemo(
    () => categories.find(cat => cat.id === selectedCategory) || categories[0],
    [categories, selectedCategory]
  );
  
  const totalFeatures = useMemo(
    () => categories.reduce((sum, cat) => sum + cat.features.length, 0),
    [categories]
  );

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
            Complete Features Showcase
          </h1>
          <p className="text-[#E5E7EB] text-lg max-w-3xl mx-auto mb-4">
            Explore all of AgriVerse's features across learning, battles, trading, companions, and more
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-[#6EE7B7]/20 text-[#6EE7B7] text-sm">
              {categories.length} Categories
            </Badge>
            <Badge className="bg-[#FFD369]/20 text-[#FFD369] text-sm">
              {totalFeatures} Features
            </Badge>
            <Badge className="bg-[#73C783]/20 text-[#73C783] text-sm">
              All Fully Integrated
            </Badge>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] shadow-lg'
                    : 'bg-[#1E293B]/30 border-[#374151] hover:border-opacity-40'
                }`}
                style={{
                  borderColor: isActive ? category.color : undefined
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: category.color }} />
                </div>
                <div className="text-[#E5E7EB] text-xs text-center">{category.name}</div>
                <div className="text-[#94A3B8] text-xs text-center mt-1">
                  {category.features.length} features
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Features Display */}
      <div className="max-w-7xl mx-auto">
          <div key={selectedCategory}>
            {/* Category Header */}
            <div className="mb-8 p-6 rounded-xl border-2" style={{ 
              backgroundColor: `${currentCategory.color}10`,
              borderColor: `${currentCategory.color}40`
            }}>
              <div className="flex items-center gap-4 mb-3">
                <div 
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: `${currentCategory.color}20` }}
                >
                  <currentCategory.icon className="w-8 h-8" style={{ color: currentCategory.color }} />
                </div>
                <div>
                  <h2 className="text-3xl text-[#E5E7EB]">{currentCategory.name}</h2>
                  <p className="text-[#94A3B8]">{currentCategory.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge style={{ 
                  backgroundColor: `${currentCategory.color}20`,
                  color: currentCategory.color
                }}>
                  {currentCategory.features.length} Features Available
                </Badge>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCategory.features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                const isExpanded = expandedFeature === feature.id;
                
                return (
                  <div key={feature.id}>
                    <Card 
                      className="bg-[#1E293B]/50 border-[#374151] hover:border-opacity-60 transition-all group h-full"
                      style={{
                        borderColor: `${currentCategory.color}40`
                      }}
                    >
                      <div className="p-6 flex flex-col h-full">
                        {/* Feature Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div 
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: `${currentCategory.color}20` }}
                          >
                            <FeatureIcon className="w-6 h-6" style={{ color: currentCategory.color }} />
                          </div>
                          <Badge 
                            className="text-xs"
                            style={{ 
                              backgroundColor: feature.status === 'new' ? '#10B98120' : 
                                              feature.status === 'beta' ? '#F59E0B20' : 
                                              `${currentCategory.color}20`,
                              color: feature.status === 'new' ? '#10B981' : 
                                     feature.status === 'beta' ? '#F59E0B' : 
                                     currentCategory.color
                            }}
                          >
                            {feature.status.toUpperCase()}
                          </Badge>
                        </div>

                        {/* Feature Info */}
                        <h3 className="text-[#E5E7EB] text-lg mb-2">{feature.name}</h3>
                        <p className="text-[#94A3B8] text-sm mb-4 flex-grow">{feature.description}</p>

                        {/* Highlights */}
                        <div className="mb-4">
                          <button
                            onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
                            className="text-[#6EE7B7] text-sm mb-2 flex items-center gap-1 hover:underline"
                          >
                            <Star className="w-3 h-3" />
                            Key Highlights {isExpanded ? '▼' : '▶'}
                          </button>
                          
                          {isExpanded && (
                            <ul className="space-y-1">
                              {feature.highlights.map((highlight, i) => (
                                <li key={i} className="text-[#94A3B8] text-xs flex items-start gap-2">
                                  <span className="text-[#6EE7B7] mt-0.5">✓</span>
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Launch Button */}
                        <Button
                          onClick={() => onNavigate(feature.route)}
                          className="w-full group-hover:scale-105 transition-transform mt-auto"
                          style={{
                            backgroundColor: `${currentCategory.color}20`,
                            color: currentCategory.color,
                            borderColor: `${currentCategory.color}40`
                          }}
                        >
                          Launch Feature
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

        {/* Quick Navigation */}
        <div className="mt-12 p-6 bg-[#1E293B]/30 rounded-xl border border-[#374151]">
          <h3 className="text-[#6EE7B7] mb-4 text-center">Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => onNavigate('farmDashboard')}
              className="bg-[#1E3A8A]/20 text-[#6EE7B7] border border-[#1E3A8A]/40 hover:bg-[#1E3A8A]/30"
            >
              Farm Dashboard
            </Button>
            <Button
              onClick={() => onNavigate('gameFeaturesHub')}
              className="bg-[#FFD369]/20 text-[#FFD369] border border-[#FFD369]/40 hover:bg-[#FFD369]/30"
            >
              Features Hub
            </Button>
            <Button
              onClick={() => onNavigate('mainMenu')}
              className="bg-[#374151] text-[#E5E7EB] border border-[#4B5563] hover:bg-[#4B5563]"
            >
              Main Menu
            </Button>
            <Button
              onClick={() => onNavigate('accessibilityTutorial')}
              className="bg-[#73C783]/20 text-[#73C783] border border-[#73C783]/40 hover:bg-[#73C783]/30"
            >
              Tutorial
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-[#6EE7B7]/10 rounded-lg border border-[#6EE7B7]/20">
            <div className="text-3xl text-[#6EE7B7] mb-1">{totalFeatures}</div>
            <div className="text-[#94A3B8] text-sm">Total Features</div>
          </div>
          <div className="text-center p-4 bg-[#FFD369]/10 rounded-lg border border-[#FFD369]/20">
            <div className="text-3xl text-[#FFD369] mb-1">{categories.length}</div>
            <div className="text-[#94A3B8] text-sm">Categories</div>
          </div>
          <div className="text-center p-4 bg-[#73C783]/10 rounded-lg border border-[#73C783]/20">
            <div className="text-3xl text-[#73C783] mb-1">
              {categories.flatMap(c => c.features).filter(f => f.status === 'new').length}
            </div>
            <div className="text-[#94A3B8] text-sm">New Features</div>
          </div>
          <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20">
            <div className="text-3xl text-[#F59E0B] mb-1">100%</div>
            <div className="text-[#94A3B8] text-sm">Integrated</div>
          </div>
        </div>
      </div>
    </div>
  );
}
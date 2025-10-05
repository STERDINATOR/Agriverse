import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  ArrowLeft, 
  Zap, 
  Droplets, 
  Sprout,
  Cpu,
  Leaf,
  Target,
  Star,
  Lock,
  CheckCircle,
  TrendingUp,
  Shield,
  Sparkles,
  Bot,
  Beaker,
  Wind
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner';

interface SkillTreeProps {
  onNavigate: (screen: string) => void;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  maxLevel: number;
  currentLevel: number;
  cost: number; // Skill points needed
  prerequisites: string[];
  effects: string[];
  category: 'agronomist' | 'irrigation' | 'eco' | 'tech';
  position: { x: number; y: number };
  unlocked: boolean;
}

interface SkillCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ComponentType<any>;
  specialAbility: string;
}

const skillCategories: SkillCategory[] = [
  {
    id: 'agronomist',
    name: 'Agronomist',
    description: 'Master of crop yields and soil science',
    color: '#73C783',
    icon: Sprout,
    specialAbility: 'Harvest Blessing: +50% yield on all crops for 5 minutes'
  },
  {
    id: 'irrigation',
    name: 'Irrigation Master',
    description: 'Expert in water management systems',
    color: '#4ECDC4',
    icon: Droplets,
    specialAbility: 'Aqua Burst: Instant water to all crops in current shard'
  },
  {
    id: 'eco',
    name: 'Eco Farmer',
    description: 'Guardian of sustainable farming practices',
    color: '#6EE7B7',
    icon: Leaf,
    specialAbility: 'Nature\'s Grace: +100% eco points for 10 minutes'
  },
  {
    id: 'tech',
    name: 'Tech Farmer',
    description: 'Pioneer of agricultural technology',
    color: '#8B5CF6',
    icon: Cpu,
    specialAbility: 'Tech Overdrive: All automated systems work 3x faster'
  }
];

const skills: Skill[] = [
  // Agronomist Tree
  {
    id: 'soil-analysis',
    name: 'Soil Analysis',
    description: 'Analyze soil composition for optimal crop placement',
    icon: Target,
    maxLevel: 5,
    currentLevel: 0,
    cost: 1,
    prerequisites: [],
    effects: ['+10% soil health per level', 'Reveals optimal crop types'],
    category: 'agronomist',
    position: { x: 20, y: 20 },
    unlocked: true
  },
  {
    id: 'crop-rotation',
    name: 'Crop Rotation',
    description: 'Advanced knowledge of sustainable farming cycles',
    icon: TrendingUp,
    maxLevel: 3,
    currentLevel: 0,
    cost: 2,
    prerequisites: ['soil-analysis'],
    effects: ['+15% yield when rotating crops', 'Soil health bonus'],
    category: 'agronomist',
    position: { x: 20, y: 40 },
    unlocked: false
  },
  {
    id: 'selective-breeding',
    name: 'Selective Breeding',
    description: 'Develop superior crop varieties through genetics',
    icon: Star,
    maxLevel: 5,
    currentLevel: 0,
    cost: 3,
    prerequisites: ['crop-rotation'],
    effects: ['+20% crop quality', 'Unlock rare seed variants'],
    category: 'agronomist',
    position: { x: 20, y: 60 },
    unlocked: false
  },
  {
    id: 'harvest-mastery',
    name: 'Harvest Mastery',
    description: 'Perfect timing and technique for maximum yield',
    icon: Sparkles,
    maxLevel: 10,
    currentLevel: 0,
    cost: 5,
    prerequisites: ['selective-breeding'],
    effects: ['+5% harvest yield per level', 'Chance for bonus seeds'],
    category: 'agronomist',
    position: { x: 20, y: 80 },
    unlocked: false
  },

  // Irrigation Tree
  {
    id: 'water-conservation',
    name: 'Water Conservation',
    description: 'Efficient water usage techniques',
    icon: Droplets,
    maxLevel: 5,
    currentLevel: 0,
    cost: 1,
    prerequisites: [],
    effects: ['-10% water consumption per level', '+5% crop water retention'],
    category: 'irrigation',
    position: { x: 40, y: 20 },
    unlocked: true
  },
  {
    id: 'drip-irrigation',
    name: 'Drip Irrigation',
    description: 'Precision watering system technology',
    icon: Target,
    maxLevel: 3,
    currentLevel: 0,
    cost: 2,
    prerequisites: ['water-conservation'],
    effects: ['Auto-water crops at optimal levels', '+25% water efficiency'],
    category: 'irrigation',
    position: { x: 40, y: 40 },
    unlocked: false
  },
  {
    id: 'aquaponics',
    name: 'Aquaponics',
    description: 'Integrate fish farming with crop production',
    icon: TrendingUp,
    maxLevel: 5,
    currentLevel: 0,
    cost: 4,
    prerequisites: ['drip-irrigation'],
    effects: ['Unlock aquaponics systems', '+30% water crop yield'],
    category: 'irrigation',
    position: { x: 40, y: 60 },
    unlocked: false
  },
  {
    id: 'weather-prediction',
    name: 'Weather Prediction',
    description: 'Advanced meteorological knowledge',
    icon: Wind,
    maxLevel: 7,
    currentLevel: 0,
    cost: 6,
    prerequisites: ['aquaponics'],
    effects: ['Predict weather changes', 'Prepare for climate events'],
    category: 'irrigation',
    position: { x: 40, y: 80 },
    unlocked: false
  },

  // Eco Farmer Tree
  {
    id: 'composting',
    name: 'Composting',
    description: 'Transform waste into valuable fertilizer',
    icon: Leaf,
    maxLevel: 5,
    currentLevel: 0,
    cost: 1,
    prerequisites: [],
    effects: ['+15% organic fertilizer production', 'Reduce waste by 20%'],
    category: 'eco',
    position: { x: 60, y: 20 },
    unlocked: true
  },
  {
    id: 'companion-planting',
    name: 'Companion Planting',
    description: 'Strategic crop partnerships for mutual benefit',
    icon: Star,
    maxLevel: 3,
    currentLevel: 0,
    cost: 2,
    prerequisites: ['composting'],
    effects: ['Crops boost each other', '+20% pest resistance'],
    category: 'eco',
    position: { x: 60, y: 40 },
    unlocked: false
  },
  {
    id: 'biodiversity',
    name: 'Biodiversity',
    description: 'Create thriving ecosystems on your farm',
    icon: Shield,
    maxLevel: 5,
    currentLevel: 0,
    cost: 3,
    prerequisites: ['companion-planting'],
    effects: ['Attract beneficial insects', '+40% natural pest control'],
    category: 'eco',
    position: { x: 60, y: 60 },
    unlocked: false
  },
  {
    id: 'carbon-sequestration',
    name: 'Carbon Sequestration',
    description: 'Capture and store atmospheric carbon in soil',
    icon: Sparkles,
    maxLevel: 10,
    currentLevel: 0,
    cost: 5,
    prerequisites: ['biodiversity'],
    effects: ['+100 eco points per day', 'Fight climate change'],
    category: 'eco',
    position: { x: 60, y: 80 },
    unlocked: false
  },

  // Tech Farmer Tree
  {
    id: 'sensor-networks',
    name: 'Sensor Networks',
    description: 'IoT monitoring of crops and environment',
    icon: Cpu,
    maxLevel: 5,
    currentLevel: 0,
    cost: 1,
    prerequisites: [],
    effects: ['Real-time crop monitoring', 'Early problem detection'],
    category: 'tech',
    position: { x: 80, y: 20 },
    unlocked: true
  },
  {
    id: 'drone-automation',
    name: 'Drone Automation',
    description: 'Automated farming with AI-powered drones',
    icon: Bot,
    maxLevel: 3,
    currentLevel: 0,
    cost: 3,
    prerequisites: ['sensor-networks'],
    effects: ['Auto-planting and harvesting', '+50% farming speed'],
    category: 'tech',
    position: { x: 80, y: 40 },
    unlocked: false
  },
  {
    id: 'genetic-engineering',
    name: 'Genetic Engineering',
    description: 'Modify crop genetics for enhanced traits',
    icon: Beaker,
    maxLevel: 5,
    currentLevel: 0,
    cost: 4,
    prerequisites: ['drone-automation'],
    effects: ['Create super crops', '+200% special trait probability'],
    category: 'tech',
    position: { x: 80, y: 60 },
    unlocked: false
  },
  {
    id: 'ai-optimization',
    name: 'AI Optimization',
    description: 'Machine learning for perfect farm management',
    icon: Sparkles,
    maxLevel: 10,
    currentLevel: 0,
    cost: 7,
    prerequisites: ['genetic-engineering'],
    effects: ['AI manages your farm', '+300% efficiency'],
    category: 'tech',
    position: { x: 80, y: 80 },
    unlocked: false
  }
];

export function SkillTree({ onNavigate }: SkillTreeProps) {
  const { gameState } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('agronomist');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillPoints] = useState(5); // In real game, this would come from gameState

  const categorySkills = skills.filter(skill => skill.category === selectedCategory);
  
  const canLearnSkill = (skill: Skill) => {
    if (skill.currentLevel >= skill.maxLevel) return false;
    if (skillPoints < skill.cost) return false;
    
    // Check prerequisites
    return skill.prerequisites.every(prereqId => {
      const prereq = skills.find(s => s.id === prereqId);
      return prereq && prereq.currentLevel > 0;
    });
  };

  const learnSkill = (skill: Skill) => {
    if (!canLearnSkill(skill)) {
      toast.error('Cannot learn this skill yet!');
      return;
    }

    // Update skill level (in real game, this would update gameState)
    skill.currentLevel += 1;
    
    // Unlock next skills if this was a prerequisite
    skills.forEach(s => {
      if (s.prerequisites.includes(skill.id) && !s.unlocked) {
        s.unlocked = true;
      }
    });

    toast.success(`Learned ${skill.name} Level ${skill.currentLevel}!`);
  };

  const useSpecialAbility = (category: SkillCategory) => {
    toast.success(`Activated ${category.specialAbility}!`);
  };

  const getSkillConnectionLines = () => {
    return categorySkills.map(skill => 
      skill.prerequisites.map(prereqId => {
        const prereq = categorySkills.find(s => s.id === prereqId);
        if (!prereq) return null;
        
        return (
          <line
            key={`${prereqId}-${skill.id}`}
            x1={`${prereq.position.x}%`}
            y1={`${prereq.position.y}%`}
            x2={`${skill.position.x}%`}
            y2={`${skill.position.y}%`}
            stroke={skill.unlocked ? '#73C783' : '#666'}
            strokeWidth="2"
            strokeDasharray={skill.unlocked ? "0" : "5,5"}
            opacity="0.7"
          />
        );
      })
    ).flat().filter(Boolean);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/90 to-black/80">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-white/5" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate('playerHub')}
              variant="ghost"
              className="text-[#E5E7EB] hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Hub
            </Button>
            
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-[#FFD369]" />
              <h1 className="text-2xl text-[#E5E7EB]">Skill Tree</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Card className="px-3 py-2 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#FFD369]" />
                <span className="text-[#E5E7EB]">{skillPoints} Skill Points</span>
              </div>
            </Card>

            <Card className="px-3 py-2 bg-black/40 border-[#73C783]/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#73C783]" />
                <span className="text-[#E5E7EB]">Level {gameState.playerLevel}</span>
              </div>
            </Card>
          </div>
        </div>

        <div className="relative z-10 flex h-[calc(100vh-80px)]">
          {/* Category Selection */}
          <div className="w-80 p-6 space-y-4">
            <h2 className="text-[#E5E7EB] text-lg mb-4">Farming Classes</h2>
            
            {skillCategories.map(category => {
              const categorySkillsData = skills.filter(s => s.category === category.id);
              const totalLevels = categorySkillsData.reduce((sum, skill) => sum + skill.currentLevel, 0);
              const maxLevels = categorySkillsData.reduce((sum, skill) => sum + skill.maxLevel, 0);
              
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer transition-all duration-300 ${
                      selectedCategory === category.id 
                        ? 'bg-black/60 border-2' 
                        : 'bg-black/40 border hover:bg-black/50'
                    }`}
                    style={{ 
                      borderColor: selectedCategory === category.id 
                        ? category.color 
                        : 'rgba(255,255,255,0.1)'
                    }}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <category.icon className="w-5 h-5" style={{ color: category.color }} />
                      </div>
                      <div>
                        <h3 className="text-[#E5E7EB] font-medium">{category.name}</h3>
                        <p className="text-xs text-[#E5E7EB]/70">{category.description}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-[#E5E7EB]/70">Progress</span>
                        <span className="text-xs" style={{ color: category.color }}>
                          {totalLevels}/{maxLevels}
                        </span>
                      </div>
                      <Progress 
                        value={(totalLevels / maxLevels) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="text-xs text-[#E5E7EB]/80 mb-3">
                      <strong>Special Ability:</strong> {category.specialAbility}
                    </div>

                    {totalLevels >= 10 && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          useSpecialAbility(category);
                        }}
                        size="sm"
                        className="w-full"
                        style={{ backgroundColor: category.color, color: 'black' }}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Use Special Ability
                      </Button>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Skill Tree Visualization */}
          <div className="flex-1 p-6">
            <div className="h-full rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 relative overflow-hidden">
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {getSkillConnectionLines()}
              </svg>

              {/* Skill Nodes */}
              {categorySkills.map(skill => (
                <Tooltip key={skill.id}>
                  <TooltipTrigger asChild>
                    <motion.div
                      className="absolute cursor-pointer"
                      style={{
                        left: `${skill.position.x}%`,
                        top: `${skill.position.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <div 
                        className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          skill.currentLevel > 0 
                            ? 'bg-gradient-to-br from-[#73C783]/40 to-[#6EE7B7]/40 border-[#73C783]' :
                          skill.unlocked 
                            ? 'bg-black/60 border-white/40 hover:border-[#73C783]' :
                            'bg-black/30 border-gray-600'
                        }`}
                      >
                        {skill.currentLevel > 0 ? (
                          <CheckCircle className="w-6 h-6 text-[#73C783]" />
                        ) : skill.unlocked ? (
                          <skill.icon className="w-6 h-6 text-[#E5E7EB]" />
                        ) : (
                          <Lock className="w-6 h-6 text-gray-500" />
                        )}
                      </div>

                      {/* Skill Level Indicator */}
                      {skill.currentLevel > 0 && (
                        <Badge 
                          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-[#73C783] text-black"
                        >
                          {skill.currentLevel}/{skill.maxLevel}
                        </Badge>
                      )}

                      {/* Skill Name */}
                      <div className="absolute top-18 left-1/2 transform -translate-x-1/2 text-center">
                        <p className="text-xs text-[#E5E7EB] whitespace-nowrap">{skill.name}</p>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-64">
                      <h4 className="font-medium mb-1">{skill.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{skill.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs"><strong>Effects:</strong></p>
                        {skill.effects.map(effect => (
                          <p key={effect} className="text-xs">• {effect}</p>
                        ))}
                      </div>
                      {skill.prerequisites.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs"><strong>Prerequisites:</strong></p>
                          {skill.prerequisites.map(prereqId => {
                            const prereq = skills.find(s => s.id === prereqId);
                            return (
                              <p key={prereqId} className="text-xs">• {prereq?.name}</p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Skill Details Panel */}
          {selectedSkill && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-80 p-6"
            >
              <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedSkill.currentLevel > 0 
                        ? 'bg-[#73C783]/20 border-2 border-[#73C783]' :
                      selectedSkill.unlocked 
                        ? 'bg-white/10 border-2 border-white/20' :
                        'bg-gray-800/20 border-2 border-gray-600'
                    }`}
                  >
                    <selectedSkill.icon className={`w-6 h-6 ${
                      selectedSkill.currentLevel > 0 ? 'text-[#73C783]' :
                      selectedSkill.unlocked ? 'text-[#E5E7EB]' : 'text-gray-500'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-[#E5E7EB] text-lg">{selectedSkill.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {selectedSkill.category}
                    </Badge>
                  </div>
                </div>

                <p className="text-[#E5E7EB]/80 mb-4">{selectedSkill.description}</p>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#E5E7EB] text-sm">Level Progress</span>
                    <span className="text-[#73C783]">
                      {selectedSkill.currentLevel}/{selectedSkill.maxLevel}
                    </span>
                  </div>
                  <Progress 
                    value={(selectedSkill.currentLevel / selectedSkill.maxLevel) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="mb-4">
                  <h4 className="text-[#6EE7B7] text-sm mb-2">Effects</h4>
                  <div className="space-y-1">
                    {selectedSkill.effects.map(effect => (
                      <p key={effect} className="text-xs text-[#E5E7EB]/80">• {effect}</p>
                    ))}
                  </div>
                </div>

                {selectedSkill.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-[#FFD369] text-sm mb-2">Prerequisites</h4>
                    <div className="space-y-1">
                      {selectedSkill.prerequisites.map(prereqId => {
                        const prereq = skills.find(s => s.id === prereqId);
                        const isComplete = prereq && prereq.currentLevel > 0;
                        return (
                          <div key={prereqId} className="flex items-center gap-2">
                            {isComplete ? (
                              <CheckCircle className="w-3 h-3 text-[#73C783]" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border border-gray-500" />
                            )}
                            <span className={`text-xs ${isComplete ? 'text-[#73C783]' : 'text-[#E5E7EB]/70'}`}>
                              {prereq?.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[#E5E7EB] text-sm">Cost</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#FFD369]" />
                      <span className="text-[#FFD369]">{selectedSkill.cost}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => learnSkill(selectedSkill)}
                  disabled={!canLearnSkill(selectedSkill)}
                  className={`w-full ${
                    canLearnSkill(selectedSkill)
                      ? 'bg-gradient-to-r from-[#73C783] to-[#6EE7B7] text-black'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {selectedSkill.currentLevel >= selectedSkill.maxLevel ? 'Maxed Out' :
                   !selectedSkill.unlocked ? 'Locked' :
                   skillPoints < selectedSkill.cost ? 'Not Enough Points' :
                   'Learn Skill'}
                </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  ArrowLeft,
  BookOpen,
  Lightbulb,
  CheckCircle,
  Star,
  Trophy,
  Sparkles,
  Brain,
  Target,
  Award,
  ChevronRight,
  Clock,
  Zap,
  TrendingUp,
  Shield,
  Bot,
  Beaker,
  Wind,
  Droplets,
  Sprout,
  Cpu,
  Leaf,
  Lock,
  Play,
  BarChart3,
  Calendar,
  GraduationCap,
  Flame,
  Users,
  MessageCircle,
  ShoppingCart
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface LearningHubProps {
  onNavigate: (screen: string) => void;
}

interface DialogueStep {
  id: string;
  character: string;
  characterImage: string;
  text: string;
  options?: {
    id: string;
    text: string;
    correct?: boolean;
    feedback: string;
    points: number;
    skillExp?: { skillId: string; exp: number }[];
  }[];
  info?: string;
  nextStep?: string;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: 'climate' | 'crops' | 'soil' | 'water' | 'sustainability' | 'technology';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  xpReward: number;
  ecoPointsReward: number;
  skillRewards: { skillId: string; exp: number }[];
  dialogue: DialogueStep[];
  completed: boolean;
  prerequisites: string[];
  isUnlocked: boolean;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  maxLevel: number;
  currentLevel: number;
  currentExp: number;
  expRequired: number;
  category: 'agronomist' | 'irrigation' | 'eco' | 'tech';
  effects: string[];
  unlocked: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'learning' | 'skills' | 'mastery';
}

const learningModules: LearningModule[] = [
  {
    id: 'climate-basics',
    title: 'Climate Change Fundamentals',
    description: 'Learn the basics of climate change and its impact on agriculture',
    category: 'climate',
    difficulty: 'beginner',
    estimatedTime: 5,
    xpReward: 50,
    ecoPointsReward: 25,
    skillRewards: [
      { skillId: 'soil-analysis', exp: 20 },
      { skillId: 'weather-prediction', exp: 15 }
    ],
    prerequisites: [],
    isUnlocked: true,
    completed: false,
    dialogue: [
      {
        id: 'intro',
        character: 'Dr. Terra',
        characterImage: '🌍',
        text: "Welcome to our climate science lesson! I'm Dr. Terra, your climate education specialist. Today we'll explore how climate change affects farming. Are you ready to learn?",
        options: [
          { 
            id: 'ready', 
            text: "I'm ready to learn!", 
            correct: true, 
            feedback: "Great enthusiasm! Let's dive in.", 
            points: 5,
            skillExp: [{ skillId: 'soil-analysis', exp: 5 }]
          },
          { 
            id: 'maybe', 
            text: "I'm not sure...", 
            correct: false, 
            feedback: "That's okay! Learning is a journey. Let's start simple.", 
            points: 2 
          }
        ],
        nextStep: 'greenhouse-effect'
      },
      {
        id: 'greenhouse-effect',
        character: 'Dr. Terra',
        characterImage: '🌡️',
        text: "Climate change is primarily caused by the greenhouse effect. When we burn fossil fuels, we release gases like CO2 that trap heat in our atmosphere. What do you think this means for farmers?",
        options: [
          { 
            id: 'temperature', 
            text: "Higher temperatures affect crop growth", 
            correct: true, 
            feedback: "Exactly! Temperature changes can stress plants and alter growing seasons.", 
            points: 10,
            skillExp: [{ skillId: 'weather-prediction', exp: 10 }]
          },
          { 
            id: 'nothing', 
            text: "It doesn't affect farming much", 
            correct: false, 
            feedback: "Actually, climate change significantly impacts agriculture. Let me explain...", 
            points: 0 
          },
          { 
            id: 'rainfall', 
            text: "It changes rainfall patterns", 
            correct: true, 
            feedback: "Correct! Irregular rainfall can cause droughts or floods.", 
            points: 10,
            skillExp: [{ skillId: 'water-conservation', exp: 8 }]
          }
        ],
        nextStep: 'conclusion'
      },
      {
        id: 'conclusion',
        character: 'Dr. Terra',
        characterImage: '🏆',
        text: "Excellent work! You've learned that climate change affects farming through temperature and rainfall changes. You're now better equipped to help heal our planet!",
        info: "Module completed! You've gained valuable knowledge about climate-adaptive farming."
      }
    ]
  },
  {
    id: 'precision-agriculture',
    title: 'Precision Agriculture & IoT',
    description: 'Discover how modern technology revolutionizes farming efficiency',
    category: 'technology',
    difficulty: 'advanced',
    estimatedTime: 8,
    xpReward: 100,
    ecoPointsReward: 50,
    skillRewards: [
      { skillId: 'sensor-networks', exp: 30 },
      { skillId: 'drone-automation', exp: 25 }
    ],
    prerequisites: ['climate-basics'],
    isUnlocked: false,
    completed: false,
    dialogue: [
      {
        id: 'intro',
        character: 'TechBot Alpha',
        characterImage: '🤖',
        text: "Greetings! I'm TechBot Alpha, your precision agriculture instructor. Today we'll explore how sensors, drones, and AI are transforming farming. Ready to enter the future?",
        options: [
          { 
            id: 'excited', 
            text: "Yes! Show me the future of farming!", 
            correct: true, 
            feedback: "Excellent! Technology will be your greatest ally.", 
            points: 8,
            skillExp: [{ skillId: 'sensor-networks', exp: 10 }]
          }
        ],
        nextStep: 'sensors'
      },
      {
        id: 'sensors',
        character: 'TechBot Alpha',
        characterImage: '📡',
        text: "IoT sensors can monitor soil moisture, pH levels, nutrient content, and even plant health in real-time. This data helps you make precise decisions. What's the biggest advantage?",
        options: [
          { 
            id: 'efficiency', 
            text: "Reduces waste and increases efficiency", 
            correct: true, 
            feedback: "Perfect! Precision reduces waste by 30-40% on average.", 
            points: 15,
            skillExp: [{ skillId: 'sensor-networks', exp: 15 }]
          },
          { 
            id: 'automation', 
            text: "Enables automated responses", 
            correct: true, 
            feedback: "Exactly! Smart systems can auto-irrigate or adjust nutrients.", 
            points: 15,
            skillExp: [{ skillId: 'drone-automation', exp: 12 }]
          }
        ],
        nextStep: 'conclusion'
      },
      {
        id: 'conclusion',
        character: 'TechBot Alpha',
        characterImage: '🚀',
        text: "Outstanding! You now understand how precision agriculture uses data to optimize every aspect of farming. You're ready to farm like a scientist!",
        info: "Advanced module completed! You've mastered precision agriculture concepts."
      }
    ]
  }
];

const skills: Skill[] = [
  {
    id: 'soil-analysis',
    name: 'Soil Analysis',
    description: 'Analyze soil composition for optimal crop placement',
    icon: Target,
    maxLevel: 5,
    currentLevel: 0,
    currentExp: 0,
    expRequired: 100,
    category: 'agronomist',
    effects: ['+10% soil health per level', 'Reveals optimal crop types'],
    unlocked: true
  },
  {
    id: 'weather-prediction',
    name: 'Weather Prediction',
    description: 'Advanced meteorological knowledge for farming',
    icon: Wind,
    maxLevel: 5,
    currentLevel: 0,
    currentExp: 0,
    expRequired: 150,
    category: 'irrigation',
    effects: ['Predict weather changes', 'Prepare for climate events'],
    unlocked: true
  },
  {
    id: 'water-conservation',
    name: 'Water Conservation',
    description: 'Efficient water usage techniques',
    icon: Droplets,
    maxLevel: 5,
    currentLevel: 0,
    currentExp: 0,
    expRequired: 120,
    category: 'irrigation',
    effects: ['-10% water consumption per level', '+5% crop water retention'],
    unlocked: true
  },
  {
    id: 'sensor-networks',
    name: 'Sensor Networks',
    description: 'IoT monitoring of crops and environment',
    icon: Cpu,
    maxLevel: 5,
    currentLevel: 0,
    currentExp: 0,
    expRequired: 200,
    category: 'tech',
    effects: ['Real-time crop monitoring', 'Early problem detection'],
    unlocked: false
  },
  {
    id: 'drone-automation',
    name: 'Drone Automation',
    description: 'Automated farming with AI-powered drones',
    icon: Bot,
    maxLevel: 5,
    currentLevel: 0,
    currentExp: 0,
    expRequired: 250,
    category: 'tech',
    effects: ['Auto-planting and harvesting', '+50% farming speed'],
    unlocked: false
  }
];

const achievements: Achievement[] = [
  {
    id: 'first-module',
    title: 'First Steps',
    description: 'Complete your first learning module',
    icon: BookOpen,
    unlocked: false,
    category: 'learning'
  },
  {
    id: 'climate-expert',
    title: 'Climate Expert',
    description: 'Complete all climate-related modules',
    icon: GraduationCap,
    unlocked: false,
    category: 'learning'
  },
  {
    id: 'skill-master',
    title: 'Skill Master',
    description: 'Reach level 5 in any skill',
    icon: Trophy,
    unlocked: false,
    category: 'skills'
  }
];

export function LearningHub({ onNavigate }: LearningHubProps) {
  const { gameState, updateResources, addXP, learnSkill, upgradeSkill } = useGame();
  const [activeTab, setActiveTab] = useState('modules');
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [skillsData, setSkillsData] = useState(skills);
  const [modulesData, setModulesData] = useState(learningModules);
  const [achievementsData, setAchievementsData] = useState(achievements);

  const addSkillExp = (skillId: string, exp: number) => {
    // Update local skill display
    setSkillsData(prev => prev.map(skill => {
      if (skill.id === skillId) {
        const newExp = skill.currentExp + exp;
        let newLevel = skill.currentLevel;
        let remainingExp = newExp;
        
        // Level up logic
        while (remainingExp >= skill.expRequired && newLevel < skill.maxLevel) {
          remainingExp -= skill.expRequired;
          newLevel += 1;
          
          if (newLevel === 1) {
            toast.success(`🎉 Skill Unlocked: ${skill.name}!`);
            // Add to global learned skills
            learnSkill({
              skillId: skill.id,
              name: skill.name,
              level: 1,
              experience: 0,
              category: skill.category === 'agronomist' ? 'soil' : 
                        skill.category === 'irrigation' ? 'water' :
                        skill.category === 'eco' ? 'sustainability' : 'tech',
              learnedAt: Date.now()
            });
          } else {
            toast.success(`📈 ${skill.name} leveled up to ${newLevel}!`);
            upgradeSkill(skillId, exp);
          }
        }
        
        return {
          ...skill,
          currentLevel: newLevel,
          currentExp: remainingExp,
          unlocked: true
        };
      }
      return skill;
    }));
    
    // Award XP to player
    upgradeSkill(skillId, exp);
  };

  const handleStartModule = (module: LearningModule) => {
    if (!module.isUnlocked) {
      toast.error('Complete prerequisites first!');
      return;
    }
    setSelectedModule(module);
    setCurrentStep(0);
    setEarnedPoints(0);
    setShowFeedback(null);
  };

  const handleOptionSelect = (option: any) => {
    setShowFeedback(option.feedback);
    setEarnedPoints(prev => prev + option.points);
    
    // Add skill experience if applicable
    if (option.skillExp) {
      option.skillExp.forEach(({ skillId, exp }: { skillId: string; exp: number }) => {
        addSkillExp(skillId, exp);
      });
    }
    
    if (option.correct) {
      toast.success(`+${option.points} XP - ${option.feedback}`);
    } else {
      toast.info(option.feedback);
    }
  };

  const handleNextStep = () => {
    if (!selectedModule) return;
    
    if (currentStep < selectedModule.dialogue.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowFeedback(null);
    } else {
      // Module completed
      const finalXP = selectedModule.xpReward + earnedPoints;
      const finalEcoPoints = selectedModule.ecoPointsReward + Math.floor(earnedPoints / 2);
      
      // Award XP to player (this also handles level ups)
      addXP(finalXP, `Completed ${selectedModule.title}`);
      
      updateResources({ 
        ecoPoints: gameState.resources.ecoPoints + finalEcoPoints 
      });
      
      // Award skill experience
      selectedModule.skillRewards.forEach(({ skillId, exp }) => {
        addSkillExp(skillId, exp);
      });
      
      // Mark module as completed and unlock next modules
      setModulesData(prev => prev.map(mod => {
        if (mod.id === selectedModule.id) {
          return { ...mod, completed: true };
        }
        // Check if this module was a prerequisite for others
        if (mod.prerequisites.includes(selectedModule.id)) {
          const allPrereqsComplete = mod.prerequisites.every(prereqId => 
            prev.find(m => m.id === prereqId)?.completed || prereqId === selectedModule.id
          );
          if (allPrereqsComplete) {
            return { ...mod, isUnlocked: true };
          }
        }
        return mod;
      }));
      
      // Check for achievements
      checkAchievements(selectedModule);
      
      toast.success(`🎓 Module completed! +${finalXP} XP, +${finalEcoPoints} Eco Points!`, {
        description: 'Use XP to buy tools and upgrade your farm!'
      });
      
      setSelectedModule(null);
      setCurrentStep(0);
    }
  };

  const checkAchievements = (completedModule: LearningModule) => {
    setAchievementsData(prev => prev.map(achievement => {
      if (achievement.unlocked) return achievement;
      
      if (achievement.id === 'first-module') {
        toast.success(`🏆 Achievement Unlocked: ${achievement.title}`);
        return { ...achievement, unlocked: true, unlockedAt: new Date() };
      }
      
      return achievement;
    }));
  };

  const currentDialogue = selectedModule?.dialogue[currentStep];
  const progress = selectedModule ? ((currentStep + 1) / selectedModule.dialogue.length) * 100 : 0;

  const getSkillCategoryColor = (category: string) => {
    switch (category) {
      case 'agronomist': return '#73C783';
      case 'irrigation': return '#4ECDC4';
      case 'eco': return '#6EE7B7';
      case 'tech': return '#8B5CF6';
      default: return '#E5E7EB';
    }
  };

  const renderModuleContent = () => {
    if (selectedModule && currentDialogue) {
      return (
        <div className="h-full w-full relative overflow-hidden">
          {/* Background with animated particles */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 via-[#1E1B4B]/80 to-[#0F172A]/90" />
          
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#6EE7B7]/30 rounded-full"
                animate={{
                  x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                  y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
              />
            ))}
          </div>

          {/* Header */}
          <div className="relative z-10 p-6 flex justify-between items-center border-b border-[#6EE7B7]/20">
            <Button
              onClick={() => setSelectedModule(null)}
              variant="ghost"
              className="text-[#E5E7EB] hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Modules
            </Button>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-[#73C783]/20 text-[#73C783] border-[#73C783]/40">
                {selectedModule.title}
              </Badge>
              <Badge className="bg-[#FFD369]/20 text-[#FFD369] border-[#FFD369]/40">
                Score: {earnedPoints}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative z-10 px-6 py-4">
            <div className="flex justify-between text-sm text-[#E5E7EB]/70 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1 p-6 flex items-center justify-center">
            <Card className="w-full max-w-4xl p-8 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
              {/* Character Display */}
              <div className="flex items-start gap-6 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6EE7B7] to-[#73C783] flex items-center justify-center text-4xl"
                >
                  {currentDialogue.characterImage}
                </motion.div>
                
                <div className="flex-1">
                  <h3 className="text-[#6EE7B7] text-xl mb-2">{currentDialogue.character}</h3>
                  <div className="bg-[#E5E7EB]/10 rounded-lg p-4">
                    <p className="text-[#E5E7EB] leading-relaxed">{currentDialogue.text}</p>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6"
                  >
                    <Card className="p-4 bg-[#73C783]/20 border-[#73C783]/40">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-[#FFD369]" />
                        <p className="text-[#E5E7EB]">{showFeedback}</p>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Options or Info */}
              {currentDialogue.options && !showFeedback ? (
                <div className="space-y-3">
                  <h4 className="text-[#FFD369] mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Choose your answer:
                  </h4>
                  {currentDialogue.options.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        onClick={() => handleOptionSelect(option)}
                        className="w-full text-left justify-start h-auto p-4 bg-[#E5E7EB]/10 hover:bg-[#6EE7B7]/20 text-[#E5E7EB] border border-[#E5E7EB]/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#6EE7B7]/20 flex items-center justify-center text-sm">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option.text}</span>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : currentDialogue.info ? (
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FFD369] to-[#FF8C42] flex items-center justify-center"
                  >
                    <Trophy className="w-8 h-8 text-white" />
                  </motion.div>
                  <p className="text-[#6EE7B7] mb-6">{currentDialogue.info}</p>
                  <Button
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-[#73C783] to-[#6EE7B7] text-black hover:from-[#6EE7B7] hover:to-[#73C783]"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Complete Module
                  </Button>
                </div>
              ) : showFeedback ? (
                <div className="text-center">
                  <Button
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-[#6EE7B7] to-[#73C783] text-black hover:from-[#73C783] hover:to-[#6EE7B7]"
                  >
                    Continue Learning
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : null}
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulesData.map((module) => {
          const isCompleted = module.completed;
          const isLocked = !module.isUnlocked;
          
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: isLocked ? 1 : 1.02 }}
              whileTap={{ scale: isLocked ? 1 : 0.98 }}
            >
              <Card className={`p-6 backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
                isLocked 
                  ? 'bg-black/20 border-gray-600/30 cursor-not-allowed' :
                isCompleted 
                  ? 'bg-[#73C783]/10 border-[#73C783]/50' 
                  : 'bg-black/40 border-[#6EE7B7]/30 hover:border-[#6EE7B7]/50'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      module.category === 'climate' ? 'bg-blue-500/20 text-blue-400' :
                      module.category === 'soil' ? 'bg-amber-500/20 text-amber-400' :
                      module.category === 'water' ? 'bg-cyan-500/20 text-cyan-400' :
                      module.category === 'technology' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {module.category === 'climate' ? '🌡️' :
                       module.category === 'soil' ? '🌱' :
                       module.category === 'water' ? '💧' :
                       module.category === 'technology' ? '🤖' : '🌿'}
                    </div>
                    <div>
                      <h3 className={`text-lg ${isLocked ? 'text-gray-500' : 'text-[#E5E7EB]'}`}>
                        {module.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${
                          module.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                          module.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {module.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-[#E5E7EB]/70">
                          <Clock className="w-3 h-3" />
                          {module.estimatedTime}m
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isLocked ? (
                    <Lock className="w-6 h-6 text-gray-500" />
                  ) : isCompleted ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="w-6 h-6 text-[#73C783]" />
                    </motion.div>
                  ) : null}
                </div>

                <p className={`text-sm mb-4 ${isLocked ? 'text-gray-500' : 'text-[#E5E7EB]/80'}`}>
                  {module.description}
                </p>

                {module.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-[#FFD369] mb-1">Prerequisites:</p>
                    <div className="flex flex-wrap gap-1">
                      {module.prerequisites.map(prereqId => {
                        const prereq = modulesData.find(m => m.id === prereqId);
                        return (
                          <Badge key={prereqId} variant="outline" className="text-xs">
                            {prereq?.title}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-[#FFD369]" />
                      <span className="text-[#FFD369]">{module.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-[#6EE7B7]" />
                      <span className="text-[#6EE7B7]">{module.ecoPointsReward} Eco</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStartModule(module)}
                    size="sm"
                    disabled={isLocked}
                    className={
                      isLocked
                        ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' :
                      isCompleted 
                        ? 'bg-[#73C783]/20 text-[#73C783] hover:bg-[#73C783]/30' 
                        : 'bg-gradient-to-r from-[#6EE7B7] to-[#73C783] text-black hover:from-[#73C783] hover:to-[#6EE7B7]'
                    }
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-4 h-4 mr-1" />
                        Locked
                      </>
                    ) : isCompleted ? (
                      <>
                        <Trophy className="w-4 h-4 mr-1" />
                        Review
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderSkillsContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {skillsData.map((skill) => {
        const categoryColor = getSkillCategoryColor(skill.category);
        const expProgress = skill.maxLevel > skill.currentLevel 
          ? (skill.currentExp / skill.expRequired) * 100 
          : 100;
        
        return (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={`p-6 backdrop-blur-sm border transition-all duration-300 ${
              skill.unlocked 
                ? 'bg-black/40 border-[#6EE7B7]/30 hover:border-[#6EE7B7]/50' 
                : 'bg-black/20 border-gray-600/30'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    skill.unlocked ? 'border-2' : 'bg-gray-800/20'
                  }`}
                  style={{ 
                    backgroundColor: skill.unlocked ? `${categoryColor}20` : undefined,
                    borderColor: skill.unlocked ? categoryColor : '#666'
                  }}
                >
                  <skill.icon 
                    className={`w-6 h-6 ${skill.unlocked ? 'text-[#E5E7EB]' : 'text-gray-500'}`}
                    style={{ color: skill.unlocked ? categoryColor : undefined }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg ${skill.unlocked ? 'text-[#E5E7EB]' : 'text-gray-500'}`}>
                    {skill.name}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ 
                      borderColor: categoryColor, 
                      color: skill.unlocked ? categoryColor : '#666'
                    }}
                  >
                    {skill.category}
                  </Badge>
                </div>
              </div>

              <p className={`text-sm mb-4 ${skill.unlocked ? 'text-[#E5E7EB]/80' : 'text-gray-500'}`}>
                {skill.description}
              </p>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#E5E7EB]/70">Level Progress</span>
                  <span className="text-sm" style={{ color: categoryColor }}>
                    {skill.currentLevel}/{skill.maxLevel}
                  </span>
                </div>
                <Progress value={(skill.currentLevel / skill.maxLevel) * 100} className="h-2 mb-2" />
                
                {skill.unlocked && skill.currentLevel < skill.maxLevel && (
                  <>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-[#E5E7EB]/60">Next Level</span>
                      <span className="text-xs text-[#FFD369]">
                        {skill.currentExp}/{skill.expRequired} XP
                      </span>
                    </div>
                    <Progress value={expProgress} className="h-1" />
                  </>
                )}
              </div>

              <div className="space-y-1">
                <h4 className="text-sm text-[#6EE7B7]">Effects</h4>
                {skill.effects.map(effect => (
                  <p key={effect} className="text-xs text-[#E5E7EB]/80">• {effect}</p>
                ))}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  const renderProgressContent = () => {
    const totalModules = modulesData.length;
    const completedModules = modulesData.filter(m => m.completed).length;
    const totalSkills = skillsData.length;
    const unlockedSkills = skillsData.filter(s => s.unlocked).length;
    const unlockedAchievements = achievementsData.filter(a => a.unlocked).length;

    return (
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#6EE7B7]/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#6EE7B7]" />
              </div>
              <div>
                <p className="text-2xl text-[#E5E7EB]">{completedModules}/{totalModules}</p>
                <p className="text-sm text-[#E5E7EB]/70">Modules Completed</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-black/40 border-[#73C783]/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#73C783]/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#73C783]" />
              </div>
              <div>
                <p className="text-2xl text-[#E5E7EB]">{unlockedSkills}/{totalSkills}</p>
                <p className="text-sm text-[#E5E7EB]/70">Skills Unlocked</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#FFD369]/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#FFD369]" />
              </div>
              <div>
                <p className="text-2xl text-[#E5E7EB]">{unlockedAchievements}</p>
                <p className="text-sm text-[#E5E7EB]/70">Achievements</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-black/40 border-[#FF6B6B]/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#FF6B6B]/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#FF6B6B]" />
              </div>
              <div>
                <p className="text-2xl text-[#E5E7EB]">7</p>
                <p className="text-sm text-[#E5E7EB]/70">Day Streak</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-xl text-[#E5E7EB] mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#FFD369]" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementsData.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`p-4 backdrop-blur-sm border transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-[#FFD369]/10 border-[#FFD369]/50' 
                    : 'bg-black/20 border-gray-600/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    achievement.unlocked 
                      ? 'bg-[#FFD369]/20 text-[#FFD369]' 
                      : 'bg-gray-800/20 text-gray-500'
                  }`}>
                    <achievement.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm ${achievement.unlocked ? 'text-[#E5E7EB]' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-xs ${achievement.unlocked ? 'text-[#E5E7EB]/70' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                    {achievement.unlockedAt && (
                      <p className="text-xs text-[#FFD369] mt-1">
                        Unlocked: {achievement.unlockedAt.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 via-[#1E1B4B]/80 to-[#0F172A]/90" />
        
        {/* Header */}
        <div className="relative z-10 p-6 flex justify-between items-center border-b border-[#6EE7B7]/20">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate('playerHub')}
              variant="ghost"
              className="text-[#E5E7EB] hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Hub
            </Button>
            
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <GraduationCap className="w-8 h-8 text-[#6EE7B7]" />
              </motion.div>
              <div>
                <h1 className="text-2xl text-[#E5E7EB]">Learning Hub</h1>
                <p className="text-sm text-[#6EE7B7]">Master sustainable farming through interactive education</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate('farmShop')}
              className="bg-gradient-to-r from-[#FFD369] to-[#FF8C42] text-black hover:from-[#FF8C42] hover:to-[#FFD369]"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Farm Shop ({gameState.resources.xp} XP)
            </Button>
            <Badge className="bg-[#73C783]/20 text-[#73C783] border-[#73C783]/40">
              🤖 AI Enhanced Learning
            </Badge>
            <Card className="px-3 py-2 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFD369]" />
                <span className="text-[#E5E7EB]">Level {gameState.playerLevel}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-[calc(100vh-80px)] overflow-auto">
          {selectedModule ? (
            renderModuleContent()
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <div className="px-6 py-4 border-b border-[#6EE7B7]/10">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-black/40 border border-[#6EE7B7]/30">
                  <TabsTrigger value="modules" className="data-[state=active]:bg-[#6EE7B7]/20">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Modules
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="data-[state=active]:bg-[#73C783]/20">
                    <Target className="w-4 h-4 mr-2" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="progress" className="data-[state=active]:bg-[#FFD369]/20">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Progress
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="modules" className="mt-0">
                  {renderModuleContent()}
                </TabsContent>
                
                <TabsContent value="skills" className="mt-0">
                  {renderSkillsContent()}
                </TabsContent>
                
                <TabsContent value="progress" className="mt-0">
                  {renderProgressContent()}
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
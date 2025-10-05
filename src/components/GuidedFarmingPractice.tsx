import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  ArrowLeft, 
  Sprout, 
  Droplets, 
  Zap, 
  Shovel,
  Eye,
  Package,
  Sun,
  MessageCircle,
  Sparkles,
  CheckCircle,
  BookOpen,
  Target,
  Award,
  ChevronRight
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface GuidedFarmingPracticeProps {
  onNavigate: (screen: string) => void;
}

interface FarmingStep {
  id: string;
  title: string;
  action: 'till' | 'plant' | 'water' | 'inspect' | 'harvest';
  companionDialogue: string;
  technique: string;
  tips: string[];
  xpReward: number;
  completed: boolean;
}

interface FarmingLesson {
  id: string;
  name: string;
  description: string;
  companionName: string;
  companionEmoji: string;
  category: 'basics' | 'water-management' | 'soil-health' | 'crop-rotation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: FarmingStep[];
  totalXP: number;
}

const farmingLessons: FarmingLesson[] = [
  {
    id: 'basic-planting',
    name: 'Basic Planting Techniques',
    description: 'Learn the fundamentals of sustainable crop planting',
    companionName: 'Clover',
    companionEmoji: '🐰',
    category: 'basics',
    difficulty: 'beginner',
    totalXP: 150,
    steps: [
      {
        id: 'till-1',
        title: 'Prepare the Soil',
        action: 'till',
        companionDialogue: "Hi there! I'm Clover, and I'll be guiding you today! 🐰 First, let's prepare the soil. Tilling breaks up compacted earth and allows roots to grow freely. Click on an empty plot with your shovel!",
        technique: 'Soil Tilling',
        tips: [
          'Till during dry weather for best results',
          'Avoid over-tilling which can damage soil structure',
          'Add compost after tilling for nutrients'
        ],
        xpReward: 30,
        completed: false
      },
      {
        id: 'plant-1',
        title: 'Plant Your First Crop',
        action: 'plant',
        companionDialogue: "Excellent tilling! 🌱 Now let's plant some seeds. Spacing is crucial - plants need room to grow without competing for nutrients. Select your seeds and plant them in the tilled plot!",
        technique: 'Seed Planting',
        tips: [
          'Plant seeds at the right depth (2-3 times seed width)',
          'Space plants according to their mature size',
          'Plant in rows for easier maintenance'
        ],
        xpReward: 40,
        completed: false
      },
      {
        id: 'water-1',
        title: 'Initial Watering',
        action: 'water',
        companionDialogue: "Great planting! 💧 Seeds need water to germinate. But be careful - too much water can drown seeds, while too little won't activate them. Let's give them just the right amount!",
        technique: 'Seed Germination Watering',
        tips: [
          'Water immediately after planting',
          'Keep soil consistently moist but not waterlogged',
          'Morning watering reduces disease risk'
        ],
        xpReward: 30,
        completed: false
      },
      {
        id: 'inspect-1',
        title: 'Monitor Growth',
        action: 'inspect',
        companionDialogue: "Perfect watering! 👁️ Regular monitoring helps you catch problems early. Use your scanner to check soil moisture, nutrient levels, and plant health. Knowledge is power in farming!",
        technique: 'Crop Monitoring',
        tips: [
          'Check plants daily for pests or disease',
          'Monitor soil moisture before watering',
          'Look for signs of nutrient deficiency'
        ],
        xpReward: 25,
        completed: false
      },
      {
        id: 'harvest-1',
        title: 'Harvest Your Crop',
        action: 'harvest',
        companionDialogue: "Your crop is ready! 🌾 Harvesting at the right time ensures maximum nutrition and flavor. Too early and you miss peak quality; too late and it might spoil. Let's harvest!",
        technique: 'Optimal Harvesting',
        tips: [
          'Harvest in the morning when it\'s cool',
          'Use clean, sharp tools to avoid damaging plants',
          'Handle produce gently to prevent bruising'
        ],
        xpReward: 25,
        completed: false
      }
    ]
  },
  {
    id: 'water-conservation',
    name: 'Water Conservation Methods',
    description: 'Master efficient irrigation and water-saving techniques',
    companionName: 'Aquarius',
    companionEmoji: '🐢',
    category: 'water-management',
    difficulty: 'intermediate',
    totalXP: 200,
    steps: [
      {
        id: 'inspect-soil',
        title: 'Check Soil Moisture',
        action: 'inspect',
        companionDialogue: "Hello, I'm Aquarius! 🐢 Water is precious. Before watering, always check if your plants actually need it. Over-watering wastes resources and harms roots. Let's check the moisture level!",
        technique: 'Moisture Assessment',
        tips: [
          'Stick your finger 2 inches into soil to test moisture',
          'Use a moisture meter for accuracy',
          'Different plants need different moisture levels'
        ],
        xpReward: 40,
        completed: false
      },
      {
        id: 'drip-water',
        title: 'Drip Irrigation Practice',
        action: 'water',
        companionDialogue: "The soil is dry! 💧 Instead of flooding the field, let's use targeted watering. Drip irrigation delivers water directly to roots, reducing waste by up to 50%. Water only the plants that need it!",
        technique: 'Drip Irrigation',
        tips: [
          'Water at the base of plants, not leaves',
          'Slow, deep watering is better than frequent shallow watering',
          'Water in early morning or evening to reduce evaporation'
        ],
        xpReward: 60,
        completed: false
      },
      {
        id: 'mulch-apply',
        title: 'Apply Mulch Layer',
        action: 'till',
        companionDialogue: "Now let's add mulch! 🌿 Mulch is like a blanket for soil - it reduces evaporation, keeps roots cool, and prevents weeds. This organic layer is a water-saver's best friend!",
        technique: 'Mulching',
        tips: [
          'Apply 2-4 inches of organic mulch around plants',
          'Keep mulch away from plant stems to prevent rot',
          'Replenish mulch as it decomposes'
        ],
        xpReward: 50,
        completed: false
      },
      {
        id: 'monitor-efficiency',
        title: 'Monitor Water Efficiency',
        action: 'inspect',
        companionDialogue: "Excellent work! 📊 Let's see how our water conservation methods are performing. Check the moisture retention and plant health. See how much water we've saved compared to traditional methods!",
        technique: 'Efficiency Monitoring',
        tips: [
          'Track water usage over time',
          'Compare plant health with water consumption',
          'Adjust techniques based on weather and season'
        ],
        xpReward: 50,
        completed: false
      }
    ]
  },
  {
    id: 'soil-enrichment',
    name: 'Soil Health & Enrichment',
    description: 'Learn how to build and maintain healthy, living soil',
    companionName: 'Fennec',
    companionEmoji: '🦊',
    category: 'soil-health',
    difficulty: 'intermediate',
    totalXP: 220,
    steps: [
      {
        id: 'test-soil',
        title: 'Test Soil Composition',
        action: 'inspect',
        companionDialogue: "Hey there! Fennec here! 🦊 Healthy crops start with healthy soil. Let's scan the soil to check pH levels, nutrients, and microbial activity. This data tells us what the soil needs!",
        technique: 'Soil Testing',
        tips: [
          'Test soil pH - most crops prefer 6.0-7.0',
          'Check for nitrogen, phosphorus, and potassium levels',
          'Look for signs of compaction or erosion'
        ],
        xpReward: 50,
        completed: false
      },
      {
        id: 'add-compost',
        title: 'Add Organic Matter',
        action: 'till',
        companionDialogue: "The soil needs nutrients! 🌱 Let's work in some compost. Organic matter feeds beneficial microorganisms, improves structure, and slowly releases nutrients. It's like a superfood for soil!",
        technique: 'Composting & Amendment',
        tips: [
          'Add 2-3 inches of compost annually',
          'Mix compost into top 6 inches of soil',
          'Use aged compost to avoid burning plants'
        ],
        xpReward: 60,
        completed: false
      },
      {
        id: 'plant-cover',
        title: 'Plant Cover Crops',
        action: 'plant',
        companionDialogue: "Now for a secret weapon - cover crops! 🌾 These plants protect soil from erosion, add nitrogen, and prevent weeds. When we till them in, they become green manure that enriches the earth!",
        technique: 'Cover Cropping',
        tips: [
          'Plant legumes to fix nitrogen',
          'Use cover crops during off-season',
          'Till cover crops before they go to seed'
        ],
        xpReward: 60,
        completed: false
      },
      {
        id: 'verify-health',
        title: 'Verify Soil Improvement',
        action: 'inspect',
        companionDialogue: "Let's check our work! 📈 Scan the soil again and compare it to our initial readings. You should see improved structure, higher organic matter, and more microbial life. That's sustainable farming!",
        technique: 'Soil Health Verification',
        tips: [
          'Track improvements over multiple seasons',
          'Look for earthworms - they indicate healthy soil',
          'Improved soil requires less fertilizer over time'
        ],
        xpReward: 50,
        completed: false
      }
    ]
  },
  {
    id: 'crop-rotation',
    name: 'Strategic Crop Rotation',
    description: 'Master the ancient technique of rotating crops for optimal yields',
    companionName: 'Corvus',
    companionEmoji: '🦅',
    category: 'crop-rotation',
    difficulty: 'advanced',
    totalXP: 250,
    steps: [
      {
        id: 'plan-rotation',
        title: 'Plan Rotation Strategy',
        action: 'inspect',
        companionDialogue: "Greetings, farmer! Corvus the wise here. 🦅 Crop rotation prevents soil depletion and breaks pest cycles. Let's analyze your field and plan which crops should follow your current harvest!",
        technique: 'Rotation Planning',
        tips: [
          'Never plant the same family in the same spot consecutively',
          'Rotate heavy feeders with light feeders',
          'Include nitrogen-fixing legumes in rotation'
        ],
        xpReward: 60,
        completed: false
      },
      {
        id: 'harvest-old',
        title: 'Clear Previous Crop',
        action: 'harvest',
        companionDialogue: "First, we harvest the current crop completely. 🌾 Don't leave old roots - they can harbor pests. But save healthy residue for composting! Every part of the plant has value.",
        technique: 'Field Clearing',
        tips: [
          'Remove all plant material to break disease cycles',
          'Compost healthy residue, burn diseased plants',
          'Clear fields promptly to maximize growing season'
        ],
        xpReward: 50,
        completed: false
      },
      {
        id: 'prep-rotation',
        title: 'Prepare for Next Crop',
        action: 'till',
        companionDialogue: "Now we prepare the soil for the next crop family. 🌱 If you just grew tomatoes (heavy feeders), let's prepare for legumes (nitrogen-fixers). This balances nutrient cycles naturally!",
        technique: 'Rotation Preparation',
        tips: [
          'After heavy feeders, plant nitrogen-fixers',
          'After root crops, plant leafy greens',
          'Add appropriate amendments for next crop'
        ],
        xpReward: 60,
        completed: false
      },
      {
        id: 'plant-rotation',
        title: 'Plant Rotated Crop',
        action: 'plant',
        companionDialogue: "Perfect soil! 🌿 Now plant the rotated crop. This new plant family will use different nutrients and attract different beneficial insects. You're creating a balanced ecosystem!",
        technique: 'Rotation Planting',
        tips: [
          'Follow a 3-4 year rotation cycle',
          'Keep records of what was planted where',
          'Group crops by family for easier rotation'
        ],
        xpReward: 50,
        completed: false
      },
      {
        id: 'monitor-rotation',
        title: 'Monitor Rotation Benefits',
        action: 'inspect',
        companionDialogue: "Excellent rotation! 📊 Monitor how this crop performs compared to the last. You should see reduced pest pressure, better growth, and healthier soil. That's the power of rotation!",
        technique: 'Rotation Monitoring',
        tips: [
          'Track pest and disease levels over rotations',
          'Note yield differences between rotations',
          'Adjust rotation plan based on results'
        ],
        xpReward: 30,
        completed: false
      }
    ]
  }
];

export function GuidedFarmingPractice({ onNavigate }: GuidedFarmingPracticeProps) {
  const { gameState, getCurrentShard, getCropsForCurrentShard, addXP, plantCrop, waterPlot, harvestCrop } = useGame();
  const [selectedLesson, setSelectedLesson] = useState<FarmingLesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState<'shovel' | 'seeds' | 'water' | 'scanner'>('shovel');
  const [selectedPlotIndex, setSelectedPlotIndex] = useState<number | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [tilledPlots, setTilledPlots] = useState<number[]>([]);

  const currentShard = getCurrentShard();
  const currentCrops = getCropsForCurrentShard();

  const currentStep = selectedLesson ? selectedLesson.steps[currentStepIndex] : null;
  const lessonProgress = selectedLesson 
    ? (completedSteps.length / selectedLesson.steps.length) * 100 
    : 0;

  // Map action to tool
  const getToolForAction = (action: string): 'shovel' | 'seeds' | 'water' | 'scanner' => {
    switch (action) {
      case 'till':
        return 'shovel';
      case 'plant':
        return 'seeds';
      case 'water':
        return 'water';
      case 'inspect':
      case 'harvest':
        return 'scanner';
      default:
        return 'shovel';
    }
  };

  useEffect(() => {
    if (currentStep) {
      setSelectedTool(getToolForAction(currentStep.action));
    }
  }, [currentStep]);

  const handleStartLesson = (lesson: FarmingLesson) => {
    setSelectedLesson(lesson);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setSelectedPlotIndex(null);
    setTilledPlots([]);
    toast.success(`🎓 Starting: ${lesson.name}`, {
      description: `${lesson.companionName} will guide you!`
    });
  };

  const handlePlotAction = (plotIndex: number) => {
    if (!currentStep) return;

    const crop = currentCrops.find(c => c.plotIndex === plotIndex);

    // Perform the action based on current step
    switch (currentStep.action) {
      case 'till':
        if (!tilledPlots.includes(plotIndex)) {
          setTilledPlots([...tilledPlots, plotIndex]);
          toast.success(`✅ ${currentStep.technique} completed!`);
          handleStepComplete();
        }
        break;
      
      case 'plant':
        if (tilledPlots.includes(plotIndex) && !crop) {
          if (gameState.resources.seeds >= 1) {
            plantCrop(plotIndex, 'basic-crop');
            toast.success(`✅ ${currentStep.technique} completed!`);
            handleStepComplete();
          } else {
            toast.error('Not enough seeds!');
          }
        } else if (!tilledPlots.includes(plotIndex)) {
          toast.info('Till the plot first!');
        }
        break;
      
      case 'water':
        if (crop && crop.growth < 100) {
          if (gameState.resources.water >= 5) {
            waterPlot(plotIndex);
            toast.success(`✅ ${currentStep.technique} completed!`);
            handleStepComplete();
          } else {
            toast.error('Not enough water!');
          }
        } else {
          toast.info('No crop to water here!');
        }
        break;
      
      case 'inspect':
        if (crop) {
          toast.info(`Growth: ${Math.round(crop.growth)}% | Water: ${Math.round(crop.waterLevel)}% | Health: ${Math.round(crop.health)}%`);
        } else {
          toast.info('Empty plot - ready for planting');
        }
        toast.success(`✅ ${currentStep.technique} completed!`);
        setTimeout(() => handleStepComplete(), 1000);
        break;
      
      case 'harvest':
        if (crop && crop.growth >= 100) {
          harvestCrop(crop.id);
          toast.success(`✅ ${currentStep.technique} completed!`);
          handleStepComplete();
        } else if (crop) {
          toast.info(`Crop is only ${Math.round(crop.growth)}% grown. Wait a bit longer!`);
        } else {
          toast.info('No crop to harvest here!');
        }
        break;
    }
  };

  const handleStepComplete = () => {
    if (!currentStep || !selectedLesson) return;

    // Mark step as completed
    setCompletedSteps([...completedSteps, currentStep.id]);
    
    // Add XP reward
    addXP(currentStep.xpReward, `farming-lesson-${currentStep.id}`);
    
    // Move to next step or complete lesson
    if (currentStepIndex < selectedLesson.steps.length - 1) {
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        setShowTips(false);
      }, 1500);
    } else {
      // Lesson complete!
      setTimeout(() => {
        toast.success(`🏆 Lesson Complete: ${selectedLesson.name}!`, {
          description: `Total XP earned: ${selectedLesson.totalXP + completedSteps.length * 10}`
        });
        addXP(selectedLesson.totalXP, `lesson-${selectedLesson.id}`);
        setSelectedLesson(null);
      }, 1500);
    }
  };

  const getCropAtPlot = (plotIndex: number) => {
    return currentCrops.find(c => c.plotIndex === plotIndex);
  };

  const getPlotColor = (plotIndex: number) => {
    const crop = getCropAtPlot(plotIndex);
    
    if (crop) {
      if (crop.growth >= 100) return 'bg-[#FFD369]/30 border-[#FFD369]/60';
      if (crop.waterLevel < 20) return 'bg-[#FF6B6B]/20 border-[#FF6B6B]/40';
      return 'bg-[#73C783]/20 border-[#73C783]/40';
    }
    
    if (tilledPlots.includes(plotIndex)) {
      return 'bg-[#8B5A3C]/20 border-[#8B5A3C]/40';
    }
    
    return 'bg-black/30 border-white/10';
  };

  // Lesson selection view
  if (!selectedLesson) {
    return (
      <TooltipProvider>
        <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
          {/* Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/80 to-black/70" />

          {/* Header */}
          <div className="relative z-10 p-6 flex justify-between items-center border-b border-[#6EE7B7]/20">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => onNavigate('farmingGameplay')}
                variant="ghost"
                className="text-[#E5E7EB] hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Farm
              </Button>
              
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#6EE7B7]" />
                <div>
                  <h1 className="text-2xl text-white">Guided Farming Practice</h1>
                  <p className="text-sm text-[#6EE7B7]">Learn techniques from your companions</p>
                </div>
              </div>
            </div>
            
            <Badge className="bg-[#73C783] text-black">
              {gameState.selectedPet ? `${gameState.selectedPet.emoji} ${gameState.selectedPet.name}` : 'Select a companion!'}
            </Badge>
          </div>

          {/* Lessons Grid */}
          <div className="relative z-10 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
            {farmingLessons.map((lesson, index) => {
              const isLocked = lesson.difficulty === 'advanced' && gameState.playerLevel < 3;
              
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`p-6 backdrop-blur-sm transition-all duration-300 ${
                    isLocked 
                      ? 'bg-black/60 border-white/10 opacity-50' 
                      : 'bg-black/40 border-[#6EE7B7]/30 hover:border-[#6EE7B7]/60 cursor-pointer'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-4xl"
                        >
                          {lesson.companionEmoji}
                        </motion.div>
                        <div>
                          <h3 className="text-xl text-[#E5E7EB] mb-1">{lesson.name}</h3>
                          <p className="text-sm text-[#6EE7B7]">with {lesson.companionName}</p>
                        </div>
                      </div>
                      
                      <Badge className={`
                        ${lesson.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                          lesson.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'}
                      `}>
                        {lesson.difficulty}
                      </Badge>
                    </div>

                    <p className="text-[#E5E7EB]/80 text-sm mb-4">{lesson.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#E5E7EB]/70">Steps:</span>
                        <span className="text-[#6EE7B7]">{lesson.steps.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#E5E7EB]/70">Total XP:</span>
                        <span className="text-[#FFD369]">{lesson.totalXP}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#E5E7EB]/70">Category:</span>
                        <Badge className="bg-[#73C783]/20 text-[#73C783] text-xs">
                          {lesson.category.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      onClick={() => !isLocked && handleStartLesson(lesson)}
                      disabled={isLocked}
                      className={`w-full ${
                        isLocked
                          ? 'bg-white/10 text-white/50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#73C783] to-[#6EE7B7] text-black hover:from-[#6EE7B7] hover:to-[#73C783]'
                      }`}
                    >
                      {isLocked ? (
                        <>🔒 Requires Level 3</>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Start Lesson
                        </>
                      )}
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </TooltipProvider>
    );
  }

  // Active lesson view
  return (
    <TooltipProvider>
      <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
        {/* Background */}
        <div 
          className="fixed inset-0 bg-cover bg-center -z-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/70 to-black/60" />

        {/* Header */}
        <div className="relative z-10 p-4 flex justify-between items-center">
          <Button
            onClick={() => {
              setSelectedLesson(null);
              setCompletedSteps([]);
            }}
            variant="ghost"
            className="text-[#E5E7EB] hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Lesson
          </Button>

          <div className="flex items-center gap-4">
            <Badge className="bg-[#6EE7B7]/20 text-[#6EE7B7] border-[#6EE7B7]/40">
              Step {currentStepIndex + 1} of {selectedLesson.steps.length}
            </Badge>
            <Badge className="bg-[#FFD369]/20 text-[#FFD369] border-[#FFD369]/40">
              XP: {completedSteps.length * currentStep!.xpReward} / {selectedLesson.totalXP}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 px-4 pb-2">
          <Progress value={lessonProgress} className="h-2" />
        </div>

        <div className="relative z-10 flex h-[calc(100vh-120px)]">
          {/* Left Panel - Companion Guidance */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-96 p-4 space-y-4 overflow-y-auto"
          >
            {/* Companion Card */}
            <Card className="p-6 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ 
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl"
                >
                  {selectedLesson.companionEmoji}
                </motion.div>
                <div>
                  <h3 className="text-xl text-[#6EE7B7]">{selectedLesson.companionName}</h3>
                  <p className="text-sm text-[#E5E7EB]/70">Your Farming Guide</p>
                </div>
              </div>

              <div className="bg-[#E5E7EB]/10 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-5 h-5 text-[#6EE7B7] flex-shrink-0 mt-1" />
                  <p className="text-[#E5E7EB] leading-relaxed">
                    {currentStep!.companionDialogue}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm text-[#FFD369]">Current Technique:</h4>
                  <Badge className="bg-[#73C783]/20 text-[#73C783]">
                    {currentStep!.technique}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm text-[#FFD369]">Required Action:</h4>
                  <Badge className="bg-[#FFD369]/20 text-[#FFD369]">
                    {currentStep!.action.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm text-[#FFD369]">XP Reward:</h4>
                  <span className="text-[#6EE7B7]">+{currentStep!.xpReward} XP</span>
                </div>
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
              <Button
                onClick={() => setShowTips(!showTips)}
                variant="ghost"
                className="w-full justify-between p-0 hover:bg-transparent"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFD369]" />
                  <h4 className="text-[#FFD369]">Professional Tips</h4>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${showTips ? 'rotate-90' : ''}`} />
              </Button>
              
              <AnimatePresence>
                {showTips && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 space-y-2"
                  >
                    {currentStep!.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#73C783] flex-shrink-0 mt-0.5" />
                        <p className="text-[#E5E7EB]/80">{tip}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Progress Summary */}
            <Card className="p-4 bg-black/40 border-[#73C783]/30 backdrop-blur-sm">
              <h4 className="text-[#73C783] mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Lesson Progress
              </h4>
              <div className="space-y-2">
                {selectedLesson.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2">
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="w-4 h-4 text-[#73C783]" />
                    ) : index === currentStepIndex ? (
                      <Target className="w-4 h-4 text-[#FFD369] animate-pulse" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-white/20" />
                    )}
                    <span className={`text-sm ${
                      completedSteps.includes(step.id) ? 'text-[#73C783]' :
                      index === currentStepIndex ? 'text-[#FFD369]' :
                      'text-[#E5E7EB]/50'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Main Farm View */}
          <div className="flex-1 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-full rounded-2xl bg-black/20 backdrop-blur-sm border border-[#73C783]/20 relative overflow-hidden"
            >
              {/* Farm Grid */}
              <div className="absolute inset-4 grid grid-cols-6 grid-rows-4 gap-3">
                {Array.from({ length: 24 }).map((_, index) => {
                  const crop = getCropAtPlot(index);
                  const isHighlighted = selectedPlotIndex === index;
                  
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <motion.div
                          className={`rounded-lg border-2 cursor-pointer transition-all duration-300 w-full h-full ${getPlotColor(index)} relative ${
                            isHighlighted ? 'ring-4 ring-[#FFD369] scale-105' : 'hover:scale-105'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => {
                            setSelectedPlotIndex(index);
                            handlePlotAction(index);
                          }}
                          onHoverStart={() => setSelectedPlotIndex(index)}
                        >
                          {/* Crop display */}
                          {crop && (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <motion.div
                                className="text-2xl"
                                animate={{
                                  scale: crop.growth >= 100 ? [1, 1.1, 1] : 1,
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: crop.growth >= 100 ? Infinity : 0
                                }}
                              >
                                {crop.emoji}
                              </motion.div>
                              {crop.growth < 100 && (
                                <div className="absolute bottom-1 left-1 right-1">
                                  <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-[#73C783] transition-all duration-300"
                                      style={{ width: `${crop.growth}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {crop ? (
                          <div>
                            <p>{crop.name}</p>
                            <p className="text-xs">Growth: {Math.round(crop.growth)}%</p>
                          </div>
                        ) : tilledPlots.includes(index) ? (
                          <p>Tilled plot - ready for planting</p>
                        ) : (
                          <p>Empty plot - till first</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              {/* Current Tool Indicator */}
              <div className="absolute bottom-4 left-4">
                <Card className="p-3 bg-black/60 border-[#73C783]/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    {selectedTool === 'shovel' && <Shovel className="w-5 h-5 text-[#8B5A3C]" />}
                    {selectedTool === 'seeds' && <Package className="w-5 h-5 text-[#73C783]" />}
                    {selectedTool === 'water' && <Droplets className="w-5 h-5 text-[#4ECDC4]" />}
                    {selectedTool === 'scanner' && <Eye className="w-5 h-5 text-[#FFD369]" />}
                    <span className="text-[#E5E7EB] text-sm">
                      {currentStep!.action.charAt(0).toUpperCase() + currentStep!.action.slice(1)} Mode
                    </span>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

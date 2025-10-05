import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft,
  BookOpen,
  Lightbulb,
  CheckCircle,
  XCircle,
  Star,
  Trophy,
  Sparkles,
  Brain,
  Target,
  Award,
  MessageCircle,
  ChevronRight,
  Clock,
  Zap
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface DialogueLearningProps {
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
  }[];
  info?: string;
  nextStep?: string;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: 'climate' | 'crops' | 'soil' | 'water' | 'sustainability';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  xpReward: number;
  ecoPointsReward: number;
  dialogue: DialogueStep[];
  completed: boolean;
}

export function DialogueLearning({ onNavigate }: DialogueLearningProps) {
  const { gameState, updateResources } = useGame();
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

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
      completed: false,
      dialogue: [
        {
          id: 'intro',
          character: 'Dr. Terra',
          characterImage: '🌍',
          text: "Welcome to our climate science lesson! I'm Dr. Terra, your climate education specialist. Today we'll explore how climate change affects farming. Are you ready to learn?",
          options: [
            { id: 'ready', text: "I'm ready to learn!", correct: true, feedback: "Great enthusiasm! Let's dive in.", points: 5 },
            { id: 'maybe', text: "I'm not sure...", correct: false, feedback: "That's okay! Learning is a journey. Let's start simple.", points: 2 }
          ],
          nextStep: 'greenhouse-effect'
        },
        {
          id: 'greenhouse-effect',
          character: 'Dr. Terra',
          characterImage: '🌡️',
          text: "Climate change is primarily caused by the greenhouse effect. When we burn fossil fuels, we release gases like CO2 that trap heat in our atmosphere. What do you think this means for farmers?",
          options: [
            { id: 'temperature', text: "Higher temperatures affect crop growth", correct: true, feedback: "Exactly! Temperature changes can stress plants and alter growing seasons.", points: 10 },
            { id: 'nothing', text: "It doesn't affect farming much", correct: false, feedback: "Actually, climate change significantly impacts agriculture. Let me explain...", points: 0 },
            { id: 'rainfall', text: "It changes rainfall patterns", correct: true, feedback: "Correct! Irregular rainfall can cause droughts or floods.", points: 10 }
          ],
          nextStep: 'adaptation'
        },
        {
          id: 'adaptation',
          character: 'Dr. Terra',
          characterImage: '🌱',
          text: "Farmers need to adapt to these changes. One effective strategy is crop diversification - growing different types of plants. Why do you think this helps?",
          options: [
            { id: 'risk', text: "It reduces risk if one crop fails", correct: true, feedback: "Perfect! Diversification is like not putting all your eggs in one basket.", points: 15 },
            { id: 'soil', text: "Different crops improve soil health", correct: true, feedback: "Yes! Different crops contribute various nutrients to the soil.", points: 15 },
            { id: 'expensive', text: "It's just more expensive", correct: false, feedback: "Initially it might cost more, but it saves money long-term by reducing risks.", points: 0 }
          ],
          nextStep: 'conclusion'
        },
        {
          id: 'conclusion',
          character: 'Dr. Terra',
          characterImage: '🏆',
          text: "Excellent work! You've learned that climate change affects farming through temperature and rainfall changes, and that farmers can adapt through strategies like crop diversification. You're now better equipped to help heal our planet!",
          info: "Module completed! You've gained valuable knowledge about climate-adaptive farming."
        }
      ]
    },
    {
      id: 'soil-health',
      title: 'Soil Health & Nutrition',
      description: 'Discover the secrets of healthy soil and sustainable farming practices',
      category: 'soil',
      difficulty: 'intermediate',
      estimatedTime: 7,
      xpReward: 75,
      ecoPointsReward: 35,
      completed: false,
      dialogue: [
        {
          id: 'intro',
          character: 'Prof. Root',
          characterImage: '🪱',
          text: "Hello, future soil expert! I'm Professor Root. Did you know that a handful of healthy soil contains more living organisms than there are people on Earth? Let's explore this amazing underground world!",
          options: [
            { id: 'amazing', text: "That's incredible!", correct: true, feedback: "Right? Soil is one of nature's most complex ecosystems!", points: 5 },
            { id: 'doubt', text: "That sounds impossible", correct: false, feedback: "I understand the skepticism, but it's true! Soil is incredibly biodiverse.", points: 2 }
          ],
          nextStep: 'soil-components'
        },
        {
          id: 'soil-components',
          character: 'Prof. Root',
          characterImage: '🔬',
          text: "Healthy soil has three key components: organic matter (like decomposed plants), minerals (from weathered rocks), and living organisms (bacteria, fungi, worms). Which do you think is most important for plant growth?",
          options: [
            { id: 'organic', text: "Organic matter provides nutrients", correct: true, feedback: "Excellent! Organic matter feeds plants and improves soil structure.", points: 10 },
            { id: 'minerals', text: "Minerals give essential elements", correct: true, feedback: "Correct! Minerals provide crucial elements like nitrogen and phosphorus.", points: 10 },
            { id: 'organisms', text: "Living organisms cycle nutrients", correct: true, feedback: "Yes! Organisms break down matter and make nutrients available to plants.", points: 10 }
          ],
          nextStep: 'soil-problems'
        },
        {
          id: 'soil-problems',
          character: 'Prof. Root',
          characterImage: '⚠️',
          text: "Unfortunately, many farming practices damage soil health. Overuse of chemical fertilizers can kill beneficial microorganisms. What's a sustainable alternative?",
          options: [
            { id: 'compost', text: "Use compost and organic fertilizers", correct: true, feedback: "Perfect! Compost feeds soil organisms and improves structure.", points: 15 },
            { id: 'more-chemicals', text: "Use stronger chemicals", correct: false, feedback: "That would make the problem worse by killing more beneficial organisms.", points: 0 },
            { id: 'crop-rotation', text: "Practice crop rotation", correct: true, feedback: "Excellent! Different crops contribute different nutrients and break pest cycles.", points: 15 }
          ],
          nextStep: 'conclusion'
        },
        {
          id: 'conclusion',
          character: 'Prof. Root',
          characterImage: '🌿',
          text: "Outstanding! You now understand that healthy soil is a living ecosystem that needs organic matter, minerals, and organisms. By using compost and crop rotation, you can maintain soil health for generations!",
          info: "Soil mastery achieved! Your farming will now be more sustainable and productive."
        }
      ]
    },
    {
      id: 'water-management',
      title: 'Smart Water Management',
      description: 'Learn efficient irrigation and water conservation techniques',
      category: 'water',
      difficulty: 'intermediate',
      estimatedTime: 6,
      xpReward: 60,
      ecoPointsReward: 30,
      completed: false,
      dialogue: [
        {
          id: 'intro',
          character: 'Aqua',
          characterImage: '💧',
          text: "Greetings, water steward! I'm Aqua, your water management guide. Water is life, but it's becoming scarce. Let's learn how to use every drop wisely!",
          options: [
            { id: 'important', text: "Water conservation is crucial", correct: true, feedback: "Absolutely! Smart water use protects our future.", points: 5 },
            { id: 'abundant', text: "Water is abundant where I live", correct: false, feedback: "Even in water-rich areas, conservation helps ecosystems and saves energy.", points: 2 }
          ],
          nextStep: 'irrigation-types'
        },
        {
          id: 'irrigation-types',
          character: 'Aqua',
          characterImage: '🚿',
          text: "There are different irrigation methods. Flood irrigation covers entire fields, while drip irrigation delivers water directly to plant roots. Which do you think is more efficient?",
          options: [
            { id: 'flood', text: "Flood irrigation waters everything", correct: false, feedback: "Flood irrigation wastes water through evaporation and runoff.", points: 0 },
            { id: 'drip', text: "Drip irrigation is more precise", correct: true, feedback: "Correct! Drip irrigation can save 30-50% more water than flood irrigation.", points: 15 },
            { id: 'both', text: "Both have their uses", correct: true, feedback: "True! The best method depends on crops, climate, and resources.", points: 10 }
          ],
          nextStep: 'water-conservation'
        },
        {
          id: 'water-conservation',
          character: 'Aqua',
          characterImage: '🌧️',
          text: "Beyond irrigation, we can collect rainwater and use mulch to reduce evaporation. What's the main benefit of mulching?",
          options: [
            { id: 'evaporation', text: "It reduces water evaporation", correct: true, feedback: "Exactly! Mulch acts like a blanket, keeping soil moist longer.", points: 15 },
            { id: 'weeds', text: "It prevents weed growth", correct: true, feedback: "Yes! Fewer weeds mean less competition for water.", points: 10 },
            { id: 'decoration', text: "It makes the garden look nice", correct: false, feedback: "While it can look nice, the main benefit is water and soil conservation.", points: 2 }
          ],
          nextStep: 'conclusion'
        },
        {
          id: 'conclusion',
          character: 'Aqua',
          characterImage: '🏆',
          text: "Wonderful! You've mastered water-smart farming! Remember: drip irrigation, rainwater collection, and mulching are your tools for water conservation. Every drop counts!",
          info: "Water wisdom unlocked! Your crops will thrive even in dry conditions."
        }
      ]
    }
  ];

  const handleStartModule = (module: LearningModule) => {
    setSelectedModule(module);
    setCurrentStep(0);
    setEarnedPoints(0);
    setTotalScore(0);
    setShowFeedback(null);
  };

  const handleOptionSelect = (option: any) => {
    setShowFeedback(option.feedback);
    setEarnedPoints(prev => prev + option.points);
    setTotalScore(prev => prev + option.points);
    
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
      
      updateResources({ 
        ecoPoints: gameState.resources.ecoPoints + finalEcoPoints 
      });
      
      toast.success(`🎓 Module completed! +${finalXP} XP, +${finalEcoPoints} Eco Points!`);
      
      // Mark module as completed
      setModuleProgress(prev => ({
        ...prev,
        [selectedModule.id]: 100
      }));
      
      setSelectedModule(null);
      setCurrentStep(0);
    }
  };

  const currentDialogue = selectedModule?.dialogue[currentStep];
  const progress = selectedModule ? ((currentStep + 1) / selectedModule.dialogue.length) * 100 : 0;

  if (selectedModule && currentDialogue) {
    return (
      <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 via-[#1E1B4B]/80 to-[#0F172A]/90" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
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
              Score: {totalScore}
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
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1E3A8A]/90 via-[#1E1B4B]/80 to-[#0F172A]/90 -z-10" />
      
      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center border-b border-[#6EE7B7]/20">
        <Button
          onClick={() => onNavigate('playerHub')}
          variant="ghost"
          className="text-[#E5E7EB] hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hub
        </Button>
        
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <BookOpen className="w-6 h-6 text-[#6EE7B7]" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl text-white">Interactive Learning</h1>
            <p className="text-sm text-[#6EE7B7]">Dialogue-Based Education</p>
          </div>
        </div>

        <Badge className="bg-[#73C783]/20 text-[#73C783] border-[#73C783]/40">
          🤖 AI Enhanced
        </Badge>
      </div>

      {/* Module Selection */}
      <div className="relative z-10 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningModules.map((module) => {
          const progress = moduleProgress[module.id] || 0;
          const isCompleted = progress >= 100;
          
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`p-6 bg-black/40 backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
                isCompleted 
                  ? 'border-[#73C783]/50 bg-[#73C783]/10' 
                  : 'border-[#6EE7B7]/30 hover:border-[#6EE7B7]/50'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      module.category === 'climate' ? 'bg-blue-500/20 text-blue-400' :
                      module.category === 'soil' ? 'bg-amber-500/20 text-amber-400' :
                      module.category === 'water' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {module.category === 'climate' ? '🌡️' :
                       module.category === 'soil' ? '🌱' :
                       module.category === 'water' ? '💧' : '🌿'}
                    </div>
                    <div>
                      <h3 className="text-[#E5E7EB] text-lg">{module.title}</h3>
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
                  {isCompleted && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="w-6 h-6 text-[#73C783]" />
                    </motion.div>
                  )}
                </div>

                <p className="text-[#E5E7EB]/80 text-sm mb-4">{module.description}</p>

                {progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-[#E5E7EB]/70 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1" />
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
                    className={isCompleted 
                      ? 'bg-[#73C783]/20 text-[#73C783] hover:bg-[#73C783]/30' 
                      : 'bg-gradient-to-r from-[#6EE7B7] to-[#73C783] text-black hover:from-[#73C783] hover:to-[#6EE7B7]'
                    }
                  >
                    {isCompleted ? (
                      <>
                        <Trophy className="w-4 h-4 mr-1" />
                        Review
                      </>
                    ) : progress > 0 ? (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Continue
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
    </div>
  );
}
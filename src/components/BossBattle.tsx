import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Flame, Droplets, Bug, Skull, AlertTriangle, CheckCircle, X, Zap } from 'lucide-react';
import { useGame, type BossChallenge } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface BossBattleProps {
  bossId: string;
  onNavigate: (screen: any) => void;
}

const bossData: Record<string, BossChallenge & { questions: Array<{ question: string; answers: string[]; correct: number; knowledge: string }> }> = {
  'drought-titan': {
    id: 'drought-titan',
    name: 'Drought Titan',
    emoji: '🔥',
    type: 'drought',
    description: 'A colossal being of scorched earth and cracked soil. Defeat it by mastering water conservation.',
    health: 1000,
    maxHealth: 1000,
    defeated: false,
    shardId: 'ash',
    questions: [
      {
        question: 'Which irrigation method is MOST water-efficient for drought conditions?',
        answers: ['Flood irrigation', 'Drip irrigation', 'Sprinkler system', 'Manual watering'],
        correct: 1,
        knowledge: 'Drip irrigation delivers water directly to plant roots, reducing evaporation by up to 60%!'
      },
      {
        question: 'What is the best time to water crops to minimize water loss?',
        answers: ['Noon (12 PM)', 'Early morning (6 AM)', 'Afternoon (3 PM)', 'Evening (8 PM)'],
        correct: 1,
        knowledge: 'Early morning watering reduces evaporation and allows plants to absorb water before the heat of the day.'
      },
      {
        question: 'Which crop is MOST drought-resistant?',
        answers: ['Rice', 'Sorghum', 'Lettuce', 'Tomatoes'],
        correct: 1,
        knowledge: 'Sorghum is incredibly drought-resistant and can survive with minimal rainfall!'
      },
      {
        question: 'What technique helps soil retain moisture longer?',
        answers: ['Deep tilling', 'Mulching', 'Frequent watering', 'Fertilizing'],
        correct: 1,
        knowledge: 'Mulching covers soil, reducing evaporation by up to 70% and keeping roots cool!'
      }
    ]
  },
  'flood-beast': {
    id: 'flood-beast',
    name: 'Flood Beast',
    emoji: '🌊',
    type: 'flood',
    description: 'A massive water spirit causing devastating floods. Master drainage and flood management to win.',
    health: 1200,
    maxHealth: 1200,
    defeated: false,
    shardId: 'drowned-fields',
    questions: [
      {
        question: 'What is the primary purpose of raised bed farming in flood-prone areas?',
        answers: ['Better sunlight', 'Improved drainage', 'Easier harvesting', 'Pest control'],
        correct: 1,
        knowledge: 'Raised beds elevate crops above water level and improve drainage, preventing root rot!'
      },
      {
        question: 'Which crop thrives in flooded conditions?',
        answers: ['Wheat', 'Rice', 'Corn', 'Potatoes'],
        correct: 1,
        knowledge: 'Rice grows in flooded paddies and has evolved to survive with roots submerged in water!'
      },
      {
        question: 'What system helps prevent soil erosion from flooding?',
        answers: ['Deforestation', 'Terracing', 'Monoculture', 'Deep plowing'],
        correct: 1,
        knowledge: 'Terracing creates stepped levels that slow water flow and prevent soil erosion!'
      },
      {
        question: 'What is a "flood-tolerant" crop variety?',
        answers: ['One that needs no water', 'One that survives submersion', 'One that grows in winter', 'One that needs pesticides'],
        correct: 1,
        knowledge: 'Flood-tolerant crops can survive being underwater for extended periods without dying!'
      }
    ]
  },
  'locust-swarm': {
    id: 'locust-swarm',
    name: 'Locust Swarm Lord',
    emoji: '🦗',
    type: 'pest',
    description: 'Commander of devastating pest swarms. Defeat it with knowledge of natural pest control.',
    health: 800,
    maxHealth: 800,
    defeated: false,
    shardId: 'locusts',
    questions: [
      {
        question: 'What is the most eco-friendly way to control pests?',
        answers: ['Chemical pesticides', 'Burning fields', 'Beneficial insects', 'Abandoning crops'],
        correct: 2,
        knowledge: 'Beneficial insects like ladybugs eat pests naturally without harming the environment!'
      },
      {
        question: 'Which plant naturally repels many common pests?',
        answers: ['Roses', 'Marigolds', 'Grass', 'Cactus'],
        correct: 1,
        knowledge: 'Marigolds emit a scent that repels aphids, mosquitoes, and other pests naturally!'
      },
      {
        question: 'What is "companion planting"?',
        answers: ['Planting one crop only', 'Growing crops near beneficial plants', 'Planting in greenhouses', 'Using only seeds'],
        correct: 1,
        knowledge: 'Companion planting pairs crops with plants that help each other grow and resist pests!'
      },
      {
        question: 'How do birds help with pest control?',
        answers: ['They scare farmers', 'They eat pest insects', 'They damage crops', 'They carry diseases'],
        correct: 1,
        knowledge: 'Birds are natural pest controllers, eating thousands of harmful insects every day!'
      }
    ]
  },
  'pollution-demon': {
    id: 'pollution-demon',
    name: 'Pollution Demon',
    emoji: '☠️',
    type: 'pollution',
    description: 'A toxic entity corrupting the land. Cleanse it with knowledge of soil remediation.',
    health: 1500,
    maxHealth: 1500,
    defeated: false,
    shardId: 'silent-soil',
    questions: [
      {
        question: 'Which process uses plants to remove pollutants from soil?',
        answers: ['Deforestation', 'Phytoremediation', 'Irrigation', 'Fertilization'],
        correct: 1,
        knowledge: 'Phytoremediation uses plants to absorb and break down pollutants in contaminated soil!'
      },
      {
        question: 'What improves soil health after pollution?',
        answers: ['More chemicals', 'Composting', 'Ignoring it', 'Concrete covering'],
        correct: 1,
        knowledge: 'Composting adds organic matter that helps restore microbial life and soil structure!'
      },
      {
        question: 'Which crop can absorb heavy metals from soil?',
        answers: ['Lettuce', 'Sunflowers', 'Carrots', 'Apples'],
        correct: 1,
        knowledge: 'Sunflowers are hyperaccumulators that can absorb lead, arsenic, and other heavy metals!'
      },
      {
        question: 'What is biochar used for in farming?',
        answers: ['Burning crops', 'Improving soil health', 'Making paint', 'Animal feed'],
        correct: 1,
        knowledge: 'Biochar is charcoal that improves soil by retaining nutrients and capturing carbon!'
      }
    ]
  }
};

export function BossBattle({ bossId, onNavigate }: BossBattleProps) {
  const { gameState, attackBoss, updateEcoImpact, addXP, getSkillBonus } = useGame();
  const boss = bossData[bossId];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [bossHealth, setBossHealth] = useState(boss.maxHealth);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [isVictory, setIsVictory] = useState(false);
  const [isDefeat, setIsDefeat] = useState(false);

  const currentQuestion = boss.questions[currentQuestionIndex];
  const healthPercentage = (bossHealth / boss.maxHealth) * 100;
  const playerHealthPercentage = playerHealth;

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correct;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      // Calculate damage based on skills
      const baseDamage = 250;
      
      // Get skill bonus based on boss type
      let skillCategory = 'water';
      if (boss.type === 'drought') skillCategory = 'water';
      else if (boss.type === 'flood') skillCategory = 'water';
      else if (boss.type === 'pest') skillCategory = 'crops';
      else if (boss.type === 'pollution') skillCategory = 'soil';
      
      const skillBonus = getSkillBonus(skillCategory);
      const totalDamage = Math.floor(baseDamage * (1 + skillBonus / 100));
      
      const newBossHealth = Math.max(0, bossHealth - totalDamage);
      setBossHealth(newBossHealth);
      attackBoss(bossId, totalDamage);
      updateEcoImpact(100);
      
      // Award XP for correct answer
      const xpReward = 25 + (skillBonus > 0 ? 10 : 0);
      addXP(xpReward, 'Boss Battle Question');
      
      if (skillBonus > 0) {
        toast.success(`Correct! Skill Bonus +${skillBonus}%!`, {
          description: `Dealt ${totalDamage} damage to ${boss.name} (+${xpReward} XP)`
        });
      } else {
        toast.success('Correct! Critical hit!', {
          description: `Dealt ${totalDamage} damage to ${boss.name} (+${xpReward} XP)`
        });
      }

      if (newBossHealth <= 0) {
        setTimeout(() => {
          setIsVictory(true);
          const victoryXP = 200;
          addXP(victoryXP, `Defeated ${boss.name}`);
          toast.success(`${boss.name} defeated!`, {
            description: `Eco-Impact +500, +${victoryXP} XP!`
          });
          updateEcoImpact(500);
        }, 1500);
      }
    } else {
      const damage = 20;
      const newPlayerHealth = Math.max(0, playerHealth - damage);
      setPlayerHealth(newPlayerHealth);
      
      toast.error('Wrong answer!', {
        description: `${boss.name} attacks! You lose ${damage} HP`
      });

      if (newPlayerHealth <= 0) {
        setTimeout(() => {
          setIsDefeat(true);
        }, 1500);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < boss.questions.length - 1 && !isVictory && !isDefeat) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else if (bossHealth > 0 && playerHealth > 0) {
      // Loop questions if boss still alive
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#450a0a] to-black relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Boss Info */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            {boss.emoji}
          </motion.div>
          <h1 className="text-4xl mb-2 text-[#FF6B6B]">{boss.name}</h1>
          <p className="text-lg text-[#E5E7EB]/80 max-w-2xl mx-auto">
            {boss.description}
          </p>
        </motion.div>

        {/* Health Bars */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Boss Health */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/40 backdrop-blur-sm border border-red-500/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg text-[#FF6B6B]">{boss.name}</h3>
              <span className="text-sm text-[#E5E7EB]">{bossHealth} / {boss.maxHealth}</span>
            </div>
            <Progress value={healthPercentage} className="h-6 bg-black/60">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500 rounded-full"
                style={{ width: `${healthPercentage}%` }}
              />
            </Progress>
          </motion.div>

          {/* Player Health */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg text-[#73C783]">Your Knowledge Power</h3>
              <span className="text-sm text-[#E5E7EB]">{playerHealth} / 100</span>
            </div>
            <Progress value={playerHealthPercentage} className="h-6 bg-black/60">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${playerHealthPercentage}%` }}
              />
            </Progress>
          </motion.div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          {!isVictory && !isDefeat && (
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-[#FFD369]">
                  Challenge {currentQuestionIndex + 1} of {boss.questions.length}
                </h3>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#FFD369]" />
                  <span className="text-sm text-[#E5E7EB]">250 Damage</span>
                </div>
              </div>

              <h2 className="text-2xl mb-6 text-[#E5E7EB]">{currentQuestion.question}</h2>

              <div className="grid grid-cols-1 gap-4 mb-6">
                {currentQuestion.answers.map((answer, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                    className={`
                      p-4 rounded-xl text-left transition-all duration-300 border-2
                      ${selectedAnswer === index
                        ? showResult
                          ? isCorrect && index === currentQuestion.correct
                            ? 'bg-green-500/20 border-green-500'
                            : index === selectedAnswer
                            ? 'bg-red-500/20 border-red-500'
                            : 'bg-white/5 border-white/20'
                          : 'bg-white/20 border-[#6EE7B7]'
                        : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
                      }
                      ${showResult && index === currentQuestion.correct ? 'bg-green-500/20 border-green-500' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#E5E7EB]">{answer}</span>
                      {showResult && index === currentQuestion.correct && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {showResult && index === selectedAnswer && index !== currentQuestion.correct && (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl mb-4 ${
                    isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
                  }`}
                >
                  <h4 className="text-lg mb-2 text-[#E5E7EB]">
                    {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
                  </h4>
                  <p className="text-sm text-[#E5E7EB]/80">
                    {currentQuestion.knowledge}
                  </p>
                </motion.div>
              )}

              <div className="flex justify-between">
                <Button
                  onClick={() => onNavigate('farmingGameplay')}
                  className="bg-white/10 hover:bg-white/20 text-[#E5E7EB] border border-white/20"
                >
                  Retreat
                </Button>
                {!showResult ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-gradient-to-r from-[#6EE7B7] to-[#73C783] hover:from-[#73C783] hover:to-[#6EE7B7] text-black px-8 disabled:opacity-50"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-[#FFD369] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD369] text-black px-8"
                  >
                    Next Challenge
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Victory Screen */}
        <AnimatePresence>
          {isVictory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-500/50 rounded-2xl p-12 text-center"
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 1 }}
                className="text-9xl mb-6"
              >
                🏆
              </motion.div>
              <h2 className="text-4xl mb-4 text-[#6EE7B7]">Victory!</h2>
              <p className="text-xl text-[#E5E7EB] mb-8">
                You defeated {boss.name} with the power of knowledge!
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => onNavigate('farmingGameplay')}
                  className="bg-gradient-to-r from-[#6EE7B7] to-[#73C783] hover:from-[#73C783] hover:to-[#6EE7B7] text-black px-12 py-6"
                >
                  Return to Farm
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Defeat Screen */}
        <AnimatePresence>
          {isDefeat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-md border border-red-500/50 rounded-2xl p-12 text-center"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-9xl mb-6"
              >
                💔
              </motion.div>
              <h2 className="text-4xl mb-4 text-[#FF6B6B]">Defeated...</h2>
              <p className="text-xl text-[#E5E7EB] mb-8">
                Don't give up! Study the knowledge and try again!
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => onNavigate('farmingGameplay')}
                  className="bg-white/10 hover:bg-white/20 text-[#E5E7EB] border border-white/20 px-8 py-6"
                >
                  Return to Farm
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-[#FFD369] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD369] text-black px-12 py-6"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

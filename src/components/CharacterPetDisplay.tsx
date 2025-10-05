import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Heart,
  Sparkles,
  MessageCircle,
  Gift,
  Play,
  Star,
  Smile,
  Coffee,
  Gamepad2,
  BookOpen,
  Trophy,
  Zap,
  Crown
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface CharacterPetDisplayProps {
  onNavigate: (screen: string) => void;
}

interface InteractionOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  cooldown: number;
  effect: string;
  energyCost?: number;
}

export function CharacterPetDisplay({ onNavigate }: CharacterPetDisplayProps) {
  const { gameState, updateResources } = useGame();
  const [characterMood, setCharacterMood] = useState<'happy' | 'excited' | 'focused' | 'sleepy' | 'energetic'>('happy');
  const [petMood, setPetMood] = useState<'playful' | 'sleepy' | 'hungry' | 'excited' | 'content'>('content');
  const [lastInteraction, setLastInteraction] = useState<Date | null>(null);
  const [interactionCooldowns, setInteractionCooldowns] = useState<Record<string, Date>>({});
  const [showInteractionEffect, setShowInteractionEffect] = useState<string | null>(null);

  const characterAppearance = gameState.characterAppearance || {
    name: 'Farmer',
    characterType: 0
  };

  const selectedPet = gameState.selectedPet || {
    name: 'Sprout',
    type: 'Leaf Dragon',
    level: 1,
    happiness: 80,
    energy: 70
  };

  const characterInteractions: InteractionOption[] = [
    {
      id: 'chat',
      label: 'Chat',
      icon: <MessageCircle className="w-4 h-4" />,
      cooldown: 30000, // 30 seconds
      effect: '+5 Happiness, Learn Farming Tips',
      energyCost: 5
    },
    {
      id: 'learn',
      label: 'Learn Skills',
      icon: <BookOpen className="w-4 h-4" />,
      cooldown: 120000, // 2 minutes
      effect: '+10 EXP, New Farming Techniques',
      energyCost: 15
    },
    {
      id: 'encourage',
      label: 'Encourage',
      icon: <Heart className="w-4 h-4" />,
      cooldown: 60000, // 1 minute
      effect: '+Motivation, +10 Energy',
      energyCost: 0
    },
    {
      id: 'celebrate',
      label: 'Celebrate',
      icon: <Trophy className="w-4 h-4" />,
      cooldown: 300000, // 5 minutes
      effect: '+20 EcoPoints, +Mood Boost',
      energyCost: 10
    }
  ];

  const petInteractions: InteractionOption[] = [
    {
      id: 'play',
      label: 'Play',
      icon: <Play className="w-4 h-4" />,
      cooldown: 45000, // 45 seconds
      effect: '+10 Happiness, +5 Bond',
      energyCost: 10
    },
    {
      id: 'feed',
      label: 'Feed',
      icon: <Gift className="w-4 h-4" />,
      cooldown: 180000, // 3 minutes
      effect: '+20 Energy, +10 Happiness',
      energyCost: 0
    },
    {
      id: 'train',
      label: 'Train',
      icon: <Zap className="w-4 h-4" />,
      cooldown: 240000, // 4 minutes
      effect: '+EXP, +Farming Abilities',
      energyCost: 20
    },
    {
      id: 'cuddle',
      label: 'Cuddle',
      icon: <Heart className="w-4 h-4" />,
      cooldown: 90000, // 1.5 minutes
      effect: '+15 Bond, Stress Relief',
      energyCost: 0
    }
  ];

  const getMoodEmoji = (mood: string, type: 'character' | 'pet') => {
    if (type === 'character') {
      switch (mood) {
        case 'happy': return '😊';
        case 'excited': return '🤩';
        case 'focused': return '🧐';
        case 'sleepy': return '😴';
        case 'energetic': return '⚡';
        default: return '😊';
      }
    } else {
      switch (mood) {
        case 'playful': return '😸';
        case 'sleepy': return '😴';
        case 'hungry': return '🤤';
        case 'excited': return '🤩';
        case 'content': return '😌';
        default: return '😌';
      }
    }
  };

  const handleInteraction = async (interaction: InteractionOption, type: 'character' | 'pet') => {
    const now = new Date();
    const cooldownKey = `${type}-${interaction.id}`;
    const lastInteractionTime = interactionCooldowns[cooldownKey];

    // Check cooldown
    if (lastInteractionTime && (now.getTime() - lastInteractionTime.getTime()) < interaction.cooldown) {
      const remainingTime = Math.ceil((interaction.cooldown - (now.getTime() - lastInteractionTime.getTime())) / 1000);
      toast.error(`Please wait ${remainingTime} seconds before ${interaction.label.toLowerCase()} again!`);
      return;
    }

    // Check energy cost
    if (interaction.energyCost && gameState.resources.energy < interaction.energyCost) {
      toast.error(`Not enough energy! Need ${interaction.energyCost} energy.`);
      return;
    }

    // Update cooldown
    setInteractionCooldowns(prev => ({ ...prev, [cooldownKey]: now }));
    
    // Deduct energy if needed
    if (interaction.energyCost) {
      updateResources({ energy: gameState.resources.energy - interaction.energyCost });
    }

    // Show interaction effect
    setShowInteractionEffect(`${type}-${interaction.id}`);
    setTimeout(() => setShowInteractionEffect(null), 2000);

    // Handle specific interactions
    switch (interaction.id) {
      case 'chat':
        setCharacterMood('happy');
        toast.success('💬 Had a great chat! Learned some farming tips!');
        onNavigate('enhancedCharacterChat');
        break;
      case 'learn':
        setCharacterMood('focused');
        toast.success('📚 Started a learning session!');
        onNavigate('learningHub');
        break;
      case 'encourage':
        setCharacterMood('energetic');
        updateResources({ energy: gameState.resources.energy + 10 });
        toast.success('💪 Feeling motivated and energized!');
        break;
      case 'celebrate':
        setCharacterMood('excited');
        updateResources({ ecoPoints: gameState.resources.ecoPoints + 20 });
        toast.success('🎉 Celebrated achievements! +20 Eco Points!');
        break;
      case 'play':
        setPetMood('playful');
        toast.success('🎾 Had fun playing together!');
        break;
      case 'feed':
        setPetMood('content');
        toast.success('🍖 Pet is well fed and happy!');
        break;
      case 'train':
        setPetMood('excited');
        toast.success('🏃 Great training session!');
        break;
      case 'cuddle':
        setPetMood('content');
        toast.success('🤗 Bonding time! Both feel relaxed.');
        break;
    }

    setLastInteraction(now);
  };

  const isOnCooldown = (interaction: InteractionOption, type: 'character' | 'pet') => {
    const cooldownKey = `${type}-${interaction.id}`;
    const lastTime = interactionCooldowns[cooldownKey];
    if (!lastTime) return false;
    
    const now = new Date();
    return (now.getTime() - lastTime.getTime()) < interaction.cooldown;
  };

  const getCooldownRemaining = (interaction: InteractionOption, type: 'character' | 'pet') => {
    const cooldownKey = `${type}-${interaction.id}`;
    const lastTime = interactionCooldowns[cooldownKey];
    if (!lastTime) return 0;
    
    const now = new Date();
    const remaining = interaction.cooldown - (now.getTime() - lastTime.getTime());
    return Math.max(0, Math.ceil(remaining / 1000));
  };

  return (
    <div className="min-h-full rounded-2xl bg-black/20 backdrop-blur-sm border border-[#73C783]/20 relative overflow-y-auto overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#73C783]/30 rounded-full"
            animate={{
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Badge className="bg-[#73C783]/20 text-[#73C783] border-[#73C783]/40">
            Interactive Mode
          </Badge>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#FFD369]/20 text-[#FFD369] border-[#FFD369]/40">
              Energy: {gameState.resources.energy}
            </Badge>
            <Badge className="bg-[#6EE7B7]/20 text-[#6EE7B7] border-[#6EE7B7]/40">
              Bond Level: 5
            </Badge>
          </div>
        </div>

        {/* Character and Pet Display */}
        <div className="flex-1 grid grid-cols-2 gap-8">
          {/* Character Side */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                scale: showInteractionEffect?.startsWith('character') ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                y: { duration: 2, repeat: Infinity },
                scale: { duration: 0.5 }
              }}
              className="relative mb-4"
            >
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#6EE7B7] to-[#73C783] flex items-center justify-center relative overflow-hidden">
                <div className="text-8xl">{getMoodEmoji(characterMood, 'character')}</div>
                
                {/* Interaction Effect */}
                <AnimatePresence>
                  {showInteractionEffect?.startsWith('character') && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-white/20 rounded-full flex items-center justify-center"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Character Status */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#73C783] text-black text-xs">
                  {characterAppearance.name}
                </Badge>
              </div>
            </motion.div>

            <Card className="w-full p-4 bg-black/40 border-[#73C783]/30 backdrop-blur-sm">
              <h3 className="text-[#73C783] mb-3 text-center">Character Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {characterInteractions.map((interaction) => {
                  const onCooldown = isOnCooldown(interaction, 'character');
                  const cooldownTime = getCooldownRemaining(interaction, 'character');
                  const canAfford = !interaction.energyCost || gameState.resources.energy >= interaction.energyCost;
                  
                  return (
                    <Button
                      key={interaction.id}
                      onClick={() => handleInteraction(interaction, 'character')}
                      disabled={onCooldown || !canAfford}
                      className={`h-12 text-xs flex flex-col items-center justify-center p-1 ${
                        onCooldown 
                          ? 'bg-gray-500/20 text-gray-400' 
                          : canAfford
                            ? 'bg-[#73C783]/20 text-[#73C783] hover:bg-[#73C783]/30'
                            : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {interaction.icon}
                      <span className="mt-1">{interaction.label}</span>
                      {onCooldown && (
                        <span className="text-xs opacity-70">{cooldownTime}s</span>
                      )}
                      {interaction.energyCost && (
                        <span className="text-xs opacity-70">⚡{interaction.energyCost}</span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Pet Side */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 5, -5, 0],
                scale: showInteractionEffect?.startsWith('pet') ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                y: { duration: 3, repeat: Infinity },
                rotate: { duration: 4, repeat: Infinity },
                scale: { duration: 0.5 }
              }}
              className="relative mb-4"
            >
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#FFD369] to-[#FF8C42] flex items-center justify-center relative overflow-hidden">
                <div className="text-8xl">{getMoodEmoji(petMood, 'pet')}</div>
                
                {/* Pet Specific Effects */}
                <div className="absolute top-2 right-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Crown className="w-6 h-6 text-[#FFD369]" />
                  </motion.div>
                </div>

                {/* Interaction Effect */}
                <AnimatePresence>
                  {showInteractionEffect?.startsWith('pet') && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-white/20 rounded-full flex items-center justify-center"
                    >
                      <Heart className="w-8 h-8 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pet Status */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#FFD369] text-black text-xs">
                  {selectedPet.name} Lv.{selectedPet.level}
                </Badge>
              </div>
            </motion.div>

            <Card className="w-full p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
              <h3 className="text-[#FFD369] mb-3 text-center">Pet Actions</h3>
              
              {/* Pet Stats */}
              <div className="mb-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/70">Happiness</span>
                  <span className="text-[#73C783]">{selectedPet.happiness}%</span>
                </div>
                <Progress value={selectedPet.happiness} className="h-1" />
                <div className="flex justify-between text-xs">
                  <span className="text-white/70">Energy</span>
                  <span className="text-[#6EE7B7]">{selectedPet.energy}%</span>
                </div>
                <Progress value={selectedPet.energy} className="h-1" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {petInteractions.map((interaction) => {
                  const onCooldown = isOnCooldown(interaction, 'pet');
                  const cooldownTime = getCooldownRemaining(interaction, 'pet');
                  const canAfford = !interaction.energyCost || gameState.resources.energy >= interaction.energyCost;
                  
                  return (
                    <Button
                      key={interaction.id}
                      onClick={() => handleInteraction(interaction, 'pet')}
                      disabled={onCooldown || !canAfford}
                      className={`h-12 text-xs flex flex-col items-center justify-center p-1 ${
                        onCooldown 
                          ? 'bg-gray-500/20 text-gray-400' 
                          : canAfford
                            ? 'bg-[#FFD369]/20 text-[#FFD369] hover:bg-[#FFD369]/30'
                            : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {interaction.icon}
                      <span className="mt-1">{interaction.label}</span>
                      {onCooldown && (
                        <span className="text-xs opacity-70">{cooldownTime}s</span>
                      )}
                      {interaction.energyCost && (
                        <span className="text-xs opacity-70">⚡{interaction.energyCost}</span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="mt-6 flex justify-center">
          <Card className="p-3 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-[#73C783]" />
                <span className="text-white/70">Character:</span>
                <span className="text-[#73C783] capitalize">{characterMood}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#FFD369]" />
                <span className="text-white/70">Pet:</span>
                <span className="text-[#FFD369] capitalize">{petMood}</span>
              </div>
              {lastInteraction && (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#6EE7B7]" />
                  <span className="text-white/70">Last Activity:</span>
                  <span className="text-[#6EE7B7]">{lastInteraction.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
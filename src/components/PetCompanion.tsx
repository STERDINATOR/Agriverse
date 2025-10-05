import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Heart, Zap, Shield, Eye, Wind, Sprout } from 'lucide-react';
import { useGame, type Pet } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface PetCompanionProps {
  onNavigate: (screen: any) => void;
}

const availablePets: Pet[] = [
  {
    id: 'eco-fox',
    name: 'Fennec',
    type: 'Eco-Fox',
    emoji: '🦊',
    description: 'A mystical fox that glows when soil is acidic or contaminated. Its keen senses detect soil imbalances.',
    ability: 'Auto-detects soil pH issues',
    color: '#FF6B35',
    level: 1
  },
  {
    id: 'wisdom-crow',
    name: 'Corvus',
    type: 'Wisdom Crow',
    emoji: '🦅',
    description: 'An ancient crow that delivers farming tips and alerts you to optimal harvest times.',
    ability: 'Provides daily farming hints',
    color: '#1A1A2E',
    level: 1
  },
  {
    id: 'water-turtle',
    name: 'Aquarius',
    type: 'Water Turtle',
    emoji: '🐢',
    description: 'A gentle turtle spirit that helps monitor water levels and prevents overwatering.',
    ability: 'Auto-waters crops when needed',
    color: '#4ECDC4',
    level: 1
  },
  {
    id: 'pollinator-bee',
    name: 'Buzz',
    type: 'Golden Pollinator',
    emoji: '🐝',
    description: 'A magical bee that increases crop yields through enhanced pollination.',
    ability: '+15% crop yield bonus',
    color: '#FFD700',
    level: 1
  },
  {
    id: 'guardian-owl',
    name: 'Athena',
    type: 'Night Guardian',
    emoji: '🦉',
    description: 'A wise owl that protects crops from pests during nighttime.',
    ability: 'Prevents pest damage at night',
    color: '#8B4789',
    level: 1
  },
  {
    id: 'sprout-rabbit',
    name: 'Clover',
    type: 'Sprout Rabbit',
    emoji: '🐰',
    description: 'An energetic rabbit that speeds up seed germination with its magical touch.',
    ability: '+20% faster crop growth',
    color: '#90EE90',
    level: 1
  },
  {
    id: 'dragon-sprite',
    name: 'Ember',
    type: 'Fire Sprite',
    emoji: '🐉',
    description: 'A tiny dragon that warms cold soils and helps crops survive harsh temperatures.',
    ability: 'Temperature regulation',
    color: '#FF4500',
    level: 1
  },
  {
    id: 'moon-cat',
    name: 'Luna',
    type: 'Lunar Cat',
    emoji: '🐱',
    description: 'A mystical cat that collects resources at night while you sleep.',
    ability: 'Auto-collects resources',
    color: '#E6E6FA',
    level: 1
  }
];

export function PetCompanion({ onNavigate }: PetCompanionProps) {
  const { gameState, selectPet } = useGame();
  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    gameState.selectedPet?.id || null
  );
  const [hoveredPetId, setHoveredPetId] = useState<string | null>(null);

  const handleSelectPet = (pet: Pet) => {
    setSelectedPetId(pet.id);
  };

  const handleConfirm = () => {
    const pet = availablePets.find(p => p.id === selectedPetId);
    if (pet) {
      selectPet(pet);
      toast.success(`${pet.name} is now your Eco-Companion!`, {
        description: pet.ability
      });
      onNavigate('playerHub');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C5F2D] via-[#0F172A] to-black relative overflow-hidden">
      {/* Animated Leaves Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`
            }}
            animate={{
              y: ['0vh', '110vh'],
              rotate: [0, 360],
              x: [0, Math.random() * 100 - 50]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            🍃
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-4 inline-block"
          >
            <Heart className="w-16 h-16 text-[#FF69B4]" />
          </motion.div>
          <h1 className="text-5xl mb-4 text-[#73C783]">Choose Your Eco-Companion</h1>
          <p className="text-xl text-[#E5E7EB]/80 max-w-2xl mx-auto">
            These magical creatures will assist you in your farming adventures, 
            each with unique abilities to help your farm thrive
          </p>
        </motion.div>

        {/* Pet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {availablePets.map((pet, index) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              onHoverStart={() => setHoveredPetId(pet.id)}
              onHoverEnd={() => setHoveredPetId(null)}
              className="relative"
            >
              <motion.div
                className={`
                  relative p-6 rounded-2xl backdrop-blur-sm cursor-pointer
                  transition-all duration-300 h-full flex flex-col
                  ${selectedPetId === pet.id
                    ? 'bg-white/20 border-2 border-[#73C783] shadow-lg shadow-[#73C783]/50'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }
                `}
                onClick={() => handleSelectPet(pet)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Selection Indicator */}
                {selectedPetId === pet.id && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-[#73C783] rounded-full flex items-center justify-center border-4 border-[#0F172A]"
                  >
                    <Heart className="w-5 h-5 text-[#0F172A] fill-[#0F172A]" />
                  </motion.div>
                )}

                {/* Pet Emoji */}
                <motion.div
                  animate={hoveredPetId === pet.id ? {
                    y: [0, -10, 0],
                    rotate: [0, -10, 10, 0]
                  } : {}}
                  transition={{ duration: 0.6 }}
                  className="text-6xl mb-4 text-center"
                >
                  {pet.emoji}
                </motion.div>

                {/* Pet Info */}
                <h3 className="text-xl mb-1 text-center text-[#FFD369]">{pet.name}</h3>
                <p className="text-xs text-center text-[#6EE7B7] mb-3">{pet.type}</p>
                
                <p className="text-xs text-[#E5E7EB]/70 mb-4 line-clamp-3 flex-grow">
                  {pet.description}
                </p>

                {/* Ability */}
                <div className="bg-gradient-to-r from-[#73C783]/20 to-[#6EE7B7]/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FFD369]" />
                    <p className="text-xs text-[#E5E7EB]">{pet.ability}</p>
                  </div>
                </div>

                {/* Level */}
                <div className="mt-3 flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < pet.level ? 'bg-[#FFD369]' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <Shield className="w-8 h-8 text-[#6EE7B7] mb-3" />
            <h3 className="text-lg mb-2 text-[#FFD369]">Always Active</h3>
            <p className="text-sm text-[#E5E7EB]/70">
              Your pet works 24/7, helping your farm even when you're offline
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <Sprout className="w-8 h-8 text-[#73C783] mb-3" />
            <h3 className="text-lg mb-2 text-[#FFD369]">Level Up</h3>
            <p className="text-sm text-[#E5E7EB]/70">
              As you farm, your pet gains experience and unlocks stronger abilities
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <Eye className="w-8 h-8 text-[#FF69B4] mb-3" />
            <h3 className="text-lg mb-2 text-[#FFD369]">Special Alerts</h3>
            <p className="text-sm text-[#E5E7EB]/70">
              Your pet will notify you of important events and opportunities
            </p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex justify-center gap-4"
        >
          <Button
            onClick={() => onNavigate('playerHub')}
            className="bg-white/10 hover:bg-white/20 text-[#E5E7EB] border border-white/20 px-8 py-6"
          >
            Back to Hub
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedPetId}
            className="bg-gradient-to-r from-[#73C783] to-[#6EE7B7] hover:from-[#6EE7B7] hover:to-[#73C783] text-black px-12 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gameState.selectedPet ? 'Change Companion' : 'Confirm Companion'}
          </Button>
        </motion.div>

        {/* Tip */}
        {!gameState.selectedPet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-[#E5E7EB]/60">
              🐾 Tip: You can switch companions anytime, but your bond level resets!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

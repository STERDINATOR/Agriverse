import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Sparkles, Leaf, Droplets, Dna, Wind, Sun, Heart } from 'lucide-react';
import { useGame, type Mentor } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface MentorSelectionProps {
  onNavigate: (screen: any) => void;
}

const availableMentors: Mentor[] = [
  {
    id: 'agro-sage',
    name: 'Terra',
    title: 'Agro Sage',
    emoji: '🧙‍♂️',
    description: 'Ancient guardian of soil wisdom. Master of earth magic and sustainable farming practices.',
    specialty: 'Soil Health & Composting',
    color: '#8B4513',
    ability: '+20% Soil Health in all farms'
  },
  {
    id: 'rain-dancer',
    name: 'Aquila',
    title: 'Rain Dancer',
    emoji: '💃',
    description: 'Spirit of the water cycle. Commands clouds and teaches the sacred art of irrigation.',
    specialty: 'Water Management & Irrigation',
    color: '#4ECDC4',
    ability: '-30% Water consumption for crops'
  },
  {
    id: 'seed-whisperer',
    name: 'Flora',
    title: 'Seed Whisperer',
    emoji: '🌸',
    description: 'Communicates with plant genetics. Unlocks the secrets hidden within every seed.',
    specialty: 'Plant Genetics & Breeding',
    color: '#FF69B4',
    ability: '+50% chance for rare crop mutations'
  },
  {
    id: 'solar-guardian',
    name: 'Helios',
    title: 'Solar Guardian',
    emoji: '☀️',
    description: 'Keeper of photosynthesis. Harnesses the power of sunlight for maximum crop yields.',
    specialty: 'Energy & Climate Control',
    color: '#FFD369',
    ability: '+15% growth speed for all crops'
  },
  {
    id: 'biodiversity-sage',
    name: 'Gaia',
    title: 'Ecosystem Sage',
    emoji: '🦋',
    description: 'Protector of all living things. Teaches the interconnectedness of nature.',
    specialty: 'Biodiversity & Pollination',
    color: '#73C783',
    ability: '+25% Eco-Impact score from harvests'
  },
  {
    id: 'wind-keeper',
    name: 'Zephyr',
    title: 'Wind Keeper',
    emoji: '🌪️',
    description: 'Master of air currents and weather patterns. Controls the breath of the earth.',
    specialty: 'Weather & Air Quality',
    color: '#87CEEB',
    ability: 'Can change weather conditions'
  }
];

export function MentorSelection({ onNavigate }: MentorSelectionProps) {
  const { gameState, selectMentor } = useGame();
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(
    gameState.selectedMentor?.id || null
  );
  const [hoveredMentorId, setHoveredMentorId] = useState<string | null>(null);

  const handleSelectMentor = (mentor: Mentor) => {
    setSelectedMentorId(mentor.id);
  };

  const handleConfirm = () => {
    const mentor = availableMentors.find(m => m.id === selectedMentorId);
    if (mentor) {
      selectMentor(mentor);
      toast.success(`${mentor.name} joined you as your Farm Guardian!`, {
        description: mentor.ability
      });
      onNavigate('playerHub');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#0F172A] to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#6EE7B7] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
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
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-4 inline-block"
          >
            <Sparkles className="w-16 h-16 text-[#FFD369]" />
          </motion.div>
          <h1 className="text-5xl mb-4 text-[#6EE7B7]">Choose Your Farm Guardian</h1>
          <p className="text-xl text-[#E5E7EB]/80 max-w-2xl mx-auto">
            These ancient spirits will guide you through your farming journey, 
            each offering unique wisdom and abilities
          </p>
        </motion.div>

        {/* Mentor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {availableMentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredMentorId(mentor.id)}
              onHoverEnd={() => setHoveredMentorId(null)}
              className="relative"
            >
              <motion.div
                className={`
                  relative p-6 rounded-2xl backdrop-blur-sm cursor-pointer
                  transition-all duration-300
                  ${selectedMentorId === mentor.id
                    ? 'bg-white/20 border-2 border-[#6EE7B7] shadow-lg shadow-[#6EE7B7]/50'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }
                `}
                onClick={() => handleSelectMentor(mentor)}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Selection Indicator */}
                {selectedMentorId === mentor.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-[#6EE7B7] rounded-full flex items-center justify-center border-4 border-[#0F172A]"
                  >
                    <Sparkles className="w-5 h-5 text-[#0F172A]" />
                  </motion.div>
                )}

                {/* Mentor Emoji */}
                <motion.div
                  animate={hoveredMentorId === mentor.id ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4 text-center"
                >
                  {mentor.emoji}
                </motion.div>

                {/* Mentor Info */}
                <h3 className="text-2xl mb-1 text-center text-[#FFD369]">{mentor.name}</h3>
                <p className="text-sm text-center text-[#6EE7B7] mb-3">{mentor.title}</p>
                
                <p className="text-sm text-[#E5E7EB]/70 mb-4 line-clamp-3">
                  {mentor.description}
                </p>

                {/* Specialty */}
                <div className="bg-black/30 rounded-lg p-3 mb-3">
                  <p className="text-xs text-[#E5E7EB]/50 mb-1">Specialty</p>
                  <p className="text-sm text-[#E5E7EB]">{mentor.specialty}</p>
                </div>

                {/* Ability */}
                <div className="bg-gradient-to-r from-[#6EE7B7]/20 to-[#73C783]/20 rounded-lg p-3">
                  <p className="text-xs text-[#6EE7B7]/80 mb-1">Unique Ability</p>
                  <p className="text-sm text-[#E5E7EB]">{mentor.ability}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
            disabled={!selectedMentorId}
            className="bg-gradient-to-r from-[#6EE7B7] to-[#73C783] hover:from-[#73C783] hover:to-[#6EE7B7] text-black px-12 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gameState.selectedMentor ? 'Change Guardian' : 'Confirm Guardian'}
          </Button>
        </motion.div>

        {/* Tip */}
        {!gameState.selectedMentor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-[#E5E7EB]/60">
              💡 Tip: You can change your Farm Guardian anytime from the Player Hub
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

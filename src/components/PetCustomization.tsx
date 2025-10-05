import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Zap, 
  Sparkles,
  Save,
  RotateCcw,
  Crown,
  Palette,
  Gift,
  Play,
  Pause,
  Shuffle,
  Eye
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface PetCustomizationProps {
  onNavigate: (screen: string) => void;
}

interface PetAppearance {
  species: number;
  name: string;
  colorVariant: number;
  pattern: number;
  accessory: number;
  expression: number;
  personalityType: number;
}

interface PetStats {
  level: number;
  experience: number;
  happiness: number;
  energy: number;
  loyalty: number;
  farmingBonus: number;
  specialAbility: string;
}

// AI-Generated Anime Pet Companions
const petSpecies = [
  { 
    name: 'Nyanko Cat', 
    image: 'https://images.unsplash.com/photo-1721907043490-d51705da24fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYW5pbWUlMjBjYXQlMjBwZXQlMjBjb21wYW5pb258ZW58MXx8fHwxNzU5NTY4NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Magical cat that purrs when plants are happy',
    ability: 'Plant Detection',
    element: '🌿',
    rarity: 'Common',
    baseStats: { farming: 85, loyalty: 90, energy: 75, magic: 70 }
  },
  { 
    name: 'Wanko Pup', 
    image: 'https://images.unsplash.com/photo-1753939579127-1527d6b4d545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGRvZyUyMGNvbXBhbmlvbiUyMHBldHxlbnwxfHx8fDE3NTk1Njg1OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Loyal companion that predicts weather changes',
    ability: 'Weather Prediction',
    element: '⛈️',
    rarity: 'Common',
    baseStats: { farming: 80, loyalty: 95, energy: 85, magic: 60 }
  },
  { 
    name: 'Kitsune Fox', 
    image: 'https://images.unsplash.com/photo-1696383378356-b127c0b5545e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMG1hZ2ljYWwlMjBmb3glMjBwZXR8ZW58MXx8fHwxNzU5NTY4NjAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Mystical nine-tailed fox with solar powers',
    ability: 'Solar Energy',
    element: '☀️',
    rarity: 'Rare',
    baseStats: { farming: 70, loyalty: 75, energy: 95, magic: 90 }
  },
  { 
    name: 'Usagi Bunny', 
    image: 'https://images.unsplash.com/photo-1644095192829-6bc51e6e5c5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwcmFiYml0JTIwYW5pbWUlMjBwZXR8ZW58MXx8fHwxNzU5NTY4NjA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Spring spirit that helps with crop harvesting',
    ability: 'Auto Harvest',
    element: '🌸',
    rarity: 'Uncommon',
    baseStats: { farming: 95, loyalty: 80, energy: 85, magic: 75 }
  }
];

const colorVariants = [
  { name: 'Natural', color: '#8B4513', rarity: 'Common' },
  { name: 'Sakura', color: '#FF69B4', rarity: 'Rare' },
  { name: 'Emerald', color: '#32CD32', rarity: 'Uncommon' },
  { name: 'Sapphire', color: '#4169E1', rarity: 'Rare' },
  { name: 'Gold', color: '#FFD700', rarity: 'Epic' },
  { name: 'Midnight', color: '#2C1B47', rarity: 'Epic' },
  { name: 'Hologram', color: '#9370DB', rarity: 'Legendary' },
  { name: 'Aurora', color: '#20B2AA', rarity: 'Legendary' }
];

const petPatterns = [
  { name: 'Solid', icon: '⚫', description: 'Simple and pure' },
  { name: 'Spotted', icon: '🔵', description: 'Cute polka dots' },
  { name: 'Striped', icon: '🟫', description: 'Classic stripes' },
  { name: 'Gradient', icon: '🌈', description: 'Smooth color blend' },
  { name: 'Starry', icon: '⭐', description: 'Magical star pattern' },
  { name: 'Floral', icon: '🌸', description: 'Delicate flower motifs' }
];

const petAccessories = [
  { name: 'Crown', icon: '👑', effect: '+10 Dignity', rarity: 'Legendary' },
  { name: 'Ribbon', icon: '🎀', effect: '+8 Cuteness', rarity: 'Common' },
  { name: 'Bell', icon: '🔔', effect: '+5 Vitality', rarity: 'Common' },
  { name: 'Star Badge', icon: '⭐', effect: '+12 Farming', rarity: 'Rare' },
  { name: 'Magic Gem', icon: '💎', effect: '+15 All Stats', rarity: 'Epic' },
  { name: 'Leaf Crown', icon: '🌿', effect: '+18 Nature Power', rarity: 'Rare' },
  { name: 'Lightning', icon: '⚡', effect: '+10 Energy', rarity: 'Epic' },
  { name: 'Ice Crystal', icon: '❄️', effect: 'Climate Resistance', rarity: 'Legendary' }
];

const petExpressions = [
  { emoji: '😊', name: 'Gentle', mood: 'Happy' },
  { emoji: '😍', name: 'Loving', mood: 'Romantic' },
  { emoji: '🤗', name: 'Hugging', mood: 'Affectionate' },
  { emoji: '😴', name: 'Sleepy', mood: 'Peaceful' },
  { emoji: '🤔', name: 'Thinking', mood: 'Curious' },
  { emoji: '😎', name: 'Cool', mood: 'Confident' },
  { emoji: '🥰', name: 'Adorable', mood: 'Sweet' },
  { emoji: '🌟', name: 'Shining', mood: 'Magical' }
];

const personalityTypes = [
  { name: 'Energetic', trait: 'Playful and active', bonus: '+Farming Speed' },
  { name: 'Clingy', trait: 'Loves attention', bonus: '+Loyalty' },
  { name: 'Relaxed', trait: 'Calm and peaceful', bonus: '+Recovery' },
  { name: 'Curious', trait: 'Loves to explore', bonus: '+Discovery Rate' },
  { name: 'Brave', trait: 'Fearless protector', bonus: '+Combat Power' },
  { name: 'Wise', trait: 'Intelligent helper', bonus: '+Experience' }
];

export function PetCustomization({ onNavigate }: PetCustomizationProps) {
  const { gameState, updatePetAppearance } = useGame();
  const [activeTab, setActiveTab] = useState<'species' | 'appearance' | 'accessories' | 'personality'>('species');
  const [isAnimating, setIsAnimating] = useState(true);
  
  const [petAppearance, setPetAppearance] = useState<PetAppearance>(
    gameState.petAppearance || {
      species: 0,
      name: 'Pet-kun',
      colorVariant: 0,
      pattern: 0,
      accessory: 0,
      expression: 0,
      personalityType: 0
    }
  );

  const [petStats] = useState<PetStats>({
    level: gameState.petLevel || 1,
    experience: gameState.petExperience || 0,
    happiness: 85,
    energy: 90,
    loyalty: 75,
    farmingBonus: 15,
    specialAbility: petSpecies[petAppearance.species].ability
  });

  const updateLocalPetAppearance = (key: keyof PetAppearance, value: any) => {
    const newAppearance = { ...petAppearance, [key]: value };
    setPetAppearance(newAppearance);
  };

  const handleSave = () => {
    updatePetAppearance(petAppearance);
    toast.success('🐾 Pet companion created successfully! Welcome to your team!');
    onNavigate('petCompanion');
  };

  const handleReset = () => {
    const defaultAppearance: PetAppearance = {
      species: 0,
      name: 'Pet-kun',
      colorVariant: 0,
      pattern: 0,
      accessory: 0,
      expression: 0,
      personalityType: 0
    };
    setPetAppearance(defaultAppearance);
    toast.info('🔄 Reset to default pet appearance');
  };

  const handleRandomize = () => {
    const randomAppearance: PetAppearance = {
      species: Math.floor(Math.random() * petSpecies.length),
      name: petAppearance.name,
      colorVariant: Math.floor(Math.random() * colorVariants.length),
      pattern: Math.floor(Math.random() * petPatterns.length),
      accessory: Math.floor(Math.random() * petAccessories.length),
      expression: Math.floor(Math.random() * petExpressions.length),
      personalityType: Math.floor(Math.random() * personalityTypes.length)
    };
    setPetAppearance(randomAppearance);
    toast.success('🎲 Random pet generated!');
  };

  const currentSpecies = petSpecies[petAppearance.species];
  const currentAccessory = petAccessories[petAppearance.accessory];
  const currentPattern = petPatterns[petAppearance.pattern];
  const currentExpression = petExpressions[petAppearance.expression];
  const currentColorVariant = colorVariants[petAppearance.colorVariant];
  const currentPersonality = personalityTypes[petAppearance.personalityType];

  const renderPetPreview = () => {
    return (
      <motion.div
        className="relative w-80 h-96 mx-auto"
        animate={isAnimating ? { scale: [1, 1.03, 1], rotate: [0, 1, -1, 0] } : {}}
        transition={{ duration: 4, repeat: isAnimating ? Infinity : 0 }}
      >
        {/* Anime-style Pet Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-400/20 via-pink-500/20 to-cyan-600/20 rounded-3xl border-2 border-cyan-300/50" />
        
        {/* Pet Portrait */}
        <div className="absolute inset-4 rounded-2xl overflow-hidden">
          <ImageWithFallback
            src={currentSpecies.image}
            alt={currentSpecies.name}
            className="w-full h-full object-cover"
          />
          
          {/* Color Filter Overlay */}
          <div 
            className="absolute inset-0 mix-blend-multiply opacity-40"
            style={{ backgroundColor: currentColorVariant.color }}
          />
          
          {/* Pattern Overlay */}
          {petAppearance.pattern > 0 && (
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{ 
                backgroundImage: `radial-gradient(circle, ${currentColorVariant.color} 20%, transparent 21%)`,
                backgroundSize: petAppearance.pattern === 1 ? '30px 30px' : 
                                petAppearance.pattern === 2 ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' :
                                'none'
              }}
              animate={currentPattern.name.includes('Gradient') ? { 
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] 
              } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Pet Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <motion.h3 
              className="text-xl mb-1"
              animate={isAnimating ? { textShadow: ['0 0 5px #00ffff', '0 0 20px #ff69b4', '0 0 5px #00ffff'] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {petAppearance.name}
            </motion.h3>
            <p className="text-sm opacity-90">{currentSpecies.name}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-cyan-500/80 text-white flex items-center">
                {currentSpecies.element} {currentSpecies.ability}
              </Badge>
              <Badge className="bg-purple-500/80 text-white">
                {currentPersonality.name}
              </Badge>
            </div>
          </div>
          
          {/* Expression Bubble */}
          <motion.div
            className="absolute top-4 left-4 text-4xl bg-white/20 rounded-full p-2 backdrop-blur-sm"
            animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            {currentExpression.emoji}
          </motion.div>
          
          {/* Accessory Overlay */}
          {petAppearance.accessory > 0 && (
            <motion.div
              className="absolute top-4 right-4 text-4xl"
              animate={isAnimating ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {currentAccessory.icon}
            </motion.div>
          )}
        </div>

        {/* Kawaii Sparkles */}
        <AnimatePresence>
          {isAnimating && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: [0, 30, 50] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0 }}
                className="absolute top-12 left-8 text-2xl"
              >
                ✨
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: [0, -30, -50] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                className="absolute top-20 right-8 text-2xl"
              >
                💫
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -30, -50] }}
                transition={{ duration: 4, repeat: Infinity, delay: 3 }}
                className="absolute bottom-20 left-1/2 text-2xl"
              >
                🌟
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: [0, 1, 0], y: [20, -40, -60] }}
                transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
                className="absolute top-8 right-1/4 text-2xl"
              >
                💖
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Anime Aura Effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 255, 255, 0.3)',
              '0 0 40px rgba(255, 105, 180, 0.5)',
              '0 0 20px rgba(0, 255, 255, 0.3)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 to-black/80" />

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center border-b border-cyan-300/20 bg-gradient-to-r from-cyan-900/20 to-pink-900/20 backdrop-blur-sm">
        <Button
          onClick={() => onNavigate('petCompanion')}
          variant="ghost"
          className="text-white hover:bg-cyan-500/20 border border-cyan-300/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: isAnimating ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-8 h-8 text-pink-400" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-3xl text-white bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">Anime Pet Creator</h1>
            <p className="text-sm text-cyan-300">Design Your Perfect Companion</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsAnimating(!isAnimating)}
            variant="outline"
            size="sm"
            className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            onClick={handleRandomize}
            variant="outline"
            className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Random
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-orange-400 text-orange-400 hover:bg-orange-400/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white hover:from-cyan-600 hover:to-pink-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="relative z-10 h-[calc(100vh-80px)] flex">
        {/* Left Panel - Pet Preview */}
        <div className="w-96 p-6 border-r border-cyan-300/20 bg-gradient-to-b from-cyan-900/10 to-pink-900/10 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-lg">Pet Preview</h3>
              <Button
                onClick={() => setIsAnimating(!isAnimating)}
                size="sm"
                variant="ghost"
                className="text-cyan-400 hover:bg-cyan-400/10"
              >
                <Eye className="w-4 h-4 mr-1" />
                {isAnimating ? 'Animation OFF' : 'Animation ON'}
              </Button>
            </div>
            
            {renderPetPreview()}
            
            {/* Pet Name Input */}
            <Card className="p-4 bg-black/40 border-cyan-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-cyan-400" />
                <h4 className="text-cyan-400">Pet Name</h4>
              </div>
              <Input
                value={petAppearance.name}
                onChange={(e) => updateLocalPetAppearance('name', e.target.value)}
                placeholder="Enter your pet's name..."
                className="bg-black/20 border-cyan-300/30 text-white placeholder:text-gray-400"
              />
            </Card>

            {/* Pet Species Info */}
            <Card className="p-4 bg-black/40 border-pink-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <h4 className="text-pink-400">{currentSpecies.name}</h4>
              </div>
              <p className="text-sm text-white/80 mb-3">
                {currentSpecies.description}
              </p>
              <div className="flex gap-2 mb-3">
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                  {currentSpecies.element} {currentSpecies.ability}
                </Badge>
                <Badge className={`${
                  currentSpecies.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                  currentSpecies.rarity === 'Rare' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                  'bg-gray-500/20 text-gray-300 border-gray-500/40'
                }`}>
                  {currentSpecies.rarity}
                </Badge>
              </div>
              <div className="text-xs text-white/70">
                Personality: {currentPersonality.name} - {currentPersonality.trait}
              </div>
            </Card>

            {/* Pet Base Stats */}
            <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
              <h4 className="text-purple-400 mb-3">Base Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-lg text-cyan-400 mb-1">{currentSpecies.baseStats.farming}</div>
                  <div className="text-xs text-white">Farming</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-lg text-pink-400 mb-1">{currentSpecies.baseStats.loyalty}</div>
                  <div className="text-xs text-white">Loyalty</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-lg text-green-400 mb-1">{currentSpecies.baseStats.energy}</div>
                  <div className="text-xs text-white">Energy</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-lg text-yellow-400 mb-1">{currentSpecies.baseStats.magic}</div>
                  <div className="text-xs text-white">Magic</div>
                </div>
              </div>
            </Card>

            {/* Current Stats */}
            <Card className="p-4 bg-black/40 border-blue-400/30 backdrop-blur-sm">
              <h4 className="text-blue-400 mb-3">Current Status</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">Happiness</span>
                    <span className="text-pink-400">{petStats.happiness}%</span>
                  </div>
                  <Progress value={petStats.happiness} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">Energy</span>
                    <span className="text-cyan-400">{petStats.energy}%</span>
                  </div>
                  <Progress value={petStats.energy} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">Loyalty</span>
                    <span className="text-yellow-400">{petStats.loyalty}%</span>
                  </div>
                  <Progress value={petStats.loyalty} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Accessory Effect */}
            {petAppearance.accessory > 0 && (
              <Card className="p-3 bg-black/40 border-green-400/30 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentAccessory.icon}</span>
                  <div>
                    <h5 className="text-sm text-green-400">{currentAccessory.name}</h5>
                    <p className="text-xs text-white/70">{currentAccessory.effect}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Right Panel - Customization Options */}
        <div className="flex-1 p-6 bg-gradient-to-b from-pink-900/5 to-cyan-900/5">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'species', label: 'Pet Species', icon: Heart, color: 'cyan' },
              { id: 'appearance', label: 'Appearance', icon: Palette, color: 'pink' },
              { id: 'accessories', label: 'Accessories', icon: Crown, color: 'purple' },
              { id: 'personality', label: 'Personality', icon: Star, color: 'yellow' }
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={`${
                  activeTab === tab.id 
                    ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white` 
                    : `text-${tab.color}-300 hover:bg-${tab.color}-500/10 border border-${tab.color}-400/30`
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {activeTab === 'species' && (
                <Card className="p-6 bg-black/40 border-cyan-400/30 backdrop-blur-sm">
                  <h4 className="text-cyan-400 mb-4 text-lg">Pet Species Selection</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {petSpecies.map((species, index) => (
                      <motion.button
                        key={index}
                        onClick={() => updateLocalPetAppearance('species', index)}
                        className={`p-4 rounded-xl border-2 transition-all text-left overflow-hidden ${
                          petAppearance.species === index 
                            ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/30' 
                            : 'border-white/20 hover:border-cyan-300/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex gap-4">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={species.image}
                              alt={species.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-1 right-1 text-lg">{species.element}</div>
                          </div>
                          <div className="flex-1">
                            <h5 className="text-white mb-1">{species.name}</h5>
                            <p className="text-xs text-white/70 mb-2">{species.description}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-xs">
                                {species.ability}
                              </Badge>
                              <Badge className={`text-xs ${
                                species.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                                species.rarity === 'Rare' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                                'bg-gray-500/20 text-gray-300 border-gray-500/40'
                              }`}>
                                {species.rarity}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-xs">
                              <div className="text-center">
                                <div className="text-cyan-400">{species.baseStats.farming}</div>
                                <div className="text-white/60">Farm</div>
                              </div>
                              <div className="text-center">
                                <div className="text-pink-400">{species.baseStats.loyalty}</div>
                                <div className="text-white/60">Loyal</div>
                              </div>
                              <div className="text-center">
                                <div className="text-green-400">{species.baseStats.energy}</div>
                                <div className="text-white/60">Energy</div>
                              </div>
                              <div className="text-center">
                                <div className="text-yellow-400">{species.baseStats.magic}</div>
                                <div className="text-white/60">Magic</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {petAppearance.species === index && (
                          <Badge className="bg-cyan-500 text-white mt-3">
                            <Star className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </Card>
              )}

              {activeTab === 'appearance' && (
                <>
                  {/* Color Variant */}
                  <Card className="p-4 bg-black/40 border-pink-400/30 backdrop-blur-sm">
                    <h4 className="text-pink-400 mb-4">Color Variant</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {colorVariants.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => updateLocalPetAppearance('colorVariant', index)}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${
                            petAppearance.colorVariant === index 
                              ? 'border-pink-400 bg-pink-400/20 scale-105' 
                              : 'border-white/20 hover:border-pink-300/50'
                          }`}
                        >
                          <div 
                            className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-white/30"
                            style={{ backgroundColor: color.color }}
                          />
                          <div className="text-xs text-white mb-1">{color.name}</div>
                          <Badge className={`text-xs ${
                            color.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                            color.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400' :
                            color.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {color.rarity}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Pattern */}
                  <Card className="p-4 bg-black/40 border-pink-400/30 backdrop-blur-sm">
                    <h4 className="text-pink-400 mb-4">Pattern Style</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {petPatterns.map((pattern, index) => (
                        <button
                          key={index}
                          onClick={() => updateLocalPetAppearance('pattern', index)}
                          className={`p-4 rounded-xl border-2 transition-all text-center ${
                            petAppearance.pattern === index 
                              ? 'border-pink-400 bg-pink-400/20' 
                              : 'border-white/20 hover:border-pink-300/50'
                          }`}
                        >
                          <div className="text-3xl mb-2">{pattern.icon}</div>
                          <div className="text-xs text-white mb-1">{pattern.name}</div>
                          <div className="text-xs text-white/60">{pattern.description}</div>
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Expression */}
                  <Card className="p-4 bg-black/40 border-pink-400/30 backdrop-blur-sm">
                    <h4 className="text-pink-400 mb-4">Expression</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {petExpressions.map((expression, index) => (
                        <button
                          key={index}
                          onClick={() => updateLocalPetAppearance('expression', index)}
                          className={`p-4 rounded-xl border-2 transition-all text-center ${
                            petAppearance.expression === index 
                              ? 'border-pink-400 bg-pink-400/20' 
                              : 'border-white/20 hover:border-pink-300/50'
                          }`}
                        >
                          <div className="text-4xl mb-2">{expression.emoji}</div>
                          <div className="text-xs text-white mb-1">{expression.name}</div>
                          <div className="text-xs text-pink-300">{expression.mood}</div>
                        </button>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'accessories' && (
                <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
                  <h4 className="text-purple-400 mb-4">Pet Accessories</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {petAccessories.map((accessory, index) => (
                      <button
                        key={index}
                        onClick={() => updateLocalPetAppearance('accessory', index)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          petAppearance.accessory === index 
                            ? 'border-purple-400 bg-purple-400/20' 
                            : 'border-white/20 hover:border-purple-300/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{accessory.icon}</span>
                          <div>
                            <h5 className="text-white">{accessory.name}</h5>
                            <p className="text-xs text-green-400">{accessory.effect}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${
                            accessory.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                            accessory.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400' :
                            accessory.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {accessory.rarity}
                          </Badge>
                          {petAppearance.accessory === index && (
                            <Badge className="bg-purple-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Equipped
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {activeTab === 'personality' && (
                <>
                  {/* Personality Type */}
                  <Card className="p-4 bg-black/40 border-yellow-400/30 backdrop-blur-sm">
                    <h4 className="text-yellow-400 mb-4">Personality Type</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {personalityTypes.map((personality, index) => (
                        <button
                          key={index}
                          onClick={() => updateLocalPetAppearance('personalityType', index)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            petAppearance.personalityType === index 
                              ? 'border-yellow-400 bg-yellow-400/20' 
                              : 'border-white/20 hover:border-yellow-300/50'
                          }`}
                        >
                          <h5 className="text-white mb-1">{personality.name}</h5>
                          <p className="text-xs text-white/70 mb-2">{personality.trait}</p>
                          <div className="text-xs text-yellow-400">{personality.bonus}</div>
                          {petAppearance.personalityType === index && (
                            <Badge className="bg-yellow-500 text-black mt-2">
                              <Star className="w-3 h-3 mr-1" />
                              Selected
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Pet Abilities Summary */}
                  <Card className="p-4 bg-black/40 border-yellow-400/30 backdrop-blur-sm">
                    <h4 className="text-yellow-400 mb-4">Special Abilities</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                        <div>
                          <h5 className="text-white">{currentSpecies.ability}</h5>
                          <p className="text-xs text-white/70">Primary Special Ability</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div>
                          <h5 className="text-white">Eco Bond</h5>
                          <p className="text-xs text-white/70">Enhanced by farm health</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Heart className="w-5 h-5 text-pink-400" />
                        <div>
                          <h5 className="text-white">Companionship</h5>
                          <p className="text-xs text-white/70">Provides emotional support</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Star className="w-5 h-5 text-purple-400" />
                        <div>
                          <h5 className="text-white">{currentPersonality.name}</h5>
                          <p className="text-xs text-white/70">{currentPersonality.bonus}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
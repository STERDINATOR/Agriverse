import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  RotateCcw, 
  Palette, 
  Shirt, 
  Crown,
  User,
  Zap,
  Sparkles,
  Save,
  Eye,
  Heart,
  Star,
  Shuffle,
  Download,
  Play,
  MessageCircle
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface CharacterCustomizationProps {
  onNavigate: (screen: string) => void;
}

interface CharacterAppearance {
  characterType: number;
  hairStyle: number;
  hairColor: string;
  eyeColor: string;
  outfit: number;
  accessory: number;
  name: string;
  voiceType: number;
  personalityTrait: number;
}

// AI-Generated Anime Character Portraits
const characterTypes = [
  {
    name: 'Sakura - Gentle Farmer',
    image: 'https://images.unsplash.com/photo-1700996003686-327c5bf8d926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZhcm1lciUyMGNoYXJhY3RlciUyMGdpcmx8ZW58MXx8fHwxNzU5NTY4NTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Kind-hearted eco-warrior',
    trait: 'Compassionate',
    stats: { wisdom: 85, strength: 70, charisma: 90 }
  },
  {
    name: 'Akira - Tech Prodigy',
    image: 'https://images.unsplash.com/photo-1653004845649-195c2c21fec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGJveSUyMGNoYXJhY3RlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTU2ODU5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Brilliant climate scientist',
    trait: 'Analytical',
    stats: { wisdom: 95, strength: 60, charisma: 75 }
  },
  {
    name: 'Luna - Mystic Guardian',
    image: 'https://images.unsplash.com/photo-1697059172415-f1e08f9151bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGdpcmwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTk1Njg2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Magical earth protector',
    trait: 'Mystical',
    stats: { wisdom: 90, strength: 80, charisma: 85 }
  },
  {
    name: 'Yuki - Ice Princess',
    image: 'https://images.unsplash.com/photo-1663035045563-24d54c1e8e28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMG1hZ2ljYWwlMjBnaXJsJTIwY2hhcmFjdGVyfGVufDF8fHx8MTc1OTU2ODYwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Cold climate specialist',
    trait: 'Determined',
    stats: { wisdom: 80, strength: 85, charisma: 80 }
  }
];

const hairStyles = [
  { name: 'Short Bob', icon: '✂️', description: 'Classic and practical' },
  { name: 'Long Flowing', icon: '🌊', description: 'Elegant and graceful' },
  { name: 'Twin Tails', icon: '🎀', description: 'Cute and energetic' },
  { name: 'Messy Bun', icon: '🌀', description: 'Casual and relaxed' },
  { name: 'Straight Bangs', icon: '📏', description: 'Sophisticated look' },
  { name: 'Curly Waves', icon: '🌀', description: 'Playful and bouncy' },
  { name: 'Ponytail', icon: '🎯', description: 'Active and sporty' },
  { name: 'Braided Crown', icon: '👑', description: 'Royal and majestic' }
];

const hairColors = [
  { color: '#2C1B18', name: 'Midnight Black', rarity: 'Common' },
  { color: '#8B4513', name: 'Chestnut Brown', rarity: 'Common' },
  { color: '#DAA520', name: 'Golden Blonde', rarity: 'Uncommon' },
  { color: '#FF6347', name: 'Sunset Orange', rarity: 'Rare' },
  { color: '#4B0082', name: 'Royal Purple', rarity: 'Epic' },
  { color: '#32CD32', name: 'Nature Green', rarity: 'Legendary' },
  { color: '#FF69B4', name: 'Sakura Pink', rarity: 'Rare' },
  { color: '#00CED1', name: 'Ocean Blue', rarity: 'Epic' }
];

const eyeColors = [
  { color: '#8B4513', name: 'Warm Brown' },
  { color: '#4169E1', name: 'Deep Blue' },
  { color: '#228B22', name: 'Forest Green' },
  { color: '#8A2BE2', name: 'Violet Dreams' },
  { color: '#20B2AA', name: 'Aqua Marine' },
  { color: '#FF69B4', name: 'Rose Pink' },
  { color: '#FFD700', name: 'Golden Amber' },
  { color: '#DC143C', name: 'Ruby Red' }
];

const outfits = [
  { name: 'School Uniform', description: 'Classic anime school attire', power: '🎓', rarity: 'Common' },
  { name: 'Farmer Overalls', description: 'Practical work clothes', power: '🌾', rarity: 'Common' },
  { name: 'Miko Priestess', description: 'Sacred shrine maiden outfit', power: '⛩️', rarity: 'Rare' },
  { name: 'Magical Girl', description: 'Sparkling transformation outfit', power: '✨', rarity: 'Epic' },
  { name: 'Cyber Suit', description: 'High-tech environmental gear', power: '🤖', rarity: 'Legendary' },
  { name: 'Kimono Robes', description: 'Traditional Japanese elegance', power: '👘', rarity: 'Rare' },
  { name: 'Battle Armor', description: 'Protective combat gear', power: '⚔️', rarity: 'Epic' },
  { name: 'Casual Street', description: 'Modern everyday fashion', power: '👕', rarity: 'Common' }
];

const accessories = [
  { name: 'Cat Ears', icon: '🐱', effect: '+10 Cuteness' },
  { name: 'Hair Ribbons', icon: '🎀', effect: '+5 Charm' },
  { name: 'Glasses', icon: '👓', effect: '+8 Intelligence' },
  { name: 'Crown Tiara', icon: '👑', effect: '+12 Leadership' },
  { name: 'Fox Mask', icon: '🦊', effect: '+6 Mystery' },
  { name: 'Star Clips', icon: '⭐', effect: '+4 Luck' },
  { name: 'Flower Crown', icon: '🌸', effect: '+7 Nature Bond' },
  { name: 'Crystal Pendant', icon: '💎', effect: '+15 Magic Power' }
];

const voiceTypes = [
  { name: 'Sweet & Gentle', style: 'Soft', description: 'Soft and caring voice' },
  { name: 'Energetic & Bright', style: 'Cheerful', description: 'Cheerful and lively' },
  { name: 'Cool & Mysterious', style: 'Cool', description: 'Calm and enigmatic' },
  { name: 'Shy & Quiet', style: 'Shy', description: 'Soft-spoken and timid' },
  { name: 'Bold & Confident', style: 'Bold', description: 'Strong and determined' },
  { name: 'Wise & Mature', style: 'Mature', description: 'Thoughtful and experienced' }
];

const personalityTraits = [
  { name: 'Kuudere', icon: '❄️', description: 'Cool exterior, warm heart' },
  { name: 'Genki', icon: '⚡', description: 'Energetic and optimistic' },
  { name: 'Dandere', icon: '🌸', description: 'Quiet but caring' },
  { name: 'Tsundere', icon: '🔥', description: 'Tough outside, soft inside' },
  { name: 'Yamato Nadeshiko', icon: '🌺', description: 'Traditional and graceful' },
  { name: 'Bokukko', icon: '⚔️', description: 'Tomboyish and brave' }
];

export function CharacterCustomization({ onNavigate }: CharacterCustomizationProps) {
  const { gameState, updateCharacterAppearance } = useGame();
  const [activeTab, setActiveTab] = useState<'character' | 'appearance' | 'outfit' | 'personality'>('character');
  const [appearance, setAppearance] = useState<CharacterAppearance>(
    gameState.characterAppearance || {
      characterType: 0,
      hairStyle: 0,
      hairColor: hairColors[0].color,
      eyeColor: eyeColors[0].color,
      outfit: 0,
      accessory: 0,
      name: 'Farmer-kun',
      voiceType: 0,
      personalityTrait: 0
    }
  );
  const [isAnimating, setIsAnimating] = useState(true);

  const updateAppearance = (key: keyof CharacterAppearance, value: any) => {
    const newAppearance = { ...appearance, [key]: value };
    setAppearance(newAppearance);
  };

  const handleSave = () => {
    updateCharacterAppearance(appearance);
    toast.success('🌸 Character created successfully! Welcome to AgriVerse!');
    onNavigate('playerHub');
  };

  const handleChatNow = () => {
    updateCharacterAppearance(appearance);
    toast.success('💬 Character saved! Opening chat...');
    onNavigate('characterChat');
  };

  const handleReset = () => {
    const defaultAppearance: CharacterAppearance = {
      characterType: 0,
      hairStyle: 0,
      hairColor: hairColors[0].color,
      eyeColor: eyeColors[0].color,
      outfit: 0,
      accessory: 0,
      name: 'Farmer-kun',
      voiceType: 0,
      personalityTrait: 0
    };
    setAppearance(defaultAppearance);
    toast.info('🔄 Reset to default appearance');
  };

  const handleRandomize = () => {
    const randomAppearance: CharacterAppearance = {
      characterType: Math.floor(Math.random() * characterTypes.length),
      hairStyle: Math.floor(Math.random() * hairStyles.length),
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)].color,
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)].color,
      outfit: Math.floor(Math.random() * outfits.length),
      accessory: Math.floor(Math.random() * accessories.length),
      name: appearance.name,
      voiceType: Math.floor(Math.random() * voiceTypes.length),
      personalityTrait: Math.floor(Math.random() * personalityTraits.length)
    };
    setAppearance(randomAppearance);
    toast.success('🎲 Random character generated!');
  };

  const renderCharacterPreview = () => {
    const currentCharacter = characterTypes[appearance.characterType];
    const currentOutfit = outfits[appearance.outfit];
    const currentAccessory = accessories[appearance.accessory];
    const currentPersonality = personalityTraits[appearance.personalityTrait];
    const currentVoice = voiceTypes[appearance.voiceType];

    return (
      <motion.div
        className="relative w-80 h-96 mx-auto"
        animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 4, repeat: isAnimating ? Infinity : 0 }}
      >
        {/* Anime-style Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-400/20 via-purple-500/20 to-blue-600/20 rounded-3xl border-2 border-pink-300/50" />
        
        {/* Character Portrait */}
        <div className="absolute inset-4 rounded-2xl overflow-hidden">
          <ImageWithFallback
            src={currentCharacter.image}
            alt={currentCharacter.name}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Character Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <motion.h3 
              className="text-xl mb-1"
              animate={isAnimating ? { textShadow: ['0 0 5px #ff69b4', '0 0 20px #ff69b4', '0 0 5px #ff69b4'] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {appearance.name}
            </motion.h3>
            <p className="text-sm opacity-90">{currentCharacter.trait}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-pink-500/80 text-white">
                {currentOutfit.power}
              </Badge>
              <Badge className="bg-purple-500/80 text-white">
                {currentPersonality.name}
              </Badge>
            </div>
          </div>
          
          {/* Accessory Overlay */}
          {appearance.accessory > 0 && (
            <motion.div
              className="absolute top-4 right-4 text-4xl"
              animate={isAnimating ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {currentAccessory.icon}
            </motion.div>
          )}
        </div>

        {/* Magical Sparkles */}
        <AnimatePresence>
          {isAnimating && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: [0, 20, 40] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                className="absolute top-8 left-8 text-2xl"
              >
                ✨
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: [0, -20, -40] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute top-16 right-8 text-2xl"
              >
                🌸
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -20, -40] }}
                transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                className="absolute bottom-16 left-1/2 text-2xl"
              >
                ⭐
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Anime Aura Effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{
            boxShadow: [
              '0 0 20px rgba(255, 105, 180, 0.3)',
              '0 0 40px rgba(138, 43, 226, 0.5)',
              '0 0 20px rgba(255, 105, 180, 0.3)'
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
      <div className="relative z-10 p-6 flex justify-between items-center border-b border-pink-300/20 bg-gradient-to-r from-pink-900/20 to-purple-900/20 backdrop-blur-sm">
        <Button
          onClick={() => onNavigate('playerHub')}
          variant="ghost"
          className="text-white hover:bg-pink-500/20 border border-pink-300/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isAnimating ? [0, 360] : 0 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-pink-400" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-3xl text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Character Creation</h1>
            <p className="text-sm text-pink-300">Anime Character Creator</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsAnimating(!isAnimating)}
            variant="outline"
            size="sm"
            className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
          >
            {isAnimating ? <Eye className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="relative z-10 h-[calc(100vh-80px)] flex">
        {/* Left Panel - Character Preview */}
        <div className="w-96 p-6 border-r border-pink-300/20 bg-gradient-to-b from-pink-900/10 to-purple-900/10 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-lg">Character Preview</h3>
              <Button
                onClick={() => setIsAnimating(!isAnimating)}
                size="sm"
                variant="ghost"
                className="text-pink-400 hover:bg-pink-400/10"
              >
                <Eye className="w-4 h-4 mr-1" />
                {isAnimating ? 'Animate OFF' : 'Animate ON'}
              </Button>
            </div>
            
            {renderCharacterPreview()}
            
            {/* Character Name Input */}
            <Card className="p-4 bg-black/40 border-pink-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <h4 className="text-pink-400">Character Name</h4>
              </div>
              <Input
                value={appearance.name}
                onChange={(e) => updateAppearance('name', e.target.value)}
                placeholder="Enter your character's name..."
                className="bg-black/20 border-pink-300/30 text-white placeholder:text-gray-400"
              />
            </Card>

            {/* Character Info */}
            <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-purple-400" />
                <h4 className="text-purple-400">{characterTypes[appearance.characterType].name}</h4>
              </div>
              <p className="text-sm text-white/80 mb-3">
                {characterTypes[appearance.characterType].description}
              </p>
              <div className="flex gap-2">
                <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/40">
                  {personalityTraits[appearance.personalityTrait].name}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40">
                  {voiceTypes[appearance.voiceType].style}
                </Badge>
              </div>
            </Card>

            {/* Character Stats */}
            <Card className="p-4 bg-black/40 border-blue-400/30 backdrop-blur-sm">
              <h4 className="text-blue-400 mb-3">Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Wisdom</span>
                  <span className="text-blue-400">{characterTypes[appearance.characterType].stats.wisdom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Strength</span>
                  <span className="text-green-400">{characterTypes[appearance.characterType].stats.strength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Charisma</span>
                  <span className="text-pink-400">{characterTypes[appearance.characterType].stats.charisma}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Special Effect</span>
                  <span className="text-purple-400">{accessories[appearance.accessory].effect}</span>
                </div>
              </div>
            </Card>

            {/* Chat with Character Button */}
            <Button
              onClick={handleChatNow}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-purple-600"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with {appearance.name}
            </Button>
          </div>
        </div>

        {/* Right Panel - Customization Options */}
        <div className="flex-1 p-6 bg-gradient-to-b from-purple-900/5 to-blue-900/5">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'character', label: 'Character', icon: User, color: 'pink' },
              { id: 'appearance', label: 'Appearance', icon: Palette, color: 'purple' },
              { id: 'outfit', label: 'Outfit', icon: Shirt, color: 'blue' },
              { id: 'personality', label: 'Personality', icon: Heart, color: 'red' }
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
              {activeTab === 'character' && (
                <Card className="p-6 bg-black/40 border-pink-400/30 backdrop-blur-sm">
                  <h4 className="text-pink-400 mb-4 text-lg">Character Selection</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {characterTypes.map((character, index) => (
                      <motion.button
                        key={index}
                        onClick={() => updateAppearance('characterType', index)}
                        className={`p-4 rounded-xl border-2 transition-all text-left overflow-hidden ${
                          appearance.characterType === index 
                            ? 'border-pink-400 bg-pink-400/20 shadow-lg shadow-pink-400/30' 
                            : 'border-white/20 hover:border-pink-300/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={character.image}
                            alt={character.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <h5 className="text-white mb-1">{character.name}</h5>
                        <p className="text-xs text-white/70 mb-2">{character.description}</p>
                        <div className="flex justify-between text-xs">
                          <span className="text-blue-400">Wisdom: {character.stats.wisdom}</span>
                          <span className="text-green-400">Strength: {character.stats.strength}</span>
                          <span className="text-pink-400">Charisma: {character.stats.charisma}</span>
                        </div>
                        {appearance.characterType === index && (
                          <Badge className="bg-pink-500 text-white mt-2">
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
                  {/* Hair Style */}
                  <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
                    <h4 className="text-purple-400 mb-4">Hair Style</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {hairStyles.map((style, index) => (
                        <button
                          key={index}
                          onClick={() => updateAppearance('hairStyle', index)}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${
                            appearance.hairStyle === index 
                              ? 'border-purple-400 bg-purple-400/20' 
                              : 'border-white/20 hover:border-purple-300/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{style.icon}</span>
                            <div>
                              <h5 className="text-white">{style.name}</h5>
                              <p className="text-xs text-white/70">{style.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Hair Color */}
                  <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
                    <h4 className="text-purple-400 mb-4">Hair Color</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {hairColors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => updateAppearance('hairColor', color.color)}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${
                            appearance.hairColor === color.color 
                              ? 'border-purple-400 bg-purple-400/20 scale-105' 
                              : 'border-white/20 hover:border-purple-300/50'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-full mx-auto mb-2 border-2 border-white/30"
                            style={{ backgroundColor: color.color }}
                          />
                          <div className="text-xs text-white">{color.name}</div>
                          <Badge className={`text-xs mt-1 ${
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

                  {/* Eye Color */}
                  <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
                    <h4 className="text-purple-400 mb-4">Eye Color</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {eyeColors.map((eye, index) => (
                        <button
                          key={index}
                          onClick={() => updateAppearance('eyeColor', eye.color)}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${
                            appearance.eyeColor === eye.color 
                              ? 'border-purple-400 bg-purple-400/20 scale-105' 
                              : 'border-white/20 hover:border-purple-300/50'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-full mx-auto mb-2 border-2 border-white/30"
                            style={{ backgroundColor: eye.color }}
                          />
                          <div className="text-xs text-white">{eye.name}</div>
                        </button>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'outfit' && (
                <Card className="p-4 bg-black/40 border-blue-400/30 backdrop-blur-sm">
                  <h4 className="text-blue-400 mb-4">Outfits</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {outfits.map((outfit, index) => (
                      <button
                        key={index}
                        onClick={() => updateAppearance('outfit', index)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          appearance.outfit === index 
                            ? 'border-blue-400 bg-blue-400/20' 
                            : 'border-white/20 hover:border-blue-300/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{outfit.power}</span>
                          <div>
                            <h5 className="text-white">{outfit.name}</h5>
                            <p className="text-xs text-white/70">{outfit.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${
                            outfit.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                            outfit.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400' :
                            outfit.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {outfit.rarity}
                          </Badge>
                          {appearance.outfit === index && (
                            <Badge className="bg-blue-500 text-white">
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
                  {/* Personality Trait */}
                  <Card className="p-4 bg-black/40 border-red-400/30 backdrop-blur-sm">
                    <h4 className="text-red-400 mb-4">Personality Type</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {personalityTraits.map((trait, index) => (
                        <button
                          key={index}
                          onClick={() => updateAppearance('personalityTrait', index)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            appearance.personalityTrait === index 
                              ? 'border-red-400 bg-red-400/20' 
                              : 'border-white/20 hover:border-red-300/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{trait.icon}</span>
                            <div>
                              <h5 className="text-white">{trait.name}</h5>
                              <p className="text-xs text-white/70">{trait.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Voice Type */}
                  <Card className="p-4 bg-black/40 border-red-400/30 backdrop-blur-sm">
                    <h4 className="text-red-400 mb-4">Voice Type</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {voiceTypes.map((voice, index) => (
                        <button
                          key={index}
                          onClick={() => updateAppearance('voiceType', index)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            appearance.voiceType === index 
                              ? 'border-red-400 bg-red-400/20' 
                              : 'border-white/20 hover:border-red-300/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="text-white">{voice.name}</h5>
                              <p className="text-xs text-white/70">{voice.description}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg">{voice.style}</span>
                              {appearance.voiceType === index && (
                                <Badge className="bg-red-500 text-white ml-2">
                                  Selected
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Accessories */}
                  <Card className="p-4 bg-black/40 border-red-400/30 backdrop-blur-sm">
                    <h4 className="text-red-400 mb-4">Accessories</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {accessories.map((accessory, index) => (
                        <button
                          key={index}
                          onClick={() => updateAppearance('accessory', index)}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${
                            appearance.accessory === index 
                              ? 'border-red-400 bg-red-400/20' 
                              : 'border-white/20 hover:border-red-300/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{accessory.icon}</span>
                            <div>
                              <h5 className="text-white text-sm">{accessory.name}</h5>
                              <p className="text-xs text-green-400">{accessory.effect}</p>
                            </div>
                          </div>
                        </button>
                      ))}
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
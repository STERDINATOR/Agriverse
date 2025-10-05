import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Sparkles, 
  Wand2,
  Loader2,
  Save,
  RefreshCw,
  Palette,
  User,
  Download,
  Settings,
  Zap,
  Heart,
  Star,
  Shirt,
  Brain,
  Eye,
  Music,
  BookOpen,
  Crown,
  Flame,
  Snowflake,
  Leaf,
  Droplets,
  MessageCircle
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { enhancedAICharacterGenerator, EnhancedCharacterRequest, EnhancedCharacter } from '../services/EnhancedAICharacterGenerator';
import { toast } from 'sonner@2.0.3';

interface EnhancedAICharacterCreatorProps {
  onNavigate: (screen: string) => void;
}

const animeStyles = [
  { value: 'anime', label: 'Classic Anime', emoji: '🎌', description: 'Traditional anime style' },
  { value: 'manga', label: 'Manga Style', emoji: '📖', description: 'Black and white manga aesthetic' },
  { value: 'chibi', label: 'Chibi', emoji: '🧸', description: 'Super cute and small' },
  { value: 'shounen', label: 'Shounen', emoji: '⚔️', description: 'Action-oriented style' },
  { value: 'shoujo', label: 'Shoujo', emoji: '🌸', description: 'Romance and drama style' },
  { value: 'seinen', label: 'Seinen', emoji: '🎯', description: 'Mature and sophisticated' },
  { value: 'josei', label: 'Josei', emoji: '✨', description: 'Adult women-focused style' }
];

const personalityArchetypes = [
  { 
    value: 'genki', 
    label: 'Genki Girl', 
    emoji: '⚡', 
    description: 'Energetic, optimistic, always cheerful',
    color: 'text-yellow-400'
  },
  { 
    value: 'tsundere', 
    label: 'Tsundere', 
    emoji: '🔥', 
    description: 'Tough exterior, soft heart, defensive but caring',
    color: 'text-red-400'
  },
  { 
    value: 'dandere', 
    label: 'Dandere', 
    emoji: '🌸', 
    description: 'Shy, quiet, opens up to people they trust',
    color: 'text-pink-400'
  },
  { 
    value: 'kuudere', 
    label: 'Kuudere', 
    emoji: '❄️', 
    description: 'Cool, calm, logical, secretly caring',
    color: 'text-blue-400'
  },
  { 
    value: 'yamato-nadeshiko', 
    label: 'Yamato Nadeshiko', 
    emoji: '🏯', 
    description: 'Traditional, graceful, wise, nurturing',
    color: 'text-purple-400'
  },
  { 
    value: 'bokukko', 
    label: 'Bokukko', 
    emoji: '👊', 
    description: 'Tomboyish, brave, direct, confident',
    color: 'text-green-400'
  }
];

const characterRoles = [
  { value: 'farmer', label: 'Eco-Farmer', emoji: '🌾', description: 'Master of sustainable agriculture' },
  { value: 'warrior', label: 'Climate Warrior', emoji: '⚔️', description: 'Fights environmental disasters' },
  { value: 'mage', label: 'Nature Mage', emoji: '🔮', description: 'Uses magic to heal the earth' },
  { value: 'guardian', label: 'Earth Guardian', emoji: '🛡️', description: 'Protects natural balance' },
  { value: 'explorer', label: 'Shard Explorer', emoji: '🗺️', description: 'Discovers new farming territories' },
  { value: 'scientist', label: 'Agri-Scientist', emoji: '🔬', description: 'Researches climate solutions' },
  { value: 'merchant', label: 'Eco-Merchant', emoji: '💰', description: 'Trades sustainable resources' },
  { value: 'healer', label: 'Land Healer', emoji: '✨', description: 'Restores damaged ecosystems' }
];

const elements = [
  { value: 'earth', label: 'Earth', emoji: '🌍', color: 'text-green-400', description: 'Soil, plants, stability' },
  { value: 'water', label: 'Water', emoji: '💧', color: 'text-blue-400', description: 'Rivers, rain, flow' },
  { value: 'fire', label: 'Fire', emoji: '🔥', color: 'text-red-400', description: 'Energy, passion, transformation' },
  { value: 'air', label: 'Air', emoji: '💨', color: 'text-gray-400', description: 'Wind, freedom, change' },
  { value: 'nature', label: 'Nature', emoji: '🌿', color: 'text-green-500', description: 'Life, growth, harmony' },
  { value: 'ice', label: 'Ice', emoji: '❄️', color: 'text-cyan-400', description: 'Preservation, clarity, patience' }
];

export function EnhancedAICharacterCreator({ onNavigate }: EnhancedAICharacterCreatorProps) {
  const { updateCharacterAppearance } = useGame();
  const [isGenerating, setIsGenerating] = useState(false);
  const [character, setCharacter] = useState<EnhancedCharacter | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Generation settings
  const [style, setStyle] = useState('anime');
  const [personalityArchetype, setPersonalityArchetype] = useState('genki');
  const [role, setRole] = useState('farmer');
  const [element, setElement] = useState('earth');
  const [ageGroup, setAgeGroup] = useState('young-adult');
  const [gender, setGender] = useState('female');
  const [customPrompt, setCustomPrompt] = useState('');
  const [detailLevel, setDetailLevel] = useState('comprehensive');

  const handleGenerateCharacter = async () => {
    setIsGenerating(true);
    
    try {
      const request: EnhancedCharacterRequest = {
        style: style as any,
        personalityArchetype: personalityArchetype as any,
        role: role as any,
        element: element as any,
        ageGroup: ageGroup as any,
        gender: gender as any,
        customPrompt: customPrompt || undefined,
        detailLevel: detailLevel as any
      };
      
      const generatedChar = await enhancedAICharacterGenerator.generateEnhancedCharacter(request);
      
      setCharacter(generatedChar);
      toast.success(`🤖 ${generatedChar.name} created with real DeepSeek AI!`);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate character. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCharacter = () => {
    if (!character) return;
    
    // Convert to game character format
    updateCharacterAppearance({
      characterType: 0, // Enhanced AI generated
      name: character.name,
      hairColor: 0,
      skinTone: 0,
      eyeColor: 0,
      outfit: 0,
      accessory: 0,
      personalityTrait: 0,
      voiceType: 0
    });
    
    toast.success(`${character.name} saved! Your enhanced AI companion is ready!`);
    onNavigate('playerHub');
  };

  const selectedArchetype = personalityArchetypes.find(p => p.value === personalityArchetype);
  const selectedElement = elements.find(e => e.value === element);

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/80 to-pink-900/90" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 2, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 flex justify-between items-center border-b border-purple-300/20 bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-md">
        <Button
          onClick={() => onNavigate('playerHub')}
          variant="ghost"
          className="text-white hover:bg-purple-500/20 border border-purple-300/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-6 h-6 text-purple-400" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl text-white">Enhanced AI Character Creator</h1>
            <div className="flex items-center gap-2 justify-center">
              <p className="text-sm text-purple-300">Create Detailed Anime Characters</p>
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 text-xs">
                Enhanced AI
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            🤖 Real AI Active
          </Badge>
        </div>
      </div>

      <div className="relative z-10 h-[calc(100vh-80px)] flex">
        {/* Left Panel - Generation Controls */}
        <div className="w-96 p-6 border-r border-purple-300/20 bg-gradient-to-b from-purple-900/20 to-indigo-900/20 backdrop-blur-sm overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
                <h3 className="text-purple-400 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Basic Settings
                </h3>
                
                {/* Art Style */}
                <div className="mb-4">
                  <Label className="text-white/70 mb-2 block">Anime Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="bg-black/40 border-purple-400/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {animeStyles.map(s => (
                        <SelectItem key={s.value} value={s.value}>
                          <div className="flex items-center gap-2">
                            <span>{s.emoji}</span>
                            <span>{s.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-white/50 mt-1">
                    {animeStyles.find(s => s.value === style)?.description}
                  </p>
                </div>

                {/* Personality Archetype */}
                <div className="mb-4">
                  <Label className="text-white/70 mb-2 block">Personality Archetype</Label>
                  <Select value={personalityArchetype} onValueChange={setPersonalityArchetype}>
                    <SelectTrigger className="bg-black/40 border-purple-400/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {personalityArchetypes.map(p => (
                        <SelectItem key={p.value} value={p.value}>
                          <div className="flex items-center gap-2">
                            <span>{p.emoji}</span>
                            <span className={p.color}>{p.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedArchetype && (
                    <p className="text-xs text-white/50 mt-1">
                      {selectedArchetype.description}
                    </p>
                  )}
                </div>

                {/* Character Role */}
                <div className="mb-4">
                  <Label className="text-white/70 mb-2 block">Character Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="bg-black/40 border-purple-400/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {characterRoles.map(r => (
                        <SelectItem key={r.value} value={r.value}>
                          <div className="flex items-center gap-2">
                            <span>{r.emoji}</span>
                            <span>{r.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Element */}
                <div>
                  <Label className="text-white/70 mb-2 block">Elemental Affinity</Label>
                  <Select value={element} onValueChange={setElement}>
                    <SelectTrigger className="bg-black/40 border-purple-400/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {elements.map(e => (
                        <SelectItem key={e.value} value={e.value}>
                          <div className="flex items-center gap-2">
                            <span>{e.emoji}</span>
                            <span className={e.color}>{e.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedElement && (
                    <p className="text-xs text-white/50 mt-1">
                      {selectedElement.description}
                    </p>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
                <h3 className="text-purple-400 mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Advanced Options
                </h3>
                
                {/* Age Group */}
                <div className="mb-4">
                  <Label className="text-white/70 mb-2 block">Age Group</Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup}>
                    <SelectTrigger className="bg-black/40 border-purple-400/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teenager">Teenager (16-19)</SelectItem>
                      <SelectItem value="young-adult">Young Adult (20-25)</SelectItem>
                      <SelectItem value="adult">Adult (26-35)</SelectItem>
                      <SelectItem value="mature">Mature (35+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender */}
                <div className="mb-4">
                  <Label className="text-white/70 mb-2 block">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="bg-black/40 border-purple-400/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="non-binary">Non-Binary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Detail Level */}
                <div>
                  <Label className="text-white/70 mb-2 block">Detail Level</Label>
                  <Select value={detailLevel} onValueChange={setDetailLevel}>
                    <SelectTrigger className="bg-black/40 border-purple-400/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Details</SelectItem>
                      <SelectItem value="detailed">Detailed Profile</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive (Recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
                <h3 className="text-purple-400 mb-4 flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Custom Prompt
                </h3>
                
                <div>
                  <Label className="text-white/70 mb-2 block">Custom Requirements</Label>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="E.g., has fox ears, wears traditional kimono, loves cooking, has a secret past..."
                    className="bg-black/40 border-purple-400/30 text-white placeholder:text-gray-500 min-h-24"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    Describe specific features, traits, or story elements you want
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateCharacter}
            disabled={isGenerating}
            className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Enhanced Character...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate Enhanced Character
              </>
            )}
          </Button>
        </div>

        {/* Center Panel - Character Preview */}
        <div className="flex-1 p-6 overflow-y-auto">
          {!character ? (
            <div className="h-full flex flex-col items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-6"
              >
                <Brain className="w-32 h-32 text-purple-400/50" />
              </motion.div>
              <h3 className="text-white text-2xl mb-3">Create Your Enhanced AI Character</h3>
              <p className="text-white/70 text-center max-w-md mb-6">
                Use advanced AI to generate a deeply detailed anime character with comprehensive personality, 
                backstory, relationships, and memory systems for Character.AI-like interactions!
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Card className="p-3 bg-purple-500/10 border-purple-400/30">
                  <h4 className="text-purple-400 mb-2">✨ Enhanced Features</h4>
                  <ul className="text-white/70 text-xs space-y-1">
                    <li>• Detailed personality archetypes</li>
                    <li>• Comprehensive backstories</li>
                    <li>• Advanced conversation styles</li>
                    <li>• Memory system integration</li>
                  </ul>
                </Card>
                <Card className="p-3 bg-pink-500/10 border-pink-400/30">
                  <h4 className="text-pink-400 mb-2">🎌 Anime Authenticity</h4>
                  <ul className="text-white/70 text-xs space-y-1">
                    <li>• Authentic personality types</li>
                    <li>• Japanese name generation</li>
                    <li>• Anime-style characteristics</li>
                    <li>• Cultural speech patterns</li>
                  </ul>
                </Card>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Character Header */}
              <Card className="p-6 bg-black/40 border-purple-400/30 backdrop-blur-sm mb-6">
                <div className="flex items-start gap-6">
                  <div className="relative w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1700996003686-327c5bf8d926?w=1024"
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Character Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <motion.h2 
                        className="text-xl text-white mb-1"
                        animate={{ 
                          textShadow: ['0 0 10px #a78bfa', '0 0 20px #a78bfa', '0 0 10px #a78bfa'] 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {character.name}
                      </motion.h2>
                      <p className="text-purple-300 text-sm">{character.japaneseName}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40">
                        {character.personalityArchetype}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40">
                        {character.gameData.role}
                      </Badge>
                      <Badge className={`${selectedElement?.color} bg-current/20 border-current/40`}>
                        {selectedElement?.emoji} {character.gameData.element}
                      </Badge>
                    </div>
                    
                    <p className="text-white/80 mb-4 leading-relaxed">
                      {character.personalityDescription}
                    </p>
                    
                    <Card className="p-3 bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-400/20">
                      <p className="text-pink-300 text-center italic">
                        "{character.catchPhrase}"
                      </p>
                    </Card>
                  </div>
                </div>
              </Card>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
                  <h4 className="text-purple-400 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Enhanced Stats
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(character.stats).map(([stat, value]) => (
                      <div key={stat} className="flex justify-between items-center">
                        <span className="text-white/70 capitalize">{stat}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={value} className="w-20 h-2" />
                          <span className="text-xs text-white w-8">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
                  <h4 className="text-purple-400 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Character Traits
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-green-400 mb-1">Positive Traits</p>
                      <div className="flex flex-wrap gap-1">
                        {character.characterTraits.positive.slice(0, 3).map((trait, index) => (
                          <Badge key={index} className="bg-green-500/20 text-green-300 border-green-500/40 text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-blue-400 mb-1">Quirks</p>
                      <div className="flex flex-wrap gap-1">
                        {character.characterTraits.quirks.map((quirk, index) => (
                          <Badge key={index} className="bg-blue-500/20 text-blue-300 border-blue-500/40 text-xs">
                            {quirk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Appearance Details */}
              <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm mb-6">
                <h4 className="text-purple-400 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Detailed Appearance
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-white/50 mb-2">Physical</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white/70">Age</span>
                        <span className="text-purple-300">{character.appearance.age}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Height</span>
                        <span className="text-purple-300">{character.appearance.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Build</span>
                        <span className="text-purple-300">{character.appearance.build}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/50 mb-2">Features</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white/70">Hair</span>
                        <span className="text-purple-300">{character.appearance.hairColor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Eyes</span>
                        <span className="text-purple-300">{character.appearance.eyeColor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Skin</span>
                        <span className="text-purple-300">{character.appearance.skinTone}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/50 mb-2">Style</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white/70">Mood</span>
                        <span className="text-purple-300">{character.appearance.mood}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Aura</span>
                        <span className="text-purple-300">{character.appearance.aura}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Backstory */}
              <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm mb-6">
                <h4 className="text-purple-400 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Character Backstory
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Origin</p>
                    <p className="text-white/80">{character.backstory.origin}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">Motivation</p>
                    <p className="text-white/80">{character.backstory.motivation}</p>
                  </div>
                </div>
              </Card>

              {/* Conversation Style Preview */}
              <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm mb-6">
                <h4 className="text-purple-400 mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Conversation Style Preview
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-400 mb-2">Greeting Style</p>
                    <div className="space-y-1">
                      {character.conversationStyle.greeting.map((greeting, index) => (
                        <Card key={index} className="p-2 bg-green-500/10 border-green-500/20">
                          <p className="text-white/80 italic">"{greeting}"</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-blue-400 mb-2">Encouragement Style</p>
                    <div className="space-y-1">
                      {character.conversationStyle.encouragement.map((encouragement, index) => (
                        <Card key={index} className="p-2 bg-blue-500/10 border-blue-500/20">
                          <p className="text-white/80 italic">"{encouragement}"</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Save Button */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSaveCharacter}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Enhanced Character & Continue
                </Button>
                <Button
                  onClick={() => onNavigate('enhancedCharacterChat')}
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
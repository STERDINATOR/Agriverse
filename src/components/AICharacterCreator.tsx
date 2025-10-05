import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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
  Shirt
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { aiCharacterGenerator, GeneratedCharacter, ImageGenerationProvider } from '../services/AICharacterGenerator';
import { toast } from 'sonner@2.0.3';

interface AICharacterCreatorProps {
  onNavigate: (screen: string) => void;
}

const artStyles = [
  { value: 'anime', label: 'Anime', emoji: '🎌' },
  { value: 'manga', label: 'Manga', emoji: '📖' },
  { value: 'chibi', label: 'Chibi', emoji: '🧸' },
  { value: 'realistic-anime', label: 'Realistic Anime', emoji: '✨' },
  { value: 'shounen', label: 'Shounen', emoji: '⚔️' },
  { value: 'shoujo', label: 'Shoujo', emoji: '🌸' }
];

const characterRoles = [
  { value: 'farmer', label: 'Farmer', emoji: '🌾' },
  { value: 'warrior', label: 'Warrior', emoji: '⚔️' },
  { value: 'mage', label: 'Mage', emoji: '🔮' },
  { value: 'guardian', label: 'Guardian', emoji: '🛡️' },
  { value: 'explorer', label: 'Explorer', emoji: '🗺️' }
];

const presetOutfits = [
  { id: 'eco-farmer', name: 'Eco-Farmer Outfit', description: 'Modern farming overalls with eco-tech accessories' },
  { id: 'battle-ready', name: 'Battle-Ready Gear', description: 'Armored vest with combat farming tools' },
  { id: 'mystic-robes', name: 'Mystic Robes', description: 'Flowing robes with nature patterns and enchantments' },
  { id: 'explorer-gear', name: 'Explorer Gear', description: 'Practical adventure clothing with climate sensors' },
  { id: 'guardian-armor', name: 'Guardian Armor', description: 'Protective armor infused with eco-energy' },
  { id: 'casual-style', name: 'Casual Style', description: 'Everyday clothing with farming accessories' }
];

const presetAccessories = [
  ['Smart greenhouse pendant', 'Seed pouch belt', 'Climate monitor bracelet'],
  ['Dragon-scale shoulder guard', 'Storm amulet', 'Combat gloves'],
  ['Crescent moon tiara', 'Star seed pouch', 'Crystal compass'],
  ['Weather goggles', 'Compass watch', 'Explorer backpack'],
  ['Shield emblem', 'Guardian seal', 'Protection charm'],
  ['Sun hat', 'Garden gloves', 'Water bottle']
];

export function AICharacterCreator({ onNavigate }: AICharacterCreatorProps) {
  const { updateCharacterAppearance } = useGame();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [character, setCharacter] = useState<GeneratedCharacter | null>(null);
  
  // Generation settings
  const [artStyle, setArtStyle] = useState('anime');
  const [role, setRole] = useState('farmer');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedOutfit, setSelectedOutfit] = useState<number | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<number | null>(null);
  
  // Image generation settings
  const [imageProvider, setImageProvider] = useState<'stability-ai' | 'dalle' | 'replicate' | 'placeholder'>('placeholder');
  const [imageApiKey, setImageApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleGenerateCharacter = async () => {
    setIsGenerating(true);
    
    try {
      const generatedChar = await aiCharacterGenerator.generateCharacter({
        style: artStyle as any,
        role: role as any,
        customPrompt: customPrompt || undefined
      });
      
      setCharacter(generatedChar);
      toast.success(`✨ ${generatedChar.name} has been created!`);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate character. Using demo character.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!character) return;
    
    setIsGeneratingImage(true);
    
    try {
      const provider: ImageGenerationProvider = {
        name: imageProvider,
        apiKey: imageApiKey
      };
      
      const imageUrl = await aiCharacterGenerator.generateCharacterImage(
        character.imagePrompt,
        provider
      );
      
      setCharacter({ ...character, imageUrl });
      
      if (imageProvider === 'placeholder') {
        toast.info('Using placeholder image. Connect an AI image service for custom generation!');
      } else {
        toast.success('🎨 Character image generated!');
      }
    } catch (error) {
      console.error('Image generation error:', error);
      toast.error('Failed to generate image. Using placeholder.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleApplyOutfit = (outfitIndex: number) => {
    if (!character) return;
    
    setSelectedOutfit(outfitIndex);
    const modified = aiCharacterGenerator.applyPresetModifications(character, {
      outfit: presetOutfits[outfitIndex].description
    });
    
    setCharacter(modified);
    toast.success(`Outfit changed to ${presetOutfits[outfitIndex].name}`);
  };

  const handleApplyAccessories = (accessoryIndex: number) => {
    if (!character) return;
    
    setSelectedAccessories(accessoryIndex);
    const modified = aiCharacterGenerator.applyPresetModifications(character, {
      accessories: presetAccessories[accessoryIndex]
    });
    
    setCharacter(modified);
    toast.success('Accessories updated!');
  };

  const handleSaveCharacter = () => {
    if (!character) return;
    
    // Convert to game character format
    updateCharacterAppearance({
      characterType: 0, // Custom AI generated
      name: character.name,
      hairColor: 0,
      skinTone: 0,
      eyeColor: 0,
      outfit: 0,
      accessory: 0,
      personalityTrait: 0,
      voiceType: 0
    });
    
    toast.success(`${character.name} saved! Ready for adventure!`);
    onNavigate('playerHub');
  };

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/80 to-pink-900/90" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 8,
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
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Wand2 className="w-6 h-6 text-purple-400" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl text-white">AI Character Creator</h1>
            <div className="flex items-center gap-2 justify-center">
              <p className="text-sm text-purple-300">Create Unique Characters</p>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                Demo Mode
              </Badge>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant="outline"
          size="sm"
          className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="relative z-10 h-[calc(100vh-80px)] flex">
        {/* Left Panel - Generation Controls */}
        <div className="w-96 p-6 border-r border-purple-300/20 bg-gradient-to-b from-purple-900/20 to-indigo-900/20 backdrop-blur-sm overflow-y-auto">
          <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm mb-4">
            <h3 className="text-purple-400 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Character
            </h3>
            
            <div className="space-y-4">
              {/* Art Style */}
              <div>
                <Label className="text-white/70 mb-2 block">Art Style</Label>
                <Select value={artStyle} onValueChange={setArtStyle}>
                  <SelectTrigger className="bg-black/40 border-purple-400/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {artStyles.map(style => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.emoji} {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Character Role */}
              <div>
                <Label className="text-white/70 mb-2 block">Character Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-black/40 border-purple-400/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {characterRoles.map(r => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.emoji} {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Prompt */}
              <div>
                <Label className="text-white/70 mb-2 block">Custom Details (Optional)</Label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="E.g., blue eyes, long hair, cheerful personality..."
                  className="bg-black/40 border-purple-400/30 text-white placeholder:text-gray-500 min-h-20"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateCharacter}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Character
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Preset Outfits */}
          {character && (
            <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm mb-4">
              <h3 className="text-purple-400 mb-3 flex items-center gap-2">
                <Shirt className="w-4 h-4" />
                Preset Outfits
              </h3>
              <div className="space-y-2">
                {presetOutfits.map((outfit, index) => (
                  <Button
                    key={outfit.id}
                    onClick={() => handleApplyOutfit(index)}
                    variant={selectedOutfit === index ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-start text-left ${
                      selectedOutfit === index 
                        ? 'bg-purple-500 text-white' 
                        : 'border-purple-400/30 text-purple-300 hover:bg-purple-400/10'
                    }`}
                  >
                    <Palette className="w-3 h-3 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{outfit.name}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          )}

          {/* Preset Accessories */}
          {character && (
            <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
              <h3 className="text-purple-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Accessory Sets
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {['Set 1', 'Set 2', 'Set 3', 'Set 4', 'Set 5', 'Set 6'].map((set, index) => (
                  <Button
                    key={index}
                    onClick={() => handleApplyAccessories(index)}
                    variant={selectedAccessories === index ? "default" : "outline"}
                    size="sm"
                    className={selectedAccessories === index 
                      ? 'bg-purple-500 text-white' 
                      : 'border-purple-400/30 text-purple-300 hover:bg-purple-400/10'
                    }
                  >
                    {set}
                  </Button>
                ))}
              </div>
            </Card>
          )}
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
                <Wand2 className="w-24 h-24 text-purple-400/50" />
              </motion.div>
              <h3 className="text-white text-xl mb-2">Create Your Character</h3>
              <p className="text-white/70 text-center max-w-md">
                Use DeepSeek AI to generate a unique anime character concept, then customize with preset outfits and accessories!
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Character Image */}
              <Card className="p-6 bg-black/40 border-purple-400/30 backdrop-blur-sm mb-6">
                <div className="relative aspect-square max-w-xl mx-auto rounded-xl overflow-hidden mb-4">
                  <ImageWithFallback
                    src={character.imageUrl || 'https://images.unsplash.com/photo-1700996003686-327c5bf8d926?w=1024'}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Character Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.h2 
                      className="text-3xl text-white mb-2"
                      animate={{ 
                        textShadow: ['0 0 10px #a78bfa', '0 0 20px #a78bfa', '0 0 10px #a78bfa'] 
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {character.name}
                    </motion.h2>
                    <p className="text-purple-300">{character.personality}</p>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Image...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate New Image
                    </>
                  )}
                </Button>
              </Card>

              {/* Character Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
                  <h4 className="text-purple-400 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Stats
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Strength</span>
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/40">
                        {character.stats.strength}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Intelligence</span>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40">
                        {character.stats.intelligence}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Charisma</span>
                      <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/40">
                        {character.stats.charisma}
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
                  <h4 className="text-purple-400 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Appearance
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Hair</span>
                      <span className="text-purple-300">{character.appearance.hairColor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Eyes</span>
                      <span className="text-purple-300">{character.appearance.eyeColor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Style</span>
                      <span className="text-purple-300">{character.appearance.hairStyle.substring(0, 15)}...</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm mb-6">
                <h4 className="text-purple-400 mb-3">Backstory</h4>
                <p className="text-white/80 leading-relaxed">{character.backstory}</p>
              </Card>

              <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm mb-6">
                <h4 className="text-purple-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Current Accessories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {character.appearance.accessories.map((acc, index) => (
                    <Badge key={index} className="bg-purple-500/20 text-purple-300 border-purple-500/40">
                      {acc}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Save Button */}
              <Button
                onClick={handleSaveCharacter}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Character & Continue
              </Button>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 p-6 border-l border-purple-300/20 bg-gradient-to-b from-indigo-900/20 to-purple-900/20 backdrop-blur-sm overflow-y-auto"
            >
              <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
                <h3 className="text-purple-400 mb-4">Image Generation Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/70 mb-2 block">Image Provider</Label>
                    <Select value={imageProvider} onValueChange={(v: any) => setImageProvider(v)}>
                      <SelectTrigger className="bg-black/40 border-purple-400/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placeholder">Placeholder (Free)</SelectItem>
                        <SelectItem value="stability-ai">Stability AI</SelectItem>
                        <SelectItem value="dalle">DALL-E 3</SelectItem>
                        <SelectItem value="replicate">Replicate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {imageProvider !== 'placeholder' && (
                    <div>
                      <Label className="text-white/70 mb-2 block">API Key</Label>
                      <Input
                        type="password"
                        value={imageApiKey}
                        onChange={(e) => setImageApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="bg-black/40 border-purple-400/30 text-white"
                      />
                      <p className="text-xs text-white/50 mt-1">
                        Your API key is stored locally and never sent to our servers.
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-purple-400/20">
                    <h4 className="text-white/70 mb-2">About</h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                      This tool uses DeepSeek AI to generate character concepts. For custom images, connect your own AI image generation service.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

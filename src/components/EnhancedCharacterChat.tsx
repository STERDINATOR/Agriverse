import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Heart,
  MessageCircle,
  Loader2,
  Smile,
  Zap,
  RotateCcw,
  Volume2,
  Star,
  Brain,
  Users,
  Settings,
  Eye,
  Mic,
  Camera,
  Gift
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { enhancedAICharacterGenerator, EnhancedCharacter } from '../services/EnhancedAICharacterGenerator';
import { toast } from 'sonner@2.0.3';

interface EnhancedCharacterChatProps {
  onNavigate: (screen: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'character';
  content: string;
  timestamp: Date;
  emotion?: 'happy' | 'excited' | 'thoughtful' | 'concerned' | 'playful' | 'shy' | 'angry' | 'loving';
  characterGrowth?: string;
}

interface VoiceSettings {
  enabled: boolean;
  speed: number;
  pitch: number;
  voice: string;
}

export function EnhancedCharacterChat({ onNavigate }: EnhancedCharacterChatProps) {
  const { gameState } = useGame();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [character, setCharacter] = useState<EnhancedCharacter | null>(null);
  const [showCharacterStats, setShowCharacterStats] = useState(false);
  const [showMemorySystem, setShowMemorySystem] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: false,
    speed: 1,
    pitch: 1,
    voice: 'default'
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize with enhanced character
  useEffect(() => {
    const initializeCharacter = async () => {
      try {
        const enhancedChar = await enhancedAICharacterGenerator.generateEnhancedCharacter({
          personalityArchetype: 'genki',
          role: 'farmer',
          element: 'earth',
          style: 'anime'
        });
        
        setCharacter(enhancedChar);
        
        // Welcome message
        const welcomeMessage: ChatMessage = {
          id: '0',
          role: 'character',
          content: enhancedChar.conversationStyle.greeting[0] + ' ' + enhancedChar.catchPhrase,
          timestamp: new Date(),
          emotion: 'happy'
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('Error initializing character:', error);
      }
    };

    initializeCharacter();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping || !character) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Generate contextual response using enhanced AI
      const response = await enhancedAICharacterGenerator.generateContextualResponse(
        character,
        inputMessage,
        {
          currentShard: gameState.currentShard || 'Temperate Plains',
          playerLevel: gameState.level || 1,
          resources: gameState.resources || { seeds: 100, water: 100, energy: 100, ecoPoints: 0 }
        }
      );

      // Update character state with memory updates
      if (response.memoryUpdate) {
        setCharacter(prev => prev ? {
          ...prev,
          memory: {
            ...prev.memory,
            ...response.memoryUpdate
          }
        } : null);
      }

      // Add character response
      const characterMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'character',
        content: response.message,
        timestamp: new Date(),
        emotion: response.emotion as any,
        characterGrowth: response.characterGrowth
      };

      setMessages(prev => [...prev, characterMessage]);

      // Show character growth notification
      if (response.characterGrowth) {
        toast.success(`💖 ${response.characterGrowth}`);
      }

      // Text-to-speech if enabled
      if (voiceSettings.enabled) {
        speakMessage(response.message);
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'character',
        content: "Sorry, I'm having trouble thinking right now... Can you try asking again?",
        timestamp: new Date(),
        emotion: 'concerned'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSettings.speed;
      utterance.pitch = voiceSettings.pitch;
      speechSynthesis.speak(utterance);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const emotionIcons = {
    happy: '😊',
    excited: '🤩',
    thoughtful: '🤔',
    concerned: '😟',
    playful: '😏',
    shy: '😳',
    angry: '😠',
    loving: '🥰'
  };

  const relationshipLevel = character?.memory.relationshipLevel || 0;
  const relationshipStage = 
    relationshipLevel >= 80 ? 'Best Friends' :
    relationshipLevel >= 60 ? 'Close Friend' :
    relationshipLevel >= 40 ? 'Friend' :
    relationshipLevel >= 20 ? 'Acquaintance' : 'Stranger';

  const suggestedPrompts = character ? [
    "Tell me about yourself",
    "What's your favorite farming technique?",
    "How do you handle crop disasters?",
    "What are your dreams?",
    "Can you teach me something new?"
  ] : [];

  if (!character) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-900/90 via-pink-900/80 to-blue-900/90 overflow-y-auto overflow-x-hidden">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Generating your AI companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/80 to-blue-900/90 -z-10" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-400/30 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1.5, 0],
              opacity: [0, 0.7, 0]
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 flex justify-between items-center border-b border-pink-300/20 bg-gradient-to-r from-pink-900/40 to-purple-900/40 backdrop-blur-md">
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
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-6 h-6 text-pink-400" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl text-white">Enhanced AI Chat</h1>
            <div className="flex items-center gap-2 justify-center">
              <p className="text-sm text-pink-300">
                {character.name} ({character.personalityArchetype})
              </p>
              <Badge className={`text-xs ${
                relationshipLevel >= 60 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                relationshipLevel >= 30 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                'bg-blue-500/20 text-blue-400 border-blue-500/30'
              }`}>
                {relationshipStage}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setVoiceSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
            variant={voiceSettings.enabled ? "default" : "outline"}
            size="sm"
            className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setShowCharacterStats(!showCharacterStats)}
            variant="outline"
            size="sm"
            className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative z-10 h-[calc(100vh-80px)] flex">
        {/* Character Info Sidebar */}
        <div className="w-80 p-4 border-r border-pink-300/20 bg-gradient-to-b from-pink-900/20 to-purple-900/20 backdrop-blur-sm overflow-y-auto">
          <Card className="p-4 bg-black/40 border-pink-400/30 backdrop-blur-sm mb-4">
            {/* Character Portrait */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1700996003686-327c5bf8d926?w=1024"
                alt={character.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Character Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <motion.h3 
                  className="text-lg text-white mb-1"
                  animate={{ 
                    textShadow: ['0 0 5px #ff69b4', '0 0 15px #ff69b4', '0 0 5px #ff69b4'] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {character.name}
                </motion.h3>
                <p className="text-xs text-pink-300">{character.japaneseName}</p>
                <p className="text-xs text-purple-300">{character.nickname}</p>
              </div>
            </div>

            {/* Relationship Progress */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-pink-400 text-sm">Relationship</span>
              </div>
              <Progress value={relationshipLevel} className="mb-1" />
              <p className="text-xs text-white/70">{relationshipStage} ({relationshipLevel}/100)</p>
            </div>

            {/* Quick Character Info */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Element</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/40 text-xs">
                  {character.gameData.element}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Role</span>
                <span className="text-purple-300">{character.gameData.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Mood</span>
                <span className="text-green-400 flex items-center gap-1">
                  {emotionIcons[character.memory.emotionalState as keyof typeof emotionIcons]}
                  {character.memory.emotionalState}
                </span>
              </div>
            </div>

            {/* Character Catchphrase */}
            <Card className="p-3 bg-purple-900/20 border-purple-400/20 mt-4">
              <p className="text-xs text-white/80 italic text-center">
                "{character.catchPhrase}"
              </p>
            </Card>
          </Card>

          {/* Enhanced Character Stats */}
          <AnimatePresence>
            {showCharacterStats && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="p-4 bg-black/40 border-pink-400/30 backdrop-blur-sm mb-4">
                  <h4 className="text-pink-400 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Enhanced Stats
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(character.stats).map(([stat, value]) => (
                      <div key={stat} className="flex justify-between">
                        <span className="text-white/70 capitalize">{stat}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={value} className="w-16 h-2" />
                          <span className="text-xs text-white w-8">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 bg-black/40 border-pink-400/30 backdrop-blur-sm mb-4">
                  <h4 className="text-purple-400 mb-3">Character Traits</h4>
                  <div className="space-y-2">
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
                        {character.characterTraits.quirks.slice(0, 2).map((quirk, index) => (
                          <Badge key={index} className="bg-blue-500/20 text-blue-300 border-blue-500/40 text-xs">
                            {quirk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Memory System */}
          <Card className="p-4 bg-black/40 border-purple-400/30 backdrop-blur-sm">
            <h4 className="text-purple-400 mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Memory
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/70">Conversations</span>
                <span className="text-blue-400">{character.memory.conversationHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Learned About You</span>
                <span className="text-pink-400">{Object.keys(character.memory.playerPreferences).length}</span>
              </div>
              {Object.keys(character.memory.playerPreferences).length > 0 && (
                <div className="pt-2 border-t border-purple-400/20">
                  <p className="text-white/60 mb-1">Remembers:</p>
                  {Object.entries(character.memory.playerPreferences).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="text-white/50">
                      • You {value} {key}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-purple-900/5 to-blue-900/5">
          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <Card className={`p-4 ${
                      message.role === 'user' 
                        ? 'bg-blue-500/20 border-blue-400/30' 
                        : 'bg-pink-500/20 border-pink-400/30'
                    } backdrop-blur-sm`}>
                      {message.role === 'character' && message.emotion && (
                        <div className="text-2xl mb-2">{emotionIcons[message.emotion]}</div>
                      )}
                      <p className="text-white">{message.content}</p>
                      {message.characterGrowth && (
                        <div className="mt-2 p-2 bg-green-500/20 border border-green-500/30 rounded">
                          <p className="text-green-300 text-sm">💖 {message.characterGrowth}</p>
                        </div>
                      )}
                      <p className="text-xs text-white/50 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <Card className="p-4 bg-pink-500/20 border-pink-400/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-pink-400 animate-spin" />
                    <span className="text-white/70">{character.name} is thinking...</span>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Suggested Prompts */}
          {messages.length <= 1 && (
            <div className="px-6 py-3">
              <p className="text-sm text-white/70 mb-2">Suggested conversations:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    onClick={() => setInputMessage(prompt)}
                    variant="outline"
                    size="sm"
                    className="border-pink-400/30 text-pink-300 hover:bg-pink-400/10 text-xs"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-pink-300/20 bg-black/20 backdrop-blur-sm">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Chat with ${character.name}...`}
                className="flex-1 bg-black/40 border-pink-300/30 text-white placeholder:text-gray-400"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-white/50">
                🤖 Real Gemini AI • Relationship: {relationshipStage}
              </p>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Heart className="w-3 h-3" />
                {relationshipLevel}/100
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
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
  Star
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { characterAIService } from '../services/CharacterAIService';
import { toast } from 'sonner@2.0.3';

interface CharacterChatProps {
  onNavigate: (screen: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'character';
  content: string;
  timestamp: Date;
  emotion?: 'happy' | 'excited' | 'thoughtful' | 'concerned' | 'playful';
}

const characterTypes = [
  {
    name: 'Sakura - Gentle Farmer',
    image: 'https://images.unsplash.com/photo-1700996003686-327c5bf8d926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGZhcm1lciUyMGNoYXJhY3RlciUyMGdpcmx8ZW58MXx8fHwxNzU5NTY4NTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    trait: 'Compassionate'
  },
  {
    name: 'Akira - Tech Prodigy',
    image: 'https://images.unsplash.com/photo-1653004845649-195c2c21fec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGJveSUyMGNoYXJhY3RlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTU2ODU5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    trait: 'Analytical'
  },
  {
    name: 'Luna - Mystic Guardian',
    image: 'https://images.unsplash.com/photo-1697059172415-f1e08f9151bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGdpcmwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTk1Njg2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    trait: 'Mystical'
  },
  {
    name: 'Yuki - Ice Princess',
    image: 'https://images.unsplash.com/photo-1663035045563-24d54c1e8e28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMG1hZ2ljYWwlMjBnaXJsJTIwY2hhcmFjdGVyfGVufDF8fHx8MTc1OTU2ODYwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    trait: 'Determined'
  }
];

const personalityTraits = [
  { name: 'Kuudere', description: 'Cool exterior, warm heart' },
  { name: 'Genki', description: 'Energetic and optimistic' },
  { name: 'Dandere', description: 'Quiet but caring' },
  { name: 'Tsundere', description: 'Tough outside, soft inside' },
  { name: 'Yamato Nadeshiko', description: 'Traditional and graceful' },
  { name: 'Bokukko', description: 'Tomboyish and brave' }
];

const emotionIcons = {
  happy: '😊',
  excited: '🤩',
  thoughtful: '🤔',
  concerned: '😟',
  playful: '😏'
};

export function CharacterChat({ onNavigate }: CharacterChatProps) {
  const { gameState } = useGame();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const characterAppearance = gameState.characterAppearance || {
    characterType: 0,
    name: 'Farmer',
    personalityTrait: 0
  };

  const currentCharacter = characterTypes[characterAppearance.characterType];
  const currentPersonality = personalityTraits[characterAppearance.personalityTrait];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: '0',
      role: 'character',
      content: `Hey there! I'm ${characterAppearance.name}, your farming companion in AgriVerse! ${getPersonalityGreeting()} How can I help you today? Feel free to ask me about farming strategies, climate challenges, or just chat about anything!`,
      timestamp: new Date(),
      emotion: 'happy'
    };
    setMessages([welcomeMessage]);
  }, []);

  const getPersonalityGreeting = () => {
    const greetings = {
      'Kuudere': "I may seem distant, but I'm here to support you.",
      'Genki': "I'm super excited to adventure with you! ⚡",
      'Dandere': "I'm a bit shy, but I'll do my best to help you...",
      'Tsundere': "It's not like I wanted to help you or anything... but I will!",
      'Yamato Nadeshiko': "It would be my honor to assist you on this journey.",
      'Bokukko': "Let's tackle these farming challenges together, partner! ⚔️"
    };
    return greetings[currentPersonality.name as keyof typeof greetings] || '';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

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
      // Get AI response
      const response = await characterAIService.chat({
        message: inputMessage,
        characterName: characterAppearance.name,
        characterTrait: currentCharacter.trait,
        personalityType: currentPersonality.name,
        conversationHistory: conversationContext,
        gameContext: {
          currentShard: gameState.currentShard || 'Temperate Plains',
          playerLevel: gameState.level || 1,
          resources: gameState.resources || { seeds: 100, water: 100, energy: 100, ecoPoints: 0 }
        }
      });

      // Add character response
      const characterMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'character',
        content: response.message,
        timestamp: new Date(),
        emotion: response.emotion
      };

      setMessages(prev => [...prev, characterMessage]);
      
      // Update conversation context
      setConversationContext(prev => [
        ...prev.slice(-8), // Keep last 8 messages for context
        inputMessage,
        response.message
      ]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'character',
      content: "Fresh start! What would you like to talk about?",
      timestamp: new Date(),
      emotion: 'happy'
    };
    setMessages([welcomeMessage]);
    setConversationContext([]);
    toast.info('Chat cleared!');
  };

  const suggestedPrompts = [
    "What crops should I plant?",
    "Tell me about yourself",
    "How do I deal with drought?",
    "What's your favorite thing about farming?",
    "Give me farming tips"
  ];

  const handleSuggestedPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/80 to-blue-900/90" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-400/30 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
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
            <MessageCircle className="w-6 h-6 text-pink-400" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl text-white">Character Chat</h1>
            <div className="flex items-center gap-2 justify-center">
              <p className="text-sm text-pink-300">Talk with {characterAppearance.name}</p>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                Interactive
              </Badge>
            </div>
          </div>
        </div>

        <Button
          onClick={handleClearChat}
          variant="outline"
          size="sm"
          className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="relative z-10 h-[calc(100vh-80px)] flex">
        {/* Character Info Sidebar */}
        <div className="w-80 p-4 border-r border-pink-300/20 bg-gradient-to-b from-pink-900/20 to-purple-900/20 backdrop-blur-sm">
          <Card className="p-4 bg-black/40 border-pink-400/30 backdrop-blur-sm">
            {/* Character Portrait */}
            <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4">
              <ImageWithFallback
                src={currentCharacter.image}
                alt={currentCharacter.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Character Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <motion.h3 
                  className="text-xl text-white mb-1"
                  animate={{ 
                    textShadow: ['0 0 5px #ff69b4', '0 0 15px #ff69b4', '0 0 5px #ff69b4'] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {characterAppearance.name}
                </motion.h3>
                <p className="text-sm text-pink-300">{currentCharacter.trait}</p>
              </div>
            </div>

            {/* Personality Info */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <h4 className="text-pink-400">Personality</h4>
                </div>
                <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/40">
                  {currentPersonality.name}
                </Badge>
                <p className="text-xs text-white/70 mt-2">{currentPersonality.description}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h4 className="text-purple-400">Status</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Mood</span>
                    <span className="text-green-400">Happy 😊</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Relationship</span>
                    <span className="text-pink-400 flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Friendly
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Messages</span>
                    <span className="text-blue-400">{messages.length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <Card className="p-3 bg-purple-900/20 border-purple-400/20">
                <p className="text-xs text-white/80 italic">
                  "I'm here to help you succeed in AgriVerse! Ask me anything about farming, climate challenges, or just chat!"
                </p>
              </Card>
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
                    <span className="text-white/70">{characterAppearance.name} is typing...</span>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Suggested Prompts (shown when chat is empty or after welcome) */}
          {messages.length <= 1 && (
            <div className="px-6 py-3">
              <p className="text-sm text-white/70 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt)}
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
                placeholder={`Chat with ${characterAppearance.name}...`}
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
            <p className="text-xs text-white/50 mt-2 text-center">
              🤖 Real DeepSeek AI Active • Press Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

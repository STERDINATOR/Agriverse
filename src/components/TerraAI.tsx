import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  ArrowLeft, 
  Bot, 
  Send, 
  Sparkles, 
  Brain, 
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Lightbulb,
  Target,
  Globe,
  Leaf,
  MessageSquare,
  Mic,
  MicOff,
  RefreshCw
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { deepSeekAIService, TerraAIResponse, TerraAIContext } from '../services/DeepSeekAIService';
import { toast } from 'sonner@2.0.3';

interface TerraAIProps {
  onNavigate: (screen: string) => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  response?: TerraAIResponse;
}

const quickQuestions = [
  "What crops should I plant in current conditions?",
  "How can I optimize my water usage?",
  "What are the climate risks for my shard?",
  "How can I improve my farming efficiency?",
  "What emergency actions should I take?",
  "How do I adapt to changing weather patterns?"
];

export function TerraAI({ onNavigate }: TerraAIProps) {
  const { gameState, getCurrentShard, getCropsForCurrentShard } = useGame();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [quickAdvice, setQuickAdvice] = useState<string[]>([]);
  const [currentAlerts, setCurrentAlerts] = useState<{ message: string; urgency: string }[]>([]);
  const [messagesEndRef, setMessagesEndRef] = useState<HTMLDivElement | null>(null);

  const currentShard = getCurrentShard();
  const currentCrops = getCropsForCurrentShard();

  // Initialize TERRA-AI with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'ai',
      content: "👋 Hello! I'm TERRA-AI, your intelligent farming advisor. I analyze NASA climate data and your farming conditions to provide personalized guidance. How can I help optimize your agricultural operations today?",
      timestamp: new Date(),
      response: {
        message: "Welcome to TERRA-AI assistance!",
        recommendations: [
          "Ask me about crop selection for current conditions",
          "Get real-time climate analysis and alerts",
          "Receive strategic farming optimization advice",
          "Learn about climate adaptation techniques"
        ],
        urgency: 'low',
        category: 'farming',
        actionItems: [],
        confidence: 100
      }
    };
    setMessages([welcomeMessage]);
    loadQuickAdvice();
    loadCurrentAlerts();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef) {
      messagesEndRef.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messagesEndRef]);

  // Refresh data when shard changes
  useEffect(() => {
    loadQuickAdvice();
    loadCurrentAlerts();
  }, [gameState.currentShardId, gameState.nasaData]);

  const loadQuickAdvice = async () => {
    try {
      const context = buildAIContext();
      const advice = await deepSeekAIService.getQuickAdvice(context);
      setQuickAdvice(advice);
    } catch (error) {
      console.error('Failed to load quick advice:', error);
    }
  };

  const loadCurrentAlerts = async () => {
    try {
      const context = buildAIContext();
      const alerts = await deepSeekAIService.getAlerts(context);
      setCurrentAlerts(alerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  const buildAIContext = (): TerraAIContext => {
    return {
      nasaData: gameState.nasaData || undefined,
      farmingConditions: gameState.farmingConditions || undefined,
      currentShard: currentShard.name,
      playerLevel: gameState.playerLevel,
      resources: gameState.resources,
      activeCrops: currentCrops.length,
      recentActions: ['farming', 'watering', 'planting'] // This could be enhanced to track actual actions
    };
  };

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = buildAIContext();
      const response = await deepSeekAIService.askTerraAI(message, context);
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: response.message,
        timestamp: new Date(),
        response
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Show toast for urgent recommendations
      if (response.urgency === 'critical' || response.urgency === 'high') {
        toast.warning(`TERRA-AI Alert: ${response.recommendations[0]}`);
      }
    } catch (error) {
      console.error('TERRA-AI Error details:', error);
      
      // Check if all endpoints failed (API key issue)
      const allEndpointsFailed = error instanceof Error && error.message.includes('All DeepSeek API endpoints failed');
      const is404Error = error instanceof Error && error.message.includes('404');
      
      let userFriendlyMessage = '';
      let hint = '';
      
      if (allEndpointsFailed) {
        userFriendlyMessage = `I'm currently running in Demo Mode with simulated responses. `;
        hint = ' 💡 The DeepSeek API is not accessible - this may be due to API key permissions or regional restrictions. You can still use all features with demo data, or check the API Diagnostics panel (bottom-right) for more information.';
      } else if (is404Error) {
        userFriendlyMessage = `I encountered a technical issue. `;
        hint = ' 💡 TIP: Try clearing browser cache (Ctrl+Shift+R) or check API Diagnostics.';
      } else {
        userFriendlyMessage = `I'm experiencing technical difficulties. `;
        hint = ' Please try again or check the NASA data panel for current conditions.';
      }
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: `${userFriendlyMessage}${hint}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Don't show error toast for expected fallback behavior
      if (!allEndpointsFailed) {
        toast.error(`TERRA-AI: ${userFriendlyMessage}`, {
          duration: is404Error ? 8000 : 4000
        });
      } else {
        toast.info('TERRA-AI running in Demo Mode with simulated responses', {
          duration: 5000
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '#DC2626';
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD369';
      case 'low': return '#73C783';
      default: return '#6EE7B7';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical': case 'high': return AlertTriangle;
      case 'medium': return TrendingUp;
      case 'low': return CheckCircle;
      default: return Lightbulb;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'farming': return Leaf;
      case 'climate': return Globe;
      case 'strategy': return Target;
      case 'emergency': return AlertTriangle;
      default: return Brain;
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 to-black/80" />

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center border-b border-white/10">
        <Button
          onClick={() => onNavigate('mainMenu')}
          variant="ghost"
          className="text-[#E5E7EB] hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Main Menu
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-8 h-8 text-[#6EE7B7]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#6EE7B7] rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl text-[#E5E7EB]">TERRA-AI</h1>
            <p className="text-sm text-[#6EE7B7]">Intelligent Farming Advisor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={loadCurrentAlerts}
            variant="ghost"
            size="sm"
            className="text-[#FFD369] hover:bg-[#FFD369]/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
          <Button
            onClick={() => handleSendMessage("Test connection")}
            variant="ghost"
            size="sm"
            className="text-[#73C783] hover:bg-[#73C783]/10"
          >
            <Zap className="w-4 h-4 mr-2" />
            Test AI
          </Button>
          <Badge className="bg-[#6EE7B7]/20 text-[#6EE7B7] border-[#6EE7B7]/40">
            Neural Network Active
          </Badge>
        </div>
      </div>

      <div className="relative z-10 h-[calc(100vh-80px)] flex">
        {/* Left Sidebar - Quick Actions & Status */}
        <div className="w-80 p-4 space-y-4 border-r border-white/10">
          {/* Current Alerts */}
          {currentAlerts.length > 0 && (
            <Card className="p-4 bg-black/40 border-[#FF6B6B]/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-[#FF6B6B]" />
                <h3 className="text-[#FF6B6B]">Active Alerts</h3>
              </div>
              <div className="space-y-2">
                {currentAlerts.slice(0, 3).map((alert, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: getUrgencyColor(alert.urgency) }}
                    />
                    <p className="text-xs text-[#E5E7EB]/80 leading-tight">{alert.message}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Advice */}
          <Card className="p-4 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-[#6EE7B7]" />
              <h3 className="text-[#6EE7B7]">Quick Recommendations</h3>
            </div>
            <div className="space-y-2">
              {quickAdvice.map((advice, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-[#73C783] mt-1 flex-shrink-0" />
                  <p className="text-xs text-[#E5E7EB]/80 leading-tight">{advice}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Questions */}
          <Card className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-[#FFD369]" />
              <h3 className="text-[#FFD369]">Quick Questions</h3>
            </div>
            <div className="space-y-2">
              {quickQuestions.slice(0, 4).map((question, index) => (
                <Button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  variant="ghost"
                  size="sm"
                  className="w-full text-left text-xs h-auto py-2 px-3 text-[#E5E7EB]/80 hover:bg-white/10 justify-start"
                >
                  {question}
                </Button>
              ))}
            </div>
          </Card>

          {/* Current Context */}
          <Card className="p-4 bg-black/40 border-white/10 backdrop-blur-sm">
            <h3 className="text-[#E5E7EB] mb-3">Current Context</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#E5E7EB]/70">Shard</span>
                <span className="text-[#E5E7EB]">{currentShard.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E5E7EB]/70">Active Crops</span>
                <span className="text-[#E5E7EB]">{currentCrops.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E5E7EB]/70">Eco Points</span>
                <span className="text-[#73C783]">{gameState.resources.ecoPoints.toLocaleString()}</span>
              </div>
              {gameState.farmingConditions && (
                <div className="flex justify-between">
                  <span className="text-[#E5E7EB]/70">Conditions</span>
                  <Badge 
                    size="sm"
                    style={{ backgroundColor: getUrgencyColor(gameState.farmingConditions.overallRating) }}
                  >
                    {gameState.farmingConditions.overallRating.toUpperCase()}
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="w-5 h-5 text-[#6EE7B7]" />
                          <span className="text-sm text-[#6EE7B7]">TERRA-AI</span>
                          <span className="text-xs text-[#E5E7EB]/50">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                      
                      <Card className={`p-4 ${
                        message.type === 'user' 
                          ? 'bg-[#6EE7B7] text-black' 
                          : 'bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm'
                      }`}>
                        <p className={`text-sm leading-relaxed ${
                          message.type === 'user' ? 'text-black' : 'text-[#E5E7EB]'
                        }`}>
                          {message.content}
                        </p>
                        
                        {message.response && (
                          <div className="mt-4 space-y-3">
                            {/* Category and Urgency */}
                            <div className="flex items-center gap-2">
                              {React.createElement(getCategoryIcon(message.response.category), { 
                                className: "w-4 h-4 text-[#6EE7B7]"
                              })}
                              <Badge 
                                size="sm"
                                style={{ backgroundColor: getUrgencyColor(message.response.urgency) }}
                              >
                                {message.response.urgency.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" size="sm" className="text-[#E5E7EB]/70">
                                {message.response.confidence}% Confidence
                              </Badge>
                            </div>
                            
                            {/* Recommendations */}
                            {message.response.recommendations.length > 0 && (
                              <div>
                                <h4 className="text-sm text-[#6EE7B7] mb-2">💡 Recommendations:</h4>
                                <ul className="space-y-1">
                                  {message.response.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-[#E5E7EB]/90">
                                      <CheckCircle className="w-3 h-3 text-[#73C783] mt-1 flex-shrink-0" />
                                      {rec}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Action Items */}
                            {message.response.actionItems.length > 0 && (
                              <div>
                                <h4 className="text-sm text-[#FFD369] mb-2">⚡ Action Items:</h4>
                                <div className="space-y-2">
                                  {message.response.actionItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white/5 rounded p-2">
                                      <div className="flex-1">
                                        <p className="text-sm text-[#E5E7EB]">{item.action}</p>
                                        <p className="text-xs text-[#E5E7EB]/70">{item.impact}</p>
                                      </div>
                                      <Badge 
                                        size="sm"
                                        variant="outline"
                                        style={{ borderColor: getUrgencyColor(item.priority) }}
                                      >
                                        {item.priority}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2 text-[#6EE7B7]">
                    <Bot className="w-5 h-5" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#6EE7B7] rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-[#6EE7B7] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-[#6EE7B7] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Scroll anchor */}
              <div ref={setMessagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask TERRA-AI about farming, climate, or strategy..."
                className="flex-1 bg-white/5 border-white/20 text-[#E5E7EB] placeholder:text-[#E5E7EB]/50"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-[#6EE7B7] text-black hover:bg-[#6EE7B7]/80"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send message to TERRA-AI</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2">
                <Button
                  onClick={() => onNavigate('nasaData')}
                  variant="ghost"
                  size="sm"
                  className="text-[#6EE7B7] hover:bg-[#6EE7B7]/10"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  NASA Data
                </Button>
                <Button
                  onClick={() => onNavigate('farmingGameplay')}
                  variant="ghost"
                  size="sm"
                  className="text-[#73C783] hover:bg-[#73C783]/10"
                >
                  <Leaf className="w-4 h-4 mr-1" />
                  Farm
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-[#E5E7EB]/50">
                <Brain className="w-3 h-3" />
                <span>Powered by DeepSeek AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
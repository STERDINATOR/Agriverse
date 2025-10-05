import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  ArrowLeft, 
  Sprout, 
  Droplets, 
  Zap, 
  Shovel,
  Eye,
  Package,
  Sun,
  CloudRain,
  Thermometer,
  Sparkles,
  Satellite,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Bot,
  Timer,
  Coins,
  Settings
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface AnimatedFarmingGameplayProps {
  onNavigate: (screen: string) => void;
}

interface PlotAction {
  type: 'planting' | 'watering' | 'harvesting' | 'fertilizing';
  plotIndex: number;
  timestamp: number;
}

interface AnimationEffect {
  id: string;
  type: 'water' | 'growth' | 'harvest' | 'sparkle' | 'sun' | 'rain';
  x: number;
  y: number;
  plotIndex?: number;
}

export function AnimatedFarmingGameplay({ onNavigate }: AnimatedFarmingGameplayProps) {
  const { 
    gameState, 
    plantCrop, 
    waterCrop, 
    harvestCrop, 
    getCurrentShard, 
    getCropsForCurrentShard,
    refreshNASAData 
  } = useGame();

  const [selectedAction, setSelectedAction] = useState<'plant' | 'water' | 'harvest' | 'inspect'>('plant');
  const [selectedCropType, setSelectedCropType] = useState(0);
  const [plotActions, setPlotActions] = useState<PlotAction[]>([]);
  const [animationEffects, setAnimationEffects] = useState<AnimationEffect[]>([]);
  const [autoMode, setAutoMode] = useState(false);
  const [showWeatherEffects, setShowWeatherEffects] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentShard = getCurrentShard();
  const currentCrops = getCropsForCurrentShard();

  // Auto-growth system
  useEffect(() => {
    if (autoMode) {
      intervalRef.current = setInterval(() => {
        // Auto-water crops that need it
        currentCrops.forEach((crop, index) => {
          if (crop.growth < 100 && Math.random() > 0.7) {
            handleAutoAction('watering', index);
          }
        });
        
        // Auto-harvest mature crops
        currentCrops.forEach((crop, index) => {
          if (crop.growth >= 100 && Math.random() > 0.8) {
            handleAutoAction('harvesting', index);
          }
        });
      }, 3000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoMode, currentCrops]);

  // Weather effects based on NASA data
  useEffect(() => {
    if (!showWeatherEffects || !gameState.nasaData) return;

    const weatherTimer = setInterval(() => {
      const { nasaData } = gameState;
      
      // Rain effects
      if (nasaData.precipitation.current > 5) {
        addWeatherEffect('rain');
      }
      
      // Sun effects during good weather
      if (nasaData.surfaceTemperature.temperature > 20 && nasaData.surfaceTemperature.temperature < 30) {
        addWeatherEffect('sun');
      }
      
      // Sparkle effects for optimal conditions
      if (gameState.farmingConditions?.overallRating === 'excellent') {
        addWeatherEffect('sparkle');
      }
    }, 2000);

    return () => clearInterval(weatherTimer);
  }, [showWeatherEffects, gameState.nasaData, gameState.farmingConditions]);

  const addWeatherEffect = (type: 'rain' | 'sun' | 'sparkle') => {
    const effect: AnimationEffect = {
      id: `weather-${Date.now()}-${Math.random()}`,
      type,
      x: Math.random() * 800,
      y: Math.random() * 400
    };
    
    setAnimationEffects(prev => [...prev, effect]);
    
    // Remove effect after animation
    setTimeout(() => {
      setAnimationEffects(prev => prev.filter(e => e.id !== effect.id));
    }, 3000);
  };

  const addPlotEffect = (type: 'water' | 'growth' | 'harvest', plotIndex: number) => {
    const plotElement = document.querySelector(`[data-plot="${plotIndex}"]`);
    if (!plotElement) return;

    const rect = plotElement.getBoundingClientRect();
    const containerRect = document.querySelector('.farm-container')?.getBoundingClientRect();
    
    if (!containerRect) return;

    const effect: AnimationEffect = {
      id: `plot-${Date.now()}-${plotIndex}`,
      type,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2,
      plotIndex
    };
    
    setAnimationEffects(prev => [...prev, effect]);
    
    // Remove effect after animation
    setTimeout(() => {
      setAnimationEffects(prev => prev.filter(e => e.id !== effect.id));
    }, 2000);
  };

  const handleAutoAction = (actionType: 'planting' | 'watering' | 'harvesting', plotIndex: number) => {
    const action: PlotAction = {
      type: actionType,
      plotIndex,
      timestamp: Date.now()
    };
    
    setPlotActions(prev => [...prev, action]);
    
    // Execute the action
    const crop = getCropAtPlot(plotIndex);
    if (actionType === 'watering' && crop) {
      waterCrop(plotIndex);
      addPlotEffect('water', plotIndex);
    } else if (actionType === 'harvesting' && crop && crop.growth >= 100) {
      harvestCrop(plotIndex);
      addPlotEffect('harvest', plotIndex);
    }
    
    // Remove action from queue after animation
    setTimeout(() => {
      setPlotActions(prev => prev.filter(a => a.timestamp !== action.timestamp));
    }, 1500);
  };

  const getCropAtPlot = (plotIndex: number) => {
    return currentCrops.find(crop => crop.plotIndex === plotIndex);
  };

  const getPlotColor = (plotIndex: number) => {
    const crop = getCropAtPlot(plotIndex);
    if (!crop) return 'border-[#4A5568] bg-[#2D3748]/20';
    
    if (crop.growth >= 100) return 'border-[#73C783] bg-[#73C783]/20';
    if (crop.growth >= 50) return 'border-[#6EE7B7] bg-[#6EE7B7]/20';
    return 'border-[#FFD369] bg-[#FFD369]/20';
  };

  const handlePlotClick = (plotIndex: number) => {
    const crop = getCropAtPlot(plotIndex);
    
    switch (selectedAction) {
      case 'plant':
        if (!crop && gameState.resources.seeds > 0) {
          plantCrop(plotIndex, selectedCropType);
          addPlotEffect('growth', plotIndex);
          toast.success('Crop planted!');
        }
        break;
      case 'water':
        if (crop && crop.growth < 100 && gameState.resources.water > 0) {
          waterCrop(plotIndex);
          addPlotEffect('water', plotIndex);
          toast.success('Crop watered!');
        }
        break;
      case 'harvest':
        if (crop && crop.growth >= 100) {
          harvestCrop(plotIndex);
          addPlotEffect('harvest', plotIndex);
          toast.success(`Harvested ${crop.name}!`);
        }
        break;
      case 'inspect':
        if (crop) {
          toast.info(`${crop.name}: ${crop.growth.toFixed(1)}% growth`);
        } else {
          toast.info('Empty plot - ready for planting');
        }
        break;
    }
  };

  const renderAnimationEffect = (effect: AnimationEffect) => {
    const baseProps = {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.5 },
      style: { 
        position: 'absolute' as const,
        left: effect.x,
        top: effect.y,
        pointerEvents: 'none' as const
      }
    };

    switch (effect.type) {
      case 'water':
        return (
          <motion.div
            key={effect.id}
            {...baseProps}
            className="text-blue-400 text-2xl"
            animate={{
              ...baseProps.animate,
              y: [0, -20, -40],
              opacity: [1, 0.8, 0]
            }}
            transition={{ duration: 1.5 }}
          >
            💧
          </motion.div>
        );
        
      case 'growth':
        return (
          <motion.div
            key={effect.id}
            {...baseProps}
            className="text-green-400 text-2xl"
            animate={{
              ...baseProps.animate,
              scale: [0.5, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ duration: 1.5 }}
          >
            🌱
          </motion.div>
        );
        
      case 'harvest':
        return (
          <motion.div
            key={effect.id}
            {...baseProps}
            className="text-yellow-400 text-2xl"
            animate={{
              ...baseProps.animate,
              y: [0, -30],
              x: [0, Math.random() * 40 - 20]
            }}
            transition={{ duration: 2 }}
          >
            ✨
          </motion.div>
        );
        
      case 'rain':
        return (
          <motion.div
            key={effect.id}
            {...baseProps}
            className="text-blue-300 text-lg"
            animate={{
              y: [0, 400],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 3 }}
          >
            🌧️
          </motion.div>
        );
        
      case 'sun':
        return (
          <motion.div
            key={effect.id}
            {...baseProps}
            className="text-yellow-300 text-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ☀️
          </motion.div>
        );
        
      case 'sparkle':
        return (
          <motion.div
            key={effect.id}
            {...baseProps}
            className="text-purple-300 text-xl"
            animate={{
              scale: [0.5, 1, 0.5],
              rotate: [0, 360],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2 }}
          >
            ✨
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  const cropTypes = [
    { name: 'Corn', emoji: '🌽', cost: 10, time: 5 },
    { name: 'Tomato', emoji: '🍅', cost: 15, time: 7 },
    { name: 'Wheat', emoji: '🌾', cost: 8, time: 4 },
    { name: 'Carrot', emoji: '🥕', cost: 12, time: 6 }
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#73C783]/20 to-[#6EE7B7]/20"
          animate={{
            background: [
              'linear-gradient(to bottom right, rgba(115, 199, 131, 0.2), rgba(110, 231, 183, 0.2))',
              'linear-gradient(to bottom right, rgba(110, 231, 183, 0.3), rgba(115, 199, 131, 0.2))',
              'linear-gradient(to bottom right, rgba(115, 199, 131, 0.2), rgba(110, 231, 183, 0.2))'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Header */}
        <div className="relative z-10 p-4 flex justify-between items-center bg-black/20 backdrop-blur-sm border-b border-white/10">
          <Button
            onClick={() => onNavigate('playerHub')}
            variant="ghost"
            className="text-[#E5E7EB] hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Base
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl text-[#E5E7EB]">{currentShard.name}</h1>
            <div className="flex gap-4 text-sm">
              <span className="text-[#73C783]">Soil: {currentShard.soilHealth}%</span>
              <span className="text-[#6EE7B7]">Water: {currentShard.waterLevel}%</span>
              <span className="text-[#FFD369]">Air: {currentShard.airQuality}%</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setAutoMode(!autoMode)}
              variant={autoMode ? 'default' : 'outline'}
              size="sm"
              className={autoMode ? 'bg-[#73C783] text-black' : 'border-[#73C783] text-[#73C783]'}
            >
              <Zap className="w-4 h-4 mr-1" />
              Auto
            </Button>
            <Button
              onClick={() => setShowWeatherEffects(!showWeatherEffects)}
              variant={showWeatherEffects ? 'default' : 'outline'}
              size="sm"
              className={showWeatherEffects ? 'bg-[#6EE7B7] text-black' : 'border-[#6EE7B7] text-[#6EE7B7]'}
            >
              <CloudRain className="w-4 h-4 mr-1" />
              Weather
            </Button>
          </div>
        </div>

        <div className="relative z-10 h-[calc(100vh-80px)] flex">
          {/* Left Sidebar */}
          <motion.div 
            className="w-80 p-4 space-y-4 bg-black/10 backdrop-blur-sm border-r border-white/10"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Action Selection */}
            <Card className="p-4 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
              <h3 className="text-[#6EE7B7] mb-3">Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { action: 'plant', icon: Sprout, label: 'Plant' },
                  { action: 'water', icon: Droplets, label: 'Water' },
                  { action: 'harvest', icon: Package, label: 'Harvest' },
                  { action: 'inspect', icon: Eye, label: 'Inspect' }
                ].map(({ action, icon: Icon, label }) => (
                  <Button
                    key={action}
                    onClick={() => setSelectedAction(action as any)}
                    variant={selectedAction === action ? 'default' : 'outline'}
                    className={`${
                      selectedAction === action 
                        ? 'bg-[#6EE7B7] text-black' 
                        : 'border-[#6EE7B7]/50 text-[#6EE7B7] hover:bg-[#6EE7B7]/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Crop Selection */}
            {selectedAction === 'plant' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 bg-black/40 border-[#73C783]/30 backdrop-blur-sm">
                  <h3 className="text-[#73C783] mb-3">Select Crop</h3>
                  <div className="space-y-2">
                    {cropTypes.map((crop, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedCropType(index)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          selectedCropType === index 
                            ? 'border-[#73C783] bg-[#73C783]/20' 
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{crop.emoji}</span>
                          <div>
                            <div className="text-[#E5E7EB]">{crop.name}</div>
                            <div className="text-xs text-[#E5E7EB]/70">
                              {crop.cost} seeds • {crop.time}min
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Resources */}
            <Card className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
              <h3 className="text-[#FFD369] mb-3">Resources</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-[#E5E7EB]">
                  <div>Seeds: <span className="text-[#73C783]">{gameState.resources.seeds}</span></div>
                  <div>Water: <span className="text-[#6EE7B7]">{gameState.resources.water}L</span></div>
                </div>
                <div className="text-[#E5E7EB]">
                  <div>Energy: <span className="text-[#FFD369]">{gameState.resources.energy}</span></div>
                  <div>Points: <span className="text-[#73C783]">{gameState.resources.ecoPoints}</span></div>
                </div>
              </div>
            </Card>

            {/* Real-time Stats */}
            <Card className="p-4 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
              <h3 className="text-[#6EE7B7] mb-3">Farm Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#E5E7EB]">Active Plots</span>
                  <span className="text-[#73C783]">{currentCrops.length}/48</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E5E7EB]">Growth Rate</span>
                  <span className="text-[#6EE7B7]">
                    {gameState.farmingConditions?.cropGrowthRate.toFixed(1)}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E5E7EB]">Conditions</span>
                  <Badge className="bg-[#73C783] text-black">
                    {gameState.farmingConditions?.overallRating || 'Loading...'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* NASA Integration */}
            <Card className="p-3 bg-gradient-to-r from-[#6EE7B7]/20 to-[#4ECDC4]/20 border-[#6EE7B7]/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-[#6EE7B7]" />
                <h4 className="text-sm text-[#6EE7B7]">TERRA-AI</h4>
                <motion.div 
                  className="w-2 h-2 bg-[#6EE7B7] rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <p className="text-xs text-[#E5E7EB]/80 mb-3">
                Real-time farming optimization with NASA climate data
              </p>
              <Button
                onClick={() => onNavigate('terraAI')}
                className="w-full bg-[#6EE7B7] text-black hover:bg-[#6EE7B7]/80 text-sm"
              >
                Ask TERRA-AI
              </Button>
            </Card>
          </motion.div>

          {/* Main Farm View */}
          <div className="flex-1 p-4 relative farm-container">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full rounded-2xl bg-black/20 backdrop-blur-sm border border-[#73C783]/20 relative overflow-hidden"
            >
              {/* Weather Effects Layer */}
              <div className="absolute inset-0 pointer-events-none">
                <AnimatePresence>
                  {animationEffects.map(renderAnimationEffect)}
                </AnimatePresence>
              </div>

              {/* Action Queue Display */}
              <AnimatePresence>
                {plotActions.map((action) => (
                  <motion.div
                    key={`${action.plotIndex}-${action.timestamp}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute top-4 left-4 bg-black/80 rounded-lg p-2 text-xs text-[#E5E7EB] z-20"
                  >
                    <div className="flex items-center gap-2">
                      <Timer className="w-3 h-3" />
                      <span>Auto {action.type} on plot {action.plotIndex + 1}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Farm Grid */}
              <div className="absolute inset-4 grid grid-cols-8 grid-rows-6 gap-2">
                {Array.from({ length: 48 }).map((_, index) => {
                  const crop = getCropAtPlot(index);
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <motion.div
                          data-plot={index}
                          className={`rounded-lg border-2 cursor-pointer transition-all duration-300 w-full h-full ${getPlotColor(index)} hover:scale-105 relative overflow-hidden`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePlotClick(index)}
                          layout
                        >
                          {/* Crop display */}
                          {crop && (
                            <div className="w-full h-full flex flex-col items-center justify-center relative">
                              <motion.div
                                className="text-lg relative z-10"
                                animate={crop.growth >= 100 ? {
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 5, -5, 0]
                                } : {
                                  scale: [1, 1.05, 1]
                                }}
                                transition={{
                                  duration: crop.growth >= 100 ? 2 : 4,
                                  repeat: Infinity
                                }}
                              >
                                {crop.emoji}
                              </motion.div>
                              
                              {/* Growth progress */}
                              {crop.growth < 100 && (
                                <motion.div 
                                  className="absolute bottom-1 left-1 right-1"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <div className="w-full h-1 bg-black/20 rounded-full">
                                    <motion.div
                                      className="h-full bg-[#73C783] rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${crop.growth}%` }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  </div>
                                </motion.div>
                              )}

                              {/* Harvest ready indicator */}
                              {crop.growth >= 100 && (
                                <motion.div
                                  className="absolute -top-1 -right-1 text-yellow-400"
                                  animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [1, 0.7, 1]
                                  }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  ✨
                                </motion.div>
                              )}

                              {/* Auto-mode indicator */}
                              {autoMode && (
                                <motion.div
                                  className="absolute top-1 left-1 text-blue-400 text-xs"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  🤖
                                </motion.div>
                              )}
                            </div>
                          )}

                          {/* Empty plot indicator */}
                          {!crop && selectedAction === 'plant' && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center text-[#73C783]/50"
                              animate={{ opacity: [0.3, 0.7, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Sprout className="w-4 h-4" />
                            </motion.div>
                          )}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {crop ? (
                          <div>
                            <p className="font-medium">{crop.name}</p>
                            <p className="text-sm">Growth: {crop.growth.toFixed(1)}%</p>
                            <p className="text-sm">Plot {index + 1}</p>
                          </div>
                        ) : (
                          <p>Empty plot - Click to plant</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              {/* Real-time climate data overlay */}
              {gameState.nasaData && (
                <motion.div
                  className="absolute top-4 right-4 bg-black/80 rounded-lg p-3 text-xs text-[#E5E7EB] space-y-1"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-3 h-3 text-[#FF6B6B]" />
                    <span>{gameState.nasaData.surfaceTemperature.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3 h-3 text-[#6EE7B7]" />
                    <span>{gameState.nasaData.soilMoisture.moisture.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-3 h-3 text-[#4ECDC4]" />
                    <span>{gameState.nasaData.precipitation.current.toFixed(1)}mm/h</span>
                  </div>
                  {gameState.farmingConditions && (
                    <div className="pt-1 border-t border-white/20">
                      <span className="text-[#73C783]">
                        Growth: {gameState.farmingConditions.cropGrowthRate.toFixed(1)}x
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
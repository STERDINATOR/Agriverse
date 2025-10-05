import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  ArrowLeft, 
  Droplets, 
  Thermometer,
  Sprout,
  Scissors,
  Zap,
  Target,
  Clock,
  AlertTriangle,
  TrendingUp,
  Sun,
  Wind,
  Gauge,
  Leaf,
  Package,
  Coins,
  Star,
  Water,
  Shovel,
  Sparkles,
  Timer,
  CheckCircle,
  RotateCcw
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface LocationShardProps {
  onNavigate: (screen: string) => void;
  locationData: any;
}

interface CropData {
  id: string;
  name: string;
  icon: string;
  growthTime: number; // in seconds for demo (real game would be hours/days)
  climatePreference: string[];
  soilPreference: string[];
  temperatureRange: { min: number; max: number };
  humidityRange: { min: number; max: number };
  waterNeed: number; // 1-5 scale
  baseYield: number;
  sellPrice: number;
  xpReward: number;
  description: string;
  season: string[];
}

interface PlantedCrop {
  id: string;
  cropId: string;
  plantedAt: Date;
  position: { x: number; y: number };
  growthStage: number; // 0-100
  health: number; // 0-100
  wateredAt?: Date;
  fertilizedAt?: Date;
  harvestable: boolean;
  yieldMultiplier: number;
}

const cropDatabase: CropData[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    icon: '🍅',
    growthTime: 30,
    climatePreference: ['mediterranean', 'temperate', 'subtropical'],
    soilPreference: ['loamy', 'silty'],
    temperatureRange: { min: 18, max: 30 },
    humidityRange: { min: 40, max: 80 },
    waterNeed: 3,
    baseYield: 5,
    sellPrice: 20,
    xpReward: 10,
    description: 'Versatile crop that thrives in warm, moderate climates',
    season: ['spring', 'summer']
  },
  {
    id: 'wheat',
    name: 'Wheat',
    icon: '🌾',
    growthTime: 45,
    climatePreference: ['temperate', 'continental'],
    soilPreference: ['loamy', 'clay'],
    temperatureRange: { min: 10, max: 25 },
    humidityRange: { min: 30, max: 70 },
    waterNeed: 2,
    baseYield: 8,
    sellPrice: 15,
    xpReward: 12,
    description: 'Staple grain crop adapted to cooler climates',
    season: ['spring', 'autumn']
  },
  {
    id: 'rice',
    name: 'Rice',
    icon: '🍚',
    growthTime: 50,
    climatePreference: ['tropical', 'subtropical'],
    soilPreference: ['silty', 'clay'],
    temperatureRange: { min: 20, max: 35 },
    humidityRange: { min: 70, max: 95 },
    waterNeed: 5,
    baseYield: 10,
    sellPrice: 18,
    xpReward: 15,
    description: 'Water-loving crop essential for tropical regions',
    season: ['summer']
  },
  {
    id: 'cactus',
    name: 'Prickly Pear',
    icon: '🌵',
    growthTime: 60,
    climatePreference: ['arid'],
    soilPreference: ['sandy', 'saline'],
    temperatureRange: { min: 15, max: 45 },
    humidityRange: { min: 10, max: 40 },
    waterNeed: 1,
    baseYield: 3,
    sellPrice: 35,
    xpReward: 20,
    description: 'Desert specialist requiring minimal water',
    season: ['summer', 'autumn']
  },
  {
    id: 'potato',
    name: 'Potato',
    icon: '🥔',
    growthTime: 35,
    climatePreference: ['temperate', 'continental'],
    soilPreference: ['loamy', 'sandy'],
    temperatureRange: { min: 5, max: 20 },
    humidityRange: { min: 50, max: 80 },
    waterNeed: 3,
    baseYield: 7,
    sellPrice: 12,
    xpReward: 8,
    description: 'Hardy root vegetable perfect for cool climates',
    season: ['spring', 'autumn']
  },
  {
    id: 'coffee',
    name: 'Coffee',
    icon: '☕',
    growthTime: 90,
    climatePreference: ['subtropical', 'tropical'],
    soilPreference: ['volcanic', 'loamy'],
    temperatureRange: { min: 18, max: 25 },
    humidityRange: { min: 60, max: 85 },
    waterNeed: 4,
    baseYield: 4,
    sellPrice: 50,
    xpReward: 25,
    description: 'Premium crop requiring specific altitude and climate',
    season: ['spring', 'summer']
  },
  {
    id: 'coconut',
    name: 'Coconut',
    icon: '🥥',
    growthTime: 120,
    climatePreference: ['tropical'],
    soilPreference: ['sandy', 'loamy'],
    temperatureRange: { min: 24, max: 32 },
    humidityRange: { min: 70, max: 90 },
    waterNeed: 3,
    baseYield: 6,
    sellPrice: 40,
    xpReward: 30,
    description: 'Tropical tree crop adapted to coastal conditions',
    season: ['summer']
  },
  {
    id: 'tulip',
    name: 'Tulip',
    icon: '🌷',
    growthTime: 25,
    climatePreference: ['temperate'],
    soilPreference: ['peat', 'loamy'],
    temperatureRange: { min: 5, max: 18 },
    humidityRange: { min: 60, max: 90 },
    waterNeed: 3,
    baseYield: 3,
    sellPrice: 60,
    xpReward: 18,
    description: 'Ornamental flower requiring cool, moist conditions',
    season: ['spring']
  }
];

export function LocationShard({ onNavigate, locationData }: LocationShardProps) {
  const { gameState, updateResources } = useGame();
  const [plantedCrops, setPlantedCrops] = useState<PlantedCrop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantedCrop | null>(null);
  const [availableSeeds, setAvailableSeeds] = useState<Record<string, number>>({
    tomato: 5, wheat: 3, rice: 2, cactus: 1, potato: 4, coffee: 1, coconut: 1, tulip: 2
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPlantMode, setShowPlantMode] = useState(false);

  const location = locationData?.location;

  // Convert SatelliteWorldMap data structure to LocationShard expected format
  const normalizedLocation = location ? {
    ...location,
    realTimeData: location.realTimeData || {
      temperature: location.avgTemperature || 20,
      humidity: location.humidity || 60,
      windSpeed: location.windSpeed || 10,
      rainfall: (location.avgRainfall || 500) / 365, // Convert annual to daily
      soilMoisture: location.analysisData?.moistureIndex ? location.analysisData.moistureIndex * 100 : 50,
      uvIndex: 5,
      airQuality: 80,
      lastUpdated: location.lastUpdated || new Date()
    },
    climateZone: location.climateZone || location.climate || 'temperate'
  } : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateCropGrowth();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateCropGrowth = () => {
    setPlantedCrops(prev => prev.map(crop => {
      const timeDiff = (Date.now() - crop.plantedAt.getTime()) / 1000;
      const cropData = cropDatabase.find(c => c.id === crop.cropId);
      if (!cropData) return crop;

      const growthStage = Math.min(100, (timeDiff / cropData.growthTime) * 100);
      const harvestable = growthStage >= 100;

      // Environmental stress factors
      let healthEffect = 1;
      if (normalizedLocation) {
        const tempInRange = normalizedLocation.realTimeData.temperature >= cropData.temperatureRange.min && 
                           normalizedLocation.realTimeData.temperature <= cropData.temperatureRange.max;
        const humidityInRange = normalizedLocation.realTimeData.humidity >= cropData.humidityRange.min && 
                               normalizedLocation.realTimeData.humidity <= cropData.humidityRange.max;
        
        if (!tempInRange) healthEffect *= 0.8;
        if (!humidityInRange) healthEffect *= 0.8;
        if (!cropData.climatePreference.includes(normalizedLocation.climateZone)) healthEffect *= 0.7;
        if (!cropData.soilPreference.includes(normalizedLocation.soilType)) healthEffect *= 0.8;
      }

      const newHealth = Math.max(20, Math.min(100, crop.health * healthEffect));

      return {
        ...crop,
        growthStage,
        harvestable,
        health: newHealth,
        yieldMultiplier: newHealth / 100
      };
    }));
  };

  const getSuitableCrops = () => {
    if (!normalizedLocation) return cropDatabase;
    
    return cropDatabase.filter(crop => {
      const climateMatch = crop.climatePreference.includes(normalizedLocation.climateZone);
      const soilMatch = crop.soilPreference.includes(normalizedLocation.soilType);
      const tempMatch = normalizedLocation.realTimeData.temperature >= crop.temperatureRange.min &&
                       normalizedLocation.realTimeData.temperature <= crop.temperatureRange.max;
      
      return climateMatch || soilMatch || tempMatch;
    }).sort((a, b) => {
      // Prioritize crops that match climate AND soil
      const aScore = (a.climatePreference.includes(normalizedLocation.climateZone) ? 2 : 0) +
                    (a.soilPreference.includes(normalizedLocation.soilType) ? 1 : 0);
      const bScore = (b.climatePreference.includes(normalizedLocation.climateZone) ? 2 : 0) +
                    (b.soilPreference.includes(normalizedLocation.soilType) ? 1 : 0);
      return bScore - aScore;
    });
  };

  const getCropCompatibility = (crop: CropData) => {
    if (!normalizedLocation) return { score: 50, status: 'unknown', color: '#888' };
    
    let score = 0;
    let factors = [];

    // Climate compatibility
    if (crop.climatePreference.includes(normalizedLocation.climateZone)) {
      score += 30;
      factors.push('Perfect climate');
    } else {
      factors.push('Climate mismatch');
    }

    // Soil compatibility
    if (crop.soilPreference.includes(normalizedLocation.soilType)) {
      score += 20;
      factors.push('Ideal soil');
    } else {
      factors.push('Soil not optimal');
    }

    // Temperature range
    const temp = normalizedLocation.realTimeData.temperature;
    if (temp >= crop.temperatureRange.min && temp <= crop.temperatureRange.max) {
      score += 25;
      factors.push('Good temperature');
    } else {
      score += Math.max(0, 15 - Math.abs(temp - (crop.temperatureRange.min + crop.temperatureRange.max) / 2));
      factors.push('Temperature stress');
    }

    // Humidity
    const humidity = normalizedLocation.realTimeData.humidity;
    if (humidity >= crop.humidityRange.min && humidity <= crop.humidityRange.max) {
      score += 25;
      factors.push('Perfect humidity');
    } else {
      score += Math.max(0, 15 - Math.abs(humidity - (crop.humidityRange.min + crop.humidityRange.max) / 2));
      factors.push('Humidity stress');
    }

    let status, color;
    if (score >= 80) { status = 'Excellent'; color = '#4CAF50'; }
    else if (score >= 60) { status = 'Good'; color = '#8BC34A'; }
    else if (score >= 40) { status = 'Fair'; color = '#FF9800'; }
    else { status = 'Poor'; color = '#F44336'; }

    return { score, status, color, factors };
  };

  const handlePlantCrop = (cropId: string, position: { x: number; y: number }) => {
    if (!availableSeeds[cropId] || availableSeeds[cropId] <= 0) {
      toast.error('No seeds available for this crop!');
      return;
    }

    // Check if position is already occupied
    const occupied = plantedCrops.some(crop => 
      Math.abs(crop.position.x - position.x) < 5 && 
      Math.abs(crop.position.y - position.y) < 5
    );

    if (occupied) {
      toast.error('This spot is already occupied!');
      return;
    }

    const newCrop: PlantedCrop = {
      id: Date.now().toString(),
      cropId,
      plantedAt: new Date(),
      position,
      growthStage: 0,
      health: 100,
      harvestable: false,
      yieldMultiplier: 1
    };

    setPlantedCrops(prev => [...prev, newCrop]);
    setAvailableSeeds(prev => ({ ...prev, [cropId]: prev[cropId] - 1 }));
    
    const cropData = cropDatabase.find(c => c.id === cropId);
    toast.success(`Planted ${cropData?.name}! Growth time: ${cropData?.growthTime}s`);
    setShowPlantMode(false);
  };

  const handleHarvestCrop = (cropToHarvest: PlantedCrop) => {
    if (!cropToHarvest.harvestable) {
      toast.error('Crop is not ready for harvest yet!');
      return;
    }

    const cropData = cropDatabase.find(c => c.id === cropToHarvest.cropId);
    if (!cropData) return;

    const actualYield = Math.floor(cropData.baseYield * cropToHarvest.yieldMultiplier);
    const earnings = actualYield * cropData.sellPrice;
    const xp = cropData.xpReward;

    setPlantedCrops(prev => prev.filter(crop => crop.id !== cropToHarvest.id));
    updateResources({
      ecoPoints: gameState.resources.ecoPoints + earnings
    });

    toast.success(`Harvested ${actualYield} ${cropData.name}! +${earnings} coins, +${xp} XP`);
  };

  const handleWaterCrop = (crop: PlantedCrop) => {
    if (crop.wateredAt && Date.now() - crop.wateredAt.getTime() < 30000) {
      toast.info('Crop was recently watered!');
      return;
    }

    setPlantedCrops(prev => prev.map(c => 
      c.id === crop.id 
        ? { ...c, health: Math.min(100, c.health + 10), wateredAt: new Date() }
        : c
    ));

    toast.success('Crop watered! +10 health');
  };

  const getFieldGridPositions = () => {
    const positions = [];
    for (let x = 10; x <= 90; x += 15) {
      for (let y = 20; y <= 80; y += 15) {
        positions.push({ x, y });
      }
    }
    return positions;
  };

  const getWeatherEffect = () => {
    if (!normalizedLocation) return { effect: 'neutral', message: 'Normal conditions', color: '#888' };
    
    const temp = normalizedLocation.realTimeData.temperature;
    const humidity = normalizedLocation.realTimeData.humidity;
    const rain = normalizedLocation.realTimeData.rainfall;

    if (rain > 10) return { effect: 'beneficial', message: 'Rain boosts growth!', color: '#4FC3F7' };
    if (temp > 35) return { effect: 'harmful', message: 'Extreme heat stress', color: '#F44336' };
    if (temp < 5) return { effect: 'harmful', message: 'Cold damage risk', color: '#2196F3' };
    if (humidity < 20) return { effect: 'harmful', message: 'Very dry conditions', color: '#FF9800' };
    if (humidity > 90) return { effect: 'caution', message: 'High humidity - disease risk', color: '#9C27B0' };
    
    return { effect: 'good', message: 'Favorable conditions', color: '#4CAF50' };
  };

  if (!normalizedLocation) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] overflow-y-auto overflow-x-hidden">
        <Card className="p-8 bg-black/40 border-white/20">
          <p className="text-white">Error: No location data provided</p>
          <Button onClick={() => onNavigate('satelliteWorldMap')} className="mt-4">
            Back to World Map
          </Button>
        </Card>
      </div>
    );
  }

  const weatherEffect = getWeatherEffect();

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
        {/* Dynamic background based on climate */}
        <div className="fixed inset-0 -z-10">
          {normalizedLocation.climateZone === 'tropical' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#2E7D32] via-[#388E3C] to-[#4CAF50]" />
          )}
          {normalizedLocation.climateZone === 'arid' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#FF8F00] via-[#FFA000] to-[#FFB300]" />
          )}
          {normalizedLocation.climateZone === 'temperate' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#1976D2] via-[#1E88E5] to-[#2196F3]" />
          )}
          {normalizedLocation.climateZone === 'continental' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#455A64] via-[#546E7A] to-[#607D8B]" />
          )}
          {!['tropical', 'arid', 'temperate', 'continental'].includes(normalizedLocation.climateZone) && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A] via-[#1E40AF] to-[#3B82F6]" />
          )}
          
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-white/5" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-4 flex justify-between items-center border-b border-white/20 backdrop-blur-sm bg-black/20">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate('satelliteWorldMap')}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              World Map
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="text-3xl">{normalizedLocation.climateIcon || '🌍'}</div>
              <div>
                <h1 className="text-xl text-white">{normalizedLocation.name} Farm</h1>
                <p className="text-sm text-gray-300">{normalizedLocation.country} • {normalizedLocation.climateZone} climate</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Card className="px-3 py-2 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#FFD369]" />
                <span className="text-white text-sm">{gameState.resources.ecoPoints}</span>
              </div>
            </Card>

            <Badge 
              className="border-0"
              style={{ backgroundColor: `${weatherEffect.color}20`, color: weatherEffect.color }}
            >
              {weatherEffect.message}
            </Badge>
          </div>
        </div>

        <div className="relative z-10 flex h-[calc(100vh-70px)]">
          {/* Farming Field */}
          <div className="flex-1 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-2xl bg-black/10 backdrop-blur-sm border border-white/20 relative overflow-hidden"
            >
              {/* Field grid */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="farmGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#farmGrid)" />
                </svg>
              </div>

              {/* Planted crops */}
              <AnimatePresence>
                {plantedCrops.map((crop) => {
                  const cropData = cropDatabase.find(c => c.id === crop.cropId);
                  if (!cropData) return null;

                  return (
                    <motion.div
                      key={crop.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute cursor-pointer"
                      style={{
                        left: `${crop.position.x}%`,
                        top: `${crop.position.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => setSelectedPlant(crop)}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative">
                            {/* Growth indicator */}
                            <motion.div
                              className="absolute -inset-2 rounded-full border-2"
                              style={{ 
                                borderColor: crop.harvestable ? '#4CAF50' : '#2196F3',
                                backgroundColor: crop.harvestable ? '#4CAF5020' : '#2196F320'
                              }}
                              animate={crop.harvestable ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                            
                            {/* Crop icon */}
                            <div 
                              className="text-3xl filter"
                              style={{ 
                                filter: `grayscale(${100 - crop.growthStage}%) brightness(${0.5 + (crop.health / 200)})`
                              }}
                            >
                              {cropData.icon}
                            </div>

                            {/* Health bar */}
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-black/50 rounded">
                              <div 
                                className="h-full rounded transition-all duration-300"
                                style={{ 
                                  width: `${crop.health}%`,
                                  backgroundColor: crop.health > 70 ? '#4CAF50' : crop.health > 40 ? '#FF9800' : '#F44336'
                                }}
                              />
                            </div>

                            {/* Status indicators */}
                            {crop.harvestable && (
                              <div className="absolute -top-1 -right-1">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                  <Sparkles className="w-4 h-4 text-[#FFD369]" />
                                </motion.div>
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black/90 border-white/20">
                          <div className="text-center space-y-1">
                            <p className="font-medium text-white">{cropData.name}</p>
                            <p className="text-xs text-gray-300">Growth: {Math.round(crop.growthStage)}%</p>
                            <p className="text-xs text-gray-300">Health: {Math.round(crop.health)}%</p>
                            {crop.harvestable && (
                              <p className="text-xs text-[#4CAF50]">Ready to harvest!</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Plant mode overlay */}
              {showPlantMode && selectedCrop && (
                <div className="absolute inset-0 bg-black/30">
                  {getFieldGridPositions().map((pos, index) => {
                    const occupied = plantedCrops.some(crop => 
                      Math.abs(crop.position.x - pos.x) < 5 && 
                      Math.abs(crop.position.y - pos.y) < 5
                    );

                    return (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: occupied ? 0.3 : 0.8 }}
                        transition={{ delay: index * 0.01 }}
                        className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                          occupied 
                            ? 'border-red-500 bg-red-500/20 cursor-not-allowed' 
                            : 'border-green-500 bg-green-500/20 hover:bg-green-500/40'
                        }`}
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => !occupied && handlePlantCrop(selectedCrop.id, pos)}
                      >
                        {occupied ? '❌' : '✅'}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Instructions */}
              <div className="absolute top-4 left-4">
                <Card className="p-3 bg-black/60 border-white/20 backdrop-blur-sm">
                  <div className="text-white text-sm space-y-1">
                    <p>🌱 Click on crops to interact</p>
                    <p>🎯 Select seeds and plant in empty spots</p>
                    <p>💧 Water crops to maintain health</p>
                    <p>✨ Harvest when crops are ready</p>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Control Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-96 p-4 space-y-4 overflow-y-auto"
          >
            {/* Climate Info */}
            <Card className="p-4 bg-black/40 border-white/20 backdrop-blur-sm">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Live Conditions
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-300">Temp:</span>
                  <span className="text-white">{normalizedLocation.realTimeData.temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Humidity:</span>
                  <span className="text-white">{normalizedLocation.realTimeData.humidity.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Rain:</span>
                  <span className="text-white">{normalizedLocation.realTimeData.rainfall.toFixed(1)}mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Soil:</span>
                  <span className="text-white">{normalizedLocation.realTimeData.soilMoisture.toFixed(0)}%</span>
                </div>
              </div>
            </Card>

            {/* Crop Selection */}
            <Card className="p-4 bg-black/40 border-white/20 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-medium">Available Seeds</h3>
                <Button
                  size="sm"
                  onClick={() => setShowPlantMode(!showPlantMode)}
                  className={showPlantMode ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
                >
                  {showPlantMode ? 'Cancel' : 'Plant Mode'}
                </Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {getSuitableCrops().map((crop) => {
                  const compatibility = getCropCompatibility(crop);
                  const seedCount = availableSeeds[crop.id] || 0;
                  
                  return (
                    <div
                      key={crop.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCrop?.id === crop.id 
                          ? 'border-[#6EE7B7] bg-[#6EE7B7]/10' 
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedCrop(crop)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{crop.icon}</span>
                          <div>
                            <p className="text-white text-sm font-medium">{crop.name}</p>
                            <p className="text-xs text-gray-400">{crop.growthTime}s growth</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className="text-xs mb-1"
                            style={{ backgroundColor: `${compatibility.color}20`, color: compatibility.color }}
                          >
                            {compatibility.status}
                          </Badge>
                          <p className="text-xs text-gray-300">Seeds: {seedCount}</p>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 mb-2">{crop.description}</div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Yield: {crop.baseYield}</span>
                        <span className="text-[#FFD369]">💰 {crop.sellPrice}</span>
                        <span className="text-[#6EE7B7]">⭐ {crop.xpReward} XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Selected Plant Actions */}
            {selectedPlant && (
              <Card className="p-4 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
                <h3 className="text-white font-medium mb-3">Crop Actions</h3>
                
                {(() => {
                  const cropData = cropDatabase.find(c => c.id === selectedPlant.cropId);
                  if (!cropData) return null;
                  
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cropData.icon}</span>
                        <div>
                          <p className="text-white font-medium">{cropData.name}</p>
                          <p className="text-xs text-gray-300">
                            Growth: {Math.round(selectedPlant.growthStage)}% • Health: {Math.round(selectedPlant.health)}%
                          </p>
                        </div>
                      </div>

                      <Progress value={selectedPlant.growthStage} className="h-2" />

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleWaterCrop(selectedPlant)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600"
                        >
                          <Droplets className="w-4 h-4 mr-1" />
                          Water
                        </Button>
                        
                        {selectedPlant.harvestable && (
                          <Button
                            size="sm"
                            onClick={() => handleHarvestCrop(selectedPlant)}
                            className="flex-1 bg-green-500 hover:bg-green-600"
                          >
                            <Scissors className="w-4 h-4 mr-1" />
                            Harvest
                          </Button>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedPlant(null)}
                        className="w-full border-white/20 text-white"
                      >
                        Close
                      </Button>
                    </div>
                  );
                })()}
              </Card>
            )}

            {/* Farm Stats */}
            <Card className="p-4 bg-black/40 border-white/20 backdrop-blur-sm">
              <h3 className="text-white font-medium mb-3">Farm Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Active Crops:</span>
                  <span className="text-white">{plantedCrops.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Ready to Harvest:</span>
                  <span className="text-[#4CAF50]">{plantedCrops.filter(c => c.harvestable).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Average Health:</span>
                  <span className="text-white">
                    {plantedCrops.length > 0 
                      ? Math.round(plantedCrops.reduce((sum, c) => sum + c.health, 0) / plantedCrops.length)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Climate Match:</span>
                  <span className="text-white">{normalizedLocation.climateZone}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}
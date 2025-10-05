import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  ArrowLeft, 
  Users, 
  Trophy, 
  Zap, 
  Droplets, 
  Thermometer,
  Sprout,
  Globe,
  Satellite,
  Crown,
  Target,
  Clock,
  AlertTriangle,
  TrendingUp,
  Sun,
  Wind,
  Eye,
  CloudSnow,
  Gauge,
  Leaf
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface EnhancedWorldMapProps {
  onNavigate: (screen: string, data?: any) => void;
}

interface RealTimeData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  soilMoisture: number;
  uvIndex: number;
  airQuality: number;
  lastUpdated: Date;
}

interface Location {
  id: string;
  name: string;
  country: string;
  coordinates: { lat: number; lng: number };
  position: { x: number; y: number };
  climateZone: 'tropical' | 'arid' | 'temperate' | 'continental' | 'polar' | 'mediterranean' | 'subtropical';
  soilType: 'clay' | 'sandy' | 'loamy' | 'silty' | 'peat' | 'chalky' | 'saline' | 'volcanic';
  realTimeData: RealTimeData;
  farmingPotential: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  specialCrops: string[];
  seasonalCrops: {
    spring: string[];
    summer: string[];
    autumn: string[];
    winter: string[];
  };
  challenges: string[];
  playersOnline: number;
  rewards: {
    ecoPoints: number;
    xp: number;
    rareSeeds: number;
    specialTools: number;
  };
  activeEvents: string[];
  description: string;
  climateIcon: string;
}

const realWorldLocations: Location[] = [
  {
    id: 'california-central-valley',
    name: 'Central Valley',
    country: 'California, USA',
    coordinates: { lat: 36.7783, lng: -119.4179 },
    position: { x: 15, y: 35 },
    climateZone: 'mediterranean',
    soilType: 'loamy',
    realTimeData: {
      temperature: 24,
      humidity: 45,
      windSpeed: 12,
      rainfall: 2.1,
      soilMoisture: 35,
      uvIndex: 7,
      airQuality: 82,
      lastUpdated: new Date()
    },
    farmingPotential: 95,
    difficulty: 'intermediate',
    specialCrops: ['Almonds', 'Grapes', 'Citrus'],
    seasonalCrops: {
      spring: ['Strawberries', 'Lettuce', 'Carrots'],
      summer: ['Tomatoes', 'Peppers', 'Corn'],
      autumn: ['Grapes', 'Almonds', 'Pumpkins'],
      winter: ['Broccoli', 'Cauliflower', 'Spinach']
    },
    challenges: ['Water scarcity', 'Drought risk', 'Heat waves'],
    playersOnline: 3247,
    rewards: { ecoPoints: 120, xp: 150, rareSeeds: 3, specialTools: 2 },
    activeEvents: ['Almond Harvest Festival', 'Water Conservation Challenge'],
    description: 'America\'s agricultural powerhouse with diverse crops and irrigation challenges',
    climateIcon: '🌞'
  },
  {
    id: 'netherlands-polders',
    name: 'Dutch Polders',
    country: 'Netherlands',
    coordinates: { lat: 52.3676, lng: 4.9041 },
    position: { x: 52, y: 22 },
    climateZone: 'temperate',
    soilType: 'peat',
    realTimeData: {
      temperature: 12,
      humidity: 78,
      windSpeed: 18,
      rainfall: 8.4,
      soilMoisture: 85,
      uvIndex: 3,
      airQuality: 91,
      lastUpdated: new Date()
    },
    farmingPotential: 88,
    difficulty: 'advanced',
    specialCrops: ['Tulips', 'Greenhouse Vegetables', 'Dairy Products'],
    seasonalCrops: {
      spring: ['Tulips', 'Daffodils', 'Early Potatoes'],
      summer: ['Greenhouse Tomatoes', 'Cucumbers', 'Bell Peppers'],
      autumn: ['Late Potatoes', 'Sugar Beets', 'Onions'],
      winter: ['Winter Wheat', 'Greenhouse Lettuce', 'Herbs']
    },
    challenges: ['Sea level rise', 'Soil subsidence', 'Storms'],
    playersOnline: 1834,
    rewards: { ecoPoints: 180, xp: 200, rareSeeds: 4, specialTools: 3 },
    activeEvents: ['Vertical Farming Innovation', 'Tulip Season'],
    description: 'Innovative land reclamation with high-tech sustainable farming',
    climateIcon: '🌧️'
  },
  {
    id: 'amazon-rainforest',
    name: 'Amazon Basin',
    country: 'Brazil',
    coordinates: { lat: -3.4653, lng: -62.2159 },
    position: { x: 35, y: 70 },
    climateZone: 'tropical',
    soilType: 'clay',
    realTimeData: {
      temperature: 28,
      humidity: 92,
      windSpeed: 6,
      rainfall: 15.2,
      soilMoisture: 95,
      uvIndex: 11,
      airQuality: 98,
      lastUpdated: new Date()
    },
    farmingPotential: 75,
    difficulty: 'expert',
    specialCrops: ['Cacao', 'Brazil Nuts', 'Açaí'],
    seasonalCrops: {
      spring: ['Cacao', 'Coffee', 'Passion Fruit'],
      summer: ['Brazil Nuts', 'Açaí', 'Cassava'],
      autumn: ['Rubber Trees', 'Palm Hearts', 'Guaraná'],
      winter: ['Tropical Fruits', 'Medicinal Plants', 'Spices']
    },
    challenges: ['Deforestation pressure', 'Biodiversity conservation', 'Heavy rainfall'],
    playersOnline: 2890,
    rewards: { ecoPoints: 300, xp: 350, rareSeeds: 6, specialTools: 4 },
    activeEvents: ['Rainforest Conservation', 'Sustainable Agroforestry'],
    description: 'Earth\'s lungs - practice sustainable agroforestry to preserve biodiversity',
    climateIcon: '🌴'
  },
  {
    id: 'sahara-edge',
    name: 'Sahel Region',
    country: 'Niger',
    coordinates: { lat: 17.6078, lng: 8.0817 },
    position: { x: 55, y: 45 },
    climateZone: 'arid',
    soilType: 'sandy',
    realTimeData: {
      temperature: 38,
      humidity: 18,
      windSpeed: 22,
      rainfall: 0.3,
      soilMoisture: 12,
      uvIndex: 12,
      airQuality: 67,
      lastUpdated: new Date()
    },
    farmingPotential: 25,
    difficulty: 'expert',
    specialCrops: ['Date Palms', 'Drought-resistant Millet', 'Acacia'],
    seasonalCrops: {
      spring: ['Early Millet', 'Sorghum', 'Desert Beans'],
      summer: ['Date Harvest', 'Drought Crops', 'Cacti'],
      autumn: ['Late Harvest', 'Seed Collection', 'Livestock Feed'],
      winter: ['Dry Season Crops', 'Water Conservation', 'Soil Prep']
    },
    challenges: ['Extreme drought', 'Desertification', 'Sand storms', 'Water scarcity'],
    playersOnline: 987,
    rewards: { ecoPoints: 400, xp: 500, rareSeeds: 8, specialTools: 5 },
    activeEvents: ['Desert Greening Project', 'Water Harvesting Initiative'],
    description: 'Master desert farming with drought-resistant crops and water conservation',
    climateIcon: '🏜️'
  },
  {
    id: 'hokkaido-japan',
    name: 'Hokkaido Plains',
    country: 'Japan',
    coordinates: { lat: 43.2203, lng: 142.8635 },
    position: { x: 85, y: 30 },
    climateZone: 'continental',
    soilType: 'volcanic',
    realTimeData: {
      temperature: 8,
      humidity: 65,
      windSpeed: 14,
      rainfall: 4.7,
      soilMoisture: 72,
      uvIndex: 4,
      airQuality: 95,
      lastUpdated: new Date()
    },
    farmingPotential: 82,
    difficulty: 'intermediate',
    specialCrops: ['Potatoes', 'Dairy Products', 'Seafood'],
    seasonalCrops: {
      spring: ['Early Potatoes', 'Asparagus', 'Spring Onions'],
      summer: ['Corn', 'Soybeans', 'Dairy Farming'],
      autumn: ['Potato Harvest', 'Rice', 'Root Vegetables'],
      winter: ['Greenhouse Crops', 'Preserved Foods', 'Ice Fishing']
    },
    challenges: ['Short growing season', 'Cold winters', 'Volcanic soil management'],
    playersOnline: 2156,
    rewards: { ecoPoints: 160, xp: 180, rareSeeds: 4, specialTools: 3 },
    activeEvents: ['Potato Festival', 'Snow Country Farming'],
    description: 'Cold climate farming with rich volcanic soil and innovative techniques',
    climateIcon: '❄️'
  },
  {
    id: 'mekong-delta',
    name: 'Mekong Delta',
    country: 'Vietnam',
    coordinates: { lat: 10.0452, lng: 105.7469 },
    position: { x: 78, y: 58 },
    climateZone: 'tropical',
    soilType: 'silty',
    realTimeData: {
      temperature: 31,
      humidity: 84,
      windSpeed: 8,
      rainfall: 12.8,
      soilMoisture: 88,
      uvIndex: 10,
      airQuality: 76,
      lastUpdated: new Date()
    },
    farmingPotential: 90,
    difficulty: 'intermediate',
    specialCrops: ['Rice', 'Fish Farming', 'Tropical Fruits'],
    seasonalCrops: {
      spring: ['Early Rice', 'Vegetables', 'Fish Farming'],
      summer: ['Main Rice Crop', 'Aquaculture', 'Dragon Fruit'],
      autumn: ['Late Rice', 'Root Vegetables', 'Coconuts'],
      winter: ['Dry Season Crops', 'Fish Harvest', 'Fruit Trees']
    },
    challenges: ['Monsoon floods', 'Salt water intrusion', 'Climate change'],
    playersOnline: 4123,
    rewards: { ecoPoints: 140, xp: 160, rareSeeds: 3, specialTools: 2 },
    activeEvents: ['Rice Harvest Festival', 'Aquaponics Challenge'],
    description: 'River delta farming with rice paddies and integrated aquaculture',
    climateIcon: '🌾'
  },
  {
    id: 'kenyan-highlands',
    name: 'Kenyan Highlands',
    country: 'Kenya',
    coordinates: { lat: -0.0236, lng: 37.9062 },
    position: { x: 58, y: 65 },
    climateZone: 'subtropical',
    soilType: 'volcanic',
    realTimeData: {
      temperature: 22,
      humidity: 68,
      windSpeed: 10,
      rainfall: 6.2,
      soilMoisture: 55,
      uvIndex: 9,
      airQuality: 88,
      lastUpdated: new Date()
    },
    farmingPotential: 78,
    difficulty: 'intermediate',
    specialCrops: ['Coffee', 'Tea', 'Flowers'],
    seasonalCrops: {
      spring: ['Coffee Planting', 'Vegetables', 'Maize'],
      summer: ['Tea Harvest', 'Bean Crops', 'Flowers'],
      autumn: ['Coffee Harvest', 'Root Crops', 'Fruits'],
      winter: ['Dry Season Farming', 'Irrigation Crops', 'Livestock']
    },
    challenges: ['Altitude farming', 'Water management', 'Market access'],
    playersOnline: 1756,
    rewards: { ecoPoints: 170, xp: 190, rareSeeds: 4, specialTools: 3 },
    activeEvents: ['Coffee Harvest', 'Highland Agriculture'],
    description: 'High-altitude farming with premium coffee and tea cultivation',
    climateIcon: '☕'
  },
  {
    id: 'australian-outback',
    name: 'Australian Outback',
    country: 'Australia',
    coordinates: { lat: -25.2744, lng: 133.7751 },
    position: { x: 88, y: 82 },
    climateZone: 'arid',
    soilType: 'sandy',
    realTimeData: {
      temperature: 35,
      humidity: 22,
      windSpeed: 16,
      rainfall: 1.2,
      soilMoisture: 15,
      uvIndex: 11,
      airQuality: 94,
      lastUpdated: new Date()
    },
    farmingPotential: 45,
    difficulty: 'advanced',
    specialCrops: ['Cattle Ranching', 'Native Plants', 'Solar Farming'],
    seasonalCrops: {
      spring: ['Native Grasses', 'Drought Plants', 'Early Harvest'],
      summer: ['Cattle Grazing', 'Desert Crops', 'Heat Resistant'],
      autumn: ['Late Harvest', 'Seed Collection', 'Water Storage'],
      winter: ['Cool Season Crops', 'Livestock Care', 'Soil Prep']
    },
    challenges: ['Extreme heat', 'Water scarcity', 'Remote location', 'Wildlife'],
    playersOnline: 654,
    rewards: { ecoPoints: 250, xp: 280, rareSeeds: 5, specialTools: 4 },
    activeEvents: ['Outback Challenge', 'Sustainable Ranching'],
    description: 'Extreme farming in the red center with innovative water conservation',
    climateIcon: '🦘'
  }
];

const climateColors = {
  tropical: '#00C851',
  arid: '#FF8800',
  temperate: '#007E33',
  continental: '#0099CC',
  polar: '#E3F2FD',
  mediterranean: '#FFD600',
  subtropical: '#4CAF50'
};

const difficultyColors = {
  beginner: '#4CAF50',
  intermediate: '#FF9800',
  advanced: '#F44336',
  expert: '#9C27B0'
};

const soilColors = {
  clay: '#8D4004',
  sandy: '#F4A460',
  loamy: '#654321',
  silty: '#A0522D',
  peat: '#2F4F4F',
  chalky: '#E6E6FA',
  saline: '#20B2AA',
  volcanic: '#4A148C'
};

export function EnhancedWorldMap({ onNavigate }: EnhancedWorldMapProps) {
  const { gameState } = useGame();
  const [selectedLocation, setSelectedLocation] = useState<Location>(realWorldLocations[0]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [globalEvents, setGlobalEvents] = useState<string[]>([]);

  useEffect(() => {
    // Update real-time data every 30 seconds
    const dataTimer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time weather changes
      realWorldLocations.forEach(location => {
        const variation = (Math.random() - 0.5) * 2; // ±1 degree variation
        location.realTimeData.temperature += variation;
        location.realTimeData.humidity += (Math.random() - 0.5) * 5;
        location.realTimeData.windSpeed += (Math.random() - 0.5) * 3;
        location.realTimeData.lastUpdated = new Date();
      });
    }, 30000);

    // Global events timer
    const eventTimer = setInterval(() => {
      const events = [
        'El Niño pattern affecting Pacific regions',
        'Monsoon season starting in Southeast Asia',
        'Drought warning issued for Sub-Saharan Africa',
        'Harvest season beginning in Northern Hemisphere',
        'Climate summit discussing sustainable farming',
        'New drought-resistant crop varieties released'
      ];
      setGlobalEvents([events[Math.floor(Math.random() * events.length)]]);
    }, 15000);

    return () => {
      clearInterval(dataTimer);
      clearInterval(eventTimer);
    };
  }, []);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    toast.success(`Selected ${location.name} - Real-time data loaded!`);
  };

  const handleEnterShard = (location: Location) => {
    toast.success(`Entering ${location.name} farming shard...`);
    // Pass location data to the shard component
    onNavigate('locationShard', { location });
  };

  const getSeasonalCrops = (location: Location) => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return location.seasonalCrops.spring;
    if (month >= 5 && month <= 7) return location.seasonalCrops.summer;
    if (month >= 8 && month <= 10) return location.seasonalCrops.autumn;
    return location.seasonalCrops.winter;
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
  };

  const getWeatherCondition = (location: Location) => {
    const { temperature, humidity, rainfall } = location.realTimeData;
    if (rainfall > 10) return { condition: 'Rainy', icon: '🌧️', color: '#4FC3F7' };
    if (temperature > 30) return { condition: 'Hot', icon: '🌞', color: '#FF9800' };
    if (temperature < 10) return { condition: 'Cold', icon: '❄️', color: '#00BCD4' };
    if (humidity > 80) return { condition: 'Humid', icon: '💨', color: '#9C27B0' };
    return { condition: 'Clear', icon: '☀️', color: '#FDD835' };
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
        {/* Dynamic Sky Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] transition-all duration-1000" />
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-white/5" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          
          {/* Floating clouds */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-20 h-10 bg-white/10 rounded-full blur-sm"
              animate={{
                x: ['-100px', 'calc(100vw + 100px)'],
                y: [Math.random() * 200 + 50, Math.random() * 200 + 100]
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 20
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 flex justify-between items-center border-b border-white/20 backdrop-blur-sm bg-black/20">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate('playerHub')}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Hub
            </Button>
            
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Globe className="w-8 h-8 text-[#6EE7B7]" />
              </motion.div>
              <div>
                <h1 className="text-2xl text-white">AgriVerse Real-Time World</h1>
                <p className="text-sm text-[#6EE7B7]">Live climate data • {getCurrentSeason()} Season</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Card className="px-3 py-2 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#6EE7B7] rounded-full animate-pulse" />
                <span className="text-white text-sm">Live Data</span>
              </div>
            </Card>
            
            <Card className="px-3 py-2 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#6EE7B7]" />
                <span className="text-white text-sm">
                  {realWorldLocations.reduce((total, loc) => total + loc.playersOnline, 0).toLocaleString()} Farmers
                </span>
              </div>
            </Card>

            <Badge className="bg-[#FFD369]/20 text-[#FFD369] border-[#FFD369]/40">
              {currentTime.toLocaleTimeString()}
            </Badge>
          </div>
        </div>

        {/* Global Events Banner */}
        {globalEvents.length > 0 && (
          <div className="relative z-10 px-6 py-2 bg-gradient-to-r from-[#FF6B6B]/20 to-[#FFD369]/20 border-b border-white/10">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-[#FFD369] animate-pulse" />
              <span className="text-[#FFD369] font-medium">GLOBAL UPDATE:</span>
              <span className="text-white">{globalEvents[0]}</span>
            </div>
          </div>
        )}

        <div className="relative z-10 flex h-[calc(100vh-120px)]">
          {/* Interactive World Map */}
          <div className="flex-1 p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="h-full rounded-2xl bg-black/20 backdrop-blur-sm border border-white/20 relative overflow-hidden"
            >
              {/* World Map SVG Background */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                  {/* Continents */}
                  <path d="M10,25 Q30,20 50,25 T90,30 L90,75 Q70,80 50,75 T10,70 Z" fill="#1e40af" opacity="0.4"/>
                  <path d="M5,35 Q25,30 45,35 T85,40 L85,85 Q65,90 45,85 T5,80 Z" fill="#1e40af" opacity="0.3"/>
                  <path d="M15,15 Q35,10 55,15 T95,20 L95,65 Q75,70 55,65 T15,60 Z" fill="#1e40af" opacity="0.5"/>
                </svg>
              </div>

              {/* Location Markers */}
              {realWorldLocations.map((location, index) => {
                const weather = getWeatherCondition(location);
                
                return (
                  <motion.div
                    key={location.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="absolute cursor-pointer group"
                    style={{
                      left: `${location.position.x}%`,
                      top: `${location.position.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          {/* Weather indicator ring */}
                          <motion.div
                            className="absolute inset-0 rounded-full opacity-60"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ 
                              backgroundColor: weather.color,
                              filter: 'blur(8px)'
                            }}
                          />
                          
                          {/* Main location marker */}
                          <div
                            className={`relative w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              selectedLocation.id === location.id 
                                ? 'border-[#FFD369] bg-[#FFD369]/30 shadow-lg scale-110' 
                                : 'border-white/60 bg-black/60 hover:border-[#6EE7B7] hover:scale-105'
                            }`}
                            style={{
                              backgroundColor: selectedLocation.id === location.id 
                                ? `${climateColors[location.climateZone]}40` 
                                : undefined,
                              boxShadow: selectedLocation.id !== location.id 
                                ? `0 0 20px ${climateColors[location.climateZone]}60` 
                                : undefined
                            }}
                          >
                            <div className="text-2xl">{location.climateIcon}</div>
                          </div>

                          {/* Real-time data indicators */}
                          <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                            <Badge className="text-xs px-1 py-0.5 bg-[#6EE7B7]/90 text-black">
                              {location.realTimeData.temperature}°C
                            </Badge>
                            <div className="text-lg" title={weather.condition}>
                              {weather.icon}
                            </div>
                          </div>

                          {/* Player count */}
                          <div className="absolute -bottom-2 -left-2">
                            <Badge className="text-xs px-1 py-0.5 bg-[#73C783]/90 text-black">
                              {location.playersOnline > 999 ? `${Math.floor(location.playersOnline/1000)}k` : location.playersOnline}
                            </Badge>
                          </div>

                          {/* Active events indicator */}
                          {location.activeEvents.length > 0 && (
                            <div className="absolute top-0 left-0">
                              <motion.div 
                                className="w-3 h-3 bg-[#FFD369] rounded-full"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black/90 border-white/20">
                        <div className="text-center space-y-1">
                          <p className="font-medium text-white">{location.name}</p>
                          <p className="text-xs text-gray-300">{location.country}</p>
                          <p className="text-xs text-[#6EE7B7]">{weather.condition} • {location.realTimeData.temperature}°C</p>
                          <p className="text-xs text-gray-300">{location.playersOnline} farmers online</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                );
              })}

              {/* Real-time data overlay */}
              <div className="absolute bottom-4 left-4">
                <Card className="p-3 bg-black/70 border-[#6EE7B7]/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Satellite className="w-4 h-4 text-[#6EE7B7]" />
                    <span className="text-[#6EE7B7] text-xs font-medium">LIVE CLIMATE DATA</span>
                    <motion.div 
                      className="w-2 h-2 bg-[#6EE7B7] rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-xs text-white space-y-1">
                    <div>Locations: {realWorldLocations.length} active</div>
                    <div>Season: {getCurrentSeason()}</div>
                    <div>Last Update: {currentTime.toLocaleTimeString()}</div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Location Details Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-96 p-6 space-y-4 overflow-y-auto"
          >
            {/* Location Header */}
            <Card className="p-6 bg-black/40 border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2"
                  style={{ 
                    backgroundColor: `${climateColors[selectedLocation.climateZone]}20`, 
                    borderColor: climateColors[selectedLocation.climateZone] 
                  }}
                >
                  {selectedLocation.climateIcon}
                </div>
                <div>
                  <h2 className="text-xl text-white">{selectedLocation.name}</h2>
                  <p className="text-sm text-gray-300">{selectedLocation.country}</p>
                  <Badge
                    className="text-xs mt-1"
                    style={{ 
                      backgroundColor: `${difficultyColors[selectedLocation.difficulty]}20`,
                      color: difficultyColors[selectedLocation.difficulty]
                    }}
                  >
                    {selectedLocation.difficulty.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4">{selectedLocation.description}</p>

              {/* Real-time Weather */}
              <div className="space-y-3 mb-4">
                <h4 className="text-[#6EE7B7] text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Live Conditions
                </h4>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-3 h-3 text-[#FF6B6B]" />
                      <span className="text-white">Temp</span>
                    </div>
                    <span className="text-[#FF6B6B]">{selectedLocation.realTimeData.temperature.toFixed(1)}°C</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-3 h-3 text-[#4FC3F7]" />
                      <span className="text-white">Humidity</span>
                    </div>
                    <span className="text-[#4FC3F7]">{selectedLocation.realTimeData.humidity.toFixed(0)}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="w-3 h-3 text-[#9C27B0]" />
                      <span className="text-white">Wind</span>
                    </div>
                    <span className="text-[#9C27B0]">{selectedLocation.realTimeData.windSpeed.toFixed(1)} km/h</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CloudSnow className="w-3 h-3 text-[#00BCD4]" />
                      <span className="text-white">Rain</span>
                    </div>
                    <span className="text-[#00BCD4]">{selectedLocation.realTimeData.rainfall.toFixed(1)}mm</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-3 h-3 text-[#8BC34A]" />
                      <span className="text-white">Soil</span>
                    </div>
                    <span className="text-[#8BC34A]">{selectedLocation.realTimeData.soilMoisture}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-3 h-3 text-[#FFC107]" />
                      <span className="text-white">UV</span>
                    </div>
                    <span className="text-[#FFC107]">{selectedLocation.realTimeData.uvIndex}/12</span>
                  </div>
                </div>
              </div>

              {/* Farming Potential */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-sm">Farming Potential</span>
                  <span className="text-[#73C783]">{selectedLocation.farmingPotential}%</span>
                </div>
                <Progress value={selectedLocation.farmingPotential} className="h-2" />
              </div>

              {/* Current Season Crops */}
              <div className="mb-4">
                <h4 className="text-[#73C783] text-sm mb-2 flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  {getCurrentSeason()} Crops
                </h4>
                <div className="flex flex-wrap gap-1">
                  {getSeasonalCrops(selectedLocation).slice(0, 6).map(crop => (
                    <Badge key={crop} variant="outline" className="text-xs">
                      {crop}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Soil & Climate Info */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div>
                  <span className="text-gray-400">Climate:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: climateColors[selectedLocation.climateZone] }}
                    />
                    <span className="text-white capitalize">{selectedLocation.climateZone}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Soil:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: soilColors[selectedLocation.soilType] }}
                    />
                    <span className="text-white capitalize">{selectedLocation.soilType}</span>
                  </div>
                </div>
              </div>

              {/* Enter Shard Button */}
              <Button
                onClick={() => handleEnterShard(selectedLocation)}
                className="w-full bg-gradient-to-r from-[#73C783] to-[#6EE7B7] text-black font-medium hover:from-[#6EE7B7] hover:to-[#73C783]"
              >
                <Sprout className="w-4 h-4 mr-2" />
                Enter {selectedLocation.name} Shard
              </Button>
            </Card>

            {/* Challenges */}
            <Card className="p-4 bg-black/40 border-[#FF6B6B]/30 backdrop-blur-sm">
              <h4 className="text-[#FF6B6B] text-sm mb-3">Farming Challenges</h4>
              <div className="space-y-2">
                {selectedLocation.challenges.map(challenge => (
                  <div key={challenge} className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-[#FF6B6B]" />
                    <span className="text-xs text-white">{challenge}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Rewards */}
            <Card className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
              <h4 className="text-[#FFD369] text-sm mb-3">Shard Rewards</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center">
                  <div className="text-[#73C783] font-medium">{selectedLocation.rewards.ecoPoints}</div>
                  <div className="text-gray-400">Eco Points</div>
                </div>
                <div className="text-center">
                  <div className="text-[#6EE7B7] font-medium">{selectedLocation.rewards.xp}</div>
                  <div className="text-gray-400">Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-[#FFD369] font-medium">{selectedLocation.rewards.rareSeeds}</div>
                  <div className="text-gray-400">Rare Seeds</div>
                </div>
                <div className="text-center">
                  <div className="text-[#FF8C42] font-medium">{selectedLocation.rewards.specialTools}</div>
                  <div className="text-gray-400">Special Tools</div>
                </div>
              </div>
            </Card>

            {/* Active Events */}
            {selectedLocation.activeEvents.length > 0 && (
              <Card className="p-4 bg-[#FFD369]/10 border-[#FFD369]/30 backdrop-blur-sm">
                <h4 className="text-[#FFD369] text-sm mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Active Events
                </h4>
                <div className="space-y-2">
                  {selectedLocation.activeEvents.map(event => (
                    <div key={event} className="flex items-center gap-2">
                      <motion.div 
                        className="w-2 h-2 bg-[#FFD369] rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-xs text-white">{event}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Players Online */}
            <Card className="p-4 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#6EE7B7]" />
                  <span className="text-white text-sm">Farmers Online</span>
                </div>
                <span className="text-[#6EE7B7] font-medium">{selectedLocation.playersOnline.toLocaleString()}</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}
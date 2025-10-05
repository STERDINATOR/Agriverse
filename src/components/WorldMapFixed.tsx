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
  TrendingUp
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner';

interface WorldMapProps {
  onNavigate: (screen: string) => void;
}

interface Region {
  id: string;
  name: string;
  country: string;
  coordinates: { lat: number; lng: number };
  position: { x: number; y: number }; // Position on the map visual
  soilType: 'clay' | 'sandy' | 'loamy' | 'silty' | 'peat' | 'chalky' | 'saline';
  climate: {
    temperature: number;
    rainfall: number;
    humidity: number;
    droughtIndex: number;
  };
  farmingPotential: number; // 0-100
  challenges: string[];
  playersOnline: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  rewards: {
    ecoPoints: number;
    rare_seeds: number;
    special_tools: number;
  };
  events: string[];
  bestCrops: string[];
}

const worldRegions: Region[] = [
  {
    id: 'midwest-usa',
    name: 'Great Plains',
    country: 'USA',
    coordinates: { lat: 41.8781, lng: -87.6298 },
    position: { x: 25, y: 35 },
    soilType: 'loamy',
    climate: { temperature: 22, rainfall: 800, humidity: 65, droughtIndex: 25 },
    farmingPotential: 95,
    challenges: ['Seasonal flooding', 'Tornado risk'],
    playersOnline: 2847,
    difficulty: 'easy',
    rewards: { ecoPoints: 100, rare_seeds: 2, special_tools: 1 },
    events: ['Spring Planting Festival'],
    bestCrops: ['Corn', 'Soybeans', 'Wheat']
  },
  {
    id: 'sahel-africa',
    name: 'Sahel Belt',
    country: 'Mali',
    coordinates: { lat: 17.5707, lng: -3.9962 },
    position: { x: 50, y: 55 },
    soilType: 'sandy',
    climate: { temperature: 35, rainfall: 200, humidity: 25, droughtIndex: 85 },
    farmingPotential: 35,
    challenges: ['Extreme drought', 'Desertification', 'Locust swarms'],
    playersOnline: 1653,
    difficulty: 'extreme',
    rewards: { ecoPoints: 300, rare_seeds: 5, special_tools: 3 },
    events: ['Drought Crisis Challenge'],
    bestCrops: ['Millet', 'Sorghum', 'Desert beans']
  },
  {
    id: 'mekong-delta',
    name: 'Mekong Delta',
    country: 'Vietnam',
    coordinates: { lat: 10.0452, lng: 105.7469 },
    position: { x: 80, y: 60 },
    soilType: 'silty',
    climate: { temperature: 28, rainfall: 1600, humidity: 85, droughtIndex: 10 },
    farmingPotential: 88,
    challenges: ['Monsoon flooding', 'Salt intrusion'],
    playersOnline: 3921,
    difficulty: 'medium',
    rewards: { ecoPoints: 150, rare_seeds: 3, special_tools: 2 },
    events: ['Rice Harvest Competition'],
    bestCrops: ['Rice', 'Aquaculture', 'Tropical fruits']
  },
  {
    id: 'pampas-argentina',
    name: 'Pampas',
    country: 'Argentina',
    coordinates: { lat: -34.6118, lng: -58.3960 },
    position: { x: 30, y: 80 },
    soilType: 'loamy',
    climate: { temperature: 18, rainfall: 1000, humidity: 70, droughtIndex: 20 },
    farmingPotential: 92,
    challenges: ['Variable rainfall', 'Economic volatility'],
    playersOnline: 2156,
    difficulty: 'easy',
    rewards: { ecoPoints: 120, rare_seeds: 2, special_tools: 1 },
    events: ['Cattle & Crop Festival'],
    bestCrops: ['Beef cattle', 'Soybeans', 'Wheat']
  },
  {
    id: 'punjab-india',
    name: 'Punjab Plains',
    country: 'India',
    coordinates: { lat: 31.1471, lng: 75.3412 },
    position: { x: 75, y: 40 },
    soilType: 'clay',
    climate: { temperature: 30, rainfall: 600, humidity: 60, droughtIndex: 40 },
    farmingPotential: 85,
    challenges: ['Water scarcity', 'Soil depletion'],
    playersOnline: 4782,
    difficulty: 'medium',
    rewards: { ecoPoints: 140, rare_seeds: 3, special_tools: 2 },
    events: ['Green Revolution Challenge'],
    bestCrops: ['Rice', 'Wheat', 'Cotton']
  },
  {
    id: 'netherlands',
    name: 'Dutch Polders',
    country: 'Netherlands',
    coordinates: { lat: 52.1326, lng: 5.2913 },
    position: { x: 52, y: 25 },
    soilType: 'peat',
    climate: { temperature: 15, rainfall: 900, humidity: 80, droughtIndex: 15 },
    farmingPotential: 78,
    challenges: ['Sea level rise', 'Soil subsidence'],
    playersOnline: 1834,
    difficulty: 'hard',
    rewards: { ecoPoints: 200, rare_seeds: 4, special_tools: 3 },
    events: ['Vertical Farming Expo'],
    bestCrops: ['Tulips', 'Greenhouse vegetables', 'Dairy']
  },
  {
    id: 'murray-darling',
    name: 'Murray-Darling',
    country: 'Australia',
    coordinates: { lat: -34.4278, lng: 142.1015 },
    position: { x: 85, y: 85 },
    soilType: 'saline',
    climate: { temperature: 25, rainfall: 400, humidity: 45, droughtIndex: 60 },
    farmingPotential: 55,
    challenges: ['Soil salinity', 'Water rights conflicts'],
    playersOnline: 987,
    difficulty: 'hard',
    rewards: { ecoPoints: 180, rare_seeds: 4, special_tools: 2 },
    events: ['Water Conservation Challenge'],
    bestCrops: ['Salt-tolerant crops', 'Sheep', 'Citrus']
  },
  {
    id: 'amazon-basin',
    name: 'Amazon Basin',
    country: 'Brazil',
    coordinates: { lat: -3.4653, lng: -62.2159 },
    position: { x: 35, y: 70 },
    soilType: 'clay',
    climate: { temperature: 26, rainfall: 2200, humidity: 90, droughtIndex: 5 },
    farmingPotential: 70,
    challenges: ['Deforestation pressure', 'Biodiversity loss'],
    playersOnline: 3456,
    difficulty: 'extreme',
    rewards: { ecoPoints: 350, rare_seeds: 6, special_tools: 4 },
    events: ['Rainforest Restoration'],
    bestCrops: ['Agroforestry', 'Cacao', 'Brazil nuts']
  }
];

const soilTypeColors = {
  clay: '#8B4513',
  sandy: '#F4A460',
  loamy: '#654321',
  silty: '#A0522D',
  peat: '#2F4F4F',
  chalky: '#E6E6FA',
  saline: '#20B2AA'
};

const difficultyColors = {
  easy: '#73C783',
  medium: '#FFD369',
  hard: '#FF8C42',
  extreme: '#FF6B6B'
};

export function WorldMap({ onNavigate }: WorldMapProps) {
  const { gameState } = useGame();
  const [selectedRegion, setSelectedRegion] = useState<Region>(worldRegions[0]);
  const [showPvPMode, setShowPvPMode] = useState(false);
  const [liveEvents, setLiveEvents] = useState<string[]>([]);

  useEffect(() => {
    // Simulate live events
    const eventTimer = setInterval(() => {
      const events = [
        'Global drought affecting 3 regions',
        'Flash flood in Mekong Delta',
        'Locust swarm approaching Sahel',
        'Market prices surging for wheat',
        'New vertical farming tech unlocked'
      ];
      setLiveEvents([events[Math.floor(Math.random() * events.length)]]);
    }, 10000);

    return () => clearInterval(eventTimer);
  }, []);

  const handleJoinRegion = (region: Region) => {
    if (showPvPMode) {
      toast.success(`Joining PvP match in ${region.name}! Finding opponents...`);
      setTimeout(() => {
        onNavigate('farmingGameplay');
      }, 2000);
    } else {
      toast.success(`Deploying to ${region.name} for solo farming!`);
      onNavigate('farmingGameplay');
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
        {/* Animated Earth Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000814] via-[#001D3D] to-[#003566]">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-white/5 animate-pulse" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate('playerHub')}
              variant="ghost"
              className="text-[#E5E7EB] hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Hub
            </Button>
            
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#6EE7B7]" />
              <h1 className="text-2xl text-[#E5E7EB]">AgriVerse World Map</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Card className="px-3 py-2 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#6EE7B7]" />
                <span className="text-[#E5E7EB] text-sm">
                  {worldRegions.reduce((total, region) => total + region.playersOnline, 0).toLocaleString()} Online
                </span>
              </div>
            </Card>

            <Button
              onClick={() => setShowPvPMode(!showPvPMode)}
              className={`${showPvPMode 
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF1744]' 
                : 'bg-gradient-to-r from-[#73C783] to-[#6EE7B7]'
              } text-black font-medium`}
            >
              <Target className="w-4 h-4 mr-2" />
              {showPvPMode ? 'PvP Battle Mode' : 'Solo Farming Mode'}
            </Button>
          </div>
        </div>

        <div className="relative z-10 flex h-[calc(100vh-80px)]">
          {/* Main World Map */}
          <div className="flex-1 p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="h-full rounded-2xl bg-black/20 backdrop-blur-sm border border-[#6EE7B7]/20 relative overflow-hidden"
            >
              {/* World Map SVG Background */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                  {/* Simplified world map paths */}
                  <path d="M20,30 Q40,25 60,30 T100,35 L100,70 Q80,75 60,70 T20,65 Z" fill="#1E3A8A" opacity="0.3"/>
                  <path d="M0,40 Q20,35 40,40 T80,45 L80,80 Q60,85 40,80 T0,75 Z" fill="#1E3A8A" opacity="0.2"/>
                  <path d="M30,20 Q50,15 70,20 T100,25 L100,60 Q80,65 60,60 T30,55 Z" fill="#1E3A8A" opacity="0.4"/>
                </svg>
              </div>

              {/* Live Events Ticker */}
              {liveEvents.length > 0 && (
                <div className="absolute top-4 left-4 right-4">
                  <Card className="p-2 bg-[#FF6B6B]/10 border-[#FF6B6B]/30 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#FF6B6B] animate-pulse" />
                      <span className="text-[#FF6B6B] text-sm font-medium">LIVE:</span>
                      <span className="text-[#E5E7EB] text-sm">{liveEvents[0]}</span>
                    </div>
                  </Card>
                </div>
              )}

              {/* Region Markers */}
              {worldRegions.map((region, index) => (
                <motion.div
                  key={region.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
                  style={{
                    left: `${region.position.x}%`,
                    top: `${region.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setSelectedRegion(region)}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        {/* Region Glow */}
                        <div
                          className="absolute inset-0 rounded-full blur-lg opacity-60"
                          style={{ backgroundColor: difficultyColors[region.difficulty] }}
                        />
                        
                        {/* Region Core */}
                        <div
                          className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            selectedRegion.id === region.id 
                              ? 'border-[#FFD369] bg-[#FFD369]/20 shadow-lg' 
                              : 'border-white/50 bg-black/50'
                          }`}
                          style={{
                            backgroundColor: selectedRegion.id === region.id 
                              ? `${difficultyColors[region.difficulty]}40` 
                              : undefined,
                            boxShadow: selectedRegion.id !== region.id 
                              ? `0 0 15px ${difficultyColors[region.difficulty]}60` 
                              : undefined
                          }}
                        >
                          <Sprout className="w-6 h-6" style={{ color: difficultyColors[region.difficulty] }} />
                        </div>

                        {/* Player count indicator */}
                        <div className="absolute -top-2 -right-2">
                          <Badge 
                            className="text-xs px-1 py-0.5 bg-[#6EE7B7] text-black"
                          >
                            {region.playersOnline > 999 ? `${Math.floor(region.playersOnline/1000)}k` : region.playersOnline}
                          </Badge>
                        </div>

                        {/* Active events indicator */}
                        {region.events.length > 0 && (
                          <div className="absolute -bottom-2 -left-2">
                            <div className="w-3 h-3 bg-[#FFD369] rounded-full animate-pulse" />
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-medium">{region.name}</p>
                        <p className="text-xs text-muted-foreground">{region.country}</p>
                        <p className="text-xs">{region.playersOnline} players online</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}

              {/* NASA Data Overlay */}
              <div className="absolute bottom-4 left-4">
                <Card className="p-3 bg-black/60 border-[#6EE7B7]/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Satellite className="w-4 h-4 text-[#6EE7B7]" />
                    <span className="text-[#6EE7B7] text-xs">REAL-TIME NASA DATA</span>
                    <div className="w-2 h-2 bg-[#6EE7B7] rounded-full animate-pulse" />
                  </div>
                  <div className="text-xs text-[#E5E7EB] space-y-1">
                    <div>Global CO₂: 421.3 ppm ↗</div>
                    <div>Ocean Temp: +1.2°C</div>
                    <div>Active Regions: {worldRegions.length}</div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Region Details Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-96 p-6 space-y-4"
          >
            <Card className="p-6 bg-black/40 border-[#73C783]/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2"
                  style={{ 
                    backgroundColor: `${difficultyColors[selectedRegion.difficulty]}20`, 
                    borderColor: difficultyColors[selectedRegion.difficulty] 
                  }}
                >
                  <Sprout className="w-6 h-6" style={{ color: difficultyColors[selectedRegion.difficulty] }} />
                </div>
                <div>
                  <h2 className="text-xl text-[#E5E7EB]">{selectedRegion.name}</h2>
                  <p className="text-sm text-[#E5E7EB]/70">{selectedRegion.country}</p>
                  <Badge
                    className="text-xs mt-1"
                    style={{ 
                      backgroundColor: `${difficultyColors[selectedRegion.difficulty]}20`,
                      color: difficultyColors[selectedRegion.difficulty]
                    }}
                  >
                    {selectedRegion.difficulty.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Climate Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-[#FF6B6B]" />
                    <span className="text-[#E5E7EB] text-sm">Temperature</span>
                  </div>
                  <span className="text-[#FF6B6B]">{selectedRegion.climate.temperature}°C</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-[#4ECDC4]" />
                    <span className="text-[#E5E7EB] text-sm">Rainfall</span>
                  </div>
                  <span className="text-[#4ECDC4]">{selectedRegion.climate.rainfall}mm</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#FFD369]" />
                    <span className="text-[#E5E7EB] text-sm">Drought Risk</span>
                  </div>
                  <span className="text-[#FFD369]">{selectedRegion.climate.droughtIndex}%</span>
                </div>
              </div>

              {/* Farming Potential */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#E5E7EB] text-sm">Farming Potential</span>
                  <span className="text-[#73C783]">{selectedRegion.farmingPotential}%</span>
                </div>
                <Progress value={selectedRegion.farmingPotential} className="h-2" />
              </div>

              {/* Soil Type */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: soilTypeColors[selectedRegion.soilType] }}
                  />
                  <span className="text-[#E5E7EB] text-sm">Soil: {selectedRegion.soilType}</span>
                </div>
              </div>

              {/* Best Crops */}
              <div className="mb-4">
                <h4 className="text-[#73C783] text-sm mb-2">Best Crops</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedRegion.bestCrops.map(crop => (
                    <Badge key={crop} variant="outline" className="text-xs">
                      {crop}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Challenges */}
              <div className="mb-4">
                <h4 className="text-[#FF6B6B] text-sm mb-2">Challenges</h4>
                <div className="space-y-1">
                  {selectedRegion.challenges.map(challenge => (
                    <p key={challenge} className="text-xs text-[#E5E7EB]/70">• {challenge}</p>
                  ))}
                </div>
              </div>

              {/* Rewards */}
              <div className="mb-6">
                <h4 className="text-[#FFD369] text-sm mb-2">Match Rewards</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-[#73C783]">{selectedRegion.rewards.ecoPoints}</div>
                    <div className="text-[#E5E7EB]/70">Eco Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#6EE7B7]">{selectedRegion.rewards.rare_seeds}</div>
                    <div className="text-[#E5E7EB]/70">Rare Seeds</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#FFD369]">{selectedRegion.rewards.special_tools}</div>
                    <div className="text-[#E5E7EB]/70">Tools</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => handleJoinRegion(selectedRegion)}
                  className={`w-full ${showPvPMode 
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF1744] hover:from-[#FF1744] hover:to-[#FF6B35]' 
                    : 'bg-gradient-to-r from-[#73C783] to-[#6EE7B7]'
                  } text-black font-medium`}
                >
                  {showPvPMode ? (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Join PvP Match ({selectedRegion.playersOnline} online)
                    </>
                  ) : (
                    <>
                      <Sprout className="w-4 h-4 mr-2" />
                      Start Solo Farming
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="text-xs border-[#6EE7B7] text-[#6EE7B7]"
                    onClick={() => toast.info(`Weather forecast for ${selectedRegion.name}: Partly cloudy, ${selectedRegion.climate.temperature}°C`)}
                  >
                    <Satellite className="w-3 h-3 mr-1" />
                    Weather
                  </Button>
                  <Button
                    variant="outline"
                    className="text-xs border-[#FFD369] text-[#FFD369]"
                    onClick={() => toast.info('Market prices updated every 5 minutes based on global supply/demand')}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Market
                  </Button>
                </div>
              </div>
            </Card>

            {/* Active Events */}
            {selectedRegion.events.length > 0 && (
              <Card className="p-4 bg-[#FFD369]/10 border-[#FFD369]/30 backdrop-blur-sm">
                <h4 className="text-[#FFD369] text-sm mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Active Events
                </h4>
                <div className="space-y-2">
                  {selectedRegion.events.map(event => (
                    <div key={event} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#FFD369] rounded-full animate-pulse" />
                      <span className="text-[#E5E7EB] text-xs">{event}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Leaderboard Preview */}
            <Card className="p-4 bg-black/40 border-[#FF6B6B]/30 backdrop-blur-sm">
              <h4 className="text-[#FF6B6B] text-sm mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                {selectedRegion.name} Leaderboard
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-3 h-3 text-[#FFD369]" />
                    <span className="text-[#E5E7EB]">EcoMaster2024</span>
                  </div>
                  <span className="text-[#73C783]">12,847 points</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#C0C0C0] rounded-full" />
                    <span className="text-[#E5E7EB]">FarmHero_99</span>
                  </div>
                  <span className="text-[#73C783]">11,203 points</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#CD7F32] rounded-full" />
                    <span className="text-[#E5E7EB]">CropKing</span>
                  </div>
                  <span className="text-[#73C783]">9,876 points</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 text-xs border-[#FF6B6B] text-[#FF6B6B]"
                onClick={() => onNavigate('arenaMode')}
              >
                View Full Rankings
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}
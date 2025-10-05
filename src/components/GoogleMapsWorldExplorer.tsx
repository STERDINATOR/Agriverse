import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Globe,
  MapPin,
  Users,
  Target,
  Star,
  Timer,
  Play,
  CheckCircle,
  Circle,
  MessageSquare,
  Sun,
  Mountain,
  Trees,
  Waves,
  Snowflake,
  Leaf
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';
import worldMapImage from 'figma:asset/69479362b0f5ad930b2abced81e0e2a6df49dd0c.png';

interface GoogleMapsWorldExplorerProps {
  onNavigate: (screen: string, data?: any) => void;
}

interface Mission {
  id: string;
  title: string;
  type: 'story' | 'challenge' | 'crisis' | 'exploration';
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: string;
  rewards: string[];
  description: string;
  requiredLevel: number;
  icon: string;
  color: string;
}

interface MapLocation {
  id: string;
  name: string;
  country: string;
  position: { x: number; y: number };
  terrain: string;
  climate: string;
  temperature: number;
  missions: Mission[];
  playersOnline: number;
  isUnlocked: boolean;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
}

const worldLocations: MapLocation[] = [
  {
    id: 'sahara',
    name: 'Sahara Oasis',
    country: 'Morocco',
    position: { x: 50, y: 45 }, // North Africa
    terrain: 'desert',
    climate: 'arid',
    temperature: 42.5,
    missions: [
      {
        id: 'drought-titan',
        title: 'Defeat the Drought Titan',
        type: 'crisis',
        difficulty: 4,
        duration: '45 min',
        rewards: ['500 EcoCoins', 'Desert Guardian Pet'],
        description: 'Face the Drought Titan threatening the Sahara',
        requiredLevel: 15,
        icon: '🔥',
        color: '#FF6B47'
      }
    ],
    playersOnline: 847,
    isUnlocked: true,
    difficultyLevel: 4
  },
  {
    id: 'amazon',
    name: 'Amazon Canopy',
    country: 'Brazil',
    position: { x: 28, y: 60 }, // South America
    terrain: 'forest',
    climate: 'tropical',
    temperature: 26.8,
    missions: [
      {
        id: 'biodiversity',
        title: 'Guardian of Biodiversity',
        type: 'exploration',
        difficulty: 3,
        duration: '2 hours',
        rewards: ['300 EcoCoins', 'Rainforest Companion'],
        description: 'Protect endangered plant species',
        requiredLevel: 8,
        icon: '🦋',
        color: '#4CAF50'
      }
    ],
    playersOnline: 1653,
    isUnlocked: true,
    difficultyLevel: 3
  },
  {
    id: 'himalaya',
    name: 'Himalayan Peaks',
    country: 'Nepal',
    position: { x: 70, y: 38 }, // Asia - Nepal/India
    terrain: 'mountains',
    climate: 'alpine',
    temperature: -5.2,
    missions: [
      {
        id: 'frozen-crops',
        title: 'Frozen Crops Challenge',
        type: 'challenge',
        difficulty: 5,
        duration: '3 hours',
        rewards: ['800 EcoCoins', 'Mountain Yak Pet'],
        description: 'Master high-altitude farming',
        requiredLevel: 25,
        icon: '❄️',
        color: '#64B5F6'
      }
    ],
    playersOnline: 324,
    isUnlocked: false,
    difficultyLevel: 5
  },
  {
    id: 'netherlands',
    name: 'Dutch Polders',
    country: 'Netherlands',
    position: { x: 50, y: 30 }, // Europe
    terrain: 'farmland',
    climate: 'temperate',
    temperature: 12.5,
    missions: [
      {
        id: 'flood-mgmt',
        title: 'Water Management Master',
        type: 'story',
        difficulty: 2,
        duration: '1 hour',
        rewards: ['250 EcoCoins', 'Flood Control Tech'],
        description: 'Learn Dutch flood management',
        requiredLevel: 3,
        icon: '🌊',
        color: '#2196F3'
      }
    ],
    playersOnline: 756,
    isUnlocked: true,
    difficultyLevel: 2
  },
  {
    id: 'australia',
    name: 'Great Barrier Reef',
    country: 'Australia',
    position: { x: 85, y: 70 }, // Australia East Coast
    terrain: 'ocean',
    climate: 'tropical marine',
    temperature: 24.5,
    missions: [
      {
        id: 'coral',
        title: 'Coral Garden Restoration',
        type: 'exploration',
        difficulty: 3,
        duration: '2.5 hours',
        rewards: ['400 EcoCoins', 'Coral Pet'],
        description: 'Restore coral reefs',
        requiredLevel: 12,
        icon: '🐠',
        color: '#00BCD4'
      }
    ],
    playersOnline: 523,
    isUnlocked: true,
    difficultyLevel: 3
  },
  {
    id: 'kenya',
    name: 'Kenyan Plains',
    country: 'Kenya',
    position: { x: 56, y: 55 }, // East Africa
    terrain: 'plains',
    climate: 'savanna',
    temperature: 28.5,
    missions: [
      {
        id: 'savanna',
        title: 'Savanna Sustainability',
        type: 'story',
        difficulty: 3,
        duration: '2 hours',
        rewards: ['350 EcoCoins', 'Zebra Pet'],
        description: 'Learn from Maasai farmers',
        requiredLevel: 10,
        icon: '🦓',
        color: '#FFB74D'
      }
    ],
    playersOnline: 892,
    isUnlocked: true,
    difficultyLevel: 3
  },
  {
    id: 'canada',
    name: 'Canadian Prairies',
    country: 'Canada',
    position: { x: 18, y: 25 }, // North America - Canada
    terrain: 'farmland',
    climate: 'continental',
    temperature: -8.5,
    missions: [
      {
        id: 'wheat-fields',
        title: 'Prairie Wheat Master',
        type: 'story',
        difficulty: 2,
        duration: '1.5 hours',
        rewards: ['300 EcoCoins', 'Wheat Seeds'],
        description: 'Learn sustainable wheat farming',
        requiredLevel: 5,
        icon: '🌾',
        color: '#FFD369'
      }
    ],
    playersOnline: 634,
    isUnlocked: true,
    difficultyLevel: 2
  },
  {
    id: 'china',
    name: 'Rice Terraces',
    country: 'China',
    position: { x: 75, y: 40 }, // East Asia - China
    terrain: 'farmland',
    climate: 'subtropical',
    temperature: 22.3,
    missions: [
      {
        id: 'terraces',
        title: 'Ancient Terrace Farming',
        type: 'exploration',
        difficulty: 3,
        duration: '2 hours',
        rewards: ['400 EcoCoins', 'Rice Knowledge'],
        description: 'Master ancient Chinese terrace farming',
        requiredLevel: 10,
        icon: '🏞️',
        color: '#8BC34A'
      }
    ],
    playersOnline: 1456,
    isUnlocked: true,
    difficultyLevel: 3
  },
  {
    id: 'russia',
    name: 'Siberian Tundra',
    country: 'Russia',
    position: { x: 70, y: 18 }, // Northern Asia - Russia
    terrain: 'glacier',
    climate: 'arctic',
    temperature: -18.2,
    missions: [
      {
        id: 'permafrost',
        title: 'Permafrost Pioneer',
        type: 'challenge',
        difficulty: 5,
        duration: '4 hours',
        rewards: ['900 EcoCoins', 'Arctic Seeds'],
        description: 'Farm in extreme Arctic conditions',
        requiredLevel: 30,
        icon: '🧊',
        color: '#B3E5FC'
      }
    ],
    playersOnline: 234,
    isUnlocked: false,
    difficultyLevel: 5
  }
];

const getTerrainIcon = (terrain: string) => {
  const icons: Record<string, any> = {
    mountains: Mountain,
    desert: Sun,
    glacier: Snowflake,
    ocean: Waves,
    forest: Trees,
    farmland: Leaf,
    plains: Leaf
  };
  return icons[terrain] || Globe;
};

const getTerrainColor = (terrain: string) => {
  const colors: Record<string, string> = {
    mountains: '#8D6E63',
    desert: '#FFB74D',
    glacier: '#B3E5FC',
    ocean: '#2196F3',
    forest: '#4CAF50',
    farmland: '#8BC34A',
    plains: '#9CCC65'
  };
  return colors[terrain] || '#666';
};

export function GoogleMapsWorldExplorer({ onNavigate }: GoogleMapsWorldExplorerProps) {
  const { gameState } = useGame();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [showAnimatedEntry, setShowAnimatedEntry] = useState(false);

  const handleLocationClick = (location: MapLocation) => {
    if (!location.isUnlocked) {
      toast.error(`${location.name} is locked!`);
      return;
    }
    setSelectedLocation(location);
    toast.success(`Exploring ${location.name}`);
  };

  const handleMissionStart = (mission: Mission) => {
    if (gameState.playerLevel < mission.requiredLevel) {
      toast.error(`Level ${mission.requiredLevel} required`);
      return;
    }

    setShowAnimatedEntry(true);
    toast.success(`Starting: ${mission.title}`);
    
    setTimeout(() => {
      setShowAnimatedEntry(false);
      onNavigate('locationShard', { 
        location: selectedLocation, 
        mission: mission
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden bg-black">
      {/* Header */}
      <div className="relative z-20 p-4 flex justify-between items-center border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => onNavigate('playerHub')}
            variant="ghost"
            className="text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Hub
          </Button>
          
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-[#6EE7B7]" />
            <div>
              <h1 className="text-xl text-white">World Explorer</h1>
              <p className="text-sm text-gray-300">Explore farming missions worldwide</p>
            </div>
          </div>
        </div>

        <Badge className="bg-[#6EE7B7]/20 text-[#6EE7B7]">
          {worldLocations.filter(l => l.isUnlocked).length} / {worldLocations.length} Unlocked
        </Badge>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel */}
        <div className="w-80 p-4 space-y-4 bg-black/20 border-r border-white/10 overflow-y-auto">
          <Card className="p-4 bg-black/40 border-white/20">
            <h3 className="text-white mb-3">Locations</h3>
            <div className="space-y-2">
              {worldLocations.map(location => {
                const TerrainIcon = getTerrainIcon(location.terrain);
                const color = getTerrainColor(location.terrain);
                
                return (
                  <div
                    key={location.id}
                    className={`p-3 rounded cursor-pointer transition-all ${
                      location.isUnlocked
                        ? selectedLocation?.id === location.id
                          ? 'bg-[#6EE7B7]/20 border border-[#6EE7B7]'
                          : 'bg-white/5 hover:bg-white/10'
                        : 'bg-gray-800/30 opacity-50'
                    }`}
                    onClick={() => location.isUnlocked && handleLocationClick(location)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TerrainIcon className="w-4 h-4" style={{ color }} />
                      <div className="flex-1">
                        <div className="text-white text-sm">{location.name}</div>
                        <div className="text-xs text-gray-400">{location.country}</div>
                      </div>
                      {!location.isUnlocked && <span>🔒</span>}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">{location.missions.length} missions</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2 h-2 ${
                              i < location.difficultyLevel 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-4 bg-black/40 border-white/20">
            <h3 className="text-white mb-3">Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Locations:</span>
                <span className="text-[#6EE7B7]">{worldLocations.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Missions:</span>
                <span className="text-[#FFD369]">
                  {worldLocations.reduce((sum, loc) => sum + loc.missions.length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Players Online:</span>
                <span className="text-white">
                  {worldLocations.reduce((sum, loc) => sum + loc.playersOnline, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <div className="w-full h-full relative">
            <img
              src={worldMapImage}
              alt="World Map"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Location Markers */}
            {worldLocations.map(location => {
              const TerrainIcon = getTerrainIcon(location.terrain);
              const color = getTerrainColor(location.terrain);
              const isSelected = selectedLocation?.id === location.id;

              return (
                <div
                  key={location.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${location.position.x}%`,
                    top: `${location.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleLocationClick(location)}
                >
                  <div 
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-all ${
                      location.isUnlocked 
                        ? isSelected 
                          ? 'border-[#FFD369] bg-[#FFD369]/40 shadow-lg' 
                          : 'border-[#6EE7B7] bg-black/70 hover:scale-110'
                        : 'border-gray-500 bg-gray-800/70 opacity-50'
                    }`}
                  >
                    <TerrainIcon 
                      className="w-5 h-5" 
                      style={{ color: location.isUnlocked ? color : '#666' }} 
                    />
                  </div>
                  
                  {location.missions.length > 0 && location.isUnlocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                      !
                    </div>
                  )}
                  
                  {location.playersOnline > 0 && (
                    <Badge className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-[#6EE7B7]/90 text-black">
                      <Users className="w-3 h-3 mr-1" />
                      {location.playersOnline > 999 ? `${Math.floor(location.playersOnline/1000)}k` : location.playersOnline}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission Panel */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 p-4 space-y-4 bg-black/20 border-l border-white/10 overflow-y-auto"
            >
              <Card className="p-4 bg-black/40 border-white/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white text-lg">{selectedLocation.name}</h3>
                    <p className="text-sm text-gray-300">{selectedLocation.country}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedLocation(null)}
                    className="text-gray-400"
                  >
                    ×
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="bg-white/5 rounded p-2">
                    <span className="text-gray-300">Climate</span>
                    <p className="text-white">{selectedLocation.climate}</p>
                  </div>
                  <div className="bg-white/5 rounded p-2">
                    <span className="text-gray-300">Temp</span>
                    <p className="text-white">{selectedLocation.temperature.toFixed(1)}°C</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Missions ({selectedLocation.missions.length})
                  </h4>
                  
                  {selectedLocation.missions.map(mission => (
                    <Card key={mission.id} className="p-3 bg-white/5 border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{mission.icon}</span>
                        <div>
                          <h5 className="text-white text-sm">{mission.title}</h5>
                          <Badge className="text-xs mt-1" style={{ backgroundColor: mission.color }}>
                            {mission.type}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-300 text-xs mb-2">{mission.description}</p>
                      
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-gray-400">⏱️ {mission.duration}</span>
                        <span className="text-gray-400">Level {mission.requiredLevel}+</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {mission.rewards.map(reward => (
                          <Badge key={reward} variant="outline" className="text-xs">
                            🎁 {reward}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleMissionStart(mission)}
                        disabled={gameState.playerLevel < mission.requiredLevel}
                        className="w-full bg-gradient-to-r from-[#73C783] to-[#6EE7B7] text-black"
                      >
                        {gameState.playerLevel < mission.requiredLevel ? (
                          <>
                            <Circle className="w-4 h-4 mr-2" />
                            Level {mission.requiredLevel} Required
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Mission
                          </>
                        )}
                      </Button>
                    </Card>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Entry Animation */}
      <AnimatePresence>
        {showAnimatedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-6xl mb-4"
              >
                🌍
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl text-white"
              >
                Entering {selectedLocation?.name}
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NASAClimateData, FarmingConditions, nasaDataService } from '../services/NASADataService';
import { toast } from 'sonner@2.0.3';

export interface Crop {
  id: string;
  type: string;
  name: string;
  emoji: string;
  plantedAt: number;
  growthTime: number; // in seconds
  growth: number; // 0-100
  plotIndex: number;
  shardId: string;
  waterLevel: number;
  health: number;
}

export interface Shard {
  id: string;
  name: string;
  emoji: string;
  status: 'available' | 'current' | 'locked';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  description: string;
  color: string;
  position: { x: number; y: number };
  climate: { temp: number; humidity: number; stability: number };
  soilHealth: number;
  waterLevel: number;
  airQuality: number;
  unlockedAt?: number;
  completionProgress: number;
}

export interface Resources {
  seeds: number;
  water: number;
  energy: number;
  ecoPoints: number;
  xp: number;
}

export interface LearnedSkill {
  skillId: string;
  name: string;
  level: number;
  experience: number;
  category: 'climate' | 'soil' | 'water' | 'crops' | 'tech' | 'sustainability';
  learnedAt: number;
}

export interface FarmTool {
  id: string;
  name: string;
  type: 'irrigation' | 'harvesting' | 'planting' | 'analysis';
  level: number;
  speedBonus: number; // percentage bonus to mission speed
  qualityBonus: number; // percentage bonus to crop quality
  xpCost: number;
  owned: boolean;
  description: string;
  emoji: string;
}

export interface CropSeed {
  id: string;
  name: string;
  type: string;
  growthTimeReduction: number; // seconds
  yieldBonus: number; // percentage
  xpCost: number;
  owned: boolean;
  description: string;
  emoji: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: Resources;
  completed: boolean;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  emoji: string;
  description: string;
  specialty: string;
  color: string;
  ability: string;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  emoji: string;
  description: string;
  ability: string;
  color: string;
  level: number;
}

export interface FarmCard {
  id: string;
  name: string;
  emoji: string;
  category: 'soil' | 'water' | 'biodiversity' | 'climate' | 'genetics';
  power: string;
  knowledge: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned: boolean;
}

export interface BossChallenge {
  id: string;
  name: string;
  emoji: string;
  type: 'drought' | 'flood' | 'pest' | 'pollution' | 'soil-degradation';
  description: string;
  health: number;
  maxHealth: number;
  defeated: boolean;
  shardId: string;
}

export interface CharacterAppearance {
  skinTone: number;
  hairStyle: number;
  hairColor: number;
  eyeColor: number;
  outfit: number;
  accessory: number;
  expression: number;
}

export interface PetAppearance {
  species: number;
  color: number;
  pattern: number;
  accessory: number;
  expression: number;
  size: number;
}

interface GameState {
  currentShardId: string;
  shards: Record<string, Shard>;
  crops: Crop[];
  resources: Resources;
  missions: Mission[];
  season: string;
  weather: string;
  playerLevel: number;
  playerXP: number;
  xpToNextLevel: number;
  unlockedTools: string[];
  selectedMentor: Mentor | null;
  selectedPet: Pet | null;
  farmCards: FarmCard[];
  ecoImpactScore: number;
  bossChallenges: BossChallenge[];
  nasaData: NASAClimateData | null;
  farmingConditions: FarmingConditions | null;
  lastDataUpdate: number;
  characterAppearance: CharacterAppearance | null;
  petAppearance: PetAppearance | null;
  petLevel: number;
  petExperience: number;
  learnedSkills: LearnedSkill[];
  farmTools: FarmTool[];
  cropSeeds: CropSeed[];
}

interface GameContextType {
  gameState: GameState;
  setCurrentShard: (shardId: string) => void;
  plantCrop: (plotIndex: number, cropType: string) => void;
  harvestCrop: (cropId: string) => void;
  waterPlot: (plotIndex: number) => void;
  irrigateAll: () => void;
  updateResources: (resources: Partial<Resources>) => void;
  completeAction: (action: string) => void;
  getCurrentShard: () => Shard;
  getCropsForCurrentShard: () => Crop[];
  selectMentor: (mentor: Mentor) => void;
  selectPet: (pet: Pet) => void;
  addFarmCard: (cardId: string) => void;
  attackBoss: (bossId: string, damage: number) => void;
  updateEcoImpact: (points: number) => void;
  refreshNASAData: () => Promise<void>;
  getShardType: () => 'drought' | 'flood' | 'temperate' | 'coastal';
  updateCharacterAppearance: (appearance: CharacterAppearance) => void;
  updatePetAppearance: (appearance: PetAppearance) => void;
  addXP: (amount: number, source: string) => void;
  learnSkill: (skill: LearnedSkill) => void;
  upgradeSkill: (skillId: string, expGained: number) => void;
  purchaseTool: (toolId: string) => boolean;
  upgradeTool: (toolId: string) => boolean;
  purchaseSeed: (seedId: string) => boolean;
  getSkillBonus: (category: string) => number;
  getToolSpeedBonus: () => number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialShards: Record<string, Shard> = {
  harmony: {
    id: 'harmony',
    name: 'Harmony',
    emoji: '🌾',
    status: 'current',
    difficulty: 'easy',
    description: 'Your balanced home base',
    color: '#FFD369',
    position: { x: 50, y: 45 },
    climate: { temp: 22, humidity: 60, stability: 85 },
    soilHealth: 85,
    waterLevel: 67,
    airQuality: 72,
    completionProgress: 45
  },
  overgrowth: {
    id: 'overgrowth',
    name: 'Overgrowth',
    emoji: '🌿',
    status: 'available',
    difficulty: 'easy',
    description: 'Lush but unbalanced ecosystem',
    color: '#73C783',
    position: { x: 15, y: 25 },
    climate: { temp: 28, humidity: 85, stability: 70 },
    soilHealth: 95,
    waterLevel: 90,
    airQuality: 88,
    completionProgress: 0
  },
  ash: {
    id: 'ash',
    name: 'Ash',
    emoji: '🔥',
    status: 'available',
    difficulty: 'hard',
    description: 'Volcanic soil, extreme heat',
    color: '#FF6B6B',
    position: { x: 80, y: 20 },
    climate: { temp: 45, humidity: 15, stability: 30 },
    soilHealth: 40,
    waterLevel: 20,
    airQuality: 35,
    completionProgress: 0
  },
  'drowned-fields': {
    id: 'drowned-fields',
    name: 'Drowned Fields',
    emoji: '🌊',
    status: 'available',
    difficulty: 'medium',
    description: 'Flooded agricultural lands',
    color: '#4ECDC4',
    position: { x: 25, y: 65 },
    climate: { temp: 18, humidity: 95, stability: 45 },
    soilHealth: 55,
    waterLevel: 98,
    airQuality: 65,
    completionProgress: 0
  },
  locusts: {
    id: 'locusts',
    name: 'Locusts',
    emoji: '☠️',
    status: 'locked',
    difficulty: 'extreme',
    description: 'Swarm-devastated wasteland',
    color: '#8B5A3C',
    position: { x: 70, y: 70 },
    climate: { temp: 35, humidity: 25, stability: 15 },
    soilHealth: 25,
    waterLevel: 30,
    airQuality: 20,
    completionProgress: 0
  },
  'silent-soil': {
    id: 'silent-soil',
    name: 'Silent Soil',
    emoji: '🌙',
    status: 'locked',
    difficulty: 'medium',
    description: 'Contaminated, lifeless earth',
    color: '#9B59B6',
    position: { x: 20, y: 80 },
    climate: { temp: 12, humidity: 40, stability: 25 },
    soilHealth: 15,
    waterLevel: 45,
    airQuality: 30,
    completionProgress: 0
  },
  'star-farms': {
    id: 'star-farms',
    name: 'Star Farms',
    emoji: '🛰️',
    status: 'locked',
    difficulty: 'extreme',
    description: 'Zero-gravity agriculture',
    color: '#3498DB',
    position: { x: 85, y: 15 },
    climate: { temp: -5, humidity: 0, stability: 95 },
    soilHealth: 60,
    waterLevel: 0,
    airQuality: 100,
    completionProgress: 0
  },
  'bio-forge': {
    id: 'bio-forge',
    name: 'Bio-Forge',
    emoji: '🧬',
    status: 'locked',
    difficulty: 'hard',
    description: 'Genetic modification lab',
    color: '#E74C3C',
    position: { x: 60, y: 85 },
    climate: { temp: 25, humidity: 75, stability: 60 },
    soilHealth: 70,
    waterLevel: 80,
    airQuality: 90,
    completionProgress: 0
  }
};

const cropTypes = {
  'drought-resistant': {
    name: 'Desert Wheat',
    emoji: '🌵',
    growthTime: 30,
    waterNeeded: 20,
    ecoPointsReward: 50,
    bestShards: ['ash', 'locusts']
  },
  'flood-tolerant': {
    name: 'Aqua Rice',
    emoji: '🌾',
    growthTime: 45,
    waterNeeded: 60,
    ecoPointsReward: 40,
    bestShards: ['drowned-fields', 'overgrowth']
  },
  'bio-enhanced': {
    name: 'Gene Corn',
    emoji: '🧬',
    growthTime: 60,
    waterNeeded: 40,
    ecoPointsReward: 80,
    bestShards: ['bio-forge', 'harmony']
  },
  'carbon-sink': {
    name: 'Air Trees',
    emoji: '🌲',
    growthTime: 90,
    waterNeeded: 50,
    ecoPointsReward: 100,
    bestShards: ['harmony', 'overgrowth']
  },
  'basic-crop': {
    name: 'Basic Crop',
    emoji: '🌱',
    growthTime: 20,
    waterNeeded: 30,
    ecoPointsReward: 25,
    bestShards: ['harmony']
  }
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    currentShardId: 'harmony',
    shards: initialShards,
    crops: [],
    resources: {
      seeds: 247,
      water: 89,
      energy: 156,
      ecoPoints: 1423,
      xp: 0
    },
    missions: [
      {
        id: 'daily-1',
        title: 'Plant 5 Crops',
        description: 'Plant 5 drought-resistant crops to improve shard stability.',
        progress: 0,
        target: 5,
        reward: { seeds: 50, water: 20, energy: 30, ecoPoints: 100, xp: 50 },
        completed: false
      }
    ],
    season: 'Spring',
    weather: 'Sunny',
    playerLevel: 1,
    playerXP: 0,
    xpToNextLevel: 100,
    unlockedTools: ['shovel', 'seeds', 'water', 'scanner'],
    selectedMentor: null,
    selectedPet: null,
    farmCards: [],
    ecoImpactScore: 0,
    bossChallenges: [],
    nasaData: null,
    farmingConditions: null,
    lastDataUpdate: 0,
    characterAppearance: null,
    petAppearance: null,
    petLevel: 1,
    petExperience: 0,
    learnedSkills: [],
    farmTools: [
      {
        id: 'basic-hoe',
        name: 'Basic Hoe',
        type: 'planting',
        level: 1,
        speedBonus: 0,
        qualityBonus: 0,
        xpCost: 0,
        owned: true,
        description: 'Standard farming hoe',
        emoji: '🪓'
      },
      {
        id: 'drip-irrigation',
        name: 'Drip Irrigation System',
        type: 'irrigation',
        level: 1,
        speedBonus: 20,
        qualityBonus: 15,
        xpCost: 150,
        owned: false,
        description: 'Efficient water delivery system',
        emoji: '💧'
      },
      {
        id: 'auto-harvester',
        name: 'Auto Harvester',
        type: 'harvesting',
        level: 1,
        speedBonus: 30,
        qualityBonus: 10,
        xpCost: 200,
        owned: false,
        description: 'Automated crop harvesting',
        emoji: '🤖'
      },
      {
        id: 'soil-analyzer',
        name: 'Soil Analyzer Pro',
        type: 'analysis',
        level: 1,
        speedBonus: 15,
        qualityBonus: 25,
        xpCost: 180,
        owned: false,
        description: 'Advanced soil composition scanner',
        emoji: '📊'
      }
    ],
    cropSeeds: [
      {
        id: 'hybrid-wheat',
        name: 'Hybrid Wheat Seeds',
        type: 'wheat',
        growthTimeReduction: 10,
        yieldBonus: 20,
        xpCost: 100,
        owned: false,
        description: 'Fast-growing wheat variety',
        emoji: '🌾'
      },
      {
        id: 'super-corn',
        name: 'Super Corn Seeds',
        type: 'corn',
        growthTimeReduction: 15,
        yieldBonus: 30,
        xpCost: 150,
        owned: false,
        description: 'High-yield corn seeds',
        emoji: '🌽'
      },
      {
        id: 'drought-resistant-rice',
        name: 'Drought-Resistant Rice',
        type: 'rice',
        growthTimeReduction: 8,
        yieldBonus: 15,
        xpCost: 120,
        owned: false,
        description: 'Thrives in low-water conditions',
        emoji: '🍚'
      }
    ]
  });

  // Real-time crop growth
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const now = Date.now();
        const updatedCrops = prev.crops.map(crop => {
          const elapsed = (now - crop.plantedAt) / 1000; // seconds
          const newGrowth = Math.min(100, (elapsed / crop.growthTime) * 100);
          
          // Simulate water consumption
          const waterDecay = 0.5; // decrease by 0.5% per update
          const newWaterLevel = Math.max(0, crop.waterLevel - waterDecay);
          
          // Health affected by water level
          let newHealth = crop.health;
          if (newWaterLevel < 20) {
            newHealth = Math.max(0, newHealth - 0.3);
          } else if (newWaterLevel > 80) {
            newHealth = Math.min(100, newHealth + 0.1);
          }
          
          return {
            ...crop,
            growth: newGrowth,
            waterLevel: newWaterLevel,
            health: newHealth
          };
        });
        
        return {
          ...prev,
          crops: updatedCrops
        };
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // Auto-unlock shards based on completion
  useEffect(() => {
    setGameState(prev => {
      const updatedShards = { ...prev.shards };
      
      // Unlock overgrowth if harmony is 50% complete
      if (prev.shards.harmony.completionProgress >= 50 && prev.shards.overgrowth.status === 'locked') {
        updatedShards.overgrowth = { ...updatedShards.overgrowth, status: 'available' };
      }
      
      // Unlock drowned-fields if harmony is 60% complete
      if (prev.shards.harmony.completionProgress >= 60 && prev.shards['drowned-fields'].status === 'locked') {
        updatedShards['drowned-fields'] = { ...updatedShards['drowned-fields'], status: 'available' };
      }
      
      return {
        ...prev,
        shards: updatedShards
      };
    });
  }, [gameState.shards.harmony.completionProgress]);

  const setCurrentShard = (shardId: string) => {
    setGameState(prev => {
      const updatedShards = { ...prev.shards };
      
      // Update all shards to not be current
      Object.keys(updatedShards).forEach(key => {
        if (updatedShards[key].status === 'current') {
          updatedShards[key] = { ...updatedShards[key], status: 'available' };
        }
      });
      
      // Set new current shard
      if (updatedShards[shardId] && updatedShards[shardId].status !== 'locked') {
        updatedShards[shardId] = { ...updatedShards[shardId], status: 'current' };
      }
      
      return {
        ...prev,
        currentShardId: shardId,
        shards: updatedShards
      };
    });
  };

  const plantCrop = (plotIndex: number, cropType: string) => {
    const cropConfig = cropTypes[cropType as keyof typeof cropTypes];
    if (!cropConfig) return;

    // Check if we have enough resources
    if (gameState.resources.seeds < 1) {
      return;
    }

    // Check if plot is already occupied
    const existingCrop = gameState.crops.find(
      c => c.plotIndex === plotIndex && c.shardId === gameState.currentShardId && c.growth < 100
    );
    if (existingCrop) return;

    const newCrop: Crop = {
      id: `crop-${Date.now()}-${plotIndex}`,
      type: cropType,
      name: cropConfig.name,
      emoji: cropConfig.emoji,
      plantedAt: Date.now(),
      growthTime: cropConfig.growthTime,
      growth: 0,
      plotIndex,
      shardId: gameState.currentShardId,
      waterLevel: 100,
      health: 100
    };

    setGameState(prev => ({
      ...prev,
      crops: [...prev.crops, newCrop],
      resources: {
        ...prev.resources,
        seeds: prev.resources.seeds - 1
      },
      missions: prev.missions.map(m => {
        if (m.id === 'daily-1' && !m.completed) {
          const newProgress = m.progress + 1;
          return {
            ...m,
            progress: newProgress,
            completed: newProgress >= m.target
          };
        }
        return m;
      })
    }));
  };

  const harvestCrop = (cropId: string) => {
    const crop = gameState.crops.find(c => c.id === cropId && c.growth >= 100);
    if (!crop) return;

    const cropConfig = cropTypes[crop.type as keyof typeof cropTypes];
    const bonus = crop.health >= 80 ? 1.5 : crop.health >= 50 ? 1.2 : 1.0;

    setGameState(prev => ({
      ...prev,
      crops: prev.crops.filter(c => c.id !== crop.id),
      resources: {
        ...prev.resources,
        ecoPoints: prev.resources.ecoPoints + Math.round(cropConfig.ecoPointsReward * bonus),
        seeds: prev.resources.seeds + Math.floor(Math.random() * 3) + 1
      },
      shards: {
        ...prev.shards,
        [prev.currentShardId]: {
          ...prev.shards[prev.currentShardId],
          completionProgress: Math.min(100, prev.shards[prev.currentShardId].completionProgress + 2)
        }
      }
    }));
  };

  const waterPlot = (plotIndex: number) => {
    if (gameState.resources.water < 5) return;

    const crop = gameState.crops.find(
      c => c.plotIndex === plotIndex && c.shardId === gameState.currentShardId && c.growth < 100
    );
    
    if (!crop) return;

    setGameState(prev => ({
      ...prev,
      crops: prev.crops.map(c =>
        c.id === crop.id
          ? { ...c, waterLevel: Math.min(100, c.waterLevel + 30) }
          : c
      ),
      resources: {
        ...prev.resources,
        water: prev.resources.water - 5
      }
    }));
  };

  const irrigateAll = () => {
    const cropsToWater = gameState.crops.filter(
      c => c.shardId === gameState.currentShardId && c.growth < 100
    );
    
    const waterNeeded = cropsToWater.length * 3;
    if (gameState.resources.water < waterNeeded) return;

    setGameState(prev => ({
      ...prev,
      crops: prev.crops.map(c =>
        c.shardId === prev.currentShardId && c.growth < 100
          ? { ...c, waterLevel: Math.min(100, c.waterLevel + 25) }
          : c
      ),
      resources: {
        ...prev.resources,
        water: prev.resources.water - waterNeeded
      }
    }));
  };

  const updateResources = (resources: Partial<Resources>) => {
    setGameState(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        ...resources
      }
    }));
  };

  const completeAction = (action: string) => {
    // Add energy/eco points for various actions
    const rewards: Record<string, Partial<Resources>> = {
      'scan-soil': { energy: -10, ecoPoints: 20 },
      'upgrade-tool': { energy: -30, ecoPoints: 50 },
      'research': { energy: -20, ecoPoints: 30 }
    };

    if (rewards[action]) {
      updateResources(rewards[action]);
    }
  };

  const getCurrentShard = () => {
    return gameState.shards[gameState.currentShardId];
  };

  const getCropsForCurrentShard = () => {
    return gameState.crops.filter(c => c.shardId === gameState.currentShardId);
  };

  const selectMentor = (mentor: Mentor) => {
    setGameState(prev => ({
      ...prev,
      selectedMentor: mentor
    }));
  };

  const selectPet = (pet: Pet) => {
    setGameState(prev => ({
      ...prev,
      selectedPet: pet
    }));
  };

  const addFarmCard = (cardId: string) => {
    setGameState(prev => ({
      ...prev,
      farmCards: prev.farmCards.map(card =>
        card.id === cardId ? { ...card, owned: true } : card
      ),
      ecoImpactScore: prev.ecoImpactScore + 50
    }));
  };

  const attackBoss = (bossId: string, damage: number) => {
    setGameState(prev => ({
      ...prev,
      bossChallenges: prev.bossChallenges.map(boss =>
        boss.id === bossId
          ? {
              ...boss,
              health: Math.max(0, boss.health - damage),
              defeated: boss.health - damage <= 0
            }
          : boss
      )
    }));
  };

  const updateEcoImpact = (points: number) => {
    setGameState(prev => ({
      ...prev,
      ecoImpactScore: prev.ecoImpactScore + points
    }));
  };

  const getShardType = (): 'drought' | 'flood' | 'temperate' | 'coastal' => {
    const shardTypeMap: Record<string, 'drought' | 'flood' | 'temperate' | 'coastal'> = {
      'ash': 'drought',
      'locusts': 'drought',
      'drowned-fields': 'flood',
      'overgrowth': 'flood',
      'harmony': 'temperate',
      'silent-soil': 'coastal',
      'star-farms': 'temperate',
      'bio-forge': 'temperate'
    };
    return shardTypeMap[gameState.currentShardId] || 'temperate';
  };

  const refreshNASAData = async () => {
    try {
      const shardType = getShardType();
      const { data, conditions } = await nasaDataService.fetchLiveData(shardType);
      
      setGameState(prev => ({
        ...prev,
        nasaData: data,
        farmingConditions: conditions,
        lastDataUpdate: Date.now()
      }));
    } catch (error) {
      console.error('Failed to fetch NASA data:', error);
    }
  };

  // Auto-refresh NASA data every 30 seconds and when shard changes
  useEffect(() => {
    refreshNASAData();
    
    const interval = setInterval(() => {
      refreshNASAData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [gameState.currentShardId]);

  // Apply NASA data effects to crop growth
  useEffect(() => {
    if (!gameState.farmingConditions) return;

    setGameState(prev => {
      const updatedCrops = prev.crops.map(crop => {
        if (crop.shardId !== prev.currentShardId || crop.growth >= 100) return crop;

        // Apply growth rate modifier from farming conditions
        const growthMultiplier = prev.farmingConditions?.cropGrowthRate || 1.0;
        const heatStress = prev.farmingConditions?.heatStress || 0;
        const waterNeed = prev.farmingConditions?.waterNeed || 50;

        // Adjust health based on NASA data conditions
        let healthAdjustment = 0;
        if (heatStress > 70) {
          healthAdjustment -= 0.5; // Heat stress damages crops
        }
        if (crop.waterLevel < waterNeed) {
          healthAdjustment -= 0.3; // Not enough water for current conditions
        }

        return {
          ...crop,
          health: Math.max(0, Math.min(100, crop.health + healthAdjustment))
        };
      });

      return {
        ...prev,
        crops: updatedCrops
      };
    });
  }, [gameState.farmingConditions]);

  const updateCharacterAppearance = (appearance: CharacterAppearance) => {
    setGameState(prev => ({
      ...prev,
      characterAppearance: appearance
    }));
  };

  const updatePetAppearance = (appearance: PetAppearance) => {
    setGameState(prev => ({
      ...prev,
      petAppearance: appearance
    }));
  };

  const addXP = (amount: number, source: string) => {
    setGameState(prev => {
      const newXP = prev.playerXP + amount;
      let newLevel = prev.playerLevel;
      let remainingXP = newXP;
      let newXPToNextLevel = prev.xpToNextLevel;

      // Level up logic
      while (remainingXP >= newXPToNextLevel) {
        remainingXP -= newXPToNextLevel;
        newLevel += 1;
        newXPToNextLevel = Math.floor(100 * Math.pow(1.5, newLevel - 1)); // Exponential XP scaling
        
        toast.success(`🎉 Level Up! You are now Level ${newLevel}!`, {
          description: `Unlocked new features and bonuses!`
        });
      }

      return {
        ...prev,
        playerXP: remainingXP,
        playerLevel: newLevel,
        xpToNextLevel: newXPToNextLevel,
        resources: {
          ...prev.resources,
          xp: prev.resources.xp + amount
        }
      };
    });
  };

  const learnSkill = (skill: LearnedSkill) => {
    setGameState(prev => {
      const existing = prev.learnedSkills.find(s => s.skillId === skill.skillId);
      if (existing) return prev;

      return {
        ...prev,
        learnedSkills: [...prev.learnedSkills, skill]
      };
    });
  };

  const upgradeSkill = (skillId: string, expGained: number) => {
    setGameState(prev => ({
      ...prev,
      learnedSkills: prev.learnedSkills.map(skill => {
        if (skill.skillId === skillId) {
          const newExp = skill.experience + expGained;
          const expNeededForNextLevel = 100 * skill.level;
          
          if (newExp >= expNeededForNextLevel && skill.level < 5) {
            toast.success(`🌟 ${skill.name} upgraded to Level ${skill.level + 1}!`);
            return {
              ...skill,
              level: skill.level + 1,
              experience: newExp - expNeededForNextLevel
            };
          }
          
          return {
            ...skill,
            experience: newExp
          };
        }
        return skill;
      })
    }));
  };

  const purchaseTool = (toolId: string) => {
    const tool = gameState.farmTools.find(t => t.id === toolId);
    if (!tool || tool.owned || gameState.resources.xp < tool.xpCost) {
      return false;
    }

    setGameState(prev => ({
      ...prev,
      farmTools: prev.farmTools.map(t =>
        t.id === toolId ? { ...t, owned: true } : t
      ),
      resources: {
        ...prev.resources,
        xp: prev.resources.xp - tool.xpCost
      }
    }));

    toast.success(`🛠️ Purchased ${tool.name}!`, {
      description: `+${tool.speedBonus}% mission speed, +${tool.qualityBonus}% crop quality`
    });
    
    return true;
  };

  const upgradeTool = (toolId: string) => {
    const tool = gameState.farmTools.find(t => t.id === toolId);
    if (!tool || !tool.owned || tool.level >= 5) {
      return false;
    }

    const upgradeCost = tool.xpCost * tool.level;
    if (gameState.resources.xp < upgradeCost) {
      return false;
    }

    setGameState(prev => ({
      ...prev,
      farmTools: prev.farmTools.map(t =>
        t.id === toolId
          ? {
              ...t,
              level: t.level + 1,
              speedBonus: Math.floor(t.speedBonus * 1.3),
              qualityBonus: Math.floor(t.qualityBonus * 1.3)
            }
          : t
      ),
      resources: {
        ...prev.resources,
        xp: prev.resources.xp - upgradeCost
      }
    }));

    toast.success(`⬆️ Upgraded ${tool.name} to Level ${tool.level + 1}!`);
    
    return true;
  };

  const purchaseSeed = (seedId: string) => {
    const seed = gameState.cropSeeds.find(s => s.id === seedId);
    if (!seed || seed.owned || gameState.resources.xp < seed.xpCost) {
      return false;
    }

    setGameState(prev => ({
      ...prev,
      cropSeeds: prev.cropSeeds.map(s =>
        s.id === seedId ? { ...s, owned: true } : s
      ),
      resources: {
        ...prev.resources,
        xp: prev.resources.xp - seed.xpCost
      }
    }));

    toast.success(`🌱 Unlocked ${seed.name}!`, {
      description: `${seed.growthTimeReduction}s faster growth, +${seed.yieldBonus}% yield`
    });
    
    return true;
  };

  const getSkillBonus = (category: string): number => {
    const relevantSkills = gameState.learnedSkills.filter(s => s.category === category);
    return relevantSkills.reduce((total, skill) => total + (skill.level * 10), 0);
  };

  const getToolSpeedBonus = (): number => {
    const ownedTools = gameState.farmTools.filter(t => t.owned);
    return ownedTools.reduce((total, tool) => total + tool.speedBonus, 0);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setCurrentShard,
        plantCrop,
        harvestCrop,
        waterPlot,
        irrigateAll,
        updateResources,
        completeAction,
        getCurrentShard,
        getCropsForCurrentShard,
        selectMentor,
        selectPet,
        addFarmCard,
        attackBoss,
        updateEcoImpact,
        refreshNASAData,
        getShardType,
        updateCharacterAppearance,
        updatePetAppearance,
        addXP,
        learnSkill,
        upgradeSkill,
        purchaseTool,
        upgradeTool,
        purchaseSeed,
        getSkillBonus,
        getToolSpeedBonus
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

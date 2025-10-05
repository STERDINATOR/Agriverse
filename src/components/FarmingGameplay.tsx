import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
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
  Bot
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner';

interface FarmingGameplayProps {
  onNavigate: (screen: string) => void;
}

const tools = [
  { id: 'shovel', icon: Shovel, name: 'Bio-Shovel', color: '#8B5A3C', action: 'till' },
  { id: 'seeds', icon: Package, name: 'Seed Vault', color: '#73C783', action: 'plant' },
  { id: 'water', icon: Droplets, name: 'Water Orb', color: '#4ECDC4', action: 'water' },
  { id: 'scanner', icon: Eye, name: 'Soil Scanner', color: '#FFD369', action: 'scan' }
];

const cropTypes = [
  { id: 'basic-crop', name: 'Basic Crop', emoji: '🌱' },
  { id: 'drought-resistant', name: 'Desert Wheat', emoji: '🌵' },
  { id: 'flood-tolerant', name: 'Aqua Rice', emoji: '🌾' },
  { id: 'bio-enhanced', name: 'Gene Corn', emoji: '🧬' },
  { id: 'carbon-sink', name: 'Air Trees', emoji: '🌲' }
];

export function FarmingGameplay({ onNavigate }: FarmingGameplayProps) {
  const { gameState, getCurrentShard, getCropsForCurrentShard, plantCrop, harvestCrop, waterPlot, irrigateAll, updateResources } = useGame();
  const [selectedTool, setSelectedTool] = React.useState('seeds');
  const [selectedCropType, setSelectedCropType] = React.useState('basic-crop');
  const [tilledPlots, setTilledPlots] = React.useState<number[]>([]);

  const currentShard = getCurrentShard();
  const currentCrops = getCropsForCurrentShard();
  const { nasaData, farmingConditions } = gameState;

  const handlePlotClick = (plotIndex: number) => {
    const existingCrop = currentCrops.find(c => c.plotIndex === plotIndex);

    if (selectedTool === 'shovel') {
      // Till the plot
      if (!tilledPlots.includes(plotIndex)) {
        setTilledPlots([...tilledPlots, plotIndex]);
        toast.success('Plot tilled and ready for planting');
      }
    } else if (selectedTool === 'seeds') {
      // Plant crop
      if (!existingCrop || existingCrop.growth === 100) {
        if (!tilledPlots.includes(plotIndex)) {
          toast.error('Till the plot first!');
          return;
        }
        if (gameState.resources.seeds < 1) {
          toast.error('Not enough seeds!');
          return;
        }
        plantCrop(plotIndex, selectedCropType);
        toast.success(`Planted ${cropTypes.find(c => c.id === selectedCropType)?.name}!`);
      } else {
        toast.info(`Crop is ${Math.round(existingCrop.growth)}% grown`);
      }
    } else if (selectedTool === 'water') {
      // Water crop
      if (existingCrop && existingCrop.growth < 100) {
        if (gameState.resources.water < 5) {
          toast.error('Not enough water!');
          return;
        }
        waterPlot(plotIndex);
        toast.success('Crop watered!');
      } else {
        toast.info('No crop to water here');
      }
    } else if (selectedTool === 'scanner') {
      // Scan plot
      if (existingCrop) {
        toast.info(`Growth: ${Math.round(existingCrop.growth)}% | Water: ${Math.round(existingCrop.waterLevel)}% | Health: ${Math.round(existingCrop.health)}%`);
      } else {
        toast.info('Empty plot - ready for planting');
      }
    }
  };

  const handleHarvest = (cropId: string) => {
    const crop = currentCrops.find(c => c.id === cropId);
    if (crop && crop.growth >= 100) {
      harvestCrop(cropId);
      toast.success(`Harvested ${crop.name}! +${Math.round(crop.health >= 80 ? 75 : 50)} Eco Points`);
    }
  };

  const handleIrrigateAll = () => {
    const cropsToWater = currentCrops.filter(c => c.growth < 100);
    const waterNeeded = cropsToWater.length * 3;
    
    if (gameState.resources.water < waterNeeded) {
      toast.error(`Need ${waterNeeded}L water to irrigate all crops!`);
      return;
    }
    
    irrigateAll();
    toast.success(`Irrigated ${cropsToWater.length} crops!`);
  };

  const getCropAtPlot = (plotIndex: number) => {
    return currentCrops.find(c => c.plotIndex === plotIndex);
  };

  const getPlotColor = (plotIndex: number) => {
    const crop = getCropAtPlot(plotIndex);
    
    if (crop) {
      if (crop.growth >= 100) return 'bg-[#FFD369]/30 border-[#FFD369]/60';
      if (crop.waterLevel < 20) return 'bg-[#FF6B6B]/20 border-[#FF6B6B]/40';
      return 'bg-[#73C783]/20 border-[#73C783]/40';
    }
    
    if (tilledPlots.includes(plotIndex)) {
      return 'bg-[#8B5A3C]/20 border-[#8B5A3C]/40';
    }
    
    return 'bg-black/30 border-white/10';
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1629943136390-3a74b225c2dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwZmFybWluZyUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc1OTU1NjkxOHww&ixlib=rb-4.1.0&q=80&w=1080')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/70 to-black/60" />

        {/* Weather overlay */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FFD369]/20 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity
          }}
        />

        {/* Header UI */}
        <div className="relative z-10 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onNavigate('shardExplorer')}
              variant="ghost"
              className="text-[#E5E7EB] hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Shard Map
            </Button>
            
            <Button
              onClick={() => onNavigate('guidedFarmingPractice')}
              className="bg-gradient-to-r from-[#73C783] to-[#6EE7B7] hover:from-[#6EE7B7] hover:to-[#73C783] text-black"
            >
              🐰 Guided Practice
            </Button>
            
            <Button
              onClick={() => onNavigate('bossBattle')}
              className="bg-gradient-to-r from-[#FF6B35] to-[#FF1744] hover:from-[#FF1744] hover:to-[#FF6B35] text-white"
            >
              ⚔️ Boss Battle
            </Button>
          </div>

          {/* Shard Info */}
          <div className="flex items-center gap-4">
            <Card className="px-3 py-2 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentShard.emoji}</span>
                <span className="text-[#E5E7EB]">{currentShard.name}</span>
              </div>
            </Card>

            <Card className="px-3 py-2 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#FFD369]" />
                <span className="text-sm text-[#E5E7EB]">{gameState.season} • {gameState.weather}</span>
                <Thermometer className="w-4 h-4 text-[#FF6B6B] ml-2" />
                <span className="text-sm text-[#E5E7EB]">{currentShard.climate.temp}°C</span>
              </div>
            </Card>
            
            <Badge className="bg-[#73C783] text-black">
              Eco Points: {gameState.resources.ecoPoints.toLocaleString()}
            </Badge>
          </div>
        </div>

        <div className="relative z-10 flex h-[calc(100vh-80px)]">
          {/* Left Panel - Tools */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-72 p-4 space-y-4"
          >
            {/* NASA Climate Conditions */}
            {nasaData && farmingConditions && (
              <Card className="p-4 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Satellite className="w-4 h-4 text-[#6EE7B7]" />
                  <h3 className="text-[#6EE7B7]">NASA Climate Data</h3>
                  <div className="w-2 h-2 bg-[#6EE7B7] rounded-full animate-pulse" />
                </div>
                
                <div className="space-y-3">
                  {/* Farming Conditions Summary */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#E5E7EB]/70">Conditions</span>
                    <Badge 
                      className="text-xs px-2 py-1"
                      style={{ 
                        backgroundColor: farmingConditions.overallRating === 'excellent' ? '#73C783' :
                                        farmingConditions.overallRating === 'good' ? '#FFD369' :
                                        farmingConditions.overallRating === 'fair' ? '#FF8C42' : '#FF6B6B',
                        color: farmingConditions.overallRating === 'excellent' || farmingConditions.overallRating === 'poor' ? 'black' : 'white'
                      }}
                    >
                      {farmingConditions.overallRating.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {/* Growth Rate */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#E5E7EB]/70">Growth Rate</span>
                    <div className="flex items-center gap-1">
                      {farmingConditions.cropGrowthRate > 1 ? (
                        <TrendingUp className="w-3 h-3 text-[#73C783]" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-[#FF6B6B]" />
                      )}
                      <span className="text-[#6EE7B7] text-xs font-medium">
                        {farmingConditions.cropGrowthRate.toFixed(1)}x
                      </span>
                    </div>
                  </div>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#E5E7EB]/70">Soil</span>
                      <span className="text-[#8B4513]">{nasaData.soilMoisture.moisture.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#E5E7EB]/70">Temp</span>
                      <span className="text-[#FF6B6B]">{nasaData.surfaceTemperature.temperature.toFixed(0)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#E5E7EB]/70">Rain</span>
                      <span className="text-[#4ECDC4]">{nasaData.precipitation.current.toFixed(1)} mm/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#E5E7EB]/70">Heat</span>
                      <span className="text-[#FFD369]">{farmingConditions.heatStress.toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  {/* Alerts */}
                  {farmingConditions.alerts.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3 h-3 text-[#FFD369]" />
                        <span className="text-xs text-[#FFD369]">Alerts</span>
                      </div>
                      <div className="space-y-1">
                        {farmingConditions.alerts.slice(0, 2).map((alert, index) => (
                          <p key={index} className="text-xs text-[#E5E7EB]/80 leading-tight">
                            • {alert}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => onNavigate('nasaData')}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-[#6EE7B7]/40 text-[#6EE7B7] hover:bg-[#6EE7B7]/10"
                  >
                    View Full Data
                  </Button>
                </div>
              </Card>
            )}
            
            {/* Tool Selection */}
            <Card className="p-4 bg-black/40 border-[#73C783]/30 backdrop-blur-sm">
              <h3 className="text-[#73C783] mb-3">Farming Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((tool) => (
                  <Tooltip key={tool.id}>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setSelectedTool(tool.id)}
                        variant={selectedTool === tool.id ? "default" : "outline"}
                        className={`h-16 w-full flex-col gap-1 ${
                          selectedTool === tool.id 
                            ? 'bg-gradient-to-b from-[#73C783] to-[#6EE7B7] text-black'
                            : 'border-white/20 text-[#E5E7EB] hover:bg-white/10'
                        }`}
                      >
                        <tool.icon className="w-5 h-5" />
                        <span className="text-xs">{tool.name}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to select {tool.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </Card>

            {/* Crop Type Selection */}
            {selectedTool === 'seeds' && (
              <Card className="p-4 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
                <h3 className="text-[#6EE7B7] mb-3">Select Crop Type</h3>
                <div className="space-y-2">
                  {cropTypes.map((crop) => (
                    <Button
                      key={crop.id}
                      onClick={() => setSelectedCropType(crop.id)}
                      variant={selectedCropType === crop.id ? "default" : "outline"}
                      className={`w-full justify-start ${
                        selectedCropType === crop.id
                          ? 'bg-[#73C783] text-black'
                          : 'border-white/20 text-[#E5E7EB]'
                      }`}
                    >
                      <span className="text-lg mr-2">{crop.emoji}</span>
                      {crop.name}
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {/* Active Crops */}
            <Card className="p-4 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm max-h-64 overflow-y-auto">
              <h3 className="text-[#6EE7B7] mb-3">Active Crops ({currentCrops.length})</h3>
              <div className="space-y-3">
                {currentCrops.length === 0 ? (
                  <p className="text-sm text-[#E5E7EB]/60 text-center py-4">No crops planted yet</p>
                ) : (
                  currentCrops.map((crop) => (
                    <div key={crop.id} className="flex items-center gap-3">
                      <span className="text-2xl">{crop.emoji}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#E5E7EB]">{crop.name}</span>
                          <span className={crop.growth >= 100 ? 'text-[#FFD369]' : 'text-[#73C783]'}>
                            {Math.round(crop.growth)}%
                          </span>
                        </div>
                        <Progress value={crop.growth} className="h-2" />
                        {crop.growth >= 100 && (
                          <Button
                            onClick={() => handleHarvest(crop.id)}
                            size="sm"
                            className="w-full mt-2 bg-[#FFD369] text-black hover:bg-[#FFD369]/80"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Harvest
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

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
          </motion.div>

          {/* Main Farm View */}
          <div className="flex-1 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full rounded-2xl bg-black/20 backdrop-blur-sm border border-[#73C783]/20 relative overflow-hidden"
            >
              {/* Farm Grid */}
              <div className="absolute inset-4 grid grid-cols-8 grid-rows-6 gap-2">
                {Array.from({ length: 48 }).map((_, index) => {
                  const crop = getCropAtPlot(index);
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <motion.div
                          className={`rounded-lg border-2 cursor-pointer transition-all duration-300 w-full h-full ${getPlotColor(index)} hover:scale-105 relative`}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handlePlotClick(index)}
                        >
                          {/* Crop display */}
                          {crop && (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <motion.div
                                className="text-lg"
                                animate={{
                                  scale: crop.growth >= 100 ? [1, 1.1, 1] : 1,
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: crop.growth >= 100 ? Infinity : 0
                                }}
                              >
                                {crop.emoji}
                              </motion.div>
                              {crop.growth < 100 && (
                                <div className="absolute bottom-1 left-1 right-1">
                                  <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-[#73C783] transition-all duration-300"
                                      style={{ width: `${crop.growth}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                              {crop.waterLevel < 30 && crop.growth < 100 && (
                                <div className="absolute top-1 right-1">
                                  <Droplets className="w-3 h-3 text-[#FF6B6B]" />
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {crop ? (
                          <div>
                            <p>{crop.name}</p>
                            <p className="text-xs">Growth: {Math.round(crop.growth)}%</p>
                            <p className="text-xs">Water: {Math.round(crop.waterLevel)}%</p>
                            <p className="text-xs">Health: {Math.round(crop.health)}%</p>
                          </div>
                        ) : tilledPlots.includes(index) ? (
                          <p>Tilled plot - ready for planting</p>
                        ) : (
                          <p>Empty plot - till first</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              {/* Current Tool Indicator */}
              <div className="absolute bottom-4 left-4">
                <Card className="p-3 bg-black/60 border-[#73C783]/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    {selectedTool === 'shovel' && <Shovel className="w-5 h-5 text-[#8B5A3C]" />}
                    {selectedTool === 'seeds' && <Package className="w-5 h-5 text-[#73C783]" />}
                    {selectedTool === 'water' && <Droplets className="w-5 h-5 text-[#4ECDC4]" />}
                    {selectedTool === 'scanner' && <Eye className="w-5 h-5 text-[#FFD369]" />}
                    <span className="text-[#E5E7EB] text-sm">
                      {tools.find(t => t.id === selectedTool)?.name} Selected
                    </span>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Actions & Stats */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-72 p-4 space-y-4"
          >
            {/* Quick Actions */}
            <Card className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
              <h3 className="text-[#FFD369] mb-3">Field Actions</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => setSelectedTool('seeds')}
                  className="w-full bg-gradient-to-r from-[#73C783] to-[#6EE7B7] text-black text-sm"
                >
                  <Sprout className="w-4 h-4 mr-2" />
                  Plant Mode
                </Button>
                <Button
                  onClick={handleIrrigateAll}
                  variant="outline"
                  className="w-full border-[#4ECDC4] text-[#4ECDC4] text-sm"
                  disabled={currentCrops.filter(c => c.growth < 100).length === 0}
                >
                  <Droplets className="w-4 h-4 mr-2" />
                  Irrigate All
                </Button>
                <Button
                  onClick={() => {
                    const readyCrops = currentCrops.filter(c => c.growth >= 100);
                    readyCrops.forEach(crop => harvestCrop(crop.id));
                    if (readyCrops.length > 0) {
                      toast.success(`Harvested ${readyCrops.length} crops!`);
                    } else {
                      toast.info('No crops ready to harvest');
                    }
                  }}
                  variant="outline"
                  className="w-full border-[#FFD369] text-[#FFD369] text-sm"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Harvest All Ready
                </Button>
              </div>
            </Card>

            {/* Field Stats */}
            <Card className="p-4 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
              <h3 className="text-[#6EE7B7] mb-3">Shard Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#E5E7EB]">Planted Plots</span>
                  <span className="text-[#73C783]">{currentCrops.length}/48</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E5E7EB]">Soil Health</span>
                  <span className="text-[#6EE7B7]">{currentShard.soilHealth}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E5E7EB]">Water Coverage</span>
                  <span className="text-[#4ECDC4]">{currentShard.waterLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E5E7EB]">Air Quality</span>
                  <span className="text-[#FFD369]">{currentShard.airQuality}%</span>
                </div>
              </div>
            </Card>

            {/* Mission Progress */}
            <Card className="p-4 bg-black/40 border-[#73C783]/30 backdrop-blur-sm">
              <h3 className="text-[#73C783] mb-3">Shard Restoration</h3>
              <p className="text-sm text-[#E5E7EB]/90 mb-3">
                Restore {currentShard.name} to ecological balance
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#E5E7EB]">Progress</span>
                  <span className="text-[#73C783]">{currentShard.completionProgress}%</span>
                </div>
                <Progress value={currentShard.completionProgress} className="h-3" />
              </div>
            </Card>

            {/* Daily Mission */}
            {gameState.missions.map(mission => (
              <Card key={mission.id} className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
                <h3 className="text-[#FFD369] mb-2">{mission.title}</h3>
                <p className="text-sm text-[#E5E7EB]/80 mb-3">{mission.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <Progress value={(mission.progress / mission.target) * 100} className="flex-1 mr-3 h-2" />
                  <span className="text-xs text-[#73C783]">{mission.progress}/{mission.target}</span>
                </div>
                {mission.completed && (
                  <Badge className="bg-[#73C783] text-black">Completed! ✓</Badge>
                )}
              </Card>
            ))}

            {/* TERRA-AI Quick Access */}
            <Card className="p-3 bg-gradient-to-r from-[#6EE7B7]/20 to-[#4ECDC4]/20 border-[#6EE7B7]/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-[#6EE7B7]" />
                <h4 className="text-sm text-[#6EE7B7]">TERRA-AI</h4>
                <div className="w-2 h-2 bg-[#6EE7B7] rounded-full animate-pulse" />
              </div>
              <p className="text-xs text-[#E5E7EB]/80 mb-3">
                Get intelligent farming advice based on current NASA climate data
              </p>
              <Button
                onClick={() => onNavigate('terraAI')}
                className="w-full bg-[#6EE7B7] text-black hover:bg-[#6EE7B7]/80 text-sm"
              >
                Ask TERRA-AI
              </Button>
            </Card>

            {/* Navigation */}
            <div className="flex gap-2">
              <Button
                onClick={() => onNavigate('climateTransition')}
                variant="outline"
                className="flex-1 border-[#6EE7B7] text-[#6EE7B7] text-sm"
              >
                Climate
              </Button>
              <Button
                onClick={() => onNavigate('playerHub')}
                className="flex-1 bg-[#73C783] text-black text-sm"
              >
                Base
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}

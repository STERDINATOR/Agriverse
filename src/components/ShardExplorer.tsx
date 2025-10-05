import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Thermometer, Droplets, Zap, AlertTriangle } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner';

interface ShardExplorerProps {
  onNavigate: (screen: string) => void;
}

export function ShardExplorer({ onNavigate }: ShardExplorerProps) {
  const { gameState, getCurrentShard, setCurrentShard } = useGame();
  const shards = Object.values(gameState.shards);
  const [selectedShard, setSelectedShard] = React.useState(getCurrentShard());
  
  React.useEffect(() => {
    setSelectedShard(getCurrentShard());
  }, [gameState.currentShardId]);

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1756756412200-f4721d505d08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIwZGF0YSUyMHZpc3VhbGl6YXRpb258ZW58MXx8fHwxNzU5NTU2OTE4fDA&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/90 to-black/80" />

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <Button
          onClick={() => onNavigate('playerHub')}
          variant="ghost"
          className="text-[#E5E7EB] hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Farm Base
        </Button>
        
        <h1 className="text-2xl text-[#E5E7EB] text-center flex-1">
          Climate Survival Shards
        </h1>

        <Button
          onClick={() => onNavigate('climateTransition')}
          className="bg-[#73C783] text-black"
        >
          Climate Data
        </Button>
      </div>

      <div className="relative z-10 flex h-[calc(100vh-80px)]">
        {/* Main Map */}
        <div className="flex-1 p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-2xl bg-black/30 backdrop-blur-sm border border-[#73C783]/20 relative overflow-hidden"
          >
            {/* World Grid */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#73C783" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Shards */}
            {shards.map((shard, index) => (
              <motion.div
                key={shard.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  shard.status === 'locked' ? 'opacity-50' : 'hover:scale-110'
                }`}
                style={{
                  left: `${shard.position.x}%`,
                  top: `${shard.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => shard.status !== 'locked' && setSelectedShard(shard)}
              >
                {/* Shard Glow */}
                <div
                  className="absolute inset-0 rounded-full blur-lg opacity-60"
                  style={{ backgroundColor: shard.color }}
                />
                
                {/* Shard Core */}
                <div
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                    shard.status === 'current' ? 'border-[#FFD369] bg-[#FFD369]/20' :
                    shard.status === 'locked' ? 'border-gray-500 bg-gray-800/50' :
                    'border-white/50 bg-black/50'
                  }`}
                  style={{
                    boxShadow: shard.status !== 'locked' ? `0 0 20px ${shard.color}40` : 'none'
                  }}
                >
                  <span className="text-2xl">{shard.emoji}</span>
                </div>

                {/* Shard Label */}
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
                  <Badge
                    className={`text-xs ${
                      shard.status === 'current' ? 'bg-[#FFD369] text-black' :
                      shard.status === 'locked' ? 'bg-gray-700 text-gray-300' :
                      'bg-black/50 text-[#E5E7EB]'
                    }`}
                  >
                    {shard.name}
                  </Badge>
                </div>

                {/* Connection Lines */}
                {shard.id === 'harmony' && (
                  <>
                    <svg className="absolute inset-0 w-96 h-96 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <line
                        x1="192"
                        y1="192"
                        x2="50"
                        y2="100"
                        stroke="#73C783"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.5"
                      />
                      <line
                        x1="192"
                        y1="192"
                        x2="350"
                        y2="80"
                        stroke="#FF6B6B"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.5"
                      />
                    </svg>
                  </>
                )}
              </motion.div>
            ))}

            {/* NASA Data Overlay */}
            <div className="absolute top-4 left-4">
              <Card className="p-3 bg-black/60 border-[#6EE7B7]/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#6EE7B7] rounded-full animate-pulse" />
                  <span className="text-xs text-[#6EE7B7]">LIVE NASA DATA</span>
                </div>
                <div className="text-xs text-[#E5E7EB] space-y-1">
                  <div>Global CO₂: 421.3 ppm</div>
                  <div>Ocean pH: 8.1</div>
                  <div>Temp Anomaly: +1.2°C</div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Shard Details Panel */}
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-96 p-6"
        >
          <Card className="p-6 bg-black/40 border-[#73C783]/30 backdrop-blur-sm h-full">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${selectedShard.color}20`, border: `2px solid ${selectedShard.color}` }}
              >
                {selectedShard.emoji}
              </div>
              <div>
                <h2 className="text-xl text-[#E5E7EB]">{selectedShard.name}</h2>
                <Badge
                  className={`text-xs ${
                    selectedShard.difficulty === 'easy' ? 'bg-[#73C783]/20 text-[#73C783]' :
                    selectedShard.difficulty === 'medium' ? 'bg-[#FFD369]/20 text-[#FFD369]' :
                    selectedShard.difficulty === 'hard' ? 'bg-[#FF6B6B]/20 text-[#FF6B6B]' :
                    'bg-[#8B5A3C]/20 text-[#8B5A3C]'
                  }`}
                >
                  {selectedShard.difficulty.toUpperCase()}
                </Badge>
              </div>
            </div>

            <p className="text-[#E5E7EB]/80 mb-6">{selectedShard.description}</p>

            {/* Climate Stats */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-[#FF6B6B]" />
                  <span className="text-[#E5E7EB]">Temperature</span>
                </div>
                <span className="text-[#FF6B6B]">{selectedShard.climate.temp}°C</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#4ECDC4]" />
                  <span className="text-[#E5E7EB]">Humidity</span>
                </div>
                <span className="text-[#4ECDC4]">{selectedShard.climate.humidity}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FFD369]" />
                  <span className="text-[#E5E7EB]">Stability</span>
                </div>
                <span className="text-[#FFD369]">{selectedShard.climate.stability}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {selectedShard.status === 'current' ? (
                <Button
                  onClick={() => onNavigate('playerHub')}
                  className="w-full bg-[#FFD369] text-black hover:bg-[#FFD369]/80"
                >
                  Return to Base
                </Button>
              ) : selectedShard.status === 'available' ? (
                <Button
                  onClick={() => {
                    setCurrentShard(selectedShard.id);
                    toast.success(`Deployed to ${selectedShard.name}!`);
                    onNavigate('farmingGameplay');
                  }}
                  className="w-full bg-gradient-to-r from-[#73C783] to-[#6EE7B7] text-black"
                >
                  Deploy to Shard
                </Button>
              ) : (
                <Button disabled className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Locked - Complete Prerequisites
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full border-[#6EE7B7] text-[#6EE7B7]"
                onClick={() => {
                  toast.info(`${selectedShard.name}: Completion ${selectedShard.completionProgress}%`);
                }}
              >
                View Shard History
              </Button>
            </div>

            {/* Mission Requirements */}
            {selectedShard.status === 'locked' && (
              <Card className="mt-4 p-3 bg-[#8B5A3C]/10 border-[#8B5A3C]/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#8B5A3C]" />
                  <span className="text-xs text-[#8B5A3C]">UNLOCK REQUIREMENTS</span>
                </div>
                <p className="text-xs text-[#E5E7EB]/70">
                  Complete missions in 3 other shards and achieve 90% stability rating.
                </p>
              </Card>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  TrendingUp,
  Lock,
  CheckCircle,
  Wrench,
  Sprout,
  Award,
  ArrowUp,
  Info
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface FarmShopProps {
  onNavigate: (screen: string) => void;
}

export function FarmShop({ onNavigate }: FarmShopProps) {
  const { gameState, purchaseTool, upgradeTool, purchaseSeed } = useGame();
  const [selectedTab, setSelectedTab] = useState('tools');

  const handlePurchaseTool = (toolId: string) => {
    const success = purchaseTool(toolId);
    if (!success) {
      toast.error('Not enough XP or tool already owned!');
    }
  };

  const handleUpgradeTool = (toolId: string) => {
    const success = upgradeTool(toolId);
    if (!success) {
      const tool = gameState.farmTools.find(t => t.id === toolId);
      if (tool && tool.level >= 5) {
        toast.error('Tool is already at max level!');
      } else {
        toast.error('Not enough XP to upgrade!');
      }
    }
  };

  const handlePurchaseSeed = (seedId: string) => {
    const success = purchaseSeed(seedId);
    if (!success) {
      toast.error('Not enough XP or seed already unlocked!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#1E3A8A] text-white">
      {/* Header */}
      <div className="border-b border-[#6EE7B7]/20 bg-black/20 backdrop-blur-sm">
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate('learningHub')}
              variant="ghost"
              className="text-[#E5E7EB] hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-[#FFD369]" />
                Farm Shop
              </h1>
              <p className="text-[#E5E7EB]/70 mt-1">
                Use XP to purchase and upgrade farming equipment
              </p>
            </div>
          </div>

          {/* XP Display */}
          <Card className="p-4 bg-gradient-to-br from-[#FFD369]/20 to-[#FF8C42]/20 border-[#FFD369]/40">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-[#FFD369]" />
              <div>
                <p className="text-sm text-[#E5E7EB]/70">Available XP</p>
                <p className="text-2xl text-[#FFD369]">{gameState.resources.xp}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Player Level Info */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-4">
            <Award className="w-5 h-5 text-[#6EE7B7]" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#E5E7EB]">Level {gameState.playerLevel}</span>
                <span className="text-[#E5E7EB]/70">
                  {gameState.playerXP} / {gameState.xpToNextLevel} XP
                </span>
              </div>
              <Progress 
                value={(gameState.playerXP / gameState.xpToNextLevel) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="tools">
              <Wrench className="w-4 h-4 mr-2" />
              Farm Tools
            </TabsTrigger>
            <TabsTrigger value="seeds">
              <Sprout className="w-4 h-4 mr-2" />
              Premium Seeds
            </TabsTrigger>
          </TabsList>

          {/* Tools Tab */}
          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameState.farmTools.map((tool, index) => {
                const upgradeCost = tool.owned ? tool.xpCost * tool.level : tool.xpCost;
                const canAfford = gameState.resources.xp >= upgradeCost;
                const isMaxLevel = tool.level >= 5;

                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`p-6 backdrop-blur-sm border transition-all duration-300 ${
                      tool.owned 
                        ? 'bg-[#73C783]/10 border-[#73C783]/50' 
                        : 'bg-black/40 border-[#6EE7B7]/30 hover:border-[#6EE7B7]/50'
                    }`}>
                      {/* Tool Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#6EE7B7]/20 to-[#73C783]/20 flex items-center justify-center text-3xl">
                            {tool.emoji}
                          </div>
                          <div>
                            <h3 className="text-lg text-[#E5E7EB]">{tool.name}</h3>
                            <Badge variant="outline" className="text-xs mt-1">
                              Level {tool.level}
                            </Badge>
                          </div>
                        </div>
                        {tool.owned && (
                          <CheckCircle className="w-5 h-5 text-[#73C783]" />
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-[#E5E7EB]/80 mb-4">{tool.description}</p>

                      {/* Stats */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#E5E7EB]/70">Mission Speed</span>
                          <span className="text-[#6EE7B7]">+{tool.speedBonus}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#E5E7EB]/70">Crop Quality</span>
                          <span className="text-[#6EE7B7]">+{tool.qualityBonus}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#E5E7EB]/70">Type</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {tool.type}
                          </Badge>
                        </div>
                      </div>

                      {/* Action Button */}
                      {!tool.owned ? (
                        <Button
                          onClick={() => handlePurchaseTool(tool.id)}
                          disabled={!canAfford}
                          className={`w-full ${
                            canAfford
                              ? 'bg-gradient-to-r from-[#6EE7B7] to-[#73C783] text-black hover:from-[#73C783] hover:to-[#6EE7B7]'
                              : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Purchase ({tool.xpCost} XP)
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleUpgradeTool(tool.id)}
                          disabled={!canAfford || isMaxLevel}
                          className={`w-full ${
                            isMaxLevel
                              ? 'bg-[#FFD369]/20 text-[#FFD369] border border-[#FFD369]/40 cursor-not-allowed'
                              : canAfford
                              ? 'bg-gradient-to-r from-[#FFD369] to-[#FF8C42] text-black hover:from-[#FF8C42] hover:to-[#FFD369]'
                              : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isMaxLevel ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Max Level
                            </>
                          ) : (
                            <>
                              <ArrowUp className="w-4 h-4 mr-2" />
                              Upgrade ({upgradeCost} XP)
                            </>
                          )}
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Seeds Tab */}
          <TabsContent value="seeds">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameState.cropSeeds.map((seed, index) => {
                const canAfford = gameState.resources.xp >= seed.xpCost;

                return (
                  <motion.div
                    key={seed.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`p-6 backdrop-blur-sm border transition-all duration-300 ${
                      seed.owned 
                        ? 'bg-[#73C783]/10 border-[#73C783]/50' 
                        : 'bg-black/40 border-[#6EE7B7]/30 hover:border-[#6EE7B7]/50'
                    }`}>
                      {/* Seed Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#6EE7B7]/20 to-[#73C783]/20 flex items-center justify-center text-3xl">
                            {seed.emoji}
                          </div>
                          <div>
                            <h3 className="text-lg text-[#E5E7EB]">{seed.name}</h3>
                            <Badge variant="outline" className="text-xs mt-1 capitalize">
                              {seed.type}
                            </Badge>
                          </div>
                        </div>
                        {seed.owned && (
                          <CheckCircle className="w-5 h-5 text-[#73C783]" />
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-[#E5E7EB]/80 mb-4">{seed.description}</p>

                      {/* Stats */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#E5E7EB]/70">Growth Speed</span>
                          <span className="text-[#6EE7B7]">-{seed.growthTimeReduction}s</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#E5E7EB]/70">Yield Bonus</span>
                          <span className="text-[#6EE7B7]">+{seed.yieldBonus}%</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {!seed.owned ? (
                        <Button
                          onClick={() => handlePurchaseSeed(seed.id)}
                          disabled={!canAfford}
                          className={`w-full ${
                            canAfford
                              ? 'bg-gradient-to-r from-[#6EE7B7] to-[#73C783] text-black hover:from-[#73C783] hover:to-[#6EE7B7]'
                              : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Unlock ({seed.xpCost} XP)
                        </Button>
                      ) : (
                        <Button
                          disabled
                          className="w-full bg-[#73C783]/20 text-[#73C783] border border-[#73C783]/40 cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Unlocked
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-[#1E3A8A]/40 to-[#3B82F6]/40 border-[#6EE7B7]/30">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-[#6EE7B7] mt-1" />
            <div>
              <h3 className="text-lg text-[#6EE7B7] mb-2">How to Earn XP</h3>
              <ul className="space-y-1 text-sm text-[#E5E7EB]/80">
                <li>• Complete Learning Modules in the Learning Hub</li>
                <li>• Answer questions correctly during lessons</li>
                <li>• Defeat bosses in Boss Battles (skills help you deal more damage!)</li>
                <li>• Complete missions faster with upgraded tools</li>
                <li>• Level up your skills to unlock bonuses</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

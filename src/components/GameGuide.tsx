import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { HelpCircle, Sprout, Droplets, Zap, Map } from 'lucide-react';

export function GameGuide() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        onClick={() => setOpen(true)}
        variant="outline" 
        size="sm"
        className="fixed bottom-4 right-4 z-40 bg-black/60 backdrop-blur-sm border-[#6EE7B7]/30 text-[#6EE7B7] hover:bg-black/80"
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        Game Guide
      </Button>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-black/95 border-[#73C783]/30 text-[#E5E7EB]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#FFD369]">AgriVerse: Game Guide</DialogTitle>
          <DialogDescription className="text-[#E5E7EB]/70">
            Master sustainable farming across climate-affected shards
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="shards">Shards</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-4 mt-4">
            <Card className="p-4 bg-black/40 border-[#73C783]/30">
              <h3 className="text-[#73C783] mb-3 flex items-center gap-2">
                <Sprout className="w-5 h-5" />
                How to Play
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong className="text-[#FFD369]">1. Till Plots:</strong> Select Bio-Shovel and click empty plots</p>
                <p><strong className="text-[#FFD369]">2. Plant Crops:</strong> Select Seed Vault, choose crop type, click tilled plots</p>
                <p><strong className="text-[#FFD369]">3. Water:</strong> Use Water Orb on growing crops when water is low</p>
                <p><strong className="text-[#FFD369]">4. Harvest:</strong> Click Harvest button when crops reach 100%</p>
              </div>
            </Card>

            <Card className="p-4 bg-black/40 border-[#4ECDC4]/30">
              <h3 className="text-[#4ECDC4] mb-3 flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                Crop Health System
              </h3>
              <div className="space-y-2 text-sm">
                <p>• <strong>Water Level:</strong> Decreases over time, keep above 20%</p>
                <p>• <strong>Health:</strong> Affected by water level</p>
                <p className="text-[#73C783]">• High Health (80%+): 1.5x Eco Points bonus</p>
                <p className="text-[#FFD369]">• Medium Health (50-80%): 1.2x bonus</p>
                <p className="text-[#FF6B6B]">• Low Health (below 50%): Normal rewards</p>
              </div>
            </Card>

            <Card className="p-4 bg-black/40 border-[#FFD369]/30">
              <h3 className="text-[#FFD369] mb-3">Resources</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p><strong>Seeds:</strong> Plant crops</p>
                  <p className="text-[#E5E7EB]/60">Gain from harvesting</p>
                </div>
                <div>
                  <p><strong>Water:</strong> Keep crops alive</p>
                  <p className="text-[#E5E7EB]/60">5L per watering</p>
                </div>
                <div>
                  <p><strong>Energy:</strong> Special actions</p>
                  <p className="text-[#E5E7EB]/60">From upgrades</p>
                </div>
                <div>
                  <p><strong>Eco Points:</strong> Main currency</p>
                  <p className="text-[#E5E7EB]/60">From harvesting</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="crops" className="space-y-4 mt-4">
            <div className="grid gap-3">
              <Card className="p-3 bg-black/40 border-[#73C783]/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h4 className="text-[#73C783]">Basic Crop</h4>
                    <Badge className="text-xs bg-[#73C783]/20 text-[#73C783]">Easy</Badge>
                  </div>
                </div>
                <div className="text-sm text-[#E5E7EB]/80">
                  <p>Growth: 20 seconds | Water: 30L | Reward: 25 points</p>
                  <p className="text-[#6EE7B7]">Best for: Quick farming, beginners</p>
                </div>
              </Card>

              <Card className="p-3 bg-black/40 border-[#8B5A3C]/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🌵</span>
                  <div>
                    <h4 className="text-[#FFD369]">Desert Wheat</h4>
                    <Badge className="text-xs bg-[#FFD369]/20 text-[#FFD369]">Drought Resistant</Badge>
                  </div>
                </div>
                <div className="text-sm text-[#E5E7EB]/80">
                  <p>Growth: 30 seconds | Water: 20L | Reward: 50 points</p>
                  <p className="text-[#FF6B6B]">Best in: Ash, Locusts shards</p>
                </div>
              </Card>

              <Card className="p-3 bg-black/40 border-[#4ECDC4]/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🌾</span>
                  <div>
                    <h4 className="text-[#4ECDC4]">Aqua Rice</h4>
                    <Badge className="text-xs bg-[#4ECDC4]/20 text-[#4ECDC4]">Flood Tolerant</Badge>
                  </div>
                </div>
                <div className="text-sm text-[#E5E7EB]/80">
                  <p>Growth: 45 seconds | Water: 60L | Reward: 40 points</p>
                  <p className="text-[#4ECDC4]">Best in: Drowned Fields, Overgrowth</p>
                </div>
              </Card>

              <Card className="p-3 bg-black/40 border-[#E74C3C]/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🧬</span>
                  <div>
                    <h4 className="text-[#E74C3C]">Gene Corn</h4>
                    <Badge className="text-xs bg-[#E74C3C]/20 text-[#E74C3C]">Bio-Enhanced</Badge>
                  </div>
                </div>
                <div className="text-sm text-[#E5E7EB]/80">
                  <p>Growth: 60 seconds | Water: 40L | Reward: 80 points</p>
                  <p className="text-[#9B59B6]">Best in: Bio-Forge, Harmony</p>
                </div>
              </Card>

              <Card className="p-3 bg-black/40 border-[#73C783]/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🌲</span>
                  <div>
                    <h4 className="text-[#73C783]">Air Trees</h4>
                    <Badge className="text-xs bg-[#73C783]/20 text-[#73C783]">Carbon Sink</Badge>
                  </div>
                </div>
                <div className="text-sm text-[#E5E7EB]/80">
                  <p>Growth: 90 seconds | Water: 50L | Reward: 100 points</p>
                  <p className="text-[#73C783]">Best in: Harmony, Overgrowth</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shards" className="space-y-4 mt-4">
            <Card className="p-4 bg-black/40 border-[#6EE7B7]/30">
              <h3 className="text-[#6EE7B7] mb-3 flex items-center gap-2">
                <Map className="w-5 h-5" />
                Shard System
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[#FFD369] mb-1">🌾 Harmony (Starting Shard)</p>
                  <p className="text-[#E5E7EB]/70">Balanced conditions, perfect for learning</p>
                </div>
                <div>
                  <p className="text-[#73C783] mb-1">🌿 Overgrowth (Unlocks at 50%)</p>
                  <p className="text-[#E5E7EB]/70">High humidity, fast growth, water abundant</p>
                </div>
                <div>
                  <p className="text-[#4ECDC4] mb-1">🌊 Drowned Fields (Unlocks at 60%)</p>
                  <p className="text-[#E5E7EB]/70">Flooded, needs flood-tolerant crops</p>
                </div>
                <div>
                  <p className="text-[#FF6B6B] mb-1">🔥 Ash (Available)</p>
                  <p className="text-[#E5E7EB]/70">Extreme heat, low water, drought-resistant crops excel</p>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-[#E5E7EB]/60 italic">Complete 3 shards at 90% to unlock extreme shards:</p>
                  <p className="text-[#8B5A3C]">☠️ Locusts | 🌙 Silent Soil | 🛰️ Star Farms | 🧬 Bio-Forge</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-black/40 border-[#FFD369]/30">
              <h3 className="text-[#FFD369] mb-3">Shard Completion</h3>
              <div className="space-y-2 text-sm">
                <p>• Each harvest increases completion by 2%</p>
                <p>• Reach 80% to unlock rewards</p>
                <p>• Complete all 8 shards to master AgriVerse</p>
                <p className="text-[#73C783]">• Higher completion = better climate stability</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4 mt-4">
            <Card className="p-4 bg-black/40 border-[#73C783]/30">
              <h3 className="text-[#73C783] mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Pro Tips
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-[#FFD369]">💡</span>
                  <p><strong>Till First:</strong> Always till plots before planting - it's required!</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#6EE7B7]">💧</span>
                  <p><strong>Water Management:</strong> Keep crops above 50% water for best health</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#73C783]">🌱</span>
                  <p><strong>Crop Strategy:</strong> Start with Basic Crops, upgrade to Gene Corn/Air Trees</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#FF6B6B]">⚡</span>
                  <p><strong>Quick Harvest:</strong> Use "Harvest All Ready" to collect multiple crops at once</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#4ECDC4]">🌊</span>
                  <p><strong>Bulk Water:</strong> Use "Irrigate All" to water all crops efficiently (3L each)</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#FFD369]">📊</span>
                  <p><strong>NASA Data:</strong> Visit NASA panel for free energy and eco points boost</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#73C783]">🎯</span>
                  <p><strong>Missions:</strong> Complete daily missions for valuable resource rewards</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#9B59B6]">🗺️</span>
                  <p><strong>Shard Matching:</strong> Plant crops that thrive in each shard's climate</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-black/40 border-[#FFD369]/30">
              <h3 className="text-[#FFD369] mb-3">Advanced Tactics</h3>
              <div className="space-y-2 text-sm">
                <p>🔄 <strong>Crop Rotation:</strong> Mix fast-growing crops with high-value ones</p>
                <p>⏱️ <strong>Time Management:</strong> Plant long-growing crops before breaks</p>
                <p>💰 <strong>Eco Points:</strong> Invest in tool upgrades for better efficiency</p>
                <p>🌍 <strong>Climate Sync:</strong> Check Climate Transitions for optimal planting times</p>
                <p>🎮 <strong>Multi-Shard:</strong> Switch between shards to maximize farming uptime</p>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-[#73C783]/20 to-[#6EE7B7]/20 border-[#73C783]/40">
              <h3 className="text-[#73C783] mb-2">🏆 Winning Strategy</h3>
              <p className="text-sm text-[#E5E7EB]/90">
                Master Harmony → Unlock Overgrowth → Plant high-value crops → 
                Keep health high → Complete missions → Unlock all shards → 
                Restore ecological balance! 🌍✨
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

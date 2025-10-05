import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Globe,
  Clock,
  AlertTriangle,
  Package,
  Zap,
  Droplets,
  Sprout,
  Truck,
  Users,
  Star,
  ShoppingCart,
  Coins
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner';

interface GlobalMarketplaceProps {
  onNavigate: (screen: string) => void;
}

interface MarketItem {
  id: string;
  name: string;
  emoji: string;
  category: 'crops' | 'seeds' | 'tools' | 'fertilizers' | 'livestock';
  basePrice: number;
  currentPrice: number;
  priceChange: number; // percentage
  supply: number;
  demand: number;
  region: string;
  quality: 'common' | 'rare' | 'epic' | 'legendary';
  seller: string;
  description: string;
  effects?: string[];
}

interface MarketTrend {
  item: string;
  price: number;
  time: number;
}

const marketItems: MarketItem[] = [
  {
    id: 'wheat-premium',
    name: 'Premium Wheat',
    emoji: '🌾',
    category: 'crops',
    basePrice: 25,
    currentPrice: 32,
    priceChange: 28,
    supply: 1250,
    demand: 1890,
    region: 'Great Plains',
    quality: 'rare',
    seller: 'EcoMaster2024',
    description: 'High-protein wheat grown in optimal conditions',
    effects: ['High yield', 'Drought resistant']
  },
  {
    id: 'quantum-seeds',
    name: 'Quantum Seeds',
    emoji: '⚛️',
    category: 'seeds',
    basePrice: 150,
    currentPrice: 198,
    priceChange: 32,
    supply: 45,
    demand: 187,
    region: 'Bio-Labs',
    quality: 'legendary',
    seller: 'TechFarmer_X',
    description: 'Genetically enhanced seeds with 300% faster growth',
    effects: ['3x Growth speed', 'Climate adaptive', 'Self-irrigating']
  },
  {
    id: 'ai-drone',
    name: 'AgriBot Pro',
    emoji: '🚁',
    category: 'tools',
    basePrice: 500,
    currentPrice: 425,
    priceChange: -15,
    supply: 87,
    demand: 234,
    region: 'Netherlands',
    quality: 'epic',
    seller: 'DroneDealer',
    description: 'Autonomous farming drone with AI pest detection',
    effects: ['Auto-watering', 'Pest control', 'Crop monitoring']
  },
  {
    id: 'bio-fertilizer',
    name: 'Mycorrhizal Boost',
    emoji: '🧪',
    category: 'fertilizers',
    basePrice: 75,
    currentPrice: 89,
    priceChange: 18.7,
    supply: 340,
    demand: 567,
    region: 'Amazon Basin',
    quality: 'epic',
    seller: 'BioSolutions',
    description: 'Fungal network enhancer for soil health',
    effects: ['Soil health +50%', 'Root growth boost', 'Natural defense']
  },
  {
    id: 'water-cattle',
    name: 'Aqua Cattle',
    emoji: '🐄',
    category: 'livestock',
    basePrice: 800,
    currentPrice: 756,
    priceChange: -5.5,
    supply: 23,
    demand: 45,
    region: 'Pampas',
    quality: 'rare',
    seller: 'RanchMaster',
    description: 'Genetically adapted cattle for wet climates',
    effects: ['Flood resistant', 'High milk yield', 'Disease immune']
  },
  {
    id: 'desert-corn',
    name: 'Sahara Corn',
    emoji: '🌽',
    category: 'crops',
    basePrice: 45,
    currentPrice: 67,
    priceChange: 48.9,
    supply: 234,
    demand: 789,
    region: 'Sahel Belt',
    quality: 'epic',
    seller: 'DesertHarvester',
    description: 'Ultra-drought resistant corn variety',
    effects: ['No water needed', 'Heat resistant', 'High nutrition']
  }
];

const qualityColors = {
  common: '#8B5A3C',
  rare: '#4ECDC4',
  epic: '#8B5CF6',
  legendary: '#FFD369'
};

export function GlobalMarketplace({ onNavigate }: GlobalMarketplaceProps) {
  const { gameState, updateResources } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceHistory, setPriceHistory] = useState<MarketTrend[]>([]);
  const [cartItems, setCartItems] = useState<{item: MarketItem, quantity: number}[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    // Simulate real-time price updates
    const priceTimer = setInterval(() => {
      marketItems.forEach(item => {
        const change = (Math.random() - 0.5) * 10; // ±5% change
        item.currentPrice = Math.max(item.basePrice * 0.5, item.currentPrice + change);
        item.priceChange = ((item.currentPrice - item.basePrice) / item.basePrice) * 100;
        
        // Update supply/demand
        item.supply += Math.floor(Math.random() * 20) - 10;
        item.demand += Math.floor(Math.random() * 30) - 15;
        item.supply = Math.max(0, item.supply);
        item.demand = Math.max(0, item.demand);
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(priceTimer);
  }, []);

  const filteredItems = marketItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                         item.region.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MarketItem, quantity: number = 1) => {
    if (gameState.resources.ecoPoints < item.currentPrice * quantity) {
      toast.error('Not enough Eco Points!');
      return;
    }

    const existingItem = cartItems.find(cartItem => cartItem.item.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.item.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { item, quantity }]);
    }
    
    toast.success(`Added ${item.name} to cart!`);
  };

  const purchaseCart = () => {
    const totalCost = cartItems.reduce((total, cartItem) => 
      total + (cartItem.item.currentPrice * cartItem.quantity), 0
    );

    if (gameState.resources.ecoPoints < totalCost) {
      toast.error('Not enough Eco Points for this purchase!');
      return;
    }

    updateResources({ ecoPoints: -totalCost });
    
    cartItems.forEach(cartItem => {
      if (cartItem.item.category === 'seeds') {
        updateResources({ seeds: cartItem.quantity * 10 }); // Seeds come in packs
      } else if (cartItem.item.category === 'tools') {
        toast.success(`${cartItem.item.name} added to your tool inventory!`);
      }
    });

    toast.success(`Purchase complete! Spent ${totalCost} Eco Points`);
    setCartItems([]);
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-[#73C783]" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-[#FF6B6B]" />;
    return <div className="w-3 h-3" />;
  };

  const getSupplyDemandRatio = (supply: number, demand: number) => {
    const ratio = supply / demand;
    if (ratio > 1.2) return { text: 'Oversupply', color: '#FF6B6B' };
    if (ratio < 0.8) return { text: 'High Demand', color: '#73C783' };
    return { text: 'Balanced', color: '#FFD369' };
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/90 to-black/80">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-white/5" style={{
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
              <h1 className="text-2xl text-[#E5E7EB]">Global Marketplace</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Card className="px-3 py-2 bg-black/40 border-[#73C783]/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#73C783]" />
                <span className="text-[#E5E7EB]">{gameState.resources.ecoPoints.toLocaleString()} Eco Points</span>
              </div>
            </Card>

            <Card className="px-3 py-2 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#FFD369]" />
                <span className="text-[#E5E7EB]">Cart ({cartItems.length})</span>
              </div>
            </Card>
          </div>
        </div>

        <div className="relative z-10 flex h-[calc(100vh-80px)]">
          {/* Main Marketplace */}
          <div className="flex-1 p-6">
            <Tabs defaultValue="marketplace" className="h-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="trends">Price Trends</TabsTrigger>
                <TabsTrigger value="mystore">My Store</TabsTrigger>
              </TabsList>

              <TabsContent value="marketplace" className="h-[calc(100%-60px)]">
                <div className="mb-4 flex gap-4">
                  <Input
                    placeholder="Search items or regions..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="flex-1 bg-black/20 border-white/20 text-[#E5E7EB]"
                  />
                  
                  <div className="flex gap-2">
                    {['all', 'crops', 'seeds', 'tools', 'fertilizers', 'livestock'].map(category => (
                      <Button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        className={selectedCategory === category 
                          ? 'bg-[#73C783] text-black' 
                          : 'border-white/20 text-[#E5E7EB]'
                        }
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[calc(100%-80px)] overflow-y-auto">
                  {filteredItems.map((item) => {
                    const supplyDemand = getSupplyDemandRatio(item.supply, item.demand);
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="p-4 bg-black/40 border-white/10 backdrop-blur-sm hover:border-[#73C783]/40 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{item.emoji}</div>
                              <div>
                                <h3 className="text-[#E5E7EB] font-medium">{item.name}</h3>
                                <p className="text-xs text-[#E5E7EB]/70">{item.region}</p>
                              </div>
                            </div>
                            
                            <Badge
                              className="text-xs"
                              style={{ 
                                backgroundColor: `${qualityColors[item.quality]}20`,
                                color: qualityColors[item.quality]
                              }}
                            >
                              {item.quality}
                            </Badge>
                          </div>

                          <p className="text-xs text-[#E5E7EB]/80 mb-3">{item.description}</p>

                          {item.effects && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1">
                                {item.effects.map(effect => (
                                  <Badge key={effect} variant="outline" className="text-xs">
                                    {effect}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg text-[#73C783] font-medium">
                                {Math.round(item.currentPrice)} EP
                              </span>
                              <div className="flex items-center gap-1">
                                {getPriceChangeIcon(item.priceChange)}
                                <span className={`text-xs ${
                                  item.priceChange > 0 ? 'text-[#73C783]' : 
                                  item.priceChange < 0 ? 'text-[#FF6B6B]' : 'text-[#E5E7EB]'
                                }`}>
                                  {item.priceChange > 0 ? '+' : ''}{item.priceChange.toFixed(1)}%
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xs text-[#E5E7EB]/70">by {item.seller}</div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-[#FFD369] fill-current" />
                                <span className="text-xs text-[#E5E7EB]">4.8</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-3 text-xs">
                            <div>
                              <span className="text-[#E5E7EB]/70">Supply: </span>
                              <span className="text-[#4ECDC4]">{item.supply}</span>
                            </div>
                            <div>
                              <span className="text-[#E5E7EB]/70">Demand: </span>
                              <span className="text-[#FF6B6B]">{item.demand}</span>
                            </div>
                            <Badge 
                              className="text-xs" 
                              style={{ 
                                backgroundColor: `${supplyDemand.color}20`,
                                color: supplyDemand.color
                              }}
                            >
                              {supplyDemand.text}
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => addToCart(item)}
                              className="flex-1 bg-[#73C783] text-black hover:bg-[#73C783]/80"
                              size="sm"
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Add to Cart
                            </Button>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => {
                                    addToCart(item);
                                    setTimeout(() => purchaseCart(), 100);
                                  }}
                                  className="bg-[#FFD369] text-black hover:bg-[#FFD369]/80"
                                  size="sm"
                                >
                                  <Zap className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Buy Now</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="trends" className="h-[calc(100%-60px)]">
                <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm h-full">
                  <h3 className="text-[#E5E7EB] text-lg mb-4">Market Analysis</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[#73C783] mb-3">Top Performers</h4>
                      <div className="space-y-3">
                        {marketItems
                          .filter(item => item.priceChange > 20)
                          .sort((a, b) => b.priceChange - a.priceChange)
                          .slice(0, 5)
                          .map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 bg-[#73C783]/10 rounded">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{item.emoji}</span>
                                <span className="text-[#E5E7EB] text-sm">{item.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-[#73C783]" />
                                <span className="text-[#73C783] text-sm">+{item.priceChange.toFixed(1)}%</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[#FF6B6B] mb-3">Market Dips</h4>
                      <div className="space-y-3">
                        {marketItems
                          .filter(item => item.priceChange < -5)
                          .sort((a, b) => a.priceChange - b.priceChange)
                          .slice(0, 5)
                          .map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 bg-[#FF6B6B]/10 rounded">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{item.emoji}</span>
                                <span className="text-[#E5E7EB] text-sm">{item.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingDown className="w-3 h-3 text-[#FF6B6B]" />
                                <span className="text-[#FF6B6B] text-sm">{item.priceChange.toFixed(1)}%</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-[#FFD369] mb-3">Regional Hotspots</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-3 bg-[#6EE7B7]/10 border-[#6EE7B7]/30">
                        <h5 className="text-[#6EE7B7] text-sm font-medium">High Activity</h5>
                        <p className="text-[#E5E7EB] text-xs">Sahel Belt</p>
                        <p className="text-[#E5E7EB]/70 text-xs">+89% trading volume</p>
                      </Card>
                      <Card className="p-3 bg-[#FFD369]/10 border-[#FFD369]/30">
                        <h5 className="text-[#FFD369] text-sm font-medium">Price Surge</h5>
                        <p className="text-[#E5E7EB] text-xs">Great Plains</p>
                        <p className="text-[#E5E7EB]/70 text-xs">Drought affecting crops</p>
                      </Card>
                      <Card className="p-3 bg-[#4ECDC4]/10 border-[#4ECDC4]/30">
                        <h5 className="text-[#4ECDC4] text-sm font-medium">New Technology</h5>
                        <p className="text-[#E5E7EB] text-xs">Netherlands</p>
                        <p className="text-[#E5E7EB]/70 text-xs">AI tools launching</p>
                      </Card>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="mystore" className="h-[calc(100%-60px)]">
                <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-sm h-full">
                  <h3 className="text-[#E5E7EB] text-lg mb-4">My Store</h3>
                  <p className="text-[#E5E7EB]/70 text-center mt-20">
                    Sell your harvested crops and unlock store features at Player Level 5
                  </p>
                  <div className="text-center mt-4">
                    <Button
                      onClick={() => onNavigate('playerHub')}
                      className="bg-[#73C783] text-black"
                    >
                      Continue Farming to Level Up
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Shopping Cart Sidebar */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-80 p-6 bg-black/20 backdrop-blur-sm border-l border-white/10"
            >
              <Card className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm">
                <h3 className="text-[#FFD369] mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Shopping Cart
                </h3>
                
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cartItems.map((cartItem, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cartItem.item.emoji}</span>
                        <div>
                          <p className="text-[#E5E7EB] text-sm">{cartItem.item.name}</p>
                          <p className="text-[#E5E7EB]/70 text-xs">Qty: {cartItem.quantity}</p>
                        </div>
                      </div>
                      <span className="text-[#73C783] text-sm">
                        {Math.round(cartItem.item.currentPrice * cartItem.quantity)} EP
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#E5E7EB]">Total:</span>
                    <span className="text-[#73C783] font-medium">
                      {cartItems.reduce((total, cartItem) => 
                        total + (cartItem.item.currentPrice * cartItem.quantity), 0
                      ).toFixed(0)} EP
                    </span>
                  </div>
                  
                  <Button
                    onClick={purchaseCart}
                    className="w-full bg-gradient-to-r from-[#73C783] to-[#6EE7B7] text-black font-medium"
                  >
                    Complete Purchase
                  </Button>
                  
                  <Button
                    onClick={() => setCartItems([])}
                    variant="outline"
                    className="w-full mt-2 border-white/20 text-[#E5E7EB]"
                    size="sm"
                  >
                    Clear Cart
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
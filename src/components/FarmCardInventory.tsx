import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, Lock } from 'lucide-react';
import { useGame, type FarmCard } from '../contexts/GameContext';

interface FarmCardInventoryProps {
  onNavigate: (screen: any) => void;
}

const farmCards: FarmCard[] = [
  // Soil Cards
  {
    id: 'soil-shield',
    name: 'Soil Shield',
    emoji: '🛡️',
    category: 'soil',
    power: 'Protects crops from soil degradation',
    knowledge: 'Healthy soil contains billions of microorganisms that create natural defenses against diseases.',
    color: '#8B4513',
    rarity: 'common',
    owned: true
  },
  {
    id: 'compost-master',
    name: 'Compost Master',
    emoji: '♻️',
    category: 'soil',
    power: '+30% soil health regeneration',
    knowledge: 'Composting transforms organic waste into nutrient-rich soil, reducing landfill waste by up to 30%.',
    color: '#654321',
    rarity: 'rare',
    owned: true
  },
  {
    id: 'mycorrhizal-bond',
    name: 'Mycorrhizal Bond',
    emoji: '🍄',
    category: 'soil',
    power: 'Unlocks symbiotic fungi networks',
    knowledge: 'Mycorrhizal fungi connect plant roots, allowing them to share nutrients and communicate.',
    color: '#D2691E',
    rarity: 'epic',
    owned: false
  },

  // Water Cards
  {
    id: 'water-staff',
    name: 'Water Staff',
    emoji: '💧',
    category: 'water',
    power: '-40% water consumption',
    knowledge: 'Drip irrigation can save up to 60% of water compared to traditional flood irrigation methods.',
    color: '#4ECDC4',
    rarity: 'common',
    owned: true
  },
  {
    id: 'aquifer-key',
    name: 'Aquifer Key',
    emoji: '🔑',
    category: 'water',
    power: 'Access underground water reserves',
    knowledge: 'Aquifers store 30% of Earth\'s freshwater and can sustain crops during droughts.',
    color: '#00CED1',
    rarity: 'rare',
    owned: false
  },
  {
    id: 'rain-caller',
    name: 'Rain Caller',
    emoji: '🌧️',
    category: 'water',
    power: 'Summon beneficial rainfall',
    knowledge: 'Rainwater harvesting can reduce municipal water use by 40% in agricultural areas.',
    color: '#1E90FF',
    rarity: 'legendary',
    owned: false
  },

  // Biodiversity Cards
  {
    id: 'pollinator-wings',
    name: 'Pollinator Wings',
    emoji: '🦋',
    category: 'biodiversity',
    power: '+25% crop yield from pollination',
    knowledge: '75% of food crops depend on pollinators like bees, butterflies, and birds.',
    color: '#FF69B4',
    rarity: 'rare',
    owned: true
  },
  {
    id: 'companion-circle',
    name: 'Companion Circle',
    emoji: '🌻',
    category: 'biodiversity',
    power: 'Unlocks companion planting',
    knowledge: 'Companion planting uses plant relationships to naturally deter pests and boost growth.',
    color: '#FFD700',
    rarity: 'common',
    owned: true
  },
  {
    id: 'predator-balance',
    name: 'Predator Balance',
    emoji: '🦅',
    category: 'biodiversity',
    power: 'Natural pest control',
    knowledge: 'A single barn owl can eliminate over 1,000 rodents per year, protecting crops naturally.',
    color: '#8B4789',
    rarity: 'epic',
    owned: false
  },

  // Climate Cards
  {
    id: 'carbon-sink',
    name: 'Carbon Sink',
    emoji: '🌳',
    category: 'climate',
    power: 'Captures 50 tons CO2/year',
    knowledge: 'Trees and soil can sequester carbon, with one acre of forest absorbing 2.5 tons of CO2 annually.',
    color: '#228B22',
    rarity: 'rare',
    owned: false
  },
  {
    id: 'solar-harvest',
    name: 'Solar Harvest',
    emoji: '☀️',
    category: 'climate',
    power: '+20% energy from sunlight',
    knowledge: 'Plants convert only 1-2% of sunlight into energy, but optimize this through photosynthesis.',
    color: '#FFD369',
    rarity: 'common',
    owned: true
  },
  {
    id: 'climate-adapt',
    name: 'Climate Adapter',
    emoji: '🌡️',
    category: 'climate',
    power: 'Crops survive extreme weather',
    knowledge: 'Climate-resilient crops can withstand temperature changes of ±10°C.',
    color: '#FF6347',
    rarity: 'legendary',
    owned: false
  },

  // Genetics Cards
  {
    id: 'gene-splice',
    name: 'Gene Splicer',
    emoji: '🧬',
    category: 'genetics',
    power: 'Creates hybrid varieties',
    knowledge: 'Selective breeding has increased crop yields by 400% over the past century.',
    color: '#9370DB',
    rarity: 'epic',
    owned: false
  },
  {
    id: 'heirloom-seed',
    name: 'Heirloom Treasure',
    emoji: '🌱',
    category: 'genetics',
    power: 'Preserves ancient genetics',
    knowledge: 'Heirloom seeds carry genetic diversity that can be crucial for future food security.',
    color: '#6B8E23',
    rarity: 'rare',
    owned: true
  },
  {
    id: 'crispr-tool',
    name: 'CRISPR Tool',
    emoji: '✂️',
    category: 'genetics',
    power: 'Precise genetic editing',
    knowledge: 'CRISPR technology can create drought-resistant crops without introducing foreign DNA.',
    color: '#4B0082',
    rarity: 'legendary',
    owned: false
  }
];

const rarityColors = {
  common: '#9CA3AF',
  rare: '#60A5FA',
  epic: '#A78BFA',
  legendary: '#FBBF24'
};

const rarityLabels = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary'
};

export function FarmCardInventory({ onNavigate }: FarmCardInventoryProps) {
  const { gameState } = useGame();
  const [selectedCard, setSelectedCard] = useState<FarmCard | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const ownedCards = farmCards.filter(card => card.owned);
  const lockedCards = farmCards.filter(card => !card.owned);

  const filterCards = (category: string) => {
    if (category === 'all') return farmCards;
    return farmCards.filter(card => card.category === category);
  };

  const visibleCards = filterCards(activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#0F172A] to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          >
            <Sparkles className="w-4 h-4 text-[#FFD369]" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl mb-2 text-[#6EE7B7]">Farm Card Collection</h1>
              <p className="text-xl text-[#E5E7EB]/80">
                Collect knowledge cards to unlock powers and learn sustainable farming
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl text-[#FFD369] mb-1">
                {ownedCards.length} / {farmCards.length}
              </div>
              <p className="text-sm text-[#E5E7EB]/60">Cards Collected</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          {Object.entries(rarityLabels).map(([rarity, label]) => {
            const count = ownedCards.filter(c => c.rarity === rarity).length;
            const total = farmCards.filter(c => c.rarity === rarity).length;
            return (
              <div
                key={rarity}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
              >
                <div
                  className="text-2xl mb-1"
                  style={{ color: rarityColors[rarity as keyof typeof rarityColors] }}
                >
                  {count}/{total}
                </div>
                <p className="text-sm text-[#E5E7EB]/70">{label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveCategory}>
          <TabsList className="bg-white/10 backdrop-blur-sm border border-white/20 p-1">
            <TabsTrigger value="all">All Cards</TabsTrigger>
            <TabsTrigger value="soil">🛡️ Soil</TabsTrigger>
            <TabsTrigger value="water">💧 Water</TabsTrigger>
            <TabsTrigger value="biodiversity">🦋 Bio</TabsTrigger>
            <TabsTrigger value="climate">🌡️ Climate</TabsTrigger>
            <TabsTrigger value="genetics">🧬 Genetics</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <AnimatePresence mode="popLayout">
            {visibleCards.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => card.owned && setSelectedCard(card)}
                className="relative group cursor-pointer"
              >
                <motion.div
                  whileHover={card.owned ? { y: -8, scale: 1.02 } : {}}
                  whileTap={card.owned ? { scale: 0.98 } : {}}
                  className={`
                    relative p-6 rounded-2xl h-full
                    ${card.owned
                      ? 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2'
                      : 'bg-black/40 backdrop-blur-sm border-2 border-white/10'
                    }
                  `}
                  style={{
                    borderColor: card.owned ? rarityColors[card.rarity] : undefined
                  }}
                >
                  {/* Locked Overlay */}
                  {!card.owned && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                      <Lock className="w-12 h-12 text-white/40" />
                    </div>
                  )}

                  {/* Rarity Indicator */}
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: `${rarityColors[card.rarity]}40`,
                      color: rarityColors[card.rarity],
                      border: `1px solid ${rarityColors[card.rarity]}`
                    }}
                  >
                    {rarityLabels[card.rarity]}
                  </div>

                  {/* Card Emoji */}
                  <motion.div
                    animate={card.owned ? {
                      rotate: [0, -5, 5, 0]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4 text-center"
                  >
                    {card.emoji}
                  </motion.div>

                  {/* Card Info */}
                  <h3 className="text-xl mb-2 text-center text-[#FFD369]">{card.name}</h3>
                  
                  {card.owned && (
                    <>
                      <div className="bg-black/30 rounded-lg p-3 mb-3">
                        <p className="text-xs text-[#6EE7B7]/80 mb-1">Power</p>
                        <p className="text-sm text-[#E5E7EB]">{card.power}</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-[#6EE7B7]/10 to-[#73C783]/10 rounded-lg p-3">
                        <p className="text-xs text-[#E5E7EB]/80 mb-1">Knowledge</p>
                        <p className="text-xs text-[#E5E7EB]/70 line-clamp-3">{card.knowledge}</p>
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Shimmer Effect for Owned Cards */}
                {card.owned && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(45deg, transparent 30%, ${rarityColors[card.rarity]}20 50%, transparent 70%)`,
                      backgroundSize: '200% 200%'
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => onNavigate('playerHub')}
            className="bg-white/10 hover:bg-white/20 text-[#E5E7EB] border border-white/20 px-12 py-6"
          >
            Back to Hub
          </Button>
        </motion.div>
      </div>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border-4 rounded-3xl p-12 max-w-2xl w-full"
              style={{ borderColor: rarityColors[selectedCard.rarity] }}
            >
              <div className="text-9xl mb-6 text-center">{selectedCard.emoji}</div>
              <h2 className="text-4xl mb-2 text-center text-[#FFD369]">{selectedCard.name}</h2>
              <p
                className="text-center mb-6"
                style={{ color: rarityColors[selectedCard.rarity] }}
              >
                {rarityLabels[selectedCard.rarity]} • {selectedCard.category}
              </p>
              
              <div className="bg-black/30 rounded-xl p-6 mb-6">
                <h3 className="text-lg mb-2 text-[#6EE7B7]">Power</h3>
                <p className="text-xl text-[#E5E7EB]">{selectedCard.power}</p>
              </div>
              
              <div className="bg-gradient-to-r from-[#6EE7B7]/20 to-[#73C783]/20 rounded-xl p-6 mb-6">
                <h3 className="text-lg mb-2 text-[#FFD369]">Knowledge</h3>
                <p className="text-lg text-[#E5E7EB]">{selectedCard.knowledge}</p>
              </div>

              <Button
                onClick={() => setSelectedCard(null)}
                className="w-full bg-white/10 hover:bg-white/20 text-[#E5E7EB] border border-white/20 py-6"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

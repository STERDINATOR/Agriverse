# AgriVerse: The Climate Survival Shards - Game Mechanics

## Overview
AgriVerse is a real-time farm simulation game where players restore ecological balance across 8 different climate-affected shards using sustainable farming and NASA climate data.

## Core Systems

### 1. Real-Time Crop Growth System
- **Growth Mechanics**: Crops grow in real-time based on their growth time (20-90 seconds)
- **Growth Progress**: Updates every second, displayed as a percentage (0-100%)
- **Water Consumption**: Each crop's water level decreases by 0.5% per second
- **Health System**: 
  - Low water (<20%) decreases health by 0.3% per update
  - High water (>80%) increases health by 0.1% per update
  - Health affects harvest rewards (80%+ health = 1.5x bonus)

### 2. Farming Tools

#### Bio-Shovel (Till)
- **Function**: Prepares empty plots for planting
- **Cost**: Free
- **Usage**: Click empty plots to till them

#### Seed Vault (Plant)
- **Function**: Plants selected crop type
- **Cost**: 1 seed + crop-specific water
- **Requirements**: Plot must be tilled first
- **Crop Types**:
  - **Basic Crop** 🌱: 20s growth, 30L water, +25 points
  - **Desert Wheat** 🌵: 30s growth, 20L water, +50 points (best in Ash, Locusts)
  - **Aqua Rice** 🌾: 45s growth, 60L water, +40 points (best in Drowned Fields, Overgrowth)
  - **Gene Corn** 🧬: 60s growth, 40L water, +80 points (best in Bio-Forge, Harmony)
  - **Air Trees** 🌲: 90s growth, 50L water, +100 points (best in Harmony, Overgrowth)

#### Water Orb (Water)
- **Function**: Restores crop water level by 30%
- **Cost**: 5L water per use
- **Usage**: Click plots with growing crops

#### Soil Scanner (Scan)
- **Function**: Shows detailed crop stats
- **Cost**: Free
- **Display**: Growth %, Water %, Health %

### 3. Quick Actions

#### Plant Mode
- Sets tool to Seed Vault for quick planting

#### Irrigate All
- Waters all growing crops in current shard
- Cost: 3L water per crop
- Restores +25% water to each crop

#### Harvest All Ready
- Automatically harvests all crops at 100% growth
- Awards eco points based on crop type and health

### 4. Shard System

#### 8 Unique Shards:
1. **Harmony** 🌾 (Easy) - Balanced home base
   - Temp: 22°C, Humidity: 60%, Stability: 85%
   - Starting shard

2. **Overgrowth** 🌿 (Easy) - Lush ecosystem
   - Temp: 28°C, Humidity: 85%, Stability: 70%
   - Unlocks at Harmony 50% completion

3. **Drowned Fields** 🌊 (Medium) - Flooded lands
   - Temp: 18°C, Humidity: 95%, Stability: 45%
   - Unlocks at Harmony 60% completion

4. **Ash** 🔥 (Hard) - Volcanic heat
   - Temp: 45°C, Humidity: 15%, Stability: 30%
   - Available from start

5. **Locusts** ☠️ (Extreme) - Swarm wasteland
   - Temp: 35°C, Humidity: 25%, Stability: 15%
   - Locked - requires 90% stability in 3 shards

6. **Silent Soil** 🌙 (Medium) - Contaminated earth
   - Temp: 12°C, Humidity: 40%, Stability: 25%
   - Locked - requires 90% stability in 3 shards

7. **Star Farms** 🛰️ (Extreme) - Zero gravity
   - Temp: -5°C, Humidity: 0%, Stability: 95%
   - Locked - requires 90% stability in 3 shards

8. **Bio-Forge** 🧬 (Hard) - Genetic lab
   - Temp: 25°C, Humidity: 75%, Stability: 60%
   - Locked - requires 90% stability in 3 shards

#### Shard Progression:
- Each shard has completion progress (0-100%)
- Harvesting crops increases completion by 2%
- Reach 80% to unlock next shards
- Each shard has unique climate stats affecting crop performance

### 5. Resource Management

#### Seeds
- Starting: 247
- Used: Planting crops (-1 per crop)
- Gained: Harvesting (+1-3 random per harvest)

#### Water
- Starting: 89L
- Used: Planting (20-60L), Watering (5L), Irrigating (3L per crop)
- Gained: NASA data application, base actions

#### Energy
- Starting: 156
- Used: Tool upgrades, special actions
- Gained: NASA data, tool upgrades, missions

#### Eco Points
- Starting: 1,423
- Used: Upgrades, unlocks
- Gained: Harvesting crops (25-100+ based on type and health)

### 6. Player Hub Actions

#### Plant Sapling
- Cost: 1 seed
- Reward: +10 Eco Points
- Improves base garden

#### Irrigate Fields
- Cost: 10L water
- Waters all base crops

#### Upgrade Tools
- Cost: 50 Eco Points
- Reward: +20 Energy
- Improves tool efficiency

### 7. Missions System

#### Daily Mission: Plant 5 Crops
- Track progress across all planting
- Complete: Plant 5 crops total
- Reward: +50 seeds, +20L water, +30 energy, +100 points

### 8. NASA Data Panel

#### Live Climate Indicators:
- Global Temperature: +1.2°C
- Sea Level Rise: +3.4mm/yr
- Arctic Ice: -13%/decade
- CO₂ Concentration: 422.4 ppm

#### Apply NASA Data Insights:
- Reward: +30 Energy, +50 Eco Points
- Uses real climate data to inform farming strategies

### 9. Climate Transitions

#### Weather Stages:
1. **Monsoon** (45s) - Heavy rainfall
2. **Drought** (30s) - High temperatures
3. **Flash Flood** (15s) - Extreme precipitation
4. **Balance** (60s) - Optimal conditions

Each stage affects crop growth rates and water needs.

### 10. Story Events

Random events appear during farming:
- **Locust Swarm**: Choose defense strategy
- **Soil Contamination**: Deploy remediation
- Each choice affects resources and shard progress

## Tips for Success

1. **Till plots before planting** - Required step for all crops
2. **Monitor water levels** - Low water damages crop health
3. **Match crops to shards** - Some crops perform better in specific climates
4. **Harvest at 100%** - Maximizes rewards
5. **Maintain high health** - 80%+ health gives 1.5x eco points
6. **Complete missions** - Earns valuable resources
7. **Apply NASA data** - Free energy and points boost
8. **Unlock new shards** - Increase completion progress to unlock harder shards

## Winning Strategy

1. Start in **Harmony** - easiest conditions
2. Plant **Basic Crops** for quick eco points
3. Reinvest in **Gene Corn** and **Air Trees** for higher rewards
4. Keep crops watered above 50%
5. Complete daily mission for resource boost
6. Reach 80% shard completion
7. Deploy to **Overgrowth** and **Drowned Fields**
8. Master all 8 shards for ultimate eco-balance!

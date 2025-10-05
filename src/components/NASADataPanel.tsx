import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { 
  ArrowLeft, 
  Satellite, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Thermometer,
  Droplets,
  Wind,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Waves,
  TreePine
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { toast } from 'sonner';

interface NASADataPanelProps {
  onNavigate: (screen: string) => void;
}

export function NASADataPanel({ onNavigate }: NASADataPanelProps) {
  const { gameState, refreshNASAData, getShardType } = useGame();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await refreshNASAData();
    setIsRefreshing(false);
    toast.success('NASA data updated successfully!');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#73C783';
      case 'moderate': return '#FFD369';
      case 'high': return '#FF6B6B';
      case 'extreme': case 'critical': return '#DC2626';
      default: return '#6EE7B7';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return CheckCircle;
      case 'moderate': return AlertTriangle;
      case 'high': case 'extreme': case 'critical': return XCircle;
      default: return CheckCircle;
    }
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const generateHistoricalChart = (data: number[], label: string) => {
    return data.map((value, index) => ({
      time: `${24 - index}h ago`,
      value: Number(value.toFixed(2))
    })).reverse();
  };

  if (!gameState.nasaData || !gameState.farmingConditions) {
    return (
      <div className="min-h-screen w-full relative flex items-center justify-center overflow-y-auto overflow-x-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-[#1E3A8A]/90 to-black/80 -z-10" />
        <div className="relative z-10 text-center">
          <Satellite className="w-16 h-16 text-[#6EE7B7] mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl text-[#E5E7EB] mb-4">Loading NASA Climate Data...</h2>
          <p className="text-[#E5E7EB]/70">Connecting to satellite feeds...</p>
        </div>
      </div>
    );
  }

  const { nasaData, farmingConditions } = gameState;

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1E3A8A]/90 to-black/80 -z-10" />

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <Button
          onClick={() => onNavigate('mainMenu')}
          variant="ghost"
          className="text-[#E5E7EB] hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Main Menu
        </Button>
        
        <div className="flex items-center gap-3">
          <Satellite className="w-6 h-6 text-[#6EE7B7]" />
          <h1 className="text-2xl text-[#E5E7EB]">NASA Earth Data Feed</h1>
          <div className="w-3 h-3 bg-[#6EE7B7] rounded-full animate-pulse" />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefreshData}
            variant="ghost"
            size="sm"
            disabled={isRefreshing}
            className="text-[#6EE7B7] hover:bg-[#6EE7B7]/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge className="bg-[#6EE7B7]/20 text-[#6EE7B7] border-[#6EE7B7]/40">
            {nasaData.location.name} - Last: {formatLastUpdated(nasaData.timestamp)}
          </Badge>
        </div>
      </div>

      <div className="relative z-10 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Farming Conditions Alert Bar */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <Card className={`p-4 border-2 bg-black/40 backdrop-blur-sm`} 
                  style={{ borderColor: getRiskColor(farmingConditions.overallRating) + '80' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {React.createElement(getRiskIcon(farmingConditions.overallRating), { 
                      className: "w-5 h-5",
                      style: { color: getRiskColor(farmingConditions.overallRating) }
                    })}
                    <h3 className="text-lg text-[#E5E7EB]">
                      Farming Conditions: <span style={{ color: getRiskColor(farmingConditions.overallRating) }}>
                        {farmingConditions.overallRating.toUpperCase()}
                      </span>
                    </h3>
                  </div>
                  <Badge className="bg-[#73C783]/20 text-[#73C783] border-[#73C783]/40">
                    Growth Rate: {farmingConditions.cropGrowthRate.toFixed(1)}x
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[#E5E7EB]/70">
                    Soil Health: {farmingConditions.soilHealth.toFixed(0)}%
                  </Badge>
                  <Badge variant="outline" className="text-[#E5E7EB]/70">
                    Heat Stress: {farmingConditions.heatStress.toFixed(0)}%
                  </Badge>
                </div>
              </div>
              {farmingConditions.alerts.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {farmingConditions.alerts.map((alert, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {alert}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* NASA Dataset Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Soil Moisture (SMAP) */}
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card className="p-4 bg-black/40 border-[#8B4513]/30 backdrop-blur-sm hover:border-[#8B4513]/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TreePine className="w-5 h-5 text-[#8B4513]" />
                    <h4 className="text-[#8B4513]">Soil Moisture (SMAP)</h4>
                  </div>
                  {nasaData.soilMoisture.trend === 'increasing' ? (
                    <TrendingUp className="w-4 h-4 text-[#73C783]" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-[#FF6B6B]" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Moisture Level</span>
                    <span className="text-[#8B4513] font-bold">{nasaData.soilMoisture.moisture.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Soil Temperature</span>
                    <span className="text-[#E5E7EB]">{nasaData.soilMoisture.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Depth</span>
                    <span className="text-[#E5E7EB]">{nasaData.soilMoisture.depth}</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Land Surface Temperature (MODIS) */}
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="p-4 bg-black/40 border-[#FF6B6B]/30 backdrop-blur-sm hover:border-[#FF6B6B]/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-[#FF6B6B]" />
                    <h4 className="text-[#FF6B6B]">Surface Temp (MODIS)</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    {React.createElement(getRiskIcon(nasaData.surfaceTemperature.fireRisk), { 
                      className: "w-4 h-4",
                      style: { color: getRiskColor(nasaData.surfaceTemperature.fireRisk) }
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Current Temp</span>
                    <span className="text-[#FF6B6B] font-bold">{nasaData.surfaceTemperature.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Fire Risk</span>
                    <span style={{ color: getRiskColor(nasaData.surfaceTemperature.fireRisk) }}>
                      {nasaData.surfaceTemperature.fireRisk.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Heat Stress</span>
                    <span className="text-[#E5E7EB]">{nasaData.surfaceTemperature.heatStress.toFixed(0)}%</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Precipitation (GPM) */}
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Card className="p-4 bg-black/40 border-[#4ECDC4]/30 backdrop-blur-sm hover:border-[#4ECDC4]/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-[#4ECDC4]" />
                    <h4 className="text-[#4ECDC4]">Precipitation (GPM)</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    {React.createElement(getRiskIcon(nasaData.precipitation.floodRisk), { 
                      className: "w-4 h-4",
                      style: { color: getRiskColor(nasaData.precipitation.floodRisk) }
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Current Rate</span>
                    <span className="text-[#4ECDC4] font-bold">{nasaData.precipitation.current.toFixed(1)} mm/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Flood Risk</span>
                    <span style={{ color: getRiskColor(nasaData.precipitation.floodRisk) }}>
                      {nasaData.precipitation.floodRisk.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Drought Index</span>
                    <span className="text-[#E5E7EB]">{nasaData.precipitation.droughtIndex.toFixed(0)}%</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Sea Level Rise (GRACE-FO) */}
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <Card className="p-4 bg-black/40 border-[#3B82F6]/30 backdrop-blur-sm hover:border-[#3B82F6]/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Waves className="w-5 h-5 text-[#3B82F6]" />
                    <h4 className="text-[#3B82F6]">Sea Level (GRACE-FO)</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    {React.createElement(getRiskIcon(nasaData.seaLevel.coastalRisk), { 
                      className: "w-4 h-4",
                      style: { color: getRiskColor(nasaData.seaLevel.coastalRisk) }
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Current Level</span>
                    <span className="text-[#3B82F6] font-bold">{nasaData.seaLevel.currentLevel.toFixed(2)}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Rise Rate</span>
                    <span className="text-[#E5E7EB]">{nasaData.seaLevel.riseRate.toFixed(1)} mm/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Coastal Risk</span>
                    <span style={{ color: getRiskColor(nasaData.seaLevel.coastalRisk) }}>
                      {nasaData.seaLevel.coastalRisk.toUpperCase()}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Global Temperature (NASA GISS) */}
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <Card className="p-4 bg-black/40 border-[#FFD369]/30 backdrop-blur-sm hover:border-[#FFD369]/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#FFD369]" />
                    <h4 className="text-[#FFD369]">Global Temp (GISS)</h4>
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#FF6B6B]" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Anomaly</span>
                    <span className="text-[#FFD369] font-bold">+{nasaData.globalTemperature.globalAnomaly.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">CO₂ Level</span>
                    <span className="text-[#E5E7EB]">{nasaData.globalTemperature.co2Level.toFixed(1)} ppm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">vs Pre-Industrial</span>
                    <span className="text-[#E5E7EB]">+{(nasaData.globalTemperature.globalAnomaly + 0.85).toFixed(1)}°C</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Farming Impact Summary */}
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
              <Card className="p-4 bg-black/40 border-[#73C783]/30 backdrop-blur-sm hover:border-[#73C783]/50 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-[#73C783]" />
                  <h4 className="text-[#73C783]">Farming Impact</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Growth Rate</span>
                    <span className="text-[#73C783] font-bold">{farmingConditions.cropGrowthRate.toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Water Need</span>
                    <span className="text-[#E5E7EB]">{farmingConditions.waterNeed.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/70">Shard Type</span>
                    <span className="text-[#E5E7EB]">{getShardType().toUpperCase()}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Temperature Trend Chart */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6 bg-black/40 border-[#FF6B6B]/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Thermometer className="w-5 h-5 text-[#FF6B6B]" />
                <h3 className="text-lg text-[#E5E7EB]">24-Hour Temperature Trend</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateHistoricalChart(nasaData.surfaceTemperature.dailyVariation, 'Temperature')}>
                    <CartesianGrid strokeDasharray="3,3" stroke="#ffffff20" />
                    <XAxis dataKey="time" stroke="#E5E7EB" fontSize={12} />
                    <YAxis stroke="#E5E7EB" fontSize={12} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#FF6B6B"
                      strokeWidth={2}
                      dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Precipitation Forecast */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6 bg-black/40 border-[#4ECDC4]/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Droplets className="w-5 h-5 text-[#4ECDC4]" />
                <h3 className="text-lg text-[#E5E7EB]">24-Hour Precipitation Forecast</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateHistoricalChart(nasaData.precipitation.forecast24h, 'Precipitation')}>
                    <CartesianGrid strokeDasharray="3,3" stroke="#ffffff20" />
                    <XAxis dataKey="time" stroke="#E5E7EB" fontSize={12} />
                    <YAxis stroke="#E5E7EB" fontSize={12} />
                    <Bar dataKey="value" fill="#4ECDC4" fillOpacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => onNavigate('farmingGameplay')}
              className="bg-[#6EE7B7] text-black hover:bg-[#6EE7B7]/80"
            >
              Apply Data to Farming
            </Button>
            <Button
              onClick={() => onNavigate('climateTransition')}
              variant="outline"
              className="border-[#FFD369] text-[#FFD369]"
            >
              View Climate Transitions
            </Button>
            <Button
              onClick={() => onNavigate('shardExplorer')}
              variant="outline"
              className="border-[#73C783] text-[#73C783]"
            >
              Explore Other Shards
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
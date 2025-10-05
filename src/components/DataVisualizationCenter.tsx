import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';
import { 
  Satellite, 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  Eye,
  MapPin,
  Thermometer,
  Droplets,
  Leaf,
  Calendar,
  Zap
} from 'lucide-react';

interface DataVisualizationCenterProps {
  onNavigate: (screen: string) => void;
}

export function DataVisualizationCenter({ onNavigate }: DataVisualizationCenterProps) {
  const [selectedDataset, setSelectedDataset] = useState('soilMoisture');
  const [timeRange, setTimeRange] = useState(30);
  const [selectedRegion, setSelectedRegion] = useState('midwest');
  const [showDataQuality, setShowDataQuality] = useState(false);

  // Mock NASA data with realistic patterns
  const generateRealisticData = (type: string, days: number) => {
    const data = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      let value, quality = 'good';
      
      switch (type) {
        case 'soilMoisture':
          value = 0.25 + 0.15 * Math.sin(i * 0.1) + Math.random() * 0.1;
          if (Math.random() < 0.1) quality = 'cloud_affected';
          break;
        case 'temperature':
          value = 20 + 10 * Math.sin((i - 180) * 0.017) + Math.random() * 5;
          break;
        case 'ndvi':
          value = Math.max(0, Math.min(1, 0.6 + 0.3 * Math.sin((i - 100) * 0.017) + Math.random() * 0.1));
          if (Math.random() < 0.15) quality = 'cloud_affected';
          break;
        case 'precipitation':
          value = Math.random() < 0.2 ? Math.random() * 25 : 0;
          break;
        default:
          value = Math.random() * 100;
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: parseFloat(value.toFixed(3)),
        quality,
        dayOfYear: date.getDay()
      });
    }
    return data;
  };

  const datasetInfo = {
    soilMoisture: {
      title: 'SMAP Soil Moisture',
      unit: 'm³/m³',
      description: 'Surface soil moisture from NASA SMAP satellite',
      resolution: '36 km',
      updateFrequency: '2-3 days',
      limitations: 'Surface layer only (0-5cm), affected by vegetation and surface roughness',
      bestFor: 'Regional drought monitoring, irrigation planning',
      icon: Droplets,
      color: '#3B82F6',
      thresholds: { low: 0.1, optimal: 0.25, high: 0.4 }
    },
    temperature: {
      title: 'MODIS Land Surface Temperature',
      unit: '°C',
      description: 'Day and night land surface temperature',
      resolution: '1 km',
      updateFrequency: 'Daily',
      limitations: 'Surface temperature, not air temperature; affected by clouds',
      bestFor: 'Heat stress detection, urban heat island analysis',
      icon: Thermometer,
      color: '#EF4444',
      thresholds: { low: 15, optimal: 25, high: 35 }
    },
    ndvi: {
      title: 'Landsat/MODIS NDVI',
      unit: 'Index',
      description: 'Normalized Difference Vegetation Index',
      resolution: '30m-250m',
      updateFrequency: '8-16 days',
      limitations: 'Affected by clouds, atmospheric conditions, soil background',
      bestFor: 'Crop health monitoring, yield prediction',
      icon: Leaf,
      color: '#10B981',
      thresholds: { low: 0.2, optimal: 0.6, high: 0.9 }
    },
    precipitation: {
      title: 'GPM Precipitation',
      unit: 'mm/day',
      description: 'Global Precipitation Measurement mission data',
      resolution: '10 km',
      updateFrequency: '30 minutes',
      limitations: 'May miss light rainfall, affected by snow/ice',
      bestFor: 'Rainfall monitoring, flood risk assessment',
      icon: Droplets,
      color: '#6366F1',
      thresholds: { low: 0, optimal: 5, high: 20 }
    }
  };

  const regions = {
    midwest: { name: 'Midwest Corn Belt', lat: 41.8, lon: -87.6 },
    california: { name: 'Central Valley, CA', lat: 36.7, lon: -119.8 },
    texas: { name: 'High Plains, TX', lat: 34.5, lon: -102.1 },
    southeast: { name: 'Southeast Cotton', lat: 32.1, lon: -84.2 }
  };

  const [currentData, setCurrentData] = useState(generateRealisticData(selectedDataset, timeRange));

  useEffect(() => {
    setCurrentData(generateRealisticData(selectedDataset, timeRange));
  }, [selectedDataset, timeRange]);

  const currentDatasetInfo = datasetInfo[selectedDataset];
  const qualityIssues = currentData.filter(d => d.quality !== 'good').length;

  const getValueColor = (value: number) => {
    const thresholds = currentDatasetInfo.thresholds;
    if (value < thresholds.low) return '#EF4444';
    if (value > thresholds.high) return '#F59E0B';
    return currentDatasetInfo.color;
  };

  const getInterpretation = (value: number) => {
    const thresholds = currentDatasetInfo.thresholds;
    if (selectedDataset === 'soilMoisture') {
      if (value < 0.1) return 'Critically dry - immediate irrigation needed';
      if (value < 0.2) return 'Dry conditions - monitor closely';
      if (value < 0.3) return 'Adequate moisture for most crops';
      return 'High moisture - potential waterlogging risk';
    }
    if (selectedDataset === 'ndvi') {
      if (value < 0.2) return 'Poor vegetation health or bare soil';
      if (value < 0.5) return 'Moderate vegetation growth';
      if (value < 0.8) return 'Healthy, dense vegetation';
      return 'Very dense, healthy vegetation';
    }
    return 'See dataset documentation for interpretation';
  };

  const latestValue = currentData[currentData.length - 1]?.value || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Button
          onClick={() => onNavigate('mainMenu')}
          className="mb-6 bg-[#1E3A8A]/20 text-[#6EE7B7] border border-[#1E3A8A]/40 hover:bg-[#1E3A8A]/30"
        >
          ← Back to Main Menu
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4 bg-gradient-to-r from-[#6EE7B7] to-[#73C783] bg-clip-text text-transparent">
            NASA Data Visualization Center
          </h1>
          <p className="text-[#E5E7EB] text-lg max-w-3xl mx-auto">
            Explore real-time NASA satellite data with interactive visualizations. 
            Understand data quality, limitations, and practical applications for farming decisions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-4">
            <h3 className="text-[#6EE7B7] mb-3 flex items-center gap-2">
              <Satellite className="w-4 h-4" />
              Dataset
            </h3>
            <div className="space-y-2">
              {Object.entries(datasetInfo).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDataset(key)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedDataset === key
                      ? 'bg-[#6EE7B7]/20 border-[#6EE7B7]/40 text-[#6EE7B7]'
                      : 'bg-[#0F172A]/30 border-[#374151] text-[#E5E7EB] hover:bg-[#0F172A]/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <info.icon className="w-4 h-4" />
                    <span className="text-sm">{info.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-4">
            <h3 className="text-[#6EE7B7] mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Region
            </h3>
            <div className="space-y-2">
              {Object.entries(regions).map(([key, region]) => (
                <button
                  key={key}
                  onClick={() => setSelectedRegion(key)}
                  className={`w-full text-left p-2 rounded border text-sm transition-colors ${
                    selectedRegion === key
                      ? 'bg-[#1E3A8A]/20 border-[#1E3A8A]/40 text-[#6EE7B7]'
                      : 'bg-[#0F172A]/30 border-[#374151] text-[#E5E7EB] hover:bg-[#0F172A]/50'
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-4">
            <h3 className="text-[#6EE7B7] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Time Range
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[#E5E7EB] text-sm block mb-2">
                  Days: {timeRange}
                </label>
                <Slider
                  value={[timeRange]}
                  onValueChange={(value) => setTimeRange(value[0])}
                  max={365}
                  min={7}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="text-[#94A3B8] text-xs">
                Showing last {timeRange} days of data
              </div>
            </div>
          </Card>
        </div>

        {/* Dataset Information */}
        <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${currentDatasetInfo.color}20` }}>
                  <currentDatasetInfo.icon className="w-6 h-6" style={{ color: currentDatasetInfo.color }} />
                </div>
                <div>
                  <h3 className="text-[#E5E7EB] text-lg">{currentDatasetInfo.title}</h3>
                  <p className="text-[#94A3B8] text-sm">{currentDatasetInfo.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-[#6EE7B7] text-sm mb-1">Resolution</h4>
                  <p className="text-[#E5E7EB]">{currentDatasetInfo.resolution}</p>
                </div>
                <div>
                  <h4 className="text-[#6EE7B7] text-sm mb-1">Updates</h4>
                  <p className="text-[#E5E7EB]">{currentDatasetInfo.updateFrequency}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="text-center p-6 bg-[#0F172A]/50 rounded-lg border border-[#374151]">
                <div className="text-3xl mb-2" style={{ color: getValueColor(latestValue) }}>
                  {latestValue.toFixed(3)} {currentDatasetInfo.unit}
                </div>
                <div className="text-[#94A3B8] text-sm mb-3">Latest Value</div>
                <div className="text-[#E5E7EB] text-sm">
                  {getInterpretation(latestValue)}
                </div>
              </div>
            </div>
          </div>

          {/* Data Quality Warning */}
          {qualityIssues > 0 && (
            <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h4 className="text-yellow-400">Data Quality Notice</h4>
              </div>
              <p className="text-[#E5E7EB] text-sm">
                {qualityIssues} out of {currentData.length} data points may be affected by clouds or atmospheric conditions.
                Consider data quality when making farming decisions.
              </p>
            </div>
          )}

          {/* Limitations */}
          <div className="mt-4 p-4 bg-[#0F172A]/30 rounded-lg border border-[#1E3A8A]/20">
            <h4 className="text-[#FFD369] text-sm mb-2">⚠️ Important Limitations:</h4>
            <p className="text-[#94A3B8] text-sm mb-2">{currentDatasetInfo.limitations}</p>
            <p className="text-[#6EE7B7] text-sm">
              <strong>Best for:</strong> {currentDatasetInfo.bestFor}
            </p>
          </div>
        </Card>

        {/* Visualization */}
        <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#6EE7B7] text-lg">Time Series Data</h3>
            <div className="flex items-center gap-4">
              <Badge className="bg-[#73C783]/20 text-[#73C783]">
                {regions[selectedRegion].name}
              </Badge>
              <button
                onClick={() => setShowDataQuality(!showDataQuality)}
                className={`text-sm px-3 py-1 rounded border transition-colors ${
                  showDataQuality
                    ? 'bg-[#FFD369]/20 text-[#FFD369] border-[#FFD369]/40'
                    : 'bg-[#374151] text-[#E5E7EB] border-[#4B5563] hover:bg-[#4B5563]'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Show Quality Issues
              </button>
            </div>
          </div>

          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
              <AreaChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94A3B8"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis 
                  stroke="#94A3B8"
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: currentDatasetInfo.unit, 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#94A3B8' }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#E5E7EB'
                  }}
                  formatter={(value, name) => [
                    `${value} ${currentDatasetInfo.unit}`,
                    currentDatasetInfo.title
                  ]}
                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={currentDatasetInfo.color}
                  fill={`${currentDatasetInfo.color}20`}
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return payload.quality !== 'good' && showDataQuality ? (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill="#F59E0B"
                        stroke="#FCD34D"
                        strokeWidth={2}
                      />
                    ) : null;
                  }}
                />
                {/* Threshold lines */}
                <ReferenceLine 
                  y={currentDatasetInfo.thresholds.low} 
                  stroke="#EF4444" 
                  strokeDasharray="5 5"
                  label={{ value: "Low", position: "insideTopRight", fill: "#EF4444" }}
                />
                <ReferenceLine 
                  y={currentDatasetInfo.thresholds.high} 
                  stroke="#F59E0B" 
                  strokeDasharray="5 5"
                  label={{ value: "High", position: "insideTopRight", fill: "#F59E0B" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {showDataQuality && (
            <div className="mt-4 p-3 bg-yellow-900/10 rounded border border-yellow-500/20">
              <p className="text-yellow-400 text-sm">
                🟡 Yellow dots indicate data points affected by clouds or atmospheric interference
              </p>
            </div>
          )}
        </Card>

        {/* Practical Applications */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
            <h3 className="text-[#6EE7B7] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Farming Applications
            </h3>
            {selectedDataset === 'soilMoisture' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#0F172A]/30 rounded border border-[#374151]">
                  <h4 className="text-[#E5E7EB] text-sm mb-2">Irrigation Scheduling</h4>
                  <p className="text-[#94A3B8] text-xs">
                    Use regional trends to plan irrigation timing, but verify with local soil sensors for precise application.
                  </p>
                </div>
                <div className="p-3 bg-[#0F172A]/30 rounded border border-[#374151]">
                  <h4 className="text-[#E5E7EB] text-sm mb-2">Drought Monitoring</h4>
                  <p className="text-[#94A3B8] text-xs">
                    Track regional moisture patterns to anticipate drought conditions and adjust crop management strategies.
                  </p>
                </div>
              </div>
            )}
            {selectedDataset === 'ndvi' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#0F172A]/30 rounded border border-[#374151]">
                  <h4 className="text-[#E5E7EB] text-sm mb-2">Crop Health Monitoring</h4>
                  <p className="text-[#94A3B8] text-xs">
                    Compare current NDVI values with historical averages to detect early signs of crop stress.
                  </p>
                </div>
                <div className="p-3 bg-[#0F172A]/30 rounded border border-[#374151]">
                  <h4 className="text-[#E5E7EB] text-sm mb-2">Yield Prediction</h4>
                  <p className="text-[#94A3B8] text-xs">
                    Peak NDVI values during growing season correlate with final crop yields for planning and marketing.
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
            <h3 className="text-[#FFD369] mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Decision Guidelines
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-900/20 rounded border border-green-500/30">
                <h4 className="text-green-400 text-sm mb-1">✅ When to Use This Data</h4>
                <p className="text-[#E5E7EB] text-xs">
                  {currentDatasetInfo.bestFor}
                </p>
              </div>
              <div className="p-3 bg-red-900/20 rounded border border-red-500/30">
                <h4 className="text-red-400 text-sm mb-1">❌ When NOT to Use</h4>
                <p className="text-[#E5E7EB] text-xs">
                  For field-scale decisions requiring higher spatial resolution than {currentDatasetInfo.resolution}
                </p>
              </div>
              <div className="p-3 bg-yellow-900/20 rounded border border-yellow-500/30">
                <h4 className="text-yellow-400 text-sm mb-1">⚠️ Always Consider</h4>
                <p className="text-[#E5E7EB] text-xs">
                  Local weather conditions, soil type variations, and recent field activities that may affect satellite observations
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <h3 className="text-[#6EE7B7] mb-4">Apply Your Data Analysis Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => onNavigate('guidedFarmingPractice')}
              className="bg-[#73C783]/20 text-[#73C783] border border-[#73C783]/40 hover:bg-[#73C783]/30"
            >
              <Zap className="w-4 h-4 mr-2" />
              Practice Scenarios
            </Button>
            <Button
              onClick={() => onNavigate('enhancedWorldMap')}
              className="bg-[#1E3A8A]/20 text-[#6EE7B7] border border-[#1E3A8A]/40 hover:bg-[#1E3A8A]/30"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Global Data Explorer
            </Button>
            <Button
              onClick={() => onNavigate('farmDashboard')}
              className="bg-[#FFD369]/20 text-[#FFD369] border border-[#FFD369]/40 hover:bg-[#FFD369]/30"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Farm Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
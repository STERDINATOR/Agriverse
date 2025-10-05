import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Satellite, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Download,
  MapPin,
  Calendar,
  Thermometer,
  Droplets,
  Leaf,
  CloudRain,
  Zap,
  ExternalLink,
  RefreshCw,
  Eye,
  BarChart3
} from 'lucide-react';

interface EnhancedNASADataServiceProps {
  onNavigate: (screen: string) => void;
}

interface DataPoint {
  date: string;
  value: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'no_data';
  confidence: number;
  source: string;
}

interface DatasetMetadata {
  name: string;
  description: string;
  spatialResolution: string;
  temporalResolution: string;
  dataRange: string;
  units: string;
  accuracy: string;
  limitations: string[];
  applications: string[];
  bestPractices: string[];
  icon: React.ComponentType<any>;
  color: string;
}

export function EnhancedNASADataService({ onNavigate }: EnhancedNASADataServiceProps) {
  const [selectedDataset, setSelectedDataset] = useState('smap_soil_moisture');
  const [selectedLocation, setSelectedLocation] = useState({ lat: 40.7128, lon: -74.0060, name: 'New York' });
  const [dateRange, setDateRange] = useState('30days');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [dataQuality, setDataQuality] = useState<'high' | 'medium' | 'low'>('high');

  const datasets: Record<string, DatasetMetadata> = {
    smap_soil_moisture: {
      name: 'SMAP Soil Moisture',
      description: 'Surface soil moisture from NASA Soil Moisture Active Passive mission',
      spatialResolution: '36 km',
      temporalResolution: '2-3 days',
      dataRange: '2015-present',
      units: 'm³/m³ (volumetric)',
      accuracy: '±0.04 m³/m³',
      limitations: [
        'Surface layer only (0-5cm depth)',
        'Affected by dense vegetation',
        'Lower accuracy over frozen/snow-covered ground',
        'Large pixel size limits field-scale applications'
      ],
      applications: [
        'Regional drought monitoring',
        'Irrigation planning assistance',
        'Agricultural water management',
        'Climate impact assessment'
      ],
      bestPractices: [
        'Combine with local weather data',
        'Use for trend analysis, not precise field values',
        'Verify with ground-truth measurements',
        'Consider seasonal and regional patterns'
      ],
      icon: Droplets,
      color: '#3B82F6'
    },
    modis_lst: {
      name: 'MODIS Land Surface Temperature',
      description: 'Day and night land surface temperature from Terra/Aqua satellites',
      spatialResolution: '1 km',
      temporalResolution: 'Daily',
      dataRange: '2000-present',
      units: '°C',
      accuracy: '±1°C under clear skies',
      limitations: [
        'Surface temperature, not air temperature',
        'Affected by clouds and atmospheric conditions',
        'May differ significantly from air temperature',
        'Emissivity assumptions can introduce errors'
      ],
      applications: [
        'Heat stress monitoring',
        'Urban heat island studies',
        'Evapotranspiration modeling',
        'Frost risk assessment'
      ],
      bestPractices: [
        'Use clear-sky data only',
        'Understand difference from air temperature',
        'Consider diurnal temperature patterns',
        'Validate with local temperature sensors'
      ],
      icon: Thermometer,
      color: '#EF4444'
    },
    landsat_ndvi: {
      name: 'Landsat NDVI',
      description: 'Normalized Difference Vegetation Index from Landsat satellites',
      spatialResolution: '30 m',
      temporalResolution: '16 days',
      dataRange: '1984-present',
      units: 'Index (-1 to 1)',
      accuracy: '±0.02 NDVI units',
      limitations: [
        'Affected by clouds and atmospheric conditions',
        '16-day revisit cycle may miss rapid changes',
        'Influenced by soil background in sparse vegetation',
        'Saturation in very dense vegetation'
      ],
      applications: [
        'Crop health monitoring',
        'Yield prediction modeling',
        'Vegetation phenology tracking',
        'Land cover classification'
      ],
      bestPractices: [
        'Use cloud-free images only',
        'Apply atmospheric corrections',
        'Consider seasonal vegetation cycles',
        'Combine multiple dates for trends'
      ],
      icon: Leaf,
      color: '#22C55E'
    },
    gpm_precipitation: {
      name: 'GPM Precipitation',
      description: 'Global precipitation estimates from GPM satellite constellation',
      spatialResolution: '0.1° (~10 km)',
      temporalResolution: '30 minutes',
      dataRange: '2014-present',
      units: 'mm/hr',
      accuracy: '±20% for moderate rainfall',
      limitations: [
        'May underestimate light rainfall',
        'Less accurate over snow/ice',
        'Complex terrain affects accuracy',
        'Brief temporal coverage of any location'
      ],
      applications: [
        'Rainfall monitoring and alerts',
        'Irrigation scheduling support',
        'Flood risk assessment',
        'Water balance calculations'
      ],
      bestPractices: [
        'Use accumulated rainfall over time',
        'Validate with local rain gauges',
        'Consider terrain effects on accuracy',
        'Account for seasonal bias patterns'
      ],
      icon: CloudRain,
      color: '#6366F1'
    }
  };

  // Mock real-time data simulation
  const generateRealisticData = (datasetKey: string, days: number): DataPoint[] => {
    const dataset = datasets[datasetKey];
    const data: DataPoint[] = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      let value: number;
      let quality: DataPoint['quality'] = 'good';
      let confidence = 0.85;
      
      // Generate realistic values based on dataset type
      switch (datasetKey) {
        case 'smap_soil_moisture':
          value = Math.max(0, Math.min(0.5, 0.25 + 0.1 * Math.sin(i * 0.05) + (Math.random() - 0.5) * 0.08));
          if (Math.random() < 0.15) quality = 'fair';
          if (Math.random() < 0.05) quality = 'poor';
          break;
        case 'modis_lst':
          const seasonalTemp = 15 + 10 * Math.sin((date.getMonth() - 2) * Math.PI / 6);
          value = seasonalTemp + (Math.random() - 0.5) * 8;
          if (Math.random() < 0.2) quality = 'fair'; // clouds
          break;
        case 'landsat_ndvi':
          const seasonalNDVI = 0.4 + 0.3 * Math.sin((date.getMonth() - 2) * Math.PI / 6);
          value = Math.max(0, Math.min(1, seasonalNDVI + (Math.random() - 0.5) * 0.15));
          if (Math.random() < 0.25) quality = 'fair'; // clouds/atmosphere
          if (Math.random() < 0.1) quality = 'no_data'; // missing data
          break;
        case 'gpm_precipitation':
          value = Math.random() < 0.85 ? 0 : Math.random() * 15; // Mostly no rain
          if (value > 0) confidence = 0.75; // Precipitation is harder to measure accurately
          break;
        default:
          value = Math.random() * 100;
      }
      
      // Adjust confidence based on quality
      if (quality === 'fair') confidence *= 0.7;
      if (quality === 'poor') confidence *= 0.4;
      if (quality === 'no_data') confidence = 0;
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: parseFloat(value.toFixed(3)),
        quality,
        confidence: parseFloat(confidence.toFixed(2)),
        source: dataset.name
      });
    }
    
    return data;
  };

  const [currentData, setCurrentData] = useState<DataPoint[]>([]);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
      setCurrentData(generateRealisticData(selectedDataset, days));
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 1000);
  }, [selectedDataset, dateRange, selectedLocation]);

  const currentDataset = datasets[selectedDataset];
  const qualityStats = currentData.reduce((acc, point) => {
    acc[point.quality] = (acc[point.quality] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageConfidence = currentData.length > 0 
    ? currentData.reduce((sum, point) => sum + point.confidence, 0) / currentData.length 
    : 0;

  const getQualityColor = (quality: DataPoint['quality']) => {
    switch (quality) {
      case 'excellent': return '#22C55E';
      case 'good': return '#3B82F6';
      case 'fair': return '#F59E0B';
      case 'poor': return '#EF4444';
      case 'no_data': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
      setCurrentData(generateRealisticData(selectedDataset, days));
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 800);
  };

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
            Enhanced NASA Data Service
          </h1>
          <p className="text-[#E5E7EB] text-lg max-w-3xl mx-auto">
            Professional-grade agricultural satellite data with comprehensive quality assessment, 
            limitations guidance, and practical application recommendations.
          </p>
        </div>

        {/* Status Bar */}
        <div className="bg-[#1E293B]/50 rounded-xl p-4 border border-[#1E3A8A]/30 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[#E5E7EB] text-sm">Service Active</span>
              </div>
              <div className="text-[#94A3B8] text-sm">
                Last Update: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${averageConfidence > 0.8 ? 'bg-green-900/20 text-green-400' : 
                                 averageConfidence > 0.6 ? 'bg-yellow-900/20 text-yellow-400' :
                                 'bg-red-900/20 text-red-400'}`}>
                {Math.round(averageConfidence * 100)}% Confidence
              </Badge>
              <Button
                onClick={refreshData}
                size="sm"
                className="bg-[#6EE7B7]/20 text-[#6EE7B7] border border-[#6EE7B7]/40 hover:bg-[#6EE7B7]/30"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="data-explorer" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="data-explorer">Data Explorer</TabsTrigger>
            <TabsTrigger value="quality-assessment">Quality Assessment</TabsTrigger>
            <TabsTrigger value="applications">Applications Guide</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
          </TabsList>

          {/* Data Explorer */}
          <TabsContent value="data-explorer" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Dataset Selection */}
              <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                <h3 className="text-[#6EE7B7] mb-4 flex items-center gap-2">
                  <Satellite className="w-5 h-5" />
                  Select Dataset
                </h3>
                <div className="space-y-3">
                  {Object.entries(datasets).map(([key, dataset]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedDataset(key)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedDataset === key
                          ? `bg-[${dataset.color}]/20 border-[${dataset.color}]/40`
                          : 'bg-[#0F172A]/30 border-[#374151] hover:bg-[#0F172A]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <dataset.icon className="w-5 h-5" style={{ color: dataset.color }} />
                        <span className="text-[#E5E7EB] text-sm">{dataset.name}</span>
                      </div>
                      <p className="text-[#94A3B8] text-xs">{dataset.spatialResolution} • {dataset.temporalResolution}</p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Location & Time */}
              <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                <h3 className="text-[#6EE7B7] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location & Time
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[#E5E7EB] text-sm block mb-2">Location</label>
                    <div className="bg-[#0F172A]/30 rounded border border-[#374151] p-2">
                      <p className="text-[#E5E7EB] text-sm">{selectedLocation.name}</p>
                      <p className="text-[#94A3B8] text-xs">
                        {selectedLocation.lat.toFixed(4)}°, {selectedLocation.lon.toFixed(4)}°
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[#E5E7EB] text-sm block mb-2">Time Range</label>
                    <div className="space-y-2">
                      {['7days', '30days', '90days'].map((range) => (
                        <button
                          key={range}
                          onClick={() => setDateRange(range)}
                          className={`w-full text-left p-2 rounded border text-sm transition-colors ${
                            dateRange === range
                              ? 'bg-[#1E3A8A]/20 border-[#1E3A8A]/40 text-[#6EE7B7]'
                              : 'bg-[#0F172A]/30 border-[#374151] text-[#E5E7EB] hover:bg-[#0F172A]/50'
                          }`}
                        >
                          {range === '7days' ? '7 Days' : range === '30days' ? '30 Days' : '90 Days'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Current Dataset Info */}
              <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${currentDataset.color}20` }}>
                    <currentDataset.icon className="w-6 h-6" style={{ color: currentDataset.color }} />
                  </div>
                  <div>
                    <h3 className="text-[#E5E7EB]">{currentDataset.name}</h3>
                    <p className="text-[#94A3B8] text-sm">{currentDataset.units}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Resolution:</span>
                    <span className="text-[#E5E7EB]">{currentDataset.spatialResolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Updates:</span>
                    <span className="text-[#E5E7EB]">{currentDataset.temporalResolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Accuracy:</span>
                    <span className="text-[#E5E7EB]">{currentDataset.accuracy}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Data Display */}
            {isLoading ? (
              <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-[#6EE7B7] border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-[#E5E7EB]">Loading NASA satellite data...</p>
                <p className="text-[#94A3B8] text-sm mt-2">Fetching {currentDataset.name} for {selectedLocation.name}</p>
              </Card>
            ) : (
              <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[#6EE7B7] text-lg">Data Timeline</h3>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-[#73C783]/20 text-[#73C783]">
                      {currentData.length} Data Points
                    </Badge>
                    <Button
                      onClick={() => onNavigate('dataVisualizationCenter')}
                      size="sm"
                      className="bg-[#FFD369]/20 text-[#FFD369] border border-[#FFD369]/40 hover:bg-[#FFD369]/30"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Advanced Charts
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {Object.entries(qualityStats).map(([quality, count]) => (
                    <div key={quality} className="text-center p-3 bg-[#0F172A]/30 rounded border border-[#374151]">
                      <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: getQualityColor(quality as DataPoint['quality']) }} />
                      <div className="text-[#E5E7EB] text-sm capitalize">{quality.replace('_', ' ')}</div>
                      <div className="text-[#94A3B8] text-xs">{count} points</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {currentData.slice(-10).reverse().map((point, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#0F172A]/30 rounded border border-[#374151]">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getQualityColor(point.quality) }}
                        />
                        <span className="text-[#E5E7EB] text-sm">{point.date}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[#E5E7EB]">
                          {point.value.toFixed(3)} {currentDataset.units}
                        </div>
                        <div className="text-[#94A3B8] text-xs">
                          {Math.round(point.confidence * 100)}% confidence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Quality Assessment Tab */}
          <TabsContent value="quality-assessment" className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Understanding data quality is crucial for making informed agricultural decisions. 
                Always consider quality indicators when interpreting satellite data.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                <h3 className="text-[#6EE7B7] mb-4">Quality Factors</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#0F172A]/30 rounded border border-[#374151]">
                    <h4 className="text-[#E5E7EB] text-sm mb-2">Atmospheric Conditions</h4>
                    <p className="text-[#94A3B8] text-xs">
                      Clouds, haze, and atmospheric moisture can interfere with satellite measurements, 
                      especially for optical sensors.
                    </p>
                  </div>
                  <div className="p-4 bg-[#0F172A]/30 rounded border border-[#374151]">
                    <h4 className="text-[#E5E7EB] text-sm mb-2">Sensor Limitations</h4>
                    <p className="text-[#94A3B8] text-xs">
                      Each sensor has physical limitations in terms of what it can detect and under 
                      what conditions it provides accurate data.
                    </p>
                  </div>
                  <div className="p-4 bg-[#0F172A]/30 rounded border border-[#374151]">
                    <h4 className="text-[#E5E7EB] text-sm mb-2">Processing Algorithms</h4>
                    <p className="text-[#94A3B8] text-xs">
                      Raw satellite data undergoes complex processing to produce final products, 
                      each step can introduce uncertainty.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                <h3 className="text-[#FFD369] mb-4">Quality Indicators</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded border border-green-500/30">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <h4 className="text-green-400 text-sm">Excellent/Good Quality</h4>
                      <p className="text-[#E5E7EB] text-xs">Clear skies, optimal sensor conditions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-900/20 rounded border border-yellow-500/30">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <div>
                      <h4 className="text-yellow-400 text-sm">Fair Quality</h4>
                      <p className="text-[#E5E7EB] text-xs">Some interference, use with caution</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-900/20 rounded border border-red-500/30">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <div>
                      <h4 className="text-red-400 text-sm">Poor/No Data</h4>
                      <p className="text-[#E5E7EB] text-xs">Significant interference or missing data</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Applications Guide Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                <h3 className="text-[#6EE7B7] mb-4">Agricultural Applications</h3>
                <div className="space-y-4">
                  {currentDataset.applications.map((app, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-[#0F172A]/30 rounded border border-[#374151]">
                      <Zap className="w-5 h-5 text-[#FFD369] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[#E5E7EB] text-sm">{app}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                <h3 className="text-[#FFD369] mb-4">Important Limitations</h3>
                <div className="space-y-3">
                  {currentDataset.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-yellow-900/10 rounded border border-yellow-500/20">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[#E5E7EB] text-sm">{limitation}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Best Practices Tab */}
          <TabsContent value="best-practices" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                <h3 className="text-[#73C783] mb-4">Recommended Best Practices</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentDataset.bestPractices.map((practice, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-900/10 rounded border border-green-500/20">
                      <CheckCircle className="w-5 h-5 text-[#73C783] flex-shrink-0 mt-0.5" />
                      <p className="text-[#E5E7EB] text-sm">{practice}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                <h3 className="text-[#6EE7B7] mb-4">Integration with Farm Management</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#0F172A]/30 rounded border border-[#374151]">
                    <h4 className="text-[#E5E7EB] text-sm mb-2">1. Start with Regional Overview</h4>
                    <p className="text-[#94A3B8] text-xs">
                      Use satellite data to understand regional patterns and trends that might affect your area.
                    </p>
                  </div>
                  <div className="p-4 bg-[#0F172A]/30 rounded border border-[#374151]">
                    <h4 className="text-[#E5E7EB] text-sm mb-2">2. Combine with Local Observations</h4>
                    <p className="text-[#94A3B8] text-xs">
                      Always validate satellite insights with your own field observations and local weather data.
                    </p>
                  </div>
                  <div className="p-4 bg-[#0F172A]/30 rounded border border-[#374151]">
                    <h4 className="text-[#E5E7EB] text-sm mb-2">3. Track Changes Over Time</h4>
                    <p className="text-[#94A3B8] text-xs">
                      Look for trends and patterns rather than making decisions based on single data points.
                    </p>
                  </div>
                  <div className="p-4 bg-[#0F172A]/30 rounded border border-[#374151]">
                    <h4 className="text-[#E5E7EB] text-sm mb-2">4. Understand Your Context</h4>
                    <p className="text-[#94A3B8] text-xs">
                      Consider your specific crops, soil types, and local climate when interpreting data.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="text-[#6EE7B7] mb-6">Apply Your Knowledge</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => onNavigate('guidedFarmingPractice')}
              className="bg-[#73C783]/20 text-[#73C783] border border-[#73C783]/40 hover:bg-[#73C783]/30 h-12"
            >
              <Zap className="w-4 h-4 mr-2" />
              Practice Scenarios
            </Button>
            <Button
              onClick={() => onNavigate('dataVisualizationCenter')}
              className="bg-[#FFD369]/20 text-[#FFD369] border border-[#FFD369]/40 hover:bg-[#FFD369]/30 h-12"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Advanced Visualization
            </Button>
            <Button
              onClick={() => onNavigate('nasaEducationalHub')}
              className="bg-[#1E3A8A]/20 text-[#6EE7B7] border border-[#1E3A8A]/40 hover:bg-[#1E3A8A]/30 h-12"
            >
              <Eye className="w-4 h-4 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
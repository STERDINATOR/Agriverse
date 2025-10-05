// NASA Data Service - Simulates real NASA climate datasets for AgriVerse
export interface SoilMoistureData {
  moisture: number; // 0-100%
  depth: string;
  temperature: number;
  lastUpdated: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface LandSurfaceTemperatureData {
  temperature: number; // Celsius
  fireRisk: 'low' | 'moderate' | 'high' | 'extreme';
  heatStress: number; // 0-100%
  lastUpdated: string;
  dailyVariation: number[];
}

export interface PrecipitationData {
  current: number; // mm/hour
  forecast24h: number[]; // hourly forecast
  monthly: number; // mm this month
  floodRisk: 'low' | 'moderate' | 'high' | 'extreme';
  droughtIndex: number; // 0-100%
}

export interface SeaLevelData {
  currentLevel: number; // meters above baseline
  riseRate: number; // mm/year
  coastalRisk: 'low' | 'moderate' | 'high' | 'critical';
  projectedRise: number[]; // next 10 years
}

export interface GlobalTemperatureData {
  globalAnomaly: number; // degrees above/below baseline
  trend: number[]; // last 12 months
  projection: number[]; // next 12 months
  co2Level: number; // ppm
}

export interface NASAClimateData {
  soilMoisture: SoilMoistureData;
  surfaceTemperature: LandSurfaceTemperatureData;
  precipitation: PrecipitationData;
  seaLevel: SeaLevelData;
  globalTemperature: GlobalTemperatureData;
  timestamp: string;
  location: {
    lat: number;
    lon: number;
    name: string;
  };
}

export interface FarmingConditions {
  cropGrowthRate: number; // 0.5-2.0 multiplier
  waterNeed: number; // 0-100%
  heatStress: number; // 0-100%
  soilHealth: number; // 0-100%
  overallRating: 'poor' | 'fair' | 'good' | 'excellent';
  alerts: string[];
}

class NASADataService {
  private simulateVariation(base: number, variance: number): number {
    return base + (Math.random() - 0.5) * variance;
  }

  private generateTimeSeriesData(length: number, base: number, variance: number): number[] {
    return Array.from({ length }, () => this.simulateVariation(base, variance));
  }

  private getCurrentDateTime(): string {
    return new Date().toISOString();
  }

  generateMockData(shardType: 'drought' | 'flood' | 'temperate' | 'coastal' = 'temperate'): NASAClimateData {
    // Base values vary by shard type
    const shardConfig = {
      drought: {
        moisture: 15,
        temp: 38,
        precipitation: 0.2,
        seaLevel: 0,
        fireRisk: 'extreme' as const
      },
      flood: {
        moisture: 85,
        temp: 28,
        precipitation: 12.5,
        seaLevel: 2.3,
        fireRisk: 'low' as const
      },
      coastal: {
        moisture: 45,
        temp: 24,
        precipitation: 3.2,
        seaLevel: 1.8,
        fireRisk: 'moderate' as const
      },
      temperate: {
        moisture: 55,
        temp: 22,
        precipitation: 2.1,
        seaLevel: 0.8,
        fireRisk: 'low' as const
      }
    };

    const config = shardConfig[shardType];

    return {
      soilMoisture: {
        moisture: this.simulateVariation(config.moisture, 10),
        depth: "0-30cm",
        temperature: this.simulateVariation(config.temp - 5, 8),
        lastUpdated: this.getCurrentDateTime(),
        trend: Math.random() > 0.5 ? 'increasing' : 'decreasing'
      },
      surfaceTemperature: {
        temperature: this.simulateVariation(config.temp, 5),
        fireRisk: config.fireRisk,
        heatStress: Math.max(0, (config.temp - 25) * 3),
        lastUpdated: this.getCurrentDateTime(),
        dailyVariation: this.generateTimeSeriesData(24, config.temp, 8)
      },
      precipitation: {
        current: this.simulateVariation(config.precipitation, 1),
        forecast24h: this.generateTimeSeriesData(24, config.precipitation, 2),
        monthly: this.simulateVariation(config.precipitation * 30 * 24, 50),
        floodRisk: config.precipitation > 8 ? 'high' : config.precipitation > 4 ? 'moderate' : 'low',
        droughtIndex: Math.max(0, 100 - (config.precipitation * 20 + config.moisture))
      },
      seaLevel: {
        currentLevel: this.simulateVariation(config.seaLevel, 0.1),
        riseRate: this.simulateVariation(3.2, 1),
        coastalRisk: config.seaLevel > 2 ? 'critical' : config.seaLevel > 1 ? 'high' : 'moderate',
        projectedRise: this.generateTimeSeriesData(10, config.seaLevel, 0.3)
      },
      globalTemperature: {
        globalAnomaly: this.simulateVariation(1.2, 0.3),
        trend: this.generateTimeSeriesData(12, 1.2, 0.5),
        projection: this.generateTimeSeriesData(12, 1.4, 0.4),
        co2Level: this.simulateVariation(420, 5)
      },
      timestamp: this.getCurrentDateTime(),
      location: {
        lat: this.simulateVariation(40.7128, 20),
        lon: this.simulateVariation(-74.0060, 40),
        name: `${shardType.charAt(0).toUpperCase() + shardType.slice(1)} Shard`
      }
    };
  }

  calculateFarmingConditions(data: NASAClimateData): FarmingConditions {
    const alerts: string[] = [];
    
    // Calculate crop growth rate based on multiple factors
    let growthRate = 1.0;
    
    // Soil moisture impact
    if (data.soilMoisture.moisture < 20) {
      growthRate *= 0.6;
      alerts.push("Critical soil moisture - crops need irrigation");
    } else if (data.soilMoisture.moisture > 80) {
      growthRate *= 0.8;
      alerts.push("Soil waterlogged - risk of root rot");
    } else if (data.soilMoisture.moisture >= 40 && data.soilMoisture.moisture <= 60) {
      growthRate *= 1.3; // Optimal moisture
    }

    // Temperature impact
    if (data.surfaceTemperature.temperature > 35) {
      growthRate *= 0.5;
      alerts.push("Extreme heat warning - crop stress likely");
    } else if (data.surfaceTemperature.temperature < 10) {
      growthRate *= 0.7;
      alerts.push("Cold conditions - slow growth expected");
    } else if (data.surfaceTemperature.temperature >= 18 && data.surfaceTemperature.temperature <= 28) {
      growthRate *= 1.2; // Optimal temperature
    }

    // Precipitation impact
    if (data.precipitation.current > 10) {
      alerts.push("Heavy rainfall - flooding risk");
    } else if (data.precipitation.droughtIndex > 70) {
      alerts.push("Drought conditions - water conservation needed");
    }

    // Fire risk alert
    if (data.surfaceTemperature.fireRisk === 'extreme') {
      alerts.push("Extreme fire danger - evacuate if necessary");
    }

    // Sea level impact for coastal areas
    if (data.seaLevel.coastalRisk === 'critical') {
      alerts.push("Critical sea level rise - saltwater intrusion risk");
      growthRate *= 0.6;
    }

    // Calculate water need
    const waterNeed = Math.min(100, Math.max(0, 
      100 - data.soilMoisture.moisture + (data.surfaceTemperature.temperature - 20) * 2
    ));

    // Calculate heat stress
    const heatStress = Math.max(0, Math.min(100, (data.surfaceTemperature.temperature - 25) * 4));

    // Calculate soil health
    const soilHealth = Math.min(100, Math.max(0,
      data.soilMoisture.moisture + 
      (30 - Math.abs(data.surfaceTemperature.temperature - 22)) * 2 -
      data.precipitation.droughtIndex * 0.3
    ));

    // Overall rating
    let overallRating: 'poor' | 'fair' | 'good' | 'excellent';
    const averageScore = (growthRate * 50) + (soilHealth * 0.3) + ((100 - heatStress) * 0.2);
    
    if (averageScore > 80) overallRating = 'excellent';
    else if (averageScore > 60) overallRating = 'good';
    else if (averageScore > 40) overallRating = 'fair';
    else overallRating = 'poor';

    return {
      cropGrowthRate: Math.max(0.3, Math.min(2.0, growthRate)),
      waterNeed,
      heatStress,
      soilHealth,
      overallRating,
      alerts
    };
  }

  // Simulate real-time updates
  async fetchLiveData(shardType: 'drought' | 'flood' | 'temperate' | 'coastal' = 'temperate'): Promise<{
    data: NASAClimateData;
    conditions: FarmingConditions;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const data = this.generateMockData(shardType);
    const conditions = this.calculateFarmingConditions(data);
    
    return { data, conditions };
  }

  // Get historical data for trends
  generateHistoricalData(days: number, shardType: 'drought' | 'flood' | 'temperate' | 'coastal' = 'temperate'): NASAClimateData[] {
    return Array.from({ length: days }, (_, i) => {
      const data = this.generateMockData(shardType);
      // Adjust timestamp to be in the past
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      data.timestamp = date.toISOString();
      return data;
    });
  }
}

export const nasaDataService = new NASADataService();
import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../contexts/GameContext';
import { geminiAIService } from '../services/GeminiAIService';
import { toast } from 'sonner';

export interface NASAInsight {
  id: string;
  title: string;
  message: string;
  category: 'warning' | 'opportunity' | 'info' | 'critical';
  dataSource: string;
  timestamp: Date;
  actionable: boolean;
}

export interface TerraAINotification {
  id: string;
  message: string;
  type: 'alert' | 'recommendation' | 'insight';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  dismissed: boolean;
}

export function useNASAIntegration() {
  const { gameState, refreshNASAData } = useGame();
  const [insights, setInsights] = useState<NASAInsight[]>([]);
  const [notifications, setNotifications] = useState<TerraAINotification[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate insights from NASA data
  const generateInsights = useCallback(async () => {
    if (!gameState.nasaData || !gameState.farmingConditions) return;

    const newInsights: NASAInsight[] = [];
    const { nasaData, farmingConditions } = gameState;

    // Soil moisture insights
    if (nasaData.soilMoisture.moisture < 20) {
      newInsights.push({
        id: `soil-${Date.now()}`,
        title: 'Critical Soil Moisture Detected',
        message: `SMAP satellite data shows soil moisture at ${nasaData.soilMoisture.moisture.toFixed(1)}%, well below optimal farming levels. Immediate irrigation recommended.`,
        category: 'critical',
        dataSource: 'SMAP',
        timestamp: new Date(),
        actionable: true
      });
    } else if (nasaData.soilMoisture.moisture > 80) {
      newInsights.push({
        id: `soil-wet-${Date.now()}`,
        title: 'Soil Saturation Warning',
        message: `SMAP data indicates soil moisture at ${nasaData.soilMoisture.moisture.toFixed(1)}%. Risk of root rot and poor aeration in crops.`,
        category: 'warning',
        dataSource: 'SMAP',
        timestamp: new Date(),
        actionable: true
      });
    }

    // Temperature insights
    if (nasaData.surfaceTemperature.temperature > 35) {
      newInsights.push({
        id: `temp-${Date.now()}`,
        title: 'Extreme Heat Detected',
        message: `MODIS surface temperature readings of ${nasaData.surfaceTemperature.temperature.toFixed(1)}°C indicate severe heat stress conditions. Fire risk: ${nasaData.surfaceTemperature.fireRisk}.`,
        category: 'critical',
        dataSource: 'MODIS',
        timestamp: new Date(),
        actionable: true
      });
    }

    // Precipitation insights
    if (nasaData.precipitation.current > 8) {
      newInsights.push({
        id: `precip-${Date.now()}`,
        title: 'Heavy Rainfall Alert',
        message: `GPM precipitation data shows ${nasaData.precipitation.current.toFixed(1)} mm/h rainfall. Flood risk assessment: ${nasaData.precipitation.floodRisk}.`,
        category: 'warning',
        dataSource: 'GPM',
        timestamp: new Date(),
        actionable: true
      });
    } else if (nasaData.precipitation.droughtIndex > 70) {
      newInsights.push({
        id: `drought-${Date.now()}`,
        title: 'Drought Conditions Developing',
        message: `Drought index at ${nasaData.precipitation.droughtIndex.toFixed(0)}% based on GPM precipitation analysis. Water conservation measures recommended.`,
        category: 'warning',
        dataSource: 'GPM',
        timestamp: new Date(),
        actionable: true
      });
    }

    // Sea level insights for coastal shards
    if (nasaData.seaLevel.coastalRisk === 'critical') {
      newInsights.push({
        id: `sealevel-${Date.now()}`,
        title: 'Critical Sea Level Rise Impact',
        message: `GRACE-FO data shows sea level at ${nasaData.seaLevel.currentLevel.toFixed(2)}m with ${nasaData.seaLevel.riseRate.toFixed(1)} mm/year rise rate. Saltwater intrusion risk in coastal farming areas.`,
        category: 'critical',
        dataSource: 'GRACE-FO',
        timestamp: new Date(),
        actionable: true
      });
    }

    // Global temperature insights
    if (nasaData.globalTemperature.globalAnomaly > 1.5) {
      newInsights.push({
        id: `global-${Date.now()}`,
        title: 'Significant Climate Anomaly',
        message: `NASA GISS data shows global temperature anomaly of +${nasaData.globalTemperature.globalAnomaly.toFixed(1)}°C. Long-term climate adaptation strategies needed.`,
        category: 'info',
        dataSource: 'NASA GISS',
        timestamp: new Date(),
        actionable: true
      });
    }

    // Farming opportunity insights
    if (farmingConditions.overallRating === 'excellent') {
      newInsights.push({
        id: `opportunity-${Date.now()}`,
        title: 'Optimal Farming Conditions',
        message: `Current NASA data indicates excellent farming conditions with ${farmingConditions.cropGrowthRate.toFixed(1)}x growth rate. Perfect time for high-value crop planting.`,
        category: 'opportunity',
        dataSource: 'Multi-satellite',
        timestamp: new Date(),
        actionable: true
      });
    }

    setInsights(prev => [...newInsights, ...prev.slice(0, 10)]); // Keep last 10 insights
  }, [gameState.nasaData, gameState.farmingConditions]);

  // Generate TERRA-AI notifications
  const generateNotifications = useCallback(async () => {
    if (!gameState.farmingConditions) return;

    const newNotifications: TerraAINotification[] = [];

    // Check for critical alerts
    if (gameState.farmingConditions.alerts.length > 0) {
      gameState.farmingConditions.alerts.forEach((alert, index) => {
        newNotifications.push({
          id: `alert-${Date.now()}-${index}`,
          message: `🚨 ${alert}`,
          type: 'alert',
          urgency: 'high',
          timestamp: new Date(),
          dismissed: false
        });
      });
    }

    // Growth rate recommendations
    if (gameState.farmingConditions.cropGrowthRate < 0.8) {
      newNotifications.push({
        id: `growth-${Date.now()}`,
        message: `📉 TERRA-AI recommends crop optimization - current growth rate is ${gameState.farmingConditions.cropGrowthRate.toFixed(1)}x`,
        type: 'recommendation',
        urgency: 'medium',
        timestamp: new Date(),
        dismissed: false
      });
    } else if (gameState.farmingConditions.cropGrowthRate > 1.3) {
      newNotifications.push({
        id: `growth-good-${Date.now()}`,
        message: `📈 Excellent growth conditions detected! Consider expanding operations with ${gameState.farmingConditions.cropGrowthRate.toFixed(1)}x rate`,
        type: 'insight',
        urgency: 'low',
        timestamp: new Date(),
        dismissed: false
      });
    }

    // Water management insights
    if (gameState.farmingConditions.waterNeed > 80) {
      newNotifications.push({
        id: `water-${Date.now()}`,
        message: `💧 High water demand detected (${gameState.farmingConditions.waterNeed.toFixed(0)}%). TERRA-AI suggests water-efficient irrigation`,
        type: 'recommendation',
        urgency: 'medium',
        timestamp: new Date(),
        dismissed: false
      });
    }

    setNotifications(prev => [...newNotifications, ...prev.filter(n => !n.dismissed).slice(0, 8)]);
  }, [gameState.farmingConditions]);

  // Auto-analyze NASA data changes
  useEffect(() => {
    if (gameState.nasaData && gameState.farmingConditions) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        generateInsights();
        generateNotifications();
        setIsAnalyzing(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.nasaData, gameState.farmingConditions, generateInsights, generateNotifications]);

  // Dismiss notification
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, dismissed: true } : n)
    );
  }, []);

  // Get critical alerts count
  const getCriticalAlertsCount = useCallback(() => {
    return notifications.filter(n => 
      !n.dismissed && (n.urgency === 'critical' || n.urgency === 'high')
    ).length;
  }, [notifications]);

  // Get farming recommendations based on current data
  const getFarmingRecommendations = useCallback(async () => {
    if (!gameState.nasaData || !gameState.farmingConditions) return [];

    try {
      const context = {
        nasaData: gameState.nasaData,
        farmingConditions: gameState.farmingConditions,
        currentShard: gameState.currentShardId,
        playerLevel: gameState.playerLevel,
        resources: gameState.resources,
        activeCrops: gameState.crops.length,
        recentActions: ['farming']
      };

      const advice = await geminiAIService.getQuickAdvice(context);
      return advice;
    } catch (error) {
      console.error('Failed to get farming recommendations:', error);
      return [];
    }
  }, [gameState]);

  // Manual refresh with user feedback
  const refreshAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      await refreshNASAData();
      await generateInsights();
      await generateNotifications();
      toast.success('TERRA-AI analysis updated with latest NASA data');
    } catch (error) {
      toast.error('Failed to refresh analysis');
    } finally {
      setIsAnalyzing(false);
    }
  }, [refreshNASAData, generateInsights, generateNotifications]);

  return {
    insights,
    notifications: notifications.filter(n => !n.dismissed),
    isAnalyzing,
    dismissNotification,
    getCriticalAlertsCount,
    getFarmingRecommendations,
    refreshAnalysis
  };
}
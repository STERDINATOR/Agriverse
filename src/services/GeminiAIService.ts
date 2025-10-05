// Gemini AI Service for TERRA-AI - Intelligent Farming Advisor
import { NASAClimateData, FarmingConditions } from './NASADataService';
import { ApiKeyStorage } from '../utils/apiKeyStorage';

export interface TerraAIResponse {
  message: string;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  category: 'farming' | 'climate' | 'strategy' | 'emergency';
  actionItems: {
    action: string;
    priority: 'low' | 'medium' | 'high';
    impact: string;
  }[];
  confidence: number; // 0-100%
}

export interface TerraAIContext {
  nasaData?: NASAClimateData;
  farmingConditions?: FarmingConditions;
  currentShard: string;
  playerLevel: number;
  resources: {
    seeds: number;
    water: number;
    energy: number;
    ecoPoints: number;
  };
  activeCrops: number;
  recentActions: string[];
}

class GeminiAIService {
  private baseURL: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
  // Fallback model URLs to try if primary fails
  private fallbackURLs: string[] = [
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent'
  ];
  
  // Get API key from storage
  private getApiKey(): string {
    return ApiKeyStorage.getGeminiKey();
  }
  
  // Diagnostic method to verify configuration
  getConfig() {
    const apiKey = this.getApiKey();
    return {
      model: 'gemini-1.5-flash (with fallbacks)',
      apiVersion: 'v1beta + v1 fallback',
      endpoint: this.baseURL,
      fallbackEndpoints: this.fallbackURLs.length,
      hasValidKey: apiKey.length > 0,
      timestamp: new Date().toISOString()
    };
  }

  // Mock responses for demonstration (replace with real API calls)
  private mockResponses: Record<string, TerraAIResponse> = {
    'drought_conditions': {
      message: "Critical drought conditions detected in your current shard. Soil moisture is dangerously low at 15%, and temperatures are exceeding optimal growing ranges.",
      recommendations: [
        "Switch to drought-resistant crops immediately",
        "Implement water conservation techniques",
        "Consider relocating to a more temperate shard",
        "Install emergency irrigation systems"
      ],
      urgency: 'critical',
      category: 'emergency',
      actionItems: [
        { action: "Plant Desert Wheat instead of regular crops", priority: 'high', impact: "50% better survival rate" },
        { action: "Use water-efficient irrigation", priority: 'high', impact: "Reduce water consumption by 30%" },
        { action: "Apply mulching to retain soil moisture", priority: 'medium', impact: "Improve water retention by 25%" }
      ],
      confidence: 94
    },
    'optimal_conditions': {
      message: "Excellent farming conditions detected! Current climate data shows optimal temperature, soil moisture, and precipitation levels for maximum crop growth.",
      recommendations: [
        "Plant high-yield crops to maximize this opportunity",
        "Expand your farming operations",
        "Focus on bio-enhanced crops for maximum eco-points",
        "Consider carbon-sink crops for long-term benefits"
      ],
      urgency: 'low',
      category: 'farming',
      actionItems: [
        { action: "Plant Gene Corn for high eco-point yields", priority: 'high', impact: "80% higher eco-point generation" },
        { action: "Expand to all available plots", priority: 'medium', impact: "Double your potential harvest" },
        { action: "Plant Air Trees for carbon sequestration", priority: 'low', impact: "Long-term environmental benefits" }
      ],
      confidence: 87
    },
    'flood_warning': {
      message: "Flood risk is elevated with precipitation rates at 12.5 mm/h. Your crops may be at risk of waterlogging and root rot.",
      recommendations: [
        "Switch to flood-tolerant crops",
        "Improve drainage systems",
        "Harvest mature crops immediately",
        "Prepare for potential crop losses"
      ],
      urgency: 'high',
      category: 'emergency',
      actionItems: [
        { action: "Plant Aqua Rice in low-lying areas", priority: 'high', impact: "Flood-resistant crop variety" },
        { action: "Create drainage channels", priority: 'high', impact: "Reduce flood damage by 60%" },
        { action: "Harvest crops above 80% growth", priority: 'medium', impact: "Secure current investment" }
      ],
      confidence: 91
    },
    'resource_optimization': {
      message: "Your resource allocation shows room for optimization. You have sufficient eco-points but low water reserves relative to your current farming operations.",
      recommendations: [
        "Invest in water-efficient technologies",
        "Trade eco-points for water resources",
        "Focus on drought-resistant crops",
        "Upgrade your water collection systems"
      ],
      urgency: 'medium',
      category: 'strategy',
      actionItems: [
        { action: "Upgrade to smart irrigation systems", priority: 'high', impact: "40% water efficiency improvement" },
        { action: "Trade 200 eco-points for water reserves", priority: 'medium', impact: "Immediate water security" },
        { action: "Research water recycling techniques", priority: 'low', impact: "Long-term sustainability" }
      ],
      confidence: 83
    },
    'climate_adaptation': {
      message: "Long-term climate trends show increasing temperature anomalies. Your farming strategy should adapt to these changing conditions.",
      recommendations: [
        "Diversify crop portfolio with climate-resilient varieties",
        "Invest in climate monitoring technology",
        "Develop heat-resistant farming techniques",
        "Plan for future climate scenarios"
      ],
      urgency: 'medium',
      category: 'climate',
      actionItems: [
        { action: "Research genetic crop modifications", priority: 'medium', impact: "Future-proof your farming" },
        { action: "Install climate sensors", priority: 'medium', impact: "Better environmental awareness" },
        { action: "Develop shade structures", priority: 'low', impact: "Protect crops from heat stress" }
      ],
      confidence: 89
    }
  };

  private generatePrompt(query: string, context: TerraAIContext): string {
    return `You are TERRA-AI, an advanced agricultural AI assistant specializing in climate-adaptive farming in the AgriVerse universe. 

Current Context:
- Shard: ${context.currentShard}
- Player Level: ${context.playerLevel}
- Resources: Seeds: ${context.resources.seeds}, Water: ${context.resources.water}, Energy: ${context.resources.energy}, Eco-Points: ${context.resources.ecoPoints}
- Active Crops: ${context.activeCrops}
- Recent Actions: ${context.recentActions.join(', ')}

${context.nasaData ? `NASA Climate Data:
- Soil Moisture: ${context.nasaData.soilMoisture.moisture.toFixed(1)}% (${context.nasaData.soilMoisture.trend})
- Surface Temperature: ${context.nasaData.surfaceTemperature.temperature.toFixed(1)}°C (Fire Risk: ${context.nasaData.surfaceTemperature.fireRisk})
- Precipitation: ${context.nasaData.precipitation.current.toFixed(1)} mm/h (Flood Risk: ${context.nasaData.precipitation.floodRisk})
- Sea Level: ${context.nasaData.seaLevel.currentLevel.toFixed(2)}m (Coastal Risk: ${context.nasaData.seaLevel.coastalRisk})
- Global Temperature Anomaly: +${context.nasaData.globalTemperature.globalAnomaly.toFixed(1)}°C` : ''}

${context.farmingConditions ? `Farming Conditions:
- Overall Rating: ${context.farmingConditions.overallRating}
- Crop Growth Rate: ${context.farmingConditions.cropGrowthRate.toFixed(1)}x
- Water Need: ${context.farmingConditions.waterNeed.toFixed(0)}%
- Heat Stress: ${context.farmingConditions.heatStress.toFixed(0)}%
- Soil Health: ${context.farmingConditions.soilHealth.toFixed(0)}%
- Active Alerts: ${context.farmingConditions.alerts.join(', ')}` : ''}

User Query: ${query}

Provide intelligent, actionable farming advice based on the current conditions. Focus on:
1. Immediate actions needed
2. Strategic recommendations
3. Risk mitigation
4. Optimization opportunities
5. Long-term planning

Respond in a helpful, concise manner appropriate for a farming game context.`;
  }

  private analyzeContext(context: TerraAIContext): string {
    if (!context.farmingConditions || !context.nasaData) {
      return 'resource_optimization';
    }

    const { farmingConditions, nasaData } = context;

    // Critical drought conditions
    if (nasaData.soilMoisture.moisture < 20 && nasaData.surfaceTemperature.temperature > 35) {
      return 'drought_conditions';
    }

    // Flood warning
    if (nasaData.precipitation.current > 8 || nasaData.precipitation.floodRisk === 'high') {
      return 'flood_warning';
    }

    // Optimal conditions
    if (farmingConditions.overallRating === 'excellent' && farmingConditions.cropGrowthRate > 1.2) {
      return 'optimal_conditions';
    }

    // Climate adaptation needed
    if (nasaData.globalTemperature.globalAnomaly > 1.0 || farmingConditions.heatStress > 60) {
      return 'climate_adaptation';
    }

    // Default to resource optimization
    return 'resource_optimization';
  }

  private async tryAPICall(url: string, requestBody: any): Promise<Response> {
    const apiKey = this.getApiKey();
    return fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
  }

  async askTerraAI(query: string, context: TerraAIContext): Promise<TerraAIResponse> {
    const prompt = this.generatePrompt(query, context);
    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
        candidateCount: 1
      }
    };

    // Try primary URL first, then fallbacks
    const urlsToTry = [this.baseURL, ...this.fallbackURLs];
    
    for (let i = 0; i < urlsToTry.length; i++) {
      const currentURL = urlsToTry[i];
      
      try {
        console.log(`🔄 Trying API endpoint ${i + 1}/${urlsToTry.length}: ${currentURL.split('/').slice(-1)[0]}`);
        
        const response = await this.tryAPICall(currentURL, requestBody);

        if (response.ok) {
          console.log(`✅ Success with endpoint: ${currentURL.split('/').slice(-1)[0]}`);
          
          // Update baseURL to the working one for future calls
          if (currentURL !== this.baseURL) {
            console.log(`📌 Updating primary endpoint to: ${currentURL.split('/').slice(-1)[0]}`);
            this.baseURL = currentURL;
          }
          
          const data = await response.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
          return this.parseAIResponse(responseText, query, context);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.warn(`❌ Endpoint ${i + 1} failed: ${response.status} ${response.statusText}`, {
            url: currentURL,
            error: errorData
          });
          
          // If this is the last URL, throw the error
          if (i === urlsToTry.length - 1) {
            console.error('🚫 All API endpoints failed. Last error details:', {
              status: response.status,
              statusText: response.statusText,
              url: `${currentURL}?key=${this.apiKey.substring(0, 10)}...`,
              errorData,
              configCheck: this.getConfig(),
              allEndpointsTried: urlsToTry.map(url => url.split('/').slice(-1)[0])
            });
            throw new Error(`All Gemini API endpoints failed. Last error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Network error with endpoint ${i + 1}:`, error);
        
        // If this is the last URL, throw the error
        if (i === urlsToTry.length - 1) {
          console.error('🚫 All API endpoints failed with network errors. Final error:', error);
          throw error;
        }
      }
    }

    // This should never be reached, but just in case
    console.error('🚫 Critical: All API attempts failed. Using fallback response system.');
    
    // Fallback to contextual mock response
    const contextKey = this.analyzeContext(context);
    const fallbackResponse = this.mockResponses[contextKey] || this.mockResponses['resource_optimization'];
    
    console.log('✅ Using intelligent fallback response based on context:', contextKey);
    
    return {
      ...fallbackResponse,
      message: `[Demo Mode] ${fallbackResponse.message}`,
      confidence: 85
    };
  }

  private customizeResponse(baseResponse: TerraAIResponse, query: string, context: TerraAIContext): TerraAIResponse {
    const lowerQuery = query.toLowerCase();
    
    // Customize based on query content
    if (lowerQuery.includes('water') || lowerQuery.includes('irrigation')) {
      return {
        ...baseResponse,
        message: `Regarding water management: ${baseResponse.message}`,
        recommendations: baseResponse.recommendations.filter(r => 
          r.toLowerCase().includes('water') || r.toLowerCase().includes('irrigation') || r.toLowerCase().includes('drought')
        )
      };
    }
    
    if (lowerQuery.includes('crop') || lowerQuery.includes('plant')) {
      return {
        ...baseResponse,
        message: `For crop selection: ${baseResponse.message}`,
        recommendations: baseResponse.recommendations.filter(r => 
          r.toLowerCase().includes('crop') || r.toLowerCase().includes('plant') || r.toLowerCase().includes('grow')
        )
      };
    }
    
    if (lowerQuery.includes('climate') || lowerQuery.includes('temperature') || lowerQuery.includes('weather')) {
      return {
        ...baseResponse,
        category: 'climate',
        message: `Climate analysis shows: ${baseResponse.message}`
      };
    }
    
    if (lowerQuery.includes('strategy') || lowerQuery.includes('optimize') || lowerQuery.includes('improve')) {
      return {
        ...baseResponse,
        category: 'strategy',
        message: `Strategic analysis: ${baseResponse.message}`
      };
    }
    
    return baseResponse;
  }

  private parseAIResponse(responseText: string, query: string, context: TerraAIContext): TerraAIResponse {
    // Try to extract structured data from AI response, fall back to context analysis if needed
    const contextKey = this.analyzeContext(context);
    const baseResponse = this.mockResponses[contextKey] || this.mockResponses['resource_optimization'];
    
    // Use AI response as the main message
    return {
      ...baseResponse,
      message: responseText || baseResponse.message,
      confidence: 95 // Higher confidence for real AI responses
    };
  }

  // Quick advice based on current conditions
  async getQuickAdvice(context: TerraAIContext): Promise<string[]> {
    const contextKey = this.analyzeContext(context);
    const response = this.mockResponses[contextKey];
    return response.recommendations.slice(0, 3); // Return top 3 recommendations
  }

  // Real-time alerts based on NASA data
  async getAlerts(context: TerraAIContext): Promise<{ message: string; urgency: string }[]> {
    if (!context.farmingConditions) return [];
    
    const alerts = context.farmingConditions.alerts.map(alert => ({
      message: alert,
      urgency: 'medium'
    }));
    
    // Add AI-enhanced alerts
    if (context.nasaData) {
      if (context.nasaData.surfaceTemperature.fireRisk === 'extreme') {
        alerts.push({
          message: "TERRA-AI: Extreme fire risk detected. Consider emergency evacuation protocols.",
          urgency: 'critical'
        });
      }
      
      if (context.nasaData.precipitation.droughtIndex > 80) {
        alerts.push({
          message: "TERRA-AI: Severe drought conditions predicted. Immediate water conservation required.",
          urgency: 'high'
        });
      }
    }
    
    return alerts;
  }
}

export const geminiAIService = new GeminiAIService();
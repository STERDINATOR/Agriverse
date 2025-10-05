// AI Character Generator Service
// Uses DeepSeek AI to generate character concepts and descriptions
// Integrates with image generation APIs (Stability AI, DALL-E, etc.)
import { ApiKeyStorage } from '../utils/apiKeyStorage';

export interface CharacterGenerationRequest {
  style?: 'manga' | 'anime' | 'chibi' | 'realistic-anime' | 'shounen' | 'shoujo';
  personality?: string;
  role?: 'farmer' | 'warrior' | 'mage' | 'guardian' | 'explorer';
  colorTheme?: string;
  customPrompt?: string;
}

export interface GeneratedCharacter {
  name: string;
  description: string;
  personality: string;
  appearance: {
    hairColor: string;
    hairStyle: string;
    eyeColor: string;
    outfit: string;
    accessories: string[];
  };
  stats: {
    strength: number;
    intelligence: number;
    charisma: number;
  };
  backstory: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface ImageGenerationProvider {
  name: 'stability-ai' | 'dalle' | 'midjourney' | 'replicate' | 'placeholder';
  apiKey: string;
}

class AICharacterGeneratorService {
  private deepSeekBaseURL: string = 'https://api.deepseek.com/v1/chat/completions';
  
  // Get API key from storage
  private getApiKey(): string {
    return ApiKeyStorage.getDeepSeekKey();
  }
  
  // Check if we should use demo mode
  private isDemoMode(): boolean {
    const key = this.getApiKey();
    return !key || key.length === 0 || ApiKeyStorage.isDemoMode();
  }

  // Method to enable API mode (when user provides their own key)
  setApiKey(key: string) {
    ApiKeyStorage.setDeepSeekKey(key);
  }
  
  // Image generation API configurations
  private imageProviders = {
    'stability-ai': {
      url: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      apiKeyHeader: 'Authorization',
      apiKeyPrefix: 'Bearer '
    },
    'dalle': {
      url: 'https://api.openai.com/v1/images/generations',
      apiKeyHeader: 'Authorization',
      apiKeyPrefix: 'Bearer '
    },
    'replicate': {
      url: 'https://api.replicate.com/v1/predictions',
      apiKeyHeader: 'Authorization',
      apiKeyPrefix: 'Token '
    }
  };

  private generateCharacterPrompt(request: CharacterGenerationRequest): string {
    const style = request.style || 'anime';
    const role = request.role || 'farmer';
    const personality = request.personality || 'friendly and determined';
    
    return `You are an expert anime/manga character designer for AgriVerse: The Climate Survival Shards, a farming adventure game.

Generate a unique, detailed ${style}-style character concept for a ${role} role with a ${personality} personality.

${request.customPrompt ? `Additional requirements: ${request.customPrompt}` : ''}

Provide a comprehensive character design in the following JSON format:
{
  "name": "A fitting Japanese or fantasy name",
  "personality": "Detailed personality description (2-3 sentences)",
  "appearance": {
    "hairColor": "Specific color (can be fantasy colors)",
    "hairStyle": "Detailed description",
    "eyeColor": "Specific color",
    "outfit": "Detailed outfit description suitable for farming/adventure",
    "accessories": ["accessory 1", "accessory 2", "accessory 3"]
  },
  "stats": {
    "strength": "number 1-100",
    "intelligence": "number 1-100", 
    "charisma": "number 1-100"
  },
  "backstory": "Brief compelling backstory (3-4 sentences) related to farming and climate challenges",
  "imagePrompt": "A detailed prompt for AI image generation, describing the character in ${style} art style. Include: art style (${style}), character features, outfit, pose, mood, background, lighting. Make it detailed and specific for best results. Format: 'anime character portrait, [detailed description], high quality, professional artwork'"
}

Make the character unique, visually interesting, and fitting for an eco-sci-fi farming game. Ensure the imagePrompt is highly detailed and optimized for AI image generation.

Respond ONLY with the JSON object, no additional text.`;
  }

  async generateCharacter(request: CharacterGenerationRequest): Promise<GeneratedCharacter> {
    try {
      // Use DeepSeek to generate character concept
      const characterConcept = await this.generateCharacterConcept(request);
      
      return characterConcept;
    } catch (error: any) {
      console.warn('⚠️ AI Character Generation unavailable - using demo character');
      console.log('💡 Tip: The AI API may not be properly configured. Demo characters work great too!');
      
      // Return mock character on error (seamless fallback)
      return this.getMockCharacter(request);
    }
  }

  private async generateCharacterConcept(request: CharacterGenerationRequest): Promise<GeneratedCharacter> {
    const apiKey = this.getApiKey();
    
    // If in demo mode or no API key, use demo character immediately
    if (this.isDemoMode() || !apiKey || apiKey.length === 0) {
      console.log('🎮 Character Generator running in Demo Mode');
      return this.getMockCharacter(request);
    }

    try {
      const prompt = this.generateCharacterPrompt(request);
      
      const response = await fetch(this.deepSeekBaseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are an expert anime/manga character designer for AgriVerse: The Climate Survival Shards, a farming adventure game.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.9,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        console.log('⚠️ Character Generator API unavailable, using Demo Mode');
        this.isDemoMode = true; // Switch to demo mode on API failure
        return this.getMockCharacter(request);
      }

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content || '';
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('Could not parse AI response, using demo character');
        return this.getMockCharacter(request);
      }

      const characterData = JSON.parse(jsonMatch[0]);
      
      return {
        name: characterData.name,
        description: characterData.personality,
        personality: characterData.personality,
        appearance: characterData.appearance,
        stats: {
          strength: parseInt(characterData.stats.strength) || 50,
          intelligence: parseInt(characterData.stats.intelligence) || 50,
          charisma: parseInt(characterData.stats.charisma) || 50
        },
        backstory: characterData.backstory,
        imagePrompt: characterData.imagePrompt
      };
    } catch (error) {
      console.log('⚠️ Character generation error, using Demo Mode');
      this.isDemoMode = true;
      return this.getMockCharacter(request);
    }
  }

  async generateCharacterImage(
    imagePrompt: string,
    provider: ImageGenerationProvider
  ): Promise<string> {
    // Placeholder mode
    if (provider.name === 'placeholder') {
      return this.getPlaceholderImage(imagePrompt);
    }

    // Check if API key is set
    if (!provider.apiKey || provider.apiKey === 'aba433c2238442d0ab5ca94bbbd9a761') {
      return this.getPlaceholderImage(imagePrompt);
    }

    try {
      switch (provider.name) {
        case 'stability-ai':
          return await this.generateWithStabilityAI(imagePrompt, provider.apiKey);
        case 'dalle':
          return await this.generateWithDALLE(imagePrompt, provider.apiKey);
        case 'replicate':
          return await this.generateWithReplicate(imagePrompt, provider.apiKey);
        default:
          return this.getPlaceholderImage(imagePrompt);
      }
    } catch (error) {
      console.error('Image generation error:', error);
      return this.getPlaceholderImage(imagePrompt);
    }
  }

  private async generateWithStabilityAI(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch(this.imageProviders['stability-ai'].url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [{
          text: prompt,
          weight: 1
        }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      })
    });

    if (!response.ok) {
      throw new Error(`Stability AI error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Convert base64 to blob URL or return base64
    return `data:image/png;base64,${data.artifacts[0].base64}`;
  }

  private async generateWithDALLE(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch(this.imageProviders['dalle'].url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      })
    });

    if (!response.ok) {
      throw new Error(`DALL-E error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].url;
  }

  private async generateWithReplicate(prompt: string, apiKey: string): Promise<string> {
    // Using Replicate's anime model
    const response = await fetch(this.imageProviders['replicate'].url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "your-model-version-here", // User needs to specify
        input: {
          prompt: prompt,
          num_outputs: 1,
          width: 1024,
          height: 1024
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Replicate error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Replicate returns a prediction that needs to be polled
    // For simplicity, return the get URL (user would need to implement polling)
    return data.urls.get;
  }

  private getPlaceholderImage(prompt: string): string {
    // Return a curated anime character placeholder based on prompt keywords
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('blue hair') || lowerPrompt.includes('mage')) {
      return 'https://images.unsplash.com/photo-1663035045563-24d54c1e8e28?w=1024';
    } else if (lowerPrompt.includes('red hair') || lowerPrompt.includes('warrior')) {
      return 'https://images.unsplash.com/photo-1697059172415-f1e08f9151bb?w=1024';
    } else if (lowerPrompt.includes('green') || lowerPrompt.includes('farmer')) {
      return 'https://images.unsplash.com/photo-1700996003686-327c5bf8d926?w=1024';
    } else if (lowerPrompt.includes('white hair') || lowerPrompt.includes('ice')) {
      return 'https://images.unsplash.com/photo-1663035045563-24d54c1e8e28?w=1024';
    } else {
      return 'https://images.unsplash.com/photo-1653004845649-195c2c21fec0?w=1024';
    }
  }

  private getMockCharacter(request: CharacterGenerationRequest): GeneratedCharacter {
    const style = request.style || 'anime';
    const role = request.role || 'farmer';
    
    const mockCharacters: Record<string, GeneratedCharacter> = {
      'farmer-anime': {
        name: 'Hana Mizuki',
        description: 'A cheerful and determined farmer who believes in the harmony between technology and nature. She approaches every challenge with optimism and innovative thinking.',
        personality: 'Genki and compassionate with an analytical mind',
        appearance: {
          hairColor: 'Chestnut brown with green highlights',
          hairStyle: 'Long braided ponytail with small flowers woven in',
          eyeColor: 'Emerald green',
          outfit: 'Modern farming overalls with eco-tech accessories, white shirt, gardening gloves with sensor displays',
          accessories: ['Smart greenhouse pendant', 'Seed pouch belt', 'Climate monitor bracelet']
        },
        stats: {
          strength: 65,
          intelligence: 85,
          charisma: 78
        },
        backstory: 'Hana grew up on a family farm that was devastated by climate change. Determined to restore the land, she studied agricultural technology and became a pioneer in climate-adaptive farming. Her dream is to green every shard in AgriVerse.',
        imagePrompt: 'anime character portrait, young woman with chestnut brown hair in braided ponytail with green highlights and small flowers, emerald green eyes, wearing modern farming overalls with eco-tech accessories, white shirt, gardening gloves with holographic displays, cheerful expression, holding a glowing seedling, lush green farm background with futuristic greenhouse, warm sunlight, high quality anime art style, detailed, vibrant colors, professional artwork',
        imageUrl: 'https://images.unsplash.com/photo-1700996003686-327c5bf8d926?w=1024'
      },
      'warrior-shounen': {
        name: 'Riku Stormheart',
        description: 'A brave warrior-farmer who fights climate disasters head-on. His determination is unshakeable, and he inspires others with his fearless spirit.',
        personality: 'Bold, protective, and fiercely loyal',
        appearance: {
          hairColor: 'Spiky crimson red',
          hairStyle: 'Short, wild spikes pointing upward',
          eyeColor: 'Fiery orange',
          outfit: 'Armored farming vest, combat boots, weather-resistant pants, cape made of recycled materials',
          accessories: ['Dragon-scale shoulder guard', 'Climate blade (farming tool)', 'Storm amulet']
        },
        stats: {
          strength: 92,
          intelligence: 68,
          charisma: 75
        },
        backstory: 'Riku witnessed his village destroyed by a massive drought when he was young. He trained to become strong enough to face any climate crisis, mastering both combat and sustainable farming techniques.',
        imagePrompt: 'shounen anime character portrait, teenage boy with spiky crimson red hair, fiery orange eyes, confident determined expression, wearing armored farming vest and combat gear, cape flowing, holding a glowing farming tool like a weapon, dramatic action pose, stormy sky background with lightning, dynamic composition, high quality anime art, vibrant colors, professional artwork',
        imageUrl: 'https://images.unsplash.com/photo-1653004845649-195c2c21fec0?w=1024'
      },
      'mage-shoujo': {
        name: 'Luna Stellaria',
        description: 'A mystical guardian with deep connection to nature\'s magic. She uses ancient wisdom and eco-spells to restore balance to the shards.',
        personality: 'Gentle, wise, mysterious, and nurturing',
        appearance: {
          hairColor: 'Silver-white with blue undertones',
          hairStyle: 'Long flowing hair with star ornaments',
          eyeColor: 'Deep cosmic blue',
          outfit: 'Flowing robes with nature patterns, moonstone jewelry, enchanted farming staff',
          accessories: ['Crescent moon tiara', 'Star seed pouch', 'Crystal nature compass']
        },
        stats: {
          strength: 55,
          intelligence: 95,
          charisma: 88
        },
        backstory: 'Luna was chosen by the ancient spirits of nature to become a guardian of ecological balance. She travels between shards, using her knowledge of both magic and climate science to heal damaged lands.',
        imagePrompt: 'shoujo magical anime character portrait, elegant woman with long silver-white hair and blue undertones, deep cosmic blue eyes, wearing flowing robes with intricate nature and star patterns, crescent moon tiara, holding an enchanted staff topped with glowing crystal and plants, serene mystical expression, magical aura with sparkles and nature elements, moonlit forest background, ethereal lighting, high quality shoujo anime art style, soft colors, detailed, professional artwork',
        imageUrl: 'https://images.unsplash.com/photo-1663035045563-24d54c1e8e28?w=1024'
      }
    };

    const key = `${role}-${style}`;
    return mockCharacters[key] || mockCharacters['farmer-anime'];
  }

  // Apply preset traits/outfits to a generated character
  applyPresetModifications(
    character: GeneratedCharacter,
    modifications: {
      outfit?: string;
      accessories?: string[];
      personality?: string;
      colorTheme?: string;
    }
  ): GeneratedCharacter {
    const modified = { ...character };

    if (modifications.outfit) {
      modified.appearance.outfit = modifications.outfit;
      modified.imagePrompt = this.updateImagePrompt(modified.imagePrompt, 'outfit', modifications.outfit);
    }

    if (modifications.accessories) {
      modified.appearance.accessories = modifications.accessories;
      modified.imagePrompt = this.updateImagePrompt(modified.imagePrompt, 'accessories', modifications.accessories.join(', '));
    }

    if (modifications.personality) {
      modified.personality = modifications.personality;
    }

    if (modifications.colorTheme) {
      modified.imagePrompt = this.updateImagePrompt(modified.imagePrompt, 'colors', modifications.colorTheme);
    }

    return modified;
  }

  private updateImagePrompt(prompt: string, element: string, value: string): string {
    // Smart prompt updating - preserves most of the prompt but updates specific elements
    const prompts = prompt.split(',').map(p => p.trim());
    
    switch (element) {
      case 'outfit':
        return prompts.map(p => 
          p.includes('wearing') ? `wearing ${value}` : p
        ).join(', ');
      case 'accessories':
        return `${prompt}, ${value}`;
      case 'colors':
        return `${prompt}, ${value} color scheme`;
      default:
        return prompt;
    }
  }
}

export const aiCharacterGenerator = new AICharacterGeneratorService();

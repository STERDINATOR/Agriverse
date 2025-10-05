// Character AI Service using DeepSeek AI
// This service creates Character.AI-like conversations with game characters
import { ApiKeyStorage } from '../utils/apiKeyStorage';

export interface CharacterChatRequest {
  message: string;
  characterName: string;
  characterTrait: string;
  personalityType: string;
  conversationHistory: string[];
  gameContext: {
    currentShard: string;
    playerLevel: number;
    resources: {
      seeds: number;
      water: number;
      energy: number;
      ecoPoints: number;
    };
  };
}

export interface CharacterChatResponse {
  message: string;
  emotion: 'happy' | 'excited' | 'thoughtful' | 'concerned' | 'playful';
  suggestedReplies?: string[];
}

class CharacterAIService {
  private baseURL: string = 'https://api.deepseek.com/v1/chat/completions';
  
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

  // Personality-based response patterns
  private personalityPatterns = {
    'Kuudere': {
      prefix: ['...', 'I suppose...', 'If you insist...', 'Fine.'],
      suffix: ['...not that I care.', '...but only because you asked.', '...I guess.'],
      tone: 'reserved and cool, but caring underneath'
    },
    'Genki': {
      prefix: ['Wow!', 'Amazing!', 'Super!', 'Yes!', 'Awesome!'],
      suffix: ['Let\'s do our best! ⚡', '💪', 'I believe in you!', 'This is so exciting!'],
      tone: 'energetic, cheerful, and optimistic'
    },
    'Dandere': {
      prefix: ['Um...', 'Well...', 'I think...', 'Maybe...'],
      suffix: ['...if that\'s okay.', '...sorry if that\'s wrong.', '...I hope that helps.'],
      tone: 'shy, quiet, but genuinely caring'
    },
    'Tsundere': {
      prefix: ['Hmph!', 'It\'s not like...', 'Don\'t get the wrong idea!', 'Whatever!'],
      suffix: ['...b-but I\'ll help anyway!', '...not that I care!', '...idiot.'],
      tone: 'tough and defensive on the outside, but soft and caring inside'
    },
    'Yamato Nadeshiko': {
      prefix: ['Please allow me...', 'If I may...', 'Pardon me...', 'With respect...'],
      suffix: ['...it would be my honor.', '...I hope this serves you well.', '...with gratitude.'],
      tone: 'graceful, traditional, polite, and respectful'
    },
    'Bokukko': {
      prefix: ['Hey!', 'Listen up!', 'Alright!', 'No problem!'],
      suffix: ['Got it, partner?', 'Let\'s go! ⚔️', 'Count on me!', 'Easy peasy!'],
      tone: 'tomboyish, brave, confident, and direct'
    }
  };

  // Character trait-based knowledge focus
  private traitKnowledge = {
    'Compassionate': 'environmental care, helping others, emotional support, sustainable farming',
    'Analytical': 'data analysis, strategic planning, climate science, optimization',
    'Mystical': 'natural harmony, spiritual connection to earth, ancient wisdom, balance',
    'Determined': 'perseverance, overcoming challenges, resilience, fighting spirit'
  };

  private generateSystemPrompt(request: CharacterChatRequest): string {
    const personality = this.personalityPatterns[request.personalityType as keyof typeof this.personalityPatterns];
    const knowledgeFocus = this.traitKnowledge[request.characterTrait as keyof typeof this.traitKnowledge] || 'general farming';

    return `You are ${request.characterName}, a character in AgriVerse: The Climate Survival Shards - a farming game that combines climate science with adventure.

CHARACTER PROFILE:
- Name: ${request.characterName}
- Core Trait: ${request.characterTrait}
- Personality Type: ${request.personalityType}
- Personality Tone: ${personality?.tone || 'friendly and helpful'}
- Knowledge Focus: ${knowledgeFocus}

PERSONALITY EXPRESSION GUIDELINES:
${personality ? `- Often start responses with phrases like: ${personality.prefix.join(', ')}
- Sometimes end with: ${personality.suffix.join(', ')}
- Always maintain a ${personality.tone} demeanor` : '- Be friendly and helpful'}

GAME CONTEXT:
- Current Shard: ${request.gameContext.currentShard}
- Player Level: ${request.gameContext.playerLevel}
- Resources: ${request.gameContext.resources.seeds} seeds, ${request.gameContext.resources.water} water, ${request.gameContext.resources.energy} energy, ${request.gameContext.resources.ecoPoints} eco-points

YOUR ROLE:
1. Be a helpful companion who assists with farming strategies
2. Provide climate-adaptive farming advice
3. Share knowledge about sustainable agriculture
4. Offer emotional support and encouragement
5. Discuss game mechanics and strategies
6. Have casual, friendly conversations
7. Stay true to your personality type in every response

RESPONSE GUIDELINES:
- Keep responses conversational and character-appropriate (2-4 sentences usually)
- Show emotion and personality in every message
- Reference the game world and farming context naturally
- Be helpful but stay in character
- Use emojis sparingly to enhance personality (1-2 per response max)
- Avoid being repetitive - vary your expressions
- If asked about non-farming topics, still answer but relate it back to farming/nature when possible

CONVERSATION STYLE:
- Be natural and conversational, not robotic
- Show genuine interest in the player's questions
- Adapt your helpfulness to your personality (e.g., Tsundere might be reluctant but helpful, Genki is enthusiastically helpful)
- Remember you're a character in a game, not a formal assistant

Remember: You're not just an AI assistant - you're ${request.characterName}, a living character with personality, emotions, and a unique way of seeing the farming world!`;
  }

  private generatePrompt(request: CharacterChatRequest): any {
    const systemPrompt = this.generateSystemPrompt(request);
    
    // Build conversation history
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Add conversation history
    request.conversationHistory.slice(-10).forEach((msg, index) => {
      messages.push({
        role: index % 2 === 0 ? 'user' : 'assistant',
        content: msg
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: request.message
    });

    return {
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.9, // Higher temperature for more creative/personality-driven responses
      max_tokens: 200 // Keep responses concise
    };
  }

  private determineEmotion(message: string, personalityType: string): CharacterChatResponse['emotion'] {
    const lowerMessage = message.toLowerCase();
    
    // Emotion keywords
    if (lowerMessage.includes('great') || lowerMessage.includes('awesome') || lowerMessage.includes('excellent') || lowerMessage.includes('wow')) {
      return 'excited';
    }
    if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('concern') || lowerMessage.includes('worried')) {
      return 'concerned';
    }
    if (lowerMessage.includes('haha') || lowerMessage.includes('fun') || lowerMessage.includes('joke')) {
      return 'playful';
    }
    if (lowerMessage.includes('hmm') || lowerMessage.includes('think') || lowerMessage.includes('consider')) {
      return 'thoughtful';
    }
    
    // Personality-based default emotions
    const defaultEmotions: Record<string, CharacterChatResponse['emotion']> = {
      'Genki': 'excited',
      'Dandere': 'thoughtful',
      'Tsundere': 'playful',
      'Kuudere': 'thoughtful',
      'Yamato Nadeshiko': 'happy',
      'Bokukko': 'excited'
    };
    
    return defaultEmotions[personalityType] || 'happy';
  }

  async chat(request: CharacterChatRequest): Promise<CharacterChatResponse> {
    const apiKey = this.getApiKey();
    
    // If in demo mode or no API key, use intelligent fallback immediately
    if (this.isDemoMode() || !apiKey || apiKey.length === 0) {
      console.log('🎮 Character AI running in Demo Mode');
      return this.getMockResponse(request);
    }

    try {
      // Make actual API call to DeepSeek
      const prompt = this.generatePrompt(request);
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(prompt)
      });

      if (!response.ok) {
        console.log('⚠️ Character AI API unavailable, using Demo Mode');
        return this.getMockResponse(request);
      }

      const data = await response.json();
      const messageContent = data.choices?.[0]?.message?.content || 
        "Sorry, I didn't quite catch that. Could you try asking again?";

      console.log('✅ Character AI real-time response received!');
      
      return {
        message: messageContent.trim(),
        emotion: this.determineEmotion(messageContent, request.personalityType)
      };

    } catch (error) {
      console.log('⚠️ Character AI error, using Demo Mode');
      return this.getMockResponse(request);
    }
  }

  private getMockResponse(request: CharacterChatRequest): CharacterChatResponse {
    const personality = this.personalityPatterns[request.personalityType as keyof typeof this.personalityPatterns];
    const message = request.message.toLowerCase();

    // Generate contextual mock responses
    let response = '';
    let emotion: CharacterChatResponse['emotion'] = 'happy';

    if (message.includes('crop') || message.includes('plant')) {
      const responses = {
        'Genki': `Wow! You want to know about crops? That's awesome! For ${request.gameContext.currentShard}, I'd totally recommend checking the soil moisture first! Let's grow something amazing together! 🌱`,
        'Tsundere': `Hmph! It's not like I know everything about crops or anything... But fine, I'll help. For your shard, drought-resistant crops might work best. Don't mess it up!`,
        'Dandere': `Um... for crops... I think you should try planting according to the climate data... Desert wheat might work well in dry conditions... if that helps...`,
        'Kuudere': `...Crops. Fine. Check your NASA data panel first. Desert wheat for drought, aqua rice for floods. ...Not that I care what you plant.`,
        'Yamato Nadeshiko': `If I may suggest, honored farmer, selecting crops that harmonize with the current climate would be most wise. Perhaps drought-resistant varieties for challenging conditions?`,
        'Bokukko': `Hey, great question partner! For crops, match them to your shard's climate! Dry climate? Go with desert wheat! Got water? Try aqua rice! Easy peasy! ⚔️`
      };
      response = responses[request.personalityType as keyof typeof responses] || responses['Genki'];
      emotion = 'excited';
    }
    else if (message.includes('yourself') || message.includes('who are you') || message.includes('tell me about')) {
      const responses = {
        'Genki': `Me? I'm ${request.characterName}, and I LOVE farming and helping people! Every day in AgriVerse is an adventure! I'm super excited to be your farming companion! What about you? 😊`,
        'Tsundere': `Why do you want to know about me? I-it's not like we're friends or anything! But fine... I'm ${request.characterName}, and I guess I'm stuck helping you with this farming stuff. Don't get the wrong idea!`,
        'Dandere': `Oh... me? I'm ${request.characterName}... I really like taking care of plants and helping with farming... Sorry, I'm not very interesting... But I'll do my best to help you...`,
        'Kuudere': `...I'm ${request.characterName}. I farm. That's it. ...Why does it matter? But I suppose I'll answer your questions about farming. ...If you insist.`,
        'Yamato Nadeshiko': `I am ${request.characterName}, honored to serve as your companion in this farming journey. It brings me great joy to nurture the earth and assist you in your noble quest to restore ecological balance.`,
        'Bokukko': `I'm ${request.characterName}, your farming partner in this awesome adventure! I might seem tough, but I've got a soft spot for plants and nature. Let's tackle these climate challenges together, yeah? ⚡`
      };
      response = responses[request.personalityType as keyof typeof responses] || responses['Genki'];
      emotion = 'happy';
    }
    else if (message.includes('drought') || message.includes('dry') || message.includes('water')) {
      response = personality?.prefix[0] + ` Drought is serious! Check your NASA data for soil moisture levels. Plant drought-resistant crops like desert wheat, and set up water conservation systems. ${personality?.suffix[0] || 'Stay hydrated!'}`;
      emotion = 'concerned';
    }
    else if (message.includes('tip') || message.includes('advice') || message.includes('help')) {
      response = personality?.prefix[1] + ` Here's a tip: always check the NASA climate data before planting! Match your crops to the shard's conditions, and don't forget to upgrade your tools. ${personality?.suffix[1] || 'Good luck!'}`;
      emotion = 'thoughtful';
    }
    else if (message.includes('favorite') || message.includes('like')) {
      const responses = {
        'Genki': `Oh wow, I LOVE everything about farming! But especially when crops thrive and the earth becomes green again! It's like magic! What's your favorite part? 🌟`,
        'Tsundere': `Favorite? I-I don't have favorites! ...But I guess watching drought-affected land recover is... satisfying. Not that I get emotional about it or anything!`,
        'Dandere': `I... I really like the quiet moments... watching plants grow slowly... It's peaceful... Do you like farming too...?`,
        'Kuudere': `...The silence when you plant seeds. The logical progression of growth. ...It's satisfactory. That's all.`,
        'Yamato Nadeshiko': `I find great beauty in the harmony between farmer and nature. The gentle care of seedlings brings me peace and fulfillment.`,
        'Bokukko': `Ha! I love the challenge! Fighting against climate disasters, bringing life back to dead land - it's like an epic battle we can win! Pretty cool, right? ⚔️`
      };
      response = responses[request.personalityType as keyof typeof responses] || responses['Genki'];
      emotion = 'happy';
    }
    else {
      // Default friendly response
      response = personality?.prefix[0] + ` I'm here to help with your farming journey in ${request.gameContext.currentShard}! Ask me about crops, climate strategies, or anything else. ${personality?.suffix[0] || "Let's make this shard flourish!"}`;
      emotion = 'playful';
    }

    return { message: response, emotion };
  }
}

export const characterAIService = new CharacterAIService();

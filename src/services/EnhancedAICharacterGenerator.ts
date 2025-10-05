// Enhanced AI Character Generator Service for Anime Characters
// Integrates with DeepSeek AI for sophisticated character generation
// Provides Character.AI-like experiences
import { ApiKeyStorage } from '../utils/apiKeyStorage';

export interface EnhancedCharacterRequest {
  style?: 'anime' | 'manga' | 'chibi' | 'realistic-anime' | 'shounen' | 'shoujo' | 'seinen' | 'josei';
  personalityArchetype?: 'kuudere' | 'tsundere' | 'dandere' | 'genki' | 'yamato-nadeshiko' | 'bokukko' | 'yandere' | 'himedere';
  role?: 'farmer' | 'warrior' | 'mage' | 'guardian' | 'explorer' | 'scientist' | 'merchant' | 'healer';
  element?: 'earth' | 'water' | 'fire' | 'air' | 'nature' | 'ice' | 'lightning' | 'metal';
  ageGroup?: 'teenager' | 'young-adult' | 'adult' | 'mature';
  gender?: 'male' | 'female' | 'non-binary';
  customPrompt?: string;
  detailLevel?: 'basic' | 'detailed' | 'comprehensive';
}

export interface EnhancedCharacter {
  // Basic Information
  name: string;
  japaneseName: string;
  nickname?: string;
  honorific: string; // -chan, -kun, -san, etc.
  
  // Core Identity
  personalityArchetype: string;
  personalityDescription: string;
  catchPhrase: string;
  voiceDescription: string;
  speechPattern: string;
  
  // Detailed Appearance
  appearance: {
    age: string;
    height: string;
    build: string;
    skinTone: string;
    hairColor: string;
    hairStyle: string;
    hairLength: string;
    eyeColor: string;
    eyeShape: string;
    facialFeatures: string[];
    outfit: {
      primary: string;
      accessories: string[];
      colors: string[];
      style: string;
    };
    specialFeatures: string[]; // Unique anime features
    mood: string;
    aura: string; // The character's presence/energy
  };
  
  // Comprehensive Stats
  stats: {
    farming: number;
    combat: number;
    magic: number;
    intelligence: number;
    charisma: number;
    wisdom: number;
    agility: number;
    luck: number;
  };
  
  // Deep Character Profile
  characterTraits: {
    positive: string[];
    quirks: string[];
    fears: string[];
    dreams: string[];
    hobbies: string[];
    talents: string[];
    weaknesses: string[];
  };
  
  // Background & Story
  backstory: {
    origin: string;
    motivation: string;
    pastTrauma?: string;
    relationships: string[];
    goals: string[];
    secrets?: string[];
  };
  
  // Game Integration
  gameData: {
    role: string;
    element: string;
    specialAbilities: string[];
    favoriteFood: string;
    farmingSpecialty: string;
    climatePreference: string;
    startingEquipment: string[];
  };
  
  // Relationship & Compatibility
  relationships: {
    bestWith: string[]; // Compatible archetypes
    conflictsWith: string[]; // Clashing archetypes
    mentorTypes: string[];
    studentTypes: string[];
    romanticCompatibility: string[];
  };
  
  // AI Generation Data
  imagePrompts: {
    portrait: string;
    fullBody: string;
    action: string;
    casual: string;
    farming: string;
  };
  
  conversationStyle: {
    greeting: string[];
    farewell: string[];
    encouragement: string[];
    concern: string[];
    excitement: string[];
    awkward: string[];
  };
  
  // Memory System for Conversations
  memory: {
    conversationHistory: string[];
    playerPreferences: Record<string, string>;
    emotionalState: 'happy' | 'sad' | 'excited' | 'worried' | 'calm' | 'angry' | 'shy';
    relationshipLevel: number; // 0-100
  };
}

class EnhancedAICharacterGeneratorService {
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
  
  // Comprehensive anime personality patterns
  private personalityArchetypes = {
    'kuudere': {
      traits: ['calm', 'cool', 'logical', 'secretly caring', 'intelligent'],
      speechPatterns: ['monotone delivery', 'formal language', 'occasional softness'],
      relationships: ['opens up slowly', 'deeply loyal once bonded', 'protective'],
      appearance: ['composed expression', 'neat appearance', 'subtle emotions']
    },
    'tsundere': {
      traits: ['defensive', 'proud', 'caring but denies it', 'short-tempered', 'loyal'],
      speechPatterns: ['confrontational', 'stammers when flustered', 'uses harsh words to hide feelings'],
      relationships: ['difficult to approach', 'fiercely protective', 'shows care through actions'],
      appearance: ['expressive eyes', 'flushed cheeks when embarrassed', 'defensive posture']
    },
    'dandere': {
      traits: ['shy', 'quiet', 'observant', 'gentle', 'thoughtful'],
      speechPatterns: ['soft voice', 'hesitant speech', 'meaningful few words'],
      relationships: ['hard to open up', 'deeply empathetic', 'loyal friend'],
      appearance: ['downcast eyes', 'soft expressions', 'fidgeting habits']
    },
    'genki': {
      traits: ['energetic', 'optimistic', 'cheerful', 'determined', 'inspiring'],
      speechPatterns: ['excited delivery', 'positive language', 'encouraging words'],
      relationships: ['makes friends easily', 'motivates others', 'brings out the best'],
      appearance: ['bright smile', 'animated expressions', 'dynamic poses']
    },
    'yamato-nadeshiko': {
      traits: ['graceful', 'traditional', 'wise', 'nurturing', 'strong-willed'],
      speechPatterns: ['polite formal speech', 'respectful tone', 'wise sayings'],
      relationships: ['caring mentor', 'emotional support', 'guides with wisdom'],
      appearance: ['elegant posture', 'serene expression', 'traditional elements']
    },
    'bokukko': {
      traits: ['tomboyish', 'brave', 'straightforward', 'competitive', 'loyal'],
      speechPatterns: ['casual masculine speech', 'direct communication', 'confident tone'],
      relationships: ['reliable partner', 'protective friend', 'honest companion'],
      appearance: ['confident stance', 'practical clothing', 'determined expression']
    }
  };

  private generateCharacterPrompt(request: EnhancedCharacterRequest): string {
    const archetype = request.personalityArchetype || 'genki';
    const style = request.style || 'anime';
    const role = request.role || 'farmer';
    const element = request.element || 'earth';
    
    return `You are an expert anime/manga character designer specializing in creating deep, compelling characters for AgriVerse: The Climate Survival Shards.

Create a highly detailed ${style}-style character with the following specifications:
- Personality Archetype: ${archetype}
- Role: ${role}
- Element: ${element}
- Age Group: ${request.ageGroup || 'young-adult'}
- Gender: ${request.gender || 'female'}

${request.customPrompt ? `Additional Requirements: ${request.customPrompt}` : ''}

Generate a comprehensive character profile in the following JSON format:

{
  "name": "Western-friendly name",
  "japaneseName": "Authentic Japanese name with kanji meaning",
  "nickname": "Cute nickname if applicable",
  "honorific": "Appropriate Japanese honorific (-chan, -kun, -san, etc.)",
  "personalityArchetype": "${archetype}",
  "personalityDescription": "3-4 sentences describing their personality in detail",
  "catchPhrase": "Signature phrase they often say",
  "voiceDescription": "How their voice sounds and speech style",
  "speechPattern": "Specific way they speak (formal, casual, etc.)",
  "appearance": {
    "age": "Apparent age (16-25)",
    "height": "Height description",
    "build": "Body type description",
    "skinTone": "Skin description",
    "hairColor": "Detailed hair color (can be fantasy colors)",
    "hairStyle": "Detailed hairstyle description",
    "hairLength": "Hair length",
    "eyeColor": "Detailed eye color",
    "eyeShape": "Eye shape and style",
    "facialFeatures": ["unique facial features"],
    "outfit": {
      "primary": "Main outfit description for farming/adventure",
      "accessories": ["accessory 1", "accessory 2", "accessory 3"],
      "colors": ["primary color", "accent color"],
      "style": "Overall fashion style"
    },
    "specialFeatures": ["unique anime features like animal ears, markings, etc."],
    "mood": "Default facial expression",
    "aura": "The energy they give off"
  },
  "stats": {
    "farming": "1-100",
    "combat": "1-100", 
    "magic": "1-100",
    "intelligence": "1-100",
    "charisma": "1-100",
    "wisdom": "1-100",
    "agility": "1-100",
    "luck": "1-100"
  },
  "characterTraits": {
    "positive": ["positive trait 1", "positive trait 2", "positive trait 3"],
    "quirks": ["cute quirk 1", "quirk 2"],
    "fears": ["fear or insecurity"],
    "dreams": ["dream or goal"],
    "hobbies": ["hobby 1", "hobby 2"],
    "talents": ["natural talent"],
    "weaknesses": ["character flaw or weakness"]
  },
  "backstory": {
    "origin": "Where they came from (2-3 sentences)",
    "motivation": "What drives them",
    "relationships": ["important relationship"],
    "goals": ["short-term goal", "long-term goal"],
    "secrets": ["optional hidden aspect"]
  },
  "gameData": {
    "role": "${role}",
    "element": "${element}",
    "specialAbilities": ["ability 1", "ability 2"],
    "favoriteFood": "Specific food they love",
    "farmingSpecialty": "What farming area they excel in",
    "climatePreference": "Preferred climate conditions",
    "startingEquipment": ["equipment 1", "equipment 2"]
  },
  "relationships": {
    "bestWith": ["compatible personality types"],
    "conflictsWith": ["clashing personality types"],
    "mentorTypes": ["types they could mentor"],
    "studentTypes": ["types they could learn from"],
    "romanticCompatibility": ["romantic compatibility types"]
  },
  "imagePrompts": {
    "portrait": "Detailed anime portrait prompt optimized for AI generation",
    "fullBody": "Full body character sheet prompt",
    "action": "Character in action/farming scene prompt",
    "casual": "Casual everyday scene prompt",
    "farming": "Character doing farming activities prompt"
  },
  "conversationStyle": {
    "greeting": ["greeting phrase 1", "greeting phrase 2"],
    "farewell": ["goodbye phrase 1", "goodbye phrase 2"],
    "encouragement": ["encouraging phrase 1", "encouraging phrase 2"],
    "concern": ["worried phrase 1", "worried phrase 2"],
    "excitement": ["excited phrase 1", "excited phrase 2"],
    "awkward": ["awkward moment phrase 1", "awkward phrase 2"]
  }
}

Make the character unique, compelling, and true to the ${archetype} personality archetype. Ensure all image prompts are detailed and optimized for AI art generation.

Respond ONLY with the JSON object, no additional text.`;
  }

  async generateEnhancedCharacter(request: EnhancedCharacterRequest): Promise<EnhancedCharacter> {
    try {
      // Try real API first, fall back to mock if needed
      const prompt = this.generateCharacterPrompt(request);
      const systemPrompt = 'You are an expert anime/manga character designer specializing in creating deep, compelling characters for AgriVerse: The Climate Survival Shards.';
      const response = await this.callDeepSeekAPI(prompt, systemPrompt);
      
      if (response) {
        return this.parseCharacterResponse(response, request);
      } else {
        return this.getEnhancedMockCharacter(request);
      }
    } catch (error: any) {
      console.warn('Enhanced AI Character Generation using demo mode:', error.message);
      return this.getEnhancedMockCharacter(request);
    }
  }

  private getEnhancedMockCharacter(request: EnhancedCharacterRequest): EnhancedCharacter {
    const archetype = request.personalityArchetype || 'genki';
    const style = request.style || 'anime';
    const role = request.role || 'farmer';
    const element = request.element || 'earth';

    const characters: Record<string, EnhancedCharacter> = {
      'genki-farmer-earth': {
        name: 'Hana Sunshine',
        japaneseName: '花陽 (Hana-yo) - Flower Sun',
        nickname: 'Hana-chan',
        honorific: '-chan',
        personalityArchetype: 'genki',
        personalityDescription: 'Hana is eternally optimistic and energetic, bringing light to even the darkest climate crises. She believes every seed holds unlimited potential and approaches farming with infectious enthusiasm. Her determination to heal the earth through sustainable practices inspires everyone around her.',
        catchPhrase: 'Every seed is a promise to the future! 🌱',
        voiceDescription: 'Clear, bright voice that rises with excitement',
        speechPattern: 'Enthusiastic and encouraging, often uses farming metaphors',
        
        appearance: {
          age: '19',
          height: '160cm (petite but energetic)',
          build: 'Slim but athletic from farm work',
          skinTone: 'Lightly tanned from working outdoors',
          hairColor: 'Warm honey blonde with green highlights',
          hairStyle: 'Twin braids with small wildflowers woven throughout',
          hairLength: 'Mid-back length',
          eyeColor: 'Bright emerald green that sparkles with determination',
          eyeShape: 'Large, expressive eyes that convey emotion easily',
          facialFeatures: ['Gentle freckles across nose', 'Warm smile lines', 'Small dimple on left cheek'],
          outfit: {
            primary: 'Modified farming overalls with tech displays, white shirt with rolled sleeves',
            accessories: ['Smart seed pouch with holographic display', 'Weather-resistant boots with grip sensors', 'Greenhouse pendant that glows with eco-energy'],
            colors: ['Forest green', 'Sunshine yellow', 'Earth brown'],
            style: 'Practical eco-tech with natural accents'
          },
          specialFeatures: ['Small leaf-shaped markings on her hands that glow when using earth magic', 'Hair flowers change color based on soil health'],
          mood: 'Bright, optimistic smile with determined eyes',
          aura: 'Warm and nurturing energy that makes plants grow faster'
        },

        stats: {
          farming: 95,
          combat: 45,
          magic: 80,
          intelligence: 75,
          charisma: 90,
          wisdom: 70,
          agility: 65,
          luck: 85
        },

        characterTraits: {
          positive: ['Unwavering optimism', 'Natural leader', 'Deep empathy for nature', 'Incredible work ethic'],
          quirks: ['Talks to plants and they seem to respond', 'Always has dirt under her nails', 'Collects interesting seeds'],
          fears: ['Failing to save dying farmland', 'Letting down people who depend on her'],
          dreams: ['Turning every desert into a green paradise', 'Teaching the whole world sustainable farming'],
          hobbies: ['Flower pressing', 'Seed collection', 'Weather observation', 'Cooking with fresh herbs'],
          talents: ['Can sense soil health by touch', 'Predicts weather changes', 'Makes anything grow'],
          weaknesses: ['Too trusting sometimes', 'Overworks herself', 'Takes responsibility for things beyond her control']
        },

        backstory: {
          origin: 'Grew up on a small family farm that was devastated by climate change when she was 12. Her grandmother taught her ancient farming wisdom before passing away, leaving Hana determined to combine old knowledge with new technology.',
          motivation: 'To prove that sustainable farming can heal the world and prevent climate disasters',
          relationships: ['Deeply respected her grandmother', 'Has a younger brother she wants to protect'],
          goals: ['Restore her family\'s destroyed farmland', 'Develop climate-resistant crop varieties', 'Create a network of eco-farmers across all shards'],
          secrets: ['Can communicate with plant spirits', 'Carries her grandmother\'s seed collection as her most precious possession']
        },

        gameData: {
          role: 'farmer',
          element: 'earth',
          specialAbilities: ['Green Thumb: 50% faster crop growth', 'Nature\'s Voice: Can sense plant needs', 'Earth Harmony: Improves soil quality over time'],
          favoriteFood: 'Fresh vegetable soup made from her own garden',
          farmingSpecialty: 'Soil restoration and climate-adaptive crops',
          climatePreference: 'Temperate with good rainfall',
          startingEquipment: ['Grandmother\'s enchanted trowel', 'Multi-spectrum soil analyzer', 'Climate-adaptive seed collection']
        },

        relationships: {
          bestWith: ['Bokukko (mutual respect)', 'Yamato Nadeshiko (shared wisdom)', 'Dandere (gentle support)'],
          conflictsWith: ['Kuudere (too logical)', 'Tsundere (clashing energy)'],
          mentorTypes: ['Shy beginners', 'Discouraged farmers', 'Young dreamers'],
          studentTypes: ['Wise elders', 'Technical specialists', 'Environmental scientists'],
          romanticCompatibility: ['Bokukko', 'Dandere', 'Gentle Kuudere']
        },

        imagePrompts: {
          portrait: 'anime character portrait, young woman with honey blonde hair in twin braids with green highlights and small wildflowers, bright emerald green eyes, warm smile with small freckles, wearing farming overalls with tech displays over white shirt, greenhouse pendant glowing softly, leaf-shaped markings on hands, warm sunlight, lush farm background, high quality anime art style, detailed, vibrant colors, professional artwork',
          fullBody: 'anime character full body, energetic pose with one hand on hip and other holding glowing seedling, honey blonde twin braids flowing, farming overalls and boots, tech accessories, surrounded by thriving plants and vegetables, character sheet style, multiple angle views, detailed, anime art style',
          action: 'anime character in action, planting seeds with magical earth energy flowing from hands, dynamic farming scene, crops growing rapidly around her, determined expression, dirt and sweat showing hard work, epic farming battle against drought, detailed anime scene',
          casual: 'anime character in casual scene, sitting under tree reading farming journal, peaceful expression, flowers in hair, simple clothes, quiet farm setting, slice of life anime style',
          farming: 'anime character doing farming work, using advanced farming tools, checking soil with tech device, multiple crops in background, professional farmer at work, detailed farming equipment, realistic farming scene with anime character'
        },

        conversationStyle: {
          greeting: ['Good morning! Ready to make the earth green today?', 'Hey there, fellow farmer! What seeds shall we plant?'],
          farewell: ['Keep growing strong!', 'May your crops flourish until we meet again!'],
          encouragement: ['You\'ve got this! Every farmer starts with a single seed!', 'Don\'t give up! The earth believes in you!'],
          concern: ['Oh no! Is everything okay with your crops?', 'Something seems wrong... let me help you figure it out!'],
          excitement: ['This is amazing! Look how much everything has grown!', 'Wow! You\'re becoming such an incredible farmer!'],
          awkward: ['Um... did I say something about plants again?', 'Sorry, I get really excited about soil composition...']
        },

        memory: {
          conversationHistory: [],
          playerPreferences: {},
          emotionalState: 'happy',
          relationshipLevel: 50
        }
      },

      'tsundere-warrior-fire': {
        name: 'Akira Flameheart',
        japaneseName: '明火 (Akira-ka) - Bright Fire',
        nickname: 'Aki',
        honorific: '-kun',
        personalityArchetype: 'tsundere',
        personalityDescription: 'Akira is fiercely independent and quick to anger, but beneath his tough exterior lies a deeply caring heart. He desperately wants to protect others but struggles to express his feelings directly. His pride often gets in the way of asking for help or admitting when he cares.',
        catchPhrase: 'I-It\'s not like I\'m doing this for you or anything!',
        voiceDescription: 'Strong, slightly rough voice that cracks when embarrassed',
        speechPattern: 'Defensive and confrontational, but softens when truly concerned',

        appearance: {
          age: '20',
          height: '175cm (tall and imposing)',
          build: 'Lean but muscular from combat training',
          skinTone: 'Lightly tanned with some scars from battles',
          hairColor: 'Spiky crimson red with orange tips',
          hairStyle: 'Wild, untamed spikes that seem to have a mind of their own',
          hairLength: 'Short to medium, very spiky',
          eyeColor: 'Fierce golden-orange like flames',
          eyeShape: 'Sharp, narrow eyes that convey intensity',
          facialFeatures: ['Strong jawline', 'Small scar over left eyebrow', 'Slight frown lines from scowling'],
          outfit: {
            primary: 'Combat-ready farming gear with armor plating, flame-resistant materials',
            accessories: ['Shoulder guard with dragon scales', 'Combat gloves with grip enhancement', 'Climate blade that ignites when needed'],
            colors: ['Deep red', 'Orange accents', 'Black trim'],
            style: 'Battle-ready farmer with practical protection'
          },
          specialFeatures: ['Eyes glow brighter when angry or protective', 'Small flame markings on arms that heat up with emotion'],
          mood: 'Slight scowl with determined, guarded expression',
          aura: 'Intense, protective energy with underlying warmth'
        },

        stats: {
          farming: 70,
          combat: 95,
          magic: 85,
          intelligence: 80,
          charisma: 60,
          wisdom: 65,
          agility: 90,
          luck: 55
        },

        characterTraits: {
          positive: ['Fiercely loyal', 'Incredibly brave', 'Strong sense of justice', 'Protective of others'],
          quirks: ['Blushes furiously when complimented', 'Accidentally destroys things when flustered', 'Secretly loves cute things'],
          fears: ['Being seen as weak', 'Losing people he cares about', 'Not being strong enough to protect others'],
          dreams: ['Becoming strong enough to protect everyone', 'Mastering both combat and farming'],
          hobbies: ['Weapon maintenance', 'Training at dawn', 'Reading combat manuals (secretly reads farming journals)'],
          talents: ['Exceptional reflexes', 'Natural leadership in crisis', 'Intuitive understanding of fire magic'],
          weaknesses: ['Terrible at expressing feelings', 'Stubborn pride', 'Tends to overwork himself']
        },

        backstory: {
          origin: 'Lost his village to a devastating wildfire caused by extreme climate change. Trained relentlessly to become strong enough to fight climate disasters, but learned farming is equally important for prevention.',
          motivation: 'To prevent what happened to his village from happening to others',
          relationships: ['Lost his mentor in the fire', 'Has a distant relationship with surviving villagers'],
          goals: ['Master fire-resistant farming techniques', 'Become strong enough to stop climate disasters', 'Build a new village that can survive anything'],
          secrets: ['Deeply traumatized by the fire', 'Keeps a pressed flower from his destroyed village', 'Afraid of getting close to people']
        },

        gameData: {
          role: 'warrior',
          element: 'fire',
          specialAbilities: ['Flame Guard: Protects crops from heat damage', 'Battle Fury: Increased combat effectiveness', 'Fire Cultivation: Can clear land quickly'],
          favoriteFood: 'Spicy curry that reminds him of home',
          farmingSpecialty: 'Fire-resistant crops and rapid land clearing',
          climatePreference: 'Hot, dry climates where others struggle',
          startingEquipment: ['Flame-enhanced farming tools', 'Fire-resistant armor', 'Emergency beacon for climate alerts']
        },

        relationships: {
          bestWith: ['Dandere (gentle patience)', 'Yamato Nadeshiko (maternal guidance)', 'Understanding Genki'],
          conflictsWith: ['Aggressive Bokukko', 'Cold Kuudere', 'Other Tsundere (personality clash)'],
          mentorTypes: ['Patient beginners', 'People who need protection', 'Fellow trauma survivors'],
          studentTypes: ['Calm mentors', 'Patient teachers', 'Wise elders'],
          romanticCompatibility: ['Patient Dandere', 'Understanding Genki', 'Mature Yamato Nadeshiko']
        },

        imagePrompts: {
          portrait: 'anime character portrait, young man with spiky crimson red hair and orange tips, fierce golden-orange eyes, slight scowl but caring underneath, wearing combat farming gear with armor plating, flame markings on arms, small scar over eyebrow, intense but protective expression, fire elements in background, high quality anime art style, detailed, dramatic lighting',
          fullBody: 'anime character full body, defensive stance with arms crossed, spiky red hair, combat farming outfit, flame-resistant gear, looking away with slight blush, character sheet style, multiple angles, tsundere personality visible in pose',
          action: 'anime character in battle action, fighting climate disaster with farming tools and fire magic, determined expression, protecting crops and people, epic battle scene, flames and determination',
          casual: 'anime character in awkward casual moment, trying to help with farming but looking embarrassed, slight blush, domestic farming scene, slice of life anime style',
          farming: 'anime character doing farming work reluctantly but efficiently, using fire abilities to help crops, trying to look like he doesn\'t care but clearly invested in success'
        },

        conversationStyle: {
          greeting: ['What do you want? I\'m busy here!', 'Oh... it\'s you. I guess that\'s... fine.'],
          farewell: ['Don\'t do anything stupid while I\'m gone!', 'I-I\'ll see you later... not that I care or anything!'],
          encouragement: ['You better not give up! I didn\'t train you to be weak!', 'Hmph! You\'re not completely hopeless, I guess...'],
          concern: ['Are you hurt?! I mean... you better not slow me down!', 'What happened? Tell me who did this!'],
          excitement: ['That was... actually pretty impressive. Don\'t let it go to your head!', 'Fine! Maybe you\'re not totally useless!'],
          awkward: ['I-I wasn\'t worried about you!', 'That\'s not what I meant to say...']
        },

        memory: {
          conversationHistory: [],
          playerPreferences: {},
          emotionalState: 'calm',
          relationshipLevel: 30
        }
      }
    };

    const key = `${archetype}-${role}-${element}`;
    return characters[key] || characters['genki-farmer-earth'];
  }

  // Enhanced conversation system with memory
  async generateContextualResponse(
    character: EnhancedCharacter,
    userMessage: string,
    gameContext: any
  ): Promise<{
    message: string;
    emotion: string;
    characterGrowth?: string;
    memoryUpdate?: Record<string, any>;
  }> {
    // Update character memory based on conversation
    character.memory.conversationHistory.push(userMessage);
    
    // Keep only last 10 messages for context
    if (character.memory.conversationHistory.length > 10) {
      character.memory.conversationHistory = character.memory.conversationHistory.slice(-10);
    }

    // Analyze message sentiment and content
    const messageAnalysis = this.analyzeMessage(userMessage);
    
    try {
      // Try to get AI response first
      const aiResponse = await this.getAIContextualResponse(character, userMessage, gameContext, messageAnalysis);
      
      if (aiResponse) {
        // Update relationship level based on interaction
        const relationshipChange = this.calculateRelationshipChange(messageAnalysis, character);
        character.memory.relationshipLevel = Math.max(0, Math.min(100, 
          character.memory.relationshipLevel + relationshipChange
        ));

        return {
          message: aiResponse,
          emotion: messageAnalysis.emotion,
          characterGrowth: character.memory.relationshipLevel > 80 ? 'Character is becoming more open with you!' : undefined,
          memoryUpdate: {
            relationshipLevel: character.memory.relationshipLevel,
            emotionalState: messageAnalysis.emotion,
            playerPreferences: this.updatePlayerPreferences(character, userMessage)
          }
        };
      }
    } catch (error) {
      console.warn('AI response failed, using archetype response');
    }
    
    // Fall back to archetype-based response
    const response = this.generateArchetypeResponse(
      character,
      userMessage,
      messageAnalysis,
      gameContext
    );

    // Update relationship level based on interaction
    const relationshipChange = this.calculateRelationshipChange(messageAnalysis, character);
    character.memory.relationshipLevel = Math.max(0, Math.min(100, 
      character.memory.relationshipLevel + relationshipChange
    ));

    return {
      message: response.message,
      emotion: response.emotion,
      characterGrowth: response.characterGrowth,
      memoryUpdate: {
        relationshipLevel: character.memory.relationshipLevel,
        emotionalState: response.emotion,
        playerPreferences: this.updatePlayerPreferences(character, userMessage)
      }
    };
  }

  private async getAIContextualResponse(
    character: EnhancedCharacter,
    userMessage: string,
    gameContext: any,
    messageAnalysis: any
  ): Promise<string | null> {
    try {
      const prompt = this.generateConversationPrompt(character, userMessage, gameContext);
      const response = await this.callDeepSeekAPI(prompt);
      
      if (response && response.trim()) {
        return response.trim();
      }
      
      return null;
    } catch (error) {
      console.error('AI contextual response failed:', error);
      return null;
    }
  }

  private generateConversationPrompt(character: EnhancedCharacter, userMessage: string, gameContext: any): string {
    const archetype = this.personalityArchetypes[character.personalityArchetype as keyof typeof this.personalityArchetypes];
    
    return `You are ${character.name}, a ${character.personalityArchetype} personality type character in AgriVerse farming game.

CHARACTER PROFILE:
- Name: ${character.name} (${character.japaneseName})
- Personality: ${character.personalityArchetype} - ${character.personalityDescription}
- Catchphrase: "${character.catchPhrase}"
- Speech Pattern: ${character.speechPattern}
- Current Relationship Level: ${character.memory.relationshipLevel}/100

PERSONALITY TRAITS:
- Tone: ${archetype?.tone || 'friendly'}
- Positive traits: ${character.characterTraits.positive.join(', ')}
- Quirks: ${character.characterTraits.quirks.join(', ')}

CONVERSATION CONTEXT:
- Recent conversations: ${character.memory.conversationHistory.slice(-3).join(' | ')}
- Player preferences: ${Object.entries(character.memory.playerPreferences).map(([k,v]) => `${k}: ${v}`).join(', ') || 'none learned yet'}
- Game context: ${gameContext.currentShard || 'Unknown Shard'}, Level ${gameContext.playerLevel || 1}

RESPONSE GUIDELINES:
1. Stay true to ${character.personalityArchetype} personality type
2. Use appropriate speech patterns and tone
3. Reference past conversations naturally if relevant
4. Keep responses conversational (2-3 sentences max)
5. Show personality growth based on relationship level (${character.memory.relationshipLevel}/100)
6. Include farming/climate context when appropriate

Player says: "${userMessage}"

Respond as ${character.name} would, staying completely in character:`;
  }

  private analyzeMessage(message: string): {
    sentiment: 'positive' | 'negative' | 'neutral';
    topics: string[];
    emotion: string;
    isQuestion: boolean;
  } {
    const lowerMessage = message.toLowerCase();
    
    // Simple sentiment analysis
    const positiveWords = ['good', 'great', 'amazing', 'love', 'like', 'wonderful', 'awesome'];
    const negativeWords = ['bad', 'hate', 'awful', 'terrible', 'horrible', 'sad', 'angry'];
    
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';
    else sentiment = 'neutral';

    // Topic extraction
    const topics: string[] = [];
    if (lowerMessage.includes('crop') || lowerMessage.includes('plant')) topics.push('farming');
    if (lowerMessage.includes('weather') || lowerMessage.includes('climate')) topics.push('weather');
    if (lowerMessage.includes('yourself') || lowerMessage.includes('you')) topics.push('personal');
    
    return {
      sentiment,
      topics,
      emotion: sentiment === 'positive' ? 'happy' : sentiment === 'negative' ? 'concerned' : 'thoughtful',
      isQuestion: lowerMessage.includes('?') || lowerMessage.startsWith('what') || lowerMessage.startsWith('how')
    };
  }

  private generateArchetypeResponse(
    character: EnhancedCharacter,
    message: string,
    analysis: any,
    gameContext: any
  ): { message: string; emotion: string; characterGrowth?: string } {
    const archetype = character.personalityArchetype;
    const relationshipLevel = character.memory.relationshipLevel;
    
    // Base response templates for each archetype
    const archetypeResponses = {
      'genki': {
        positive: character.conversationStyle.excitement,
        negative: character.conversationStyle.concern,
        neutral: character.conversationStyle.encouragement
      },
      'tsundere': {
        positive: ['That\'s... not terrible, I guess!', 'Don\'t get cocky just because I said that!'],
        negative: ['What happened?! I mean... it\'s not like I care!', 'You better not give up on me!'],
        neutral: ['It\'s not like I was waiting for you to talk to me...', 'What do you want now?']
      },
      'dandere': {
        positive: ['That makes me really happy...', 'You\'re so kind... thank you...'],
        negative: ['Oh no... is everything okay...?', 'I\'m worried about you...'],
        neutral: ['Um... how are you doing today...?', 'I hope I can help somehow...']
      }
      // Add more archetypes...
    };

    const responses = archetypeResponses[archetype as keyof typeof archetypeResponses] || archetypeResponses['genki'];
    const responseArray = responses[analysis.sentiment as keyof typeof responses] || responses.neutral;
    const baseResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

    // Modify response based on relationship level
    let modifiedResponse = baseResponse;
    if (relationshipLevel > 70 && archetype === 'tsundere') {
      modifiedResponse = baseResponse.replace('not like', 'maybe'); // Softer tsundere
    }

    return {
      message: modifiedResponse,
      emotion: analysis.emotion,
      characterGrowth: relationshipLevel > 80 ? 'Character is becoming more open with you!' : undefined
    };
  }

  private calculateRelationshipChange(analysis: any, character: EnhancedCharacter): number {
    let change = 0;
    
    // Positive interactions increase relationship
    if (analysis.sentiment === 'positive') change += 2;
    if (analysis.sentiment === 'negative') change -= 1;
    
    // Personal questions increase relationship for some archetypes
    if (analysis.topics.includes('personal')) {
      if (['dandere', 'kuudere'].includes(character.personalityArchetype)) change += 1;
    }
    
    return change;
  }

  private updatePlayerPreferences(character: EnhancedCharacter, message: string): Record<string, string> {
    const preferences = { ...character.memory.playerPreferences };
    
    // Extract preferences from conversation
    if (message.toLowerCase().includes('love') || message.toLowerCase().includes('like')) {
      const words = message.toLowerCase().split(' ');
      const loveIndex = words.findIndex(word => word === 'love' || word === 'like');
      if (loveIndex >= 0 && loveIndex < words.length - 1) {
        preferences[words[loveIndex + 1]] = 'likes';
      }
    }
    
    return preferences;
  }

  private async callDeepSeekAPI(prompt: string, systemPrompt?: string): Promise<string | null> {
    const apiKey = this.getApiKey();
    
    try {
      const response = await fetch(this.deepSeekBaseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: systemPrompt ? [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ] : [
            { role: 'user', content: prompt }
          ],
          temperature: 0.9,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('DeepSeek API error:', response.status, response.statusText, errorText);
        return null;
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (error) {
      console.error('DeepSeek API call failed:', error);
      return null;
    }
  }

  private parseCharacterResponse(responseText: string, request: EnhancedCharacterRequest): EnhancedCharacter {
    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const characterData = JSON.parse(jsonMatch[0]);
      
      // Convert API response to EnhancedCharacter format
      return {
        name: characterData.name || 'Generated Character',
        japaneseName: characterData.japaneseName || '生成キャラ',
        nickname: characterData.nickname,
        honorific: characterData.honorific || '-chan',
        personalityArchetype: characterData.personalityArchetype || request.personalityArchetype || 'genki',
        personalityDescription: characterData.personalityDescription || 'A unique character with their own personality.',
        catchPhrase: characterData.catchPhrase || 'Let\'s do our best!',
        voiceDescription: characterData.voiceDescription || 'Friendly and warm voice',
        speechPattern: characterData.speechPattern || 'Casual and encouraging',
        
        appearance: {
          ...characterData.appearance,
          specialFeatures: characterData.appearance?.specialFeatures || [],
          outfit: {
            primary: characterData.appearance?.outfit?.primary || 'Casual farming outfit',
            accessories: characterData.appearance?.outfit?.accessories || [],
            colors: characterData.appearance?.outfit?.colors || ['green', 'brown'],
            style: characterData.appearance?.outfit?.style || 'practical'
          }
        },
        
        stats: {
          farming: characterData.stats?.farming || 70,
          combat: characterData.stats?.combat || 50,
          magic: characterData.stats?.magic || 60,
          intelligence: characterData.stats?.intelligence || 75,
          charisma: characterData.stats?.charisma || 80,
          wisdom: characterData.stats?.wisdom || 65,
          agility: characterData.stats?.agility || 60,
          luck: characterData.stats?.luck || 70
        },
        
        characterTraits: {
          positive: characterData.characterTraits?.positive || ['Kind', 'Determined'],
          quirks: characterData.characterTraits?.quirks || ['Talks to plants'],
          fears: characterData.characterTraits?.fears || ['Letting others down'],
          dreams: characterData.characterTraits?.dreams || ['A green world'],
          hobbies: characterData.characterTraits?.hobbies || ['Gardening'],
          talents: characterData.characterTraits?.talents || ['Growing things'],
          weaknesses: characterData.characterTraits?.weaknesses || ['Too trusting']
        },
        
        backstory: {
          origin: characterData.backstory?.origin || 'A mysterious farming background',
          motivation: characterData.backstory?.motivation || 'To help heal the world',
          relationships: characterData.backstory?.relationships || [],
          goals: characterData.backstory?.goals || ['Restore the land'],
          secrets: characterData.backstory?.secrets || []
        },
        
        gameData: {
          role: request.role || 'farmer',
          element: request.element || 'earth',
          specialAbilities: characterData.gameData?.specialAbilities || ['Green Thumb'],
          favoriteFood: characterData.gameData?.favoriteFood || 'Fresh vegetables',
          farmingSpecialty: characterData.gameData?.farmingSpecialty || 'General farming',
          climatePreference: characterData.gameData?.climatePreference || 'Temperate',
          startingEquipment: characterData.gameData?.startingEquipment || ['Basic tools']
        },
        
        relationships: {
          bestWith: characterData.relationships?.bestWith || ['friendly types'],
          conflictsWith: characterData.relationships?.conflictsWith || ['hostile types'],
          mentorTypes: characterData.relationships?.mentorTypes || ['beginners'],
          studentTypes: characterData.relationships?.studentTypes || ['experienced farmers'],
          romanticCompatibility: characterData.relationships?.romanticCompatibility || ['compatible types']
        },
        
        imagePrompts: {
          portrait: characterData.imagePrompts?.portrait || 'anime character portrait',
          fullBody: characterData.imagePrompts?.fullBody || 'full body character',
          action: characterData.imagePrompts?.action || 'character in action',
          casual: characterData.imagePrompts?.casual || 'casual scene',
          farming: characterData.imagePrompts?.farming || 'farming scene'
        },
        
        conversationStyle: {
          greeting: characterData.conversationStyle?.greeting || ['Hello there!', 'Good to see you!'],
          farewell: characterData.conversationStyle?.farewell || ['See you later!', 'Take care!'],
          encouragement: characterData.conversationStyle?.encouragement || ['You can do it!', 'Keep going!'],
          concern: characterData.conversationStyle?.concern || ['Are you okay?', 'What\'s wrong?'],
          excitement: characterData.conversationStyle?.excitement || ['Amazing!', 'Wonderful!'],
          awkward: characterData.conversationStyle?.awkward || ['Um...', 'Well...']
        },
        
        memory: {
          conversationHistory: [],
          playerPreferences: {},
          emotionalState: 'happy',
          relationshipLevel: 50
        }
      };
    } catch (error) {
      console.error('Failed to parse character response:', error);
      throw new Error('Could not parse AI character response');
    }
  }
}

export const enhancedAICharacterGenerator = new EnhancedAICharacterGeneratorService();
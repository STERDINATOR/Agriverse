# AI Character Creator Setup Guide

## Overview

The AI Character Creator uses **Gemini AI** to generate unique anime/manga character concepts with detailed descriptions, backstories, and appearances. It can optionally integrate with AI image generation services to create custom character artwork.

## Features

### 🎨 Character Generation
- **AI-Powered Concepts**: Gemini AI creates unique character designs
- **Multiple Art Styles**: Anime, Manga, Chibi, Shounen, Shoujo, Realistic Anime
- **Character Roles**: Farmer, Warrior, Mage, Guardian, Explorer
- **Custom Prompts**: Add your own details to guide generation
- **Detailed Backstories**: Each character has a complete backstory

### 👗 Customization
- **Preset Outfits**: 6 different outfit styles
- **Accessory Sets**: 6 sets of themed accessories
- **Live Updates**: See changes immediately
- **Mix & Match**: Combine AI generation with presets

### 🖼️ Image Generation (Optional)
- **Multiple Providers**: Support for Stability AI, DALL-E 3, Replicate
- **Placeholder Mode**: Works without any API keys
- **Custom Prompts**: AI-optimized prompts for best results

---

## Setup Instructions

### Step 1: Gemini AI Setup (Required for AI Generation)

1. **Get a Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Get API Key"
   - Copy your API key

2. **Add Your Gemini API Key**
   - Open `/services/AICharacterGenerator.ts`
   - Find line 32:
     ```typescript
     private geminiApiKey: string = 'YOUR_GEMINI_API_KEY_HERE';
     ```
   - Replace with:
     ```typescript
     private geminiApiKey: string = 'AIzaSy...your-actual-key';
     ```
   
   **Also update Character Chat (if you use that feature):**
   - Open `/services/CharacterAIService.ts`
   - Find line 29 and do the same replacement

3. **Test It**
   - Go to Player Hub → AI Character Creator
   - Select art style and role
   - Click "Generate Character"
   - You should get a unique AI-generated character!

**Note:** Without a Gemini API key, the system uses high-quality mock characters.

---

### Step 2: Image Generation Setup (Optional)

The character creator works great with just text descriptions, but you can add AI image generation for custom artwork.

#### Option A: Stability AI (Recommended)

**Best for:** High-quality anime images, affordable pricing

1. **Get API Key**
   - Visit [Stability AI Platform](https://platform.stability.ai/)
   - Create account and add credits ($10 minimum)
   - Generate API key in dashboard

2. **Add to Character Creator**
   - In the AI Character Creator, click "Settings"
   - Select "Stability AI" as Image Provider
   - Enter your API key
   - Click "Generate New Image"

**Pricing:** ~$0.02-0.04 per image

#### Option B: DALL-E 3 (OpenAI)

**Best for:** Creative variety, different art styles

1. **Get API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create account and add payment method
   - Generate API key

2. **Configure**
   - Settings → Select "DALL-E 3"
   - Enter OpenAI API key
   - Generate images

**Pricing:** ~$0.04-0.08 per image (1024x1024)

#### Option C: Replicate

**Best for:** Access to specific anime models

1. **Get API Key**
   - Visit [Replicate](https://replicate.com/)
   - Create account
   - Get API token

2. **Configure Model**
   - Open `/services/AICharacterGenerator.ts`
   - Line 116: Update `version` with your chosen model
   - Popular anime models:
     - `stability-ai/sdxl`
     - `cjwbw/anything-v3.0`
     - `lucataco/anime-art-diffusion`

**Pricing:** Varies by model ($0.01-0.05 per image)

#### Option D: Placeholder Mode (Free)

**Best for:** Testing, development, no API key needed

- Automatically active when no API key is provided
- Uses curated anime-style placeholder images
- Great for prototyping and demos
- No costs or setup required

---

## Usage Guide

### Basic Character Generation

1. **Navigate** to Player Hub → AI Character Creator
2. **Select Art Style**
   - Anime: Classic Japanese animation style
   - Manga: Black & white manga aesthetic
   - Chibi: Cute, super-deformed style
   - Realistic Anime: More realistic proportions
   - Shounen: Action-oriented, dynamic
   - Shoujo: Elegant, detailed, romantic

3. **Choose Role**
   - Farmer: Agricultural focus, nature-based
   - Warrior: Combat-ready, strong
   - Mage: Magical, mystical
   - Guardian: Protective, supportive
   - Explorer: Adventurous, curious

4. **Add Custom Details** (optional)
   ```
   Examples:
   - "long blue hair, golden eyes, cheerful"
   - "serious personality, armored outfit"
   - "nature-themed accessories"
   ```

5. **Generate!**

### Customizing Generated Characters

After generation, you can modify:

1. **Outfits**
   - Eco-Farmer Outfit
   - Battle-Ready Gear
   - Mystic Robes
   - Explorer Gear
   - Guardian Armor
   - Casual Style

2. **Accessory Sets**
   - 6 themed sets that match different styles
   - Mix and match with outfits

3. **Regenerate Image**
   - Keep the character concept
   - Generate a new visual interpretation

### Saving Your Character

1. Click "Save Character & Continue"
2. Character is saved to your game profile
3. Use in chat, gameplay, and customization
4. Can modify later in Character Customization

---

## Advanced Configuration

### Environment Variables (Production)

For production, use environment variables:

```typescript
// In AICharacterGenerator.ts
private geminiApiKey: string = 
  process.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
```

Create `.env`:
```
VITE_GEMINI_API_KEY=AIzaSy...your-key
VITE_STABILITY_API_KEY=sk-...your-key
```

### Customizing Prompts

Edit prompt generation in `/services/AICharacterGenerator.ts`:

```typescript
private generateCharacterPrompt(request: CharacterGenerationRequest): string {
  // Modify this function to change how AI generates characters
  // Add your own personality types, styles, or requirements
}
```

### Adding New Art Styles

In `/components/AICharacterCreator.tsx`:

```typescript
const artStyles = [
  // Add your own styles
  { value: 'custom-style', label: 'Custom Style', emoji: '🎨' },
];
```

### Adding New Preset Outfits

```typescript
const presetOutfits = [
  // Add new outfits
  { 
    id: 'your-outfit', 
    name: 'Your Outfit Name', 
    description: 'Detailed description for AI prompts' 
  },
];

const presetAccessories = [
  // Add corresponding accessories
  ['Accessory 1', 'Accessory 2', 'Accessory 3'],
];
```

---

## API Limits & Costs

### Gemini AI (Google)
- **Free Tier**: 60 requests/minute, 1,500/day
- **Cost**: FREE up to limits
- **Good for**: Character concept generation (text)

### Stability AI
- **Cost**: ~$0.02-0.04 per image
- **Quality**: Excellent for anime/manga
- **Speed**: ~10-15 seconds per image

### DALL-E 3 (OpenAI)
- **Cost**: ~$0.04-0.08 per image (1024x1024)
- **Quality**: Very good, creative
- **Speed**: ~5-10 seconds per image

### Replicate
- **Cost**: Varies by model ($0.01-0.05)
- **Quality**: Depends on model
- **Speed**: Varies (10-30 seconds)

---

## Troubleshooting

### Character Generation Issues

**Problem:** "Gemini API error: Not Found" or "Failed to generate character"
- **Solution**: 
  - Check your Gemini API key is correct (should start with "AIzaSy")
  - Ensure you've replaced 'YOUR_GEMINI_API_KEY_HERE' in the code
  - The API endpoint has been updated to use `gemini-1.5-flash-latest`
  - Verify your API key is active at [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Fallback**: System uses mock characters automatically if API fails

**Problem:** Characters don't match my style preference
- **Solution**: 
  - Add more details in custom prompt
  - Try different art styles
  - Regenerate multiple times

### Image Generation Issues

**Problem:** "Failed to generate image"
- **Check**: API key is correct
- **Check**: You have credits/billing set up
- **Check**: Provider is online
- **Fallback**: Use placeholder mode

**Problem:** Images don't look like anime
- **Solution**: 
  - For Stability AI: Ensure you're using SDXL model
  - For DALL-E: Add "anime style" explicitly
  - For Replicate: Choose an anime-specific model

**Problem:** Image generation is slow
- **Normal**: 10-30 seconds is typical
- **If longer**: Check provider status page
- **Workaround**: Use placeholder while waiting

### API Key Security

**Never commit API keys to version control!**

✅ **Good practices:**
- Use environment variables
- Add `.env` to `.gitignore`
- Rotate keys regularly
- Use separate keys for dev/prod

❌ **Avoid:**
- Hardcoding keys in files
- Sharing keys in screenshots
- Using production keys in development

---

## Tips for Best Results

### Character Generation
1. **Be specific but flexible**: "blue hair, determined personality" works better than "exactly like [character name]"
2. **Use the custom prompt**: Add unique details that make your character special
3. **Try different styles**: Same concept in different styles creates variety
4. **Regenerate freely**: Each generation is unique

### Image Generation
1. **Detailed prompts work best**: The AI generates detailed prompts automatically
2. **Consistent style**: Stick with one provider for a cohesive look
3. **Save favorites**: Download or screenshot characters you love
4. **Iterate**: Generate multiple versions, pick the best

### Customization
1. **Mix and match**: Combine AI outfits with preset accessories
2. **Test combinations**: Some outfits work better with certain styles
3. **Update anytime**: You can always regenerate or modify

---

## Examples

### Example 1: Nature Farmer
```
Art Style: Shoujo
Role: Farmer
Custom Prompt: "loves plants, gentle personality, green theme"
```

**Result**: Character with nature-themed design, soft features, gardening accessories

### Example 2: Battle Warrior
```
Art Style: Shounen  
Role: Warrior
Custom Prompt: "fierce but kind, red and black colors, dragon motif"
```

**Result**: Dynamic warrior with dragon-themed armor and determined expression

### Example 3: Mystical Mage
```
Art Style: Anime
Role: Mage
Custom Prompt: "mysterious, starry theme, wise and calm"
```

**Result**: Elegant mage with celestial design and mystical accessories

---

## Support & Resources

### Documentation
- [Gemini AI Docs](https://ai.google.dev/docs)
- [Stability AI Docs](https://platform.stability.ai/docs)
- [OpenAI DALL-E Docs](https://platform.openai.com/docs/guides/images)
- [Replicate Docs](https://replicate.com/docs)

### Community
- Check browser console for error details
- Review this documentation
- Test with placeholder mode first

### Updates
- Service is actively maintained
- New styles and features added regularly
- Check FEATURES.md for latest updates

---

## Privacy & Data

- **Character data**: Stored locally in browser
- **API calls**: Sent only to Google (Gemini) and your chosen image provider
- **API keys**: Never sent to our servers, stored in browser only
- **Images**: Generated on-demand, not stored by us
- **No tracking**: Your creations are private

---

**Happy Character Creating! ✨**

Generate unique, beautiful anime characters for your AgriVerse adventure!

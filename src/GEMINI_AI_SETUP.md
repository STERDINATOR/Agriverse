# Gemini AI Integration for Character Chat

## Overview

The Character Chat feature uses Google's Gemini AI to create Character.AI-style conversations with your customized game characters. Characters respond with unique personalities based on their personality type (Kuudere, Genki, Tsundere, etc.) and traits.

## Setup Instructions

### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key or use an existing one
5. Copy your API key

### 2. Add Your API Key

**For Character Chat:**

Open `/services/CharacterAIService.ts` and replace the placeholder on line 29:

```typescript
private apiKey: string = 'YOUR_GEMINI_API_KEY_HERE';
```

With your actual API key:

```typescript
private apiKey: string = 'AIzaSy...your-actual-key-here';
```

**For AI Character Creator:**

Open `/services/AICharacterGenerator.ts` and replace the placeholder on line 32:

```typescript
private geminiApiKey: string = 'YOUR_GEMINI_API_KEY_HERE';
```

With your actual API key:

```typescript
private geminiApiKey: string = 'AIzaSy...your-actual-key-here';
```

**Important:** Never commit your API key to version control. Consider using environment variables in production.

### 3. Using Environment Variables (Recommended)

For production, use environment variables:

```typescript
private apiKey: string = process.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
```

Then create a `.env` file:

```
VITE_GEMINI_API_KEY=AIzaSy...your-actual-key-here
```

## Features

### Character Personalities

Each personality type has unique speech patterns:

- **Kuudere**: Cool and reserved but caring underneath
- **Genki**: Energetic, cheerful, and optimistic
- **Dandere**: Shy, quiet, but genuinely caring
- **Tsundere**: Tough exterior, soft inside
- **Yamato Nadeshiko**: Graceful, traditional, and polite
- **Bokukko**: Tomboyish, brave, and confident

### Character Traits

Characters have specialized knowledge based on their trait:

- **Compassionate**: Environmental care, emotional support
- **Analytical**: Data analysis, strategic planning
- **Mystical**: Natural harmony, spiritual wisdom
- **Determined**: Perseverance, overcoming challenges

### How It Works

1. **Character Selection**: Uses your customized character from Character Customization
2. **Personality-Driven Responses**: AI generates responses matching the character's personality
3. **Contextual Conversations**: References game state, resources, and current shard
4. **Emotion Detection**: Displays appropriate emotions (happy, excited, concerned, etc.)
5. **Conversation Memory**: Maintains context of the last 8 messages

## Demo Mode

Without an API key, the system uses intelligent mock responses that still demonstrate personality-based conversations. This is great for testing and development.

## API Limits

Free tier Gemini API limits:
- 60 requests per minute
- 1,500 requests per day
- 1 million tokens per day

## Cost

Gemini 1.5 Flash (used in this integration):
- **FREE** up to the daily limits
- Very low cost if you exceed limits

## Customization

### Adjust Response Length

In `CharacterAIService.ts`, modify `maxOutputTokens`:

```typescript
maxOutputTokens: 200, // Increase for longer responses
```

### Adjust Creativity

Modify the `temperature` setting:

```typescript
temperature: 0.9, // Higher = more creative (0-1)
```

### Add More Personality Patterns

Add new personalities in the `personalityPatterns` object:

```typescript
'YourNewType': {
  prefix: ['Hello!', 'Hey there!'],
  suffix: ['Nice talking!', 'See ya!'],
  tone: 'friendly and casual'
}
```

## Troubleshooting

### "Failed to get response"

1. Check that your API key is correct
2. Verify you haven't exceeded rate limits
3. Check browser console for detailed error messages

### Characters respond too slowly

1. The first response may take 2-3 seconds
2. Subsequent responses should be faster (1-2 seconds)
3. Check your internet connection

### Responses don't match personality

1. Clear the chat and try again
2. The system prompt may need adjustment in `generateSystemPrompt()`
3. Increase the `temperature` for more varied responses

### "Gemini API error: Not Found"

1. **Check your API key**: Make sure it starts with "AIzaSy" and is correctly copied
2. **Verify API key is active**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to ensure it's still valid
3. **Check you've updated the code**: Ensure you've replaced 'YOUR_GEMINI_API_KEY_HERE' with your actual key
4. **API endpoint is correct**: The code now uses `gemini-1.5-flash-latest` endpoint
5. **Enable the API**: Make sure you've enabled the Gemini API in your Google Cloud project (usually automatic with API Studio keys)

## Privacy & Safety

- Conversations are not stored on any server
- All data stays in your browser session
- Gemini API has built-in safety filters
- No personal data is sent except the game context

## Support

For issues or questions:
- Check the browser console for errors
- Review the Gemini API documentation
- Ensure your API key has proper permissions

---

**Powered by Google Gemini AI** 🤖✨

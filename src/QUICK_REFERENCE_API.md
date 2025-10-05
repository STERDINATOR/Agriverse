# ⚡ Quick Reference - Gemini API Integration

## 🔑 Your API Key
```
AIzaSyCggWZ65woVi6tSjSSVtBnnSgvYSUp1glg
```
**Status**: ✅ Active & Configured

---

## 🎯 Quick Actions

### Test Connection (1 minute)
1. Main Menu → "API Settings"
2. Gemini AI tab → "Test Connection"
3. Wait for ✅ "Connected"

### Generate Character (30 seconds)
1. Main Menu → "AI Character Creator"
2. Select style + role
3. Click "Generate Character"
4. Customize & save

### Chat with AI (ongoing)
1. Main Menu → PlayerHub → Character Chat
2. Choose personality type
3. Start conversation

---

## ⚙️ Where Your API Key is Used

| File | Feature | Status |
|------|---------|--------|
| `AICharacterGenerator.ts` | Character creation | ✅ Active |
| `CharacterAIService.ts` | Character chat | ✅ Active |
| `GeminiAIService.ts` | TERRA-AI advisor | ✅ Active |

---

## 🚨 Common Issues

### "Not Found" Error
- **Cause**: Wrong endpoint
- **Fix**: Already fixed - using `gemini-1.5-flash-latest`

### "Invalid API Key"  
- **Cause**: Typo or disabled API
- **Fix**: Regenerate at https://makersuite.google.com/app/apikey

### "Rate Limit"
- **Cause**: >60 requests/minute
- **Fix**: Wait 60 seconds

---

## 📊 Feature Status

| Feature | Status | Test It |
|---------|--------|---------|
| AI Character Creator | ✅ Live | Main Menu → AI Character Creator |
| Character Chat | ✅ Live | PlayerHub → Character Chat |
| TERRA-AI Advisor | ✅ Live | Main Menu → TERRA-AI Assistant |
| API Testing | ✅ Live | Main Menu → API Settings |

---

## 🎨 Visual Indicators

### API Active Badge
- **Location**: AI Character Creator header
- **Look for**: Green "API Active" badge
- **Means**: Real Gemini API in use (not demo)

### Connection Status
- **Location**: API Settings panel
- **Green** = Connected ✅
- **Red** = Error ❌  
- **Gray** = Not Tested

---

## 💡 Quick Tips

1. **Test First**: Always test connection before heavy use
2. **Monitor Console**: Open browser console (F12) for errors
3. **Save Favorites**: Export character JSON data
4. **Rate Limits**: Normal gameplay won't hit limits
5. **Fallback Works**: Game works even if API fails

---

## 🔗 Essential Links

- **API Key**: https://makersuite.google.com/app/apikey
- **API Docs**: https://ai.google.dev/docs
- **Full Guide**: `/GEMINI_INTEGRATION_COMPLETE.md`
- **Troubleshooting**: `/API_INTEGRATION_SUMMARY.md`

---

## 🎉 You're All Set!

Everything is configured and ready to use. Just launch the game and explore the AI features!

**Questions?** Check the full documentation files or test your connection in API Settings.

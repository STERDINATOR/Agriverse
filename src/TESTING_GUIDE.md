# 🧪 Testing Guide - Gemini AI Integration

## Quick Test Checklist

Use this guide to verify that your Gemini API integration is working correctly.

---

## ✅ Test 1: API Connection (2 minutes)

### Steps:
1. Launch the game
2. Click "API Settings" button (bottom of main menu)
3. You should see the API Configuration modal
4. Click "Test Connection" button

### Expected Results:
- ✅ Green "Connected" badge appears
- ✅ Success toast notification shows
- ✅ No error messages

### If It Fails:
- ❌ Check the error message displayed
- ❌ Verify your internet connection
- ❌ Ensure API key is correct
- ❌ Try regenerating API key at https://makersuite.google.com/app/apikey

---

## ✅ Test 2: AI Character Creator (3 minutes)

### Steps:
1. Main Menu → "AI Character Creator"
2. Verify you see green "API Active" badge in header
3. Select art style: "Anime"
4. Select role: "Farmer"
5. (Optional) Add custom prompt: "Make them cheerful and nature-loving"
6. Click "Generate Character"
7. Wait 3-5 seconds

### Expected Results:
- ✅ Loading spinner appears
- ✅ Unique character appears with:
  - Name (e.g., "Hana Mizuki")
  - Detailed personality description
  - Appearance details (hair, eyes, outfit)
  - Character stats (STR, INT, CHA)
  - Backstory (3-4 sentences)
- ✅ Character image loads (placeholder or AI-generated)
- ✅ Success toast: "✨ [Character Name] has been created!"

### If Using Real API:
- Character details should be unique each time
- Names should be varied and creative
- Backstories should be contextual to AgriVerse

### If Using Demo Mode:
- Same character templates appear
- Names are always: Hana Mizuki, Riku Stormheart, or Luna Stellaria
- This means API key isn't working - check Test 1

---

## ✅ Test 3: Character Chat (3 minutes)

### Steps:
1. Main Menu → Player Hub → Character Chat
2. Verify green "Gemini AI" badge in header
3. Read the welcome message
4. Type: "Tell me about yourself"
5. Press Send
6. Wait for response

### Expected Results:
- ✅ Your message appears on the right (blue bubble)
- ✅ Typing indicator appears briefly
- ✅ Character responds on the left (purple bubble)
- ✅ Response matches character's personality type
- ✅ Emotion icon appears with message

### Personality-Specific Responses:

#### Tsundere Character:
"Why do you want to know about me? I-it's not like we're friends or anything! But fine... I'm [Name], and I guess I'm stuck helping you..."

#### Genki Character:
"Me? I'm [Name], and I LOVE farming and helping people! Every day in AgriVerse is an adventure! 🌱"

#### Kuudere Character:
"...I'm [Name]. I farm. That's it. ...Why does it matter? But I suppose I'll answer your questions..."

### Test Multiple Messages:
1. "What crops should I plant?"
2. "How do I deal with drought?"
3. "What's your favorite thing?"

Each response should:
- Be different and contextual
- Match the personality
- Reference farming/game context
- Feel like a natural conversation

---

## ✅ Test 4: TERRA-AI Advisor (2 minutes)

### Steps:
1. Main Menu → "TERRA-AI Assistant"
2. Type question: "What farming strategy should I use?"
3. Click "Ask TERRA-AI"
4. Wait for response

### Expected Results:
- ✅ Loading indicator appears
- ✅ AI response appears in card
- ✅ Recommendations list shows
- ✅ Action items appear
- ✅ Urgency level indicated
- ✅ Confidence percentage shown

### Sample Response Structure:
```
Message: "Based on current conditions..."
Recommendations:
  - Plant drought-resistant crops
  - Install irrigation systems
  - Monitor soil moisture

Action Items:
  ✓ Plant Desert Wheat - HIGH priority
  ✓ Upgrade irrigation - MEDIUM priority

Urgency: Medium
Confidence: 89%
```

---

## ✅ Test 5: Browser Console Check (2 minutes)

### Steps:
1. Open browser developer tools (F12)
2. Go to "Console" tab
3. Generate a character or send a chat message
4. Watch for logs

### Good Signs (Working):
- ✅ No red error messages
- ✅ Logs might show: "Using real Gemini API"
- ✅ Network tab shows requests to `generativelanguage.googleapis.com`

### Bad Signs (Not Working):
- ❌ Red error messages about API
- ❌ "API Key not valid" errors
- ❌ "Demo mode" messages
- ❌ 403/404 errors from Google APIs

---

## 🔍 Detailed API Call Verification

### How to Check Real API Usage:

#### Method 1: Network Tab
1. F12 → Network tab
2. Generate character
3. Look for requests to: `generativelanguage.googleapis.com`
4. Check request status: Should be 200 (success)
5. Click request → Preview tab → See actual AI response

#### Method 2: Console Logging
1. F12 → Console
2. Generate character
3. Look for any error messages
4. Success = no errors about API

#### Method 3: Response Quality
1. Generate 3-5 characters in a row
2. Each should be completely unique
3. Names should vary significantly
4. Backstories should be different
5. If all identical = demo mode active

---

## 📊 Feature Comparison Test

### Demo Mode vs Real API

Generate 3 characters and check:

| Aspect | Demo Mode | Real API |
|--------|-----------|----------|
| Names | Same 3 names | Always unique |
| Backstories | Identical | Different each time |
| Stats | Fixed values | Varied appropriately |
| Personalities | Template-based | Contextual & creative |
| Generation Time | Instant | 2-5 seconds |

---

## 🐛 Common Issues & Solutions

### Issue: Characters Always Same
**Diagnosis**: Demo mode active  
**Cause**: API key not working  
**Fix**: 
1. Test connection in API Settings
2. Check browser console for errors
3. Verify API key is correctly entered
4. Regenerate API key if needed

### Issue: "Rate Limit Exceeded"
**Diagnosis**: Too many API calls  
**Cause**: Hitting 60 requests/minute limit  
**Fix**:
1. Wait 60 seconds
2. Close other tabs running the game
3. Test again

### Issue: "Invalid API Key"
**Diagnosis**: Key problem  
**Cause**: Wrong key or API not enabled  
**Fix**:
1. Go to https://makersuite.google.com/app/apikey
2. Verify key matches exactly
3. Check if Gemini API is enabled
4. Generate new key if needed

### Issue: Slow Responses
**Diagnosis**: Normal API latency  
**Cause**: Network speed or Google API load  
**Expected**: 2-5 seconds is normal  
**Fix**: None needed if working

### Issue: Empty Responses
**Diagnosis**: API configuration error  
**Cause**: Wrong endpoint or missing permissions  
**Fix**:
1. Check browser console for details
2. Verify using `gemini-1.5-flash-latest` model
3. Check API quotas in Google Cloud Console

---

## 🎯 Success Criteria

### Your integration is working if:

- [x] ✅ API Connection test shows "Connected"
- [x] ✅ Character Creator shows "API Active" badge
- [x] ✅ Generated characters are unique every time
- [x] ✅ Character chat responses are conversational
- [x] ✅ TERRA-AI provides contextual advice
- [x] ✅ No errors in browser console
- [x] ✅ Network tab shows successful API calls
- [x] ✅ Responses take 2-5 seconds (not instant)

### You're in demo mode if:

- [ ] ❌ Same character names every time
- [ ] ❌ Identical backstories
- [ ] ❌ Instant generation (no delay)
- [ ] ❌ Console shows "Using demo mode"
- [ ] ❌ No network requests to Google APIs

---

## 📈 Performance Benchmarks

### Expected Timings (Real API):
- Connection test: 2-5 seconds
- Character generation: 3-7 seconds
- Chat response: 1-3 seconds
- TERRA-AI query: 2-5 seconds

### Demo Mode Timings:
- Character generation: Instant (< 1 second)
- Chat response: 1-2 seconds (simulated delay)

If your timings match "Real API" = ✅ Working!  
If your timings match "Demo Mode" = ❌ Check API key

---

## 🔬 Advanced Testing

### Test Different Prompts:

#### Character Creator:
1. "Create a cyberpunk farmer with blue hair"
2. "Make a traditional Japanese warrior-farmer"
3. "Generate a mystical nature guardian"
4. "Create a young tech genius farmer"

Each should produce completely different results.

#### Character Chat:
1. Test all 6 personality types
2. Verify each responds differently
3. Check emotion variety
4. Confirm context awareness

#### TERRA-AI:
1. Ask about drought strategies
2. Query flood management
3. Request crop recommendations
4. Ask about resource optimization

Each should provide unique, contextual advice.

---

## 📝 Test Results Template

Copy this and fill it out:

```
=== Gemini AI Integration Test Results ===

Date: _______________
Browser: _______________

Test 1: API Connection
Status: [ ] Pass [ ] Fail
Notes: _________________________________

Test 2: Character Creator
Status: [ ] Pass [ ] Fail
Character Names Generated:
1. _________________________________
2. _________________________________
3. _________________________________
Notes: _________________________________

Test 3: Character Chat
Status: [ ] Pass [ ] Fail
Response Quality: [ ] Good [ ] Template [ ] Error
Notes: _________________________________

Test 4: TERRA-AI
Status: [ ] Pass [ ] Fail
Notes: _________________________________

Test 5: Console Check
Status: [ ] Clean [ ] Errors
Error Messages: _________________________________

Overall Status: [ ] Fully Working [ ] Demo Mode [ ] Broken
Next Steps: _________________________________
```

---

## 🎉 All Tests Passed?

### Congratulations! Your integration is live!

You can now:
- ✅ Generate unlimited unique characters
- ✅ Have natural conversations with AI companions
- ✅ Get intelligent farming advice
- ✅ Experience dynamic, AI-driven gameplay

### Next Steps:
1. Explore different character styles
2. Try various personality types
3. Build character relationships through chat
4. Use TERRA-AI for strategic planning
5. Consider adding image generation API

---

## 📞 Still Having Issues?

### Troubleshooting Checklist:
1. ✅ API key copied correctly (no extra spaces)
2. ✅ Internet connection stable
3. ✅ Gemini API enabled in Google Cloud
4. ✅ No firewall blocking Google APIs
5. ✅ Browser allows fetch requests
6. ✅ No CORS errors in console
7. ✅ Using latest browser version

### Get More Help:
- Check `/GEMINI_INTEGRATION_COMPLETE.md`
- Review `/API_INTEGRATION_SUMMARY.md`
- Read `/QUICK_REFERENCE_API.md`
- Check browser console for detailed errors
- Verify API status at Google AI Studio

---

**Happy Testing! 🚀**

*Remember: If something doesn't work, check the browser console first - it usually tells you exactly what's wrong!*

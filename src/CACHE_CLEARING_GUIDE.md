# Cache Clearing Guide - Fix Gemini API 404 Error

## ⚠️ IMPORTANT: Browser Cache Issue

If you're still seeing the 404 error even after the code has been updated, this is due to **browser caching**. The old JavaScript files are still loaded in your browser.

## Quick Fix Steps

### 1. **Hard Refresh** (Recommended - Fastest)

**Windows/Linux:**
- Press `Ctrl + Shift + R`
- Or `Ctrl + F5`

**Mac:**
- Press `Cmd + Shift + R`
- Or `Cmd + Option + R`

### 2. **Clear Browser Cache Manually**

#### Chrome/Edge:
1. Press `F12` to open Developer Tools
2. **Right-click** the refresh button (🔄)
3. Select **"Empty Cache and Hard Reload"**

Or:
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page

#### Firefox:
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "Cache"
3. Click "Clear Now"
4. Refresh the page

#### Safari:
1. Press `Cmd+Option+E` to empty cache
2. Refresh the page

### 3. **Incognito/Private Mode** (For Testing)

Open the app in an incognito/private window:
- Chrome: `Ctrl+Shift+N` (Windows) or `Cmd+Shift+N` (Mac)
- Firefox: `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
- Safari: `Cmd+Shift+N`

## Verify the Fix

### Using the API Diagnostics Tool

1. Look for the **"API Diagnostics"** button in the bottom-right corner of the app
2. Click it to open the diagnostics panel
3. Check the **Current Configuration** section:
   - **Model** should show: `gemini-1.5-flash-latest` ✅
   - **API Version** should show: `v1beta` ✅
   - **Endpoint** should end with: `-latest:generateContent` ✅

4. Click **"Test API Connection"** button
5. If successful, you'll see a green success message ✅

### Manual Verification

1. Open **Browser Console** (F12)
2. Navigate to TERRA-AI (Main Menu → TERRA-AI Assistant)
3. Send a test message
4. Check the console logs for:
   ```
   configCheck: {
     model: "gemini-1.5-flash-latest",  // ✅ Should have -latest
     apiVersion: "v1beta",
     endpoint: "...gemini-1.5-flash-latest:generateContent"
   }
   ```

## Expected vs. Incorrect URLs

### ✅ CORRECT (After Fix):
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent
                                                                              ^^^^^^^^ -latest suffix
```

### ❌ INCORRECT (Old Cached Version):
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
                                                                      ^ Missing -latest
```

## Files That Were Updated

All these files now use `gemini-1.5-flash-latest`:

1. ✅ `/services/GeminiAIService.ts` - Line 34
2. ✅ `/services/CharacterAIService.ts` - Line 30
3. ✅ `/services/AICharacterGenerator.ts` - Line 41
4. ✅ `/services/EnhancedAICharacterGenerator.ts` - Line 135

## Still Having Issues?

### Check Console for Detailed Errors

The error logs now include helpful diagnostic information:

```javascript
{
  status: 404,
  statusText: "Not Found",
  url: "...",
  errorData: {...},
  configCheck: {
    model: "gemini-1.5-flash-latest",  // This shows what the code is using
    apiVersion: "v1beta",
    timestamp: "2025-10-05T..."
  },
  cacheWarning: "If you see old model name in URL above, clear browser cache..."
}
```

**Compare the URL field with the configCheck:**
- If URL shows `gemini-1.5-flash` (old) but configCheck shows `gemini-1.5-flash-latest` (new)
  → **You have a cache problem** - Hard refresh required!
- If both show `gemini-1.5-flash-latest`
  → **Different issue** - Check API key or network

### Advanced: Disable Cache During Development

**Chrome DevTools:**
1. Press `F12` to open DevTools
2. Go to **Network** tab
3. Check **"Disable cache"** checkbox
4. Keep DevTools open while testing

**Firefox DevTools:**
1. Press `F12` to open DevTools
2. Click Settings (⚙️) in the top right
3. Check **"Disable HTTP Cache (when toolbox is open)"**

## API Key Verification

If caching is not the issue, verify your API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Check if your key `AIzaSyCggWZ65woVi6tSjSSVtBnnSgvYSUp1glg` is active
3. Ensure it has permissions for Gemini API v1beta
4. Generate a new key if needed

## Success Indicators

After clearing cache, you should see:

✅ **No 404 errors in console**  
✅ **TERRA-AI responds with AI-generated advice**  
✅ **Character chat works**  
✅ **Character creator generates personalities**  
✅ **API Diagnostics test passes**  
✅ **Console shows correct model name in all requests**

## Prevention

To avoid cache issues in the future:

1. Use the **API Diagnostics** tool regularly
2. Keep DevTools open with cache disabled during development
3. Hard refresh after any code updates
4. Test in incognito mode when in doubt

---

## Quick Reference

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Hard Refresh | `Ctrl+Shift+R` | `Cmd+Shift+R` |
| Clear Cache | `Ctrl+Shift+Delete` | `Cmd+Shift+Delete` |
| DevTools | `F12` | `Cmd+Option+I` |
| Incognito | `Ctrl+Shift+N` | `Cmd+Shift+N` |

---

**Last Updated:** October 5, 2025  
**Status:** ✅ Code Fixed - Cache Clearing Required  
**Next Step:** Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
// Quick model discovery script - Run this in browser console to find available models

const API_KEY = 'AIzaSyCggWZ65woVi6tSjSSVtBnnSgvYSUp1glg';

async function discoverModels() {
  console.log('🔍 Discovering available Gemini models...');
  
  try {
    // Try v1 API
    console.log('\n📡 Checking v1 API...');
    const v1Response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`);
    
    if (v1Response.ok) {
      const v1Data = await v1Response.json();
      console.log('✅ v1 API Models:', v1Data.models?.map(m => ({
        name: m.name,
        displayName: m.displayName,
        supportedMethods: m.supportedGenerationMethods
      })));
    } else {
      console.log('❌ v1 API failed:', v1Response.status, v1Response.statusText);
    }
    
    // Try v1beta API
    console.log('\n📡 Checking v1beta API...');
    const v1betaResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    
    if (v1betaResponse.ok) {
      const v1betaData = await v1betaResponse.json();
      console.log('✅ v1beta API Models:', v1betaData.models?.map(m => ({
        name: m.name,
        displayName: m.displayName,
        supportedMethods: m.supportedGenerationMethods
      })));
    } else {
      console.log('❌ v1beta API failed:', v1betaResponse.status, v1betaResponse.statusText);
    }
    
  } catch (error) {
    console.error('🚫 Discovery failed:', error);
  }
}

// Run discovery
discoverModels();

// Also try some common model names
const commonModels = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-8b'
];

console.log('\n🧪 Testing common model names...');
commonModels.forEach(async (model) => {
  try {
    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Test' }] }]
      })
    });
    
    console.log(`${model}: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log(`${model}: Error - ${error.message}`);
  }
});
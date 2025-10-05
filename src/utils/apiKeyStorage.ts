// API Key Storage Utility - Securely stores API keys in browser localStorage
// Keys are stored locally and never sent to any server except the respective AI provider

const STORAGE_PREFIX = 'agriverse_';

export const ApiKeyStorage = {
  // DeepSeek API Key
  getDeepSeekKey(): string {
    return localStorage.getItem(`${STORAGE_PREFIX}deepseek_key`) || '';
  },
  
  setDeepSeekKey(key: string): void {
    if (key && key.length > 0) {
      localStorage.setItem(`${STORAGE_PREFIX}deepseek_key`, key);
    } else {
      localStorage.removeItem(`${STORAGE_PREFIX}deepseek_key`);
    }
  },
  
  // Gemini API Key (legacy support)
  getGeminiKey(): string {
    return localStorage.getItem(`${STORAGE_PREFIX}gemini_key`) || '';
  },
  
  setGeminiKey(key: string): void {
    if (key && key.length > 0) {
      localStorage.setItem(`${STORAGE_PREFIX}gemini_key`, key);
    } else {
      localStorage.removeItem(`${STORAGE_PREFIX}gemini_key`);
    }
  },
  
  // Check if user has configured any API keys
  hasAnyKeys(): boolean {
    return this.getDeepSeekKey().length > 0 || this.getGeminiKey().length > 0;
  },
  
  // Check if DeepSeek is configured
  hasDeepSeekKey(): boolean {
    const key = this.getDeepSeekKey();
    return key.length > 0 && key.startsWith('sk-');
  },
  
  // Clear all API keys
  clearAllKeys(): void {
    localStorage.removeItem(`${STORAGE_PREFIX}deepseek_key`);
    localStorage.removeItem(`${STORAGE_PREFIX}gemini_key`);
  },
  
  // Get Demo Mode preference
  isDemoMode(): boolean {
    return localStorage.getItem(`${STORAGE_PREFIX}demo_mode`) === 'true' || !this.hasAnyKeys();
  },
  
  // Set Demo Mode preference
  setDemoMode(enabled: boolean): void {
    localStorage.setItem(`${STORAGE_PREFIX}demo_mode`, enabled.toString());
  }
};

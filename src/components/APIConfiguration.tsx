import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { 
  Settings, 
  Key, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Sparkles,
  Image as ImageIcon,
  MessageSquare,
  Brain,
  Zap,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ApiKeyStorage } from '../utils/apiKeyStorage';
import { deepSeekAIService } from '../services/DeepSeekAIService';

interface APIConfigurationProps {
  onClose: () => void;
}

export function APIConfiguration({ onClose }: APIConfigurationProps) {
  const [deepSeekKey, setDeepSeekKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [stabilityKey, setStabilityKey] = useState('');
  const [dalleKey, setDalleKey] = useState('');
  const [replicateKey, setReplicateKey] = useState('');
  const [demoMode, setDemoMode] = useState(true);
  
  const [testingDeepSeek, setTestingDeepSeek] = useState(false);
  const [deepSeekStatus, setDeepSeekStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deepSeekError, setDeepSeekError] = useState('');
  
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [geminiError, setGeminiError] = useState('');

  // Load saved API keys on mount
  useEffect(() => {
    setDeepSeekKey(ApiKeyStorage.getDeepSeekKey());
    setGeminiKey(ApiKeyStorage.getGeminiKey());
    setDemoMode(ApiKeyStorage.isDemoMode());
  }, []);

  const saveDeepSeekKey = () => {
    ApiKeyStorage.setDeepSeekKey(deepSeekKey);
    deepSeekAIService.setApiKey(deepSeekKey);
    toast.success('DeepSeek API key saved!');
  };

  const saveDemoModePreference = (enabled: boolean) => {
    setDemoMode(enabled);
    ApiKeyStorage.setDemoMode(enabled);
    toast.success(enabled ? 'Demo Mode enabled' : 'Real AI Mode enabled');
    window.location.reload(); // Reload to apply changes
  };

  const testDeepSeekConnection = async () => {
    if (!deepSeekKey || deepSeekKey.length === 0) {
      toast.error('Please enter a valid DeepSeek API key');
      return;
    }

    if (!deepSeekKey.startsWith('sk-')) {
      toast.error('Invalid DeepSeek API key format. Key should start with "sk-"');
      return;
    }

    setTestingDeepSeek(true);
    setDeepSeekStatus('idle');
    setDeepSeekError('');

    try {
      const response = await fetch(
        'https://api.deepseek.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepSeekKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{
              role: 'user',
              content: 'Say "Hello from AgriVerse!" if you can read this.'
            }],
            max_tokens: 50
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content;

      if (responseText) {
        setDeepSeekStatus('success');
        saveDeepSeekKey();
        toast.success('✨ DeepSeek API connected successfully! Real-time AI is now active!');
      } else {
        throw new Error('No response received from API');
      }
    } catch (error: any) {
      console.error('DeepSeek API test failed:', error);
      setDeepSeekStatus('error');
      setDeepSeekError(error.message || 'Connection failed');
      toast.error('Failed to connect to DeepSeek API');
    } finally {
      setTestingDeepSeek(false);
    }
  };

  const testGeminiConnection = async () => {
    if (!geminiKey || geminiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      toast.error('Please enter a valid Gemini API key');
      return;
    }

    setTestingGemini(true);
    setGeminiStatus('idle');
    setGeminiError('');

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: 'Say "Hello from AgriVerse!" if you can read this.' }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 50,
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (responseText) {
        setGeminiStatus('success');
        ApiKeyStorage.setGeminiKey(geminiKey);
        toast.success('✨ Gemini API connected successfully!');
      } else {
        throw new Error('No response received from API');
      }
    } catch (error: any) {
      console.error('Gemini API test failed:', error);
      setGeminiStatus('error');
      setGeminiError(error.message || 'Connection failed');
      toast.error('Failed to connect to Gemini API');
    } finally {
      setTestingGemini(false);
    }
  };

  const copyApiKey = (key: string, name: string) => {
    navigator.clipboard.writeText(key);
    toast.success(`${name} API key copied to clipboard`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        <Card className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-purple-500/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Settings className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-white">API Configuration</h2>
                <p className="text-sm text-gray-400">Manage your AI service connections</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              Close
            </Button>
          </div>

          {/* Demo Mode Toggle */}
          <div className="mb-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-white">AI Mode</h3>
                  <p className="text-sm text-gray-400">
                    {demoMode ? 'Using intelligent demo responses' : 'Using real-time AI with your API key'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Demo Mode</span>
                <Switch
                  checked={demoMode}
                  onCheckedChange={saveDemoModePreference}
                />
                <span className="text-sm text-gray-400">Real AI</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="deepseek" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="deepseek" className="data-[state=active]:bg-purple-500/20">
                <Zap className="w-4 h-4 mr-2" />
                DeepSeek AI
              </TabsTrigger>
              <TabsTrigger value="gemini" className="data-[state=active]:bg-purple-500/20">
                <Brain className="w-4 h-4 mr-2" />
                Gemini AI
              </TabsTrigger>
              <TabsTrigger value="image" className="data-[state=active]:bg-purple-500/20">
                <ImageIcon className="w-4 h-4 mr-2" />
                Image Generation
              </TabsTrigger>
            </TabsList>

            {/* DeepSeek AI Tab */}
            <TabsContent value="deepseek" className="space-y-4 mt-4">
              <div className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  <Zap className="w-5 h-5 text-purple-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-purple-300 mb-1">DeepSeek AI (Recommended)</h3>
                    <p className="text-sm text-gray-400">
                      Powers all character conversations, AI character generation, and TERRA-AI farming advisor
                    </p>
                  </div>
                  <Badge 
                    className={
                      deepSeekStatus === 'success' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : deepSeekStatus === 'error'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }
                  >
                    {deepSeekStatus === 'success' ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</> 
                    ) : deepSeekStatus === 'error' ? (
                      <><XCircle className="w-3 h-3 mr-1" /> Error</>
                    ) : (
                      'Not Tested'
                    )}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-300 mb-2 block">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        value={deepSeekKey}
                        onChange={(e) => {
                          setDeepSeekKey(e.target.value);
                          setDeepSeekStatus('idle');
                        }}
                        placeholder="sk-..."
                        className="flex-1 bg-slate-900/50 border-purple-500/30 text-white"
                      />
                      <Button
                        onClick={saveDeepSeekKey}
                        variant="outline"
                        className="border-purple-500/30 text-purple-300"
                      >
                        Save
                      </Button>
                    </div>
                  </div>

                  {deepSeekError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-sm text-red-400">{deepSeekError}</p>
                    </div>
                  )}

                  <Button
                    onClick={testDeepSeekConnection}
                    disabled={testingDeepSeek}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {testingDeepSeek ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing Connection...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Test Connection & Save
                      </>
                    )}
                  </Button>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                    <h4 className="text-blue-300 mb-2 flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      How to get your API key:
                    </h4>
                    <ol className="text-sm text-gray-300 space-y-1 ml-4 list-decimal">
                      <li>Visit <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">DeepSeek Platform</a></li>
                      <li>Sign up or log in to your account</li>
                      <li>Navigate to API Keys section</li>
                      <li>Create a new API key</li>
                      <li>Copy the key (starts with "sk-") and paste it above</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-sm text-yellow-300">
                      ⚡ Your API key is stored locally in your browser and only sent to DeepSeek's servers for AI requests.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-purple-500/20">
                    <h4 className="text-purple-300 mb-2">Features powered by DeepSeek:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <MessageSquare className="w-4 h-4 text-purple-400 mb-1" />
                        <p className="text-sm text-gray-300">Character Chat</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <Sparkles className="w-4 h-4 text-purple-400 mb-1" />
                        <p className="text-sm text-gray-300">AI Character Creator</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <Brain className="w-4 h-4 text-purple-400 mb-1" />
                        <p className="text-sm text-gray-300">TERRA-AI Advisor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Gemini AI Tab */}
            <TabsContent value="gemini" className="space-y-4 mt-4">
              <div className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-purple-300 mb-1">Google Gemini API</h3>
                    <p className="text-sm text-gray-400">
                      Powers character generation, AI chat, and TERRA-AI farming advisor
                    </p>
                  </div>
                  <Badge 
                    className={
                      geminiStatus === 'success' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : geminiStatus === 'error'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }
                  >
                    {geminiStatus === 'success' ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</>
                    ) : geminiStatus === 'error' ? (
                      <><XCircle className="w-3 h-3 mr-1" /> Error</>
                    ) : (
                      'Not Tested'
                    )}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-300 mb-2 block">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        value={geminiKey}
                        onChange={(e) => {
                          setGeminiKey(e.target.value);
                          setGeminiStatus('idle');
                        }}
                        placeholder="Enter your Gemini API key"
                        className="flex-1 bg-slate-900/50 border-purple-500/30 text-white"
                      />
                      <Button
                        onClick={() => copyApiKey(geminiKey, 'Gemini')}
                        variant="outline"
                        className="border-purple-500/30 text-purple-300"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  {geminiError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-sm text-red-400">{geminiError}</p>
                    </div>
                  )}

                  <Button
                    onClick={testGeminiConnection}
                    disabled={testingGemini}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {testingGemini ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing Connection...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Test Connection & Save
                      </>
                    )}
                  </Button>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                    <h4 className="text-blue-300 mb-2 flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      How to get your API key:
                    </h4>
                    <ol className="text-sm text-gray-300 space-y-1 ml-4 list-decimal">
                      <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Google AI Studio</a></li>
                      <li>Sign in with your Google account</li>
                      <li>Click "Get API Key" or "Create API Key"</li>
                      <li>Copy the generated key and paste it above</li>
                    </ol>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-sm text-yellow-300">
                      ⚡ Your API key is stored locally in your browser and never sent to our servers.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-purple-500/20">
                    <h4 className="text-purple-300 mb-2">Features powered by Gemini:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <MessageSquare className="w-4 h-4 text-purple-400 mb-1" />
                        <p className="text-sm text-gray-300">Character Chat</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <Sparkles className="w-4 h-4 text-purple-400 mb-1" />
                        <p className="text-sm text-gray-300">AI Character Creator</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <Brain className="w-4 h-4 text-purple-400 mb-1" />
                        <p className="text-sm text-gray-300">TERRA-AI Advisor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Image Generation Tab */}
            <TabsContent value="image" className="space-y-4 mt-4">
              <div className="space-y-4">
                {/* Stability AI */}
                <div className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-4">
                  <h3 className="text-purple-300 mb-3">Stability AI</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-300 mb-2 block">API Key</Label>
                      <Input
                        type="password"
                        value={stabilityKey}
                        onChange={(e) => setStabilityKey(e.target.value)}
                        placeholder="sk-..."
                        className="bg-slate-900/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Get your key from <a href="https://platform.stability.ai/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Stability AI Platform</a>
                    </p>
                  </div>
                </div>

                {/* DALL-E */}
                <div className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-4">
                  <h3 className="text-purple-300 mb-3">DALL-E (OpenAI)</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-300 mb-2 block">API Key</Label>
                      <Input
                        type="password"
                        value={dalleKey}
                        onChange={(e) => setDalleKey(e.target.value)}
                        placeholder="sk-..."
                        className="bg-slate-900/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">OpenAI Platform</a>
                    </p>
                  </div>
                </div>

                {/* Replicate */}
                <div className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-4">
                  <h3 className="text-purple-300 mb-3">Replicate</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-300 mb-2 block">API Key</Label>
                      <Input
                        type="password"
                        value={replicateKey}
                        onChange={(e) => setReplicateKey(e.target.value)}
                        placeholder="r8_..."
                        className="bg-slate-900/50 border-purple-500/30 text-white"
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Get your key from <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Replicate Dashboard</a>
                    </p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    💡 Image generation APIs are optional. The AI Character Creator works with placeholder images if no image API is configured.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}

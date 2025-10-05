import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Copy,
  Settings
} from 'lucide-react';
import { deepSeekAIService } from '../services/DeepSeekAIService';
import { toast } from 'sonner@2.0.3';
import { ModelTester } from './ModelTester';

interface APIDiagnosticsProps {
  onClose?: () => void;
}

export function APIDiagnostics({ onClose }: APIDiagnosticsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [modelsList, setModelsList] = useState<any>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const config = (deepSeekAIService as any).getConfig?.() || {
    model: 'Unknown',
    apiVersion: 'Unknown',
    endpoint: 'Unknown'
  };

  const handleListModels = async () => {
    setIsLoadingModels(true);
    setModelsList(null);

    try {
      // Try to list available models using v1beta API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCggWZ65woVi6tSjSSVtBnnSgvYSUp1glg`);
      
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setModelsList({
        success: true,
        models: data.models || [],
        timestamp: new Date().toISOString()
      });
      toast.success('Models list retrieved successfully!');
    } catch (error) {
      setModelsList({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      toast.error('Failed to list models - check console for details');
      console.error('List Models Error:', error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const context = {
        currentShard: 'Test Shard',
        playerLevel: 1,
        resources: { seeds: 10, water: 100, energy: 50, ecoPoints: 100 },
        activeCrops: 0,
        recentActions: ['test']
      };

      const response = await deepSeekAIService.askTerraAI('Hello, test connection', context);
      
      setTestResult({
        success: true,
        message: 'API connection successful!',
        response: response.message,
        timestamp: new Date().toISOString()
      });
      toast.success('API test successful!');
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      toast.error('API test failed - check console for details');
      console.error('API Test Error:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyConfig = () => {
    const configText = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(configText);
    toast.success('Configuration copied to clipboard');
  };

  const handleClearCache = () => {
    toast.info('Please manually clear browser cache: Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-black/80 border-[#6EE7B7] text-[#6EE7B7] hover:bg-black"
      >
        <Settings className="w-4 h-4 mr-2" />
        API Diagnostics
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-[#1E3A8A]/90 border-[#6EE7B7] p-6 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl text-[#E5E7EB] mb-2">API Diagnostics</h2>
            <p className="text-sm text-[#E5E7EB]/70">DeepSeek API Configuration & Testing</p>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="text-[#E5E7EB]"
          >
            ✕
          </Button>
        </div>

        {/* Configuration Info */}
        <div className="space-y-4">
          <div className="bg-black/40 border border-[#6EE7B7]/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[#FFD369]">Current Configuration</h3>
              <Button
                onClick={handleCopyConfig}
                size="sm"
                variant="ghost"
                className="text-[#6EE7B7]"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#E5E7EB]/70">Model:</span>
                <Badge className="bg-[#73C783]/20 text-[#73C783] border-[#73C783]/40">
                  {config.model}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#E5E7EB]/70">API Version:</span>
                <Badge className="bg-[#6EE7B7]/20 text-[#6EE7B7] border-[#6EE7B7]/40">
                  {config.apiVersion}
                </Badge>
              </div>
              <div className="mt-3">
                <span className="text-[#E5E7EB]/70 block mb-1">Endpoint:</span>
                <code className="text-xs text-[#FFD369] bg-black/60 p-2 rounded block break-all">
                  {config.endpoint}
                </code>
              </div>
              {config.timestamp && (
                <div className="text-xs text-[#E5E7EB]/50 mt-2">
                  Config loaded: {new Date(config.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Test Section */}
          <div className="bg-black/40 border border-[#FFD369]/30 rounded-lg p-4">
            <h3 className="text-[#FFD369] mb-3">Connection Test</h3>
            
            <div className="flex gap-3 mb-4">
              <Button
                onClick={handleTest}
                disabled={isTesting}
                className="flex-1 bg-gradient-to-r from-[#73C783] to-[#6EE7B7] text-black hover:from-[#6EE7B7] hover:to-[#73C783]"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Test API Connection
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleClearCache}
                variant="outline"
                className="border-[#FFD369] text-[#FFD369]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Cache
              </Button>

              <Button
                onClick={handleListModels}
                disabled={isLoadingModels}
                variant="outline"
                className="border-[#6EE7B7] text-[#6EE7B7]"
              >
                {isLoadingModels ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    List Models
                  </>
                )}
              </Button>
            </div>

            {testResult && (
              <div className={`border rounded-lg p-3 ${
                testResult.success 
                  ? 'border-[#73C783] bg-[#73C783]/10' 
                  : 'border-[#FF6B6B] bg-[#FF6B6B]/10'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-[#73C783]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#FF6B6B]" />
                  )}
                  <span className={testResult.success ? 'text-[#73C783]' : 'text-[#FF6B6B]'}>
                    {testResult.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                
                <p className="text-sm text-[#E5E7EB] mb-2">
                  {testResult.message}
                </p>
                
                {testResult.response && (
                  <div className="mt-2 text-xs text-[#E5E7EB]/70 bg-black/40 p-2 rounded">
                    Response: {testResult.response.substring(0, 200)}...
                  </div>
                )}
                
                <div className="text-xs text-[#E5E7EB]/50 mt-2">
                  {new Date(testResult.timestamp).toLocaleString()}
                </div>
              </div>
            )}

            {modelsList && (
              <div className={`border rounded-lg p-3 mt-4 ${
                modelsList.success 
                  ? 'border-[#73C783] bg-[#73C783]/10' 
                  : 'border-[#FF6B6B] bg-[#FF6B6B]/10'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {modelsList.success ? (
                    <CheckCircle className="w-5 h-5 text-[#73C783]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#FF6B6B]" />
                  )}
                  <span className={modelsList.success ? 'text-[#73C783]' : 'text-[#FF6B6B]'}>
                    Available Models
                  </span>
                </div>
                
                {modelsList.success ? (
                  <div className="text-sm text-[#E5E7EB] space-y-1">
                    <p className="mb-2">Found {modelsList.models.length} models:</p>
                    <div className="max-h-40 overflow-auto bg-black/40 p-2 rounded text-xs">
                      {modelsList.models.map((model: any, index: number) => (
                        <div key={index} className="mb-1">
                          <span className="text-[#6EE7B7]">{model.name?.replace('models/', '') || 'Unknown'}</span>
                          {model.supportedGenerationMethods?.includes('generateContent') && (
                            <span className="text-[#73C783] ml-2">✓ generateContent</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#E5E7EB]">Error: {modelsList.error}</p>
                )}
                
                <div className="text-xs text-[#E5E7EB]/50 mt-2">
                  {new Date(modelsList.timestamp).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Model Compatibility Tester */}
          <ModelTester />

          {/* Troubleshooting Tips */}
          <div className="bg-black/40 border border-[#FF6B6B]/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-[#FFD369]" />
              <h3 className="text-[#FFD369]">Troubleshooting</h3>
            </div>
            
            <div className="space-y-2 text-sm text-[#E5E7EB]/90">
              <div>
                <strong className="text-[#6EE7B7]">If you see 404 errors:</strong>
                <ul className="list-disc list-inside ml-2 text-[#E5E7EB]/70 mt-1 space-y-1">
                  <li>Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)</li>
                  <li>Use "Test All Models" above to find working endpoints</li>
                  <li>Click "List Models" to see officially available models</li>
                  <li>Check API key is valid at <a href="https://makersuite.google.com/app/apikey" target="_blank" className="text-[#6EE7B7] underline">Google AI Studio</a></li>
                </ul>
              </div>
              
              <div className="mt-3">
                <strong className="text-[#6EE7B7]">Smart Fallback System:</strong>
                <ul className="list-disc list-inside ml-2 text-[#E5E7EB]/70 mt-1 space-y-1">
                  <li>Primary: gemini-pro (v1beta)</li>
                  <li>Automatically tries 4 fallback endpoints</li>
                  <li>Self-healing: updates to working endpoint</li>
                  <li>Supports both v1beta and v1 APIs</li>
                </ul>
              </div>

              <div className="mt-3">
                <strong className="text-[#6EE7B7]">Model Testing:</strong>
                <p className="text-[#E5E7EB]/70 ml-2 mt-1">
                  The "Test All Models" tool above will identify which Gemini models work with your API key and show response times.
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={() => {
                setIsOpen(false);
                if (onClose) onClose();
              }}
              className="bg-[#1E3A8A] text-[#E5E7EB] hover:bg-[#1E3A8A]/80"
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
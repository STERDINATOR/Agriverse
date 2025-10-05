import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Loader2, Play } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ModelTestResult {
  model: string;
  apiVersion: string;
  status: 'testing' | 'success' | 'failed';
  statusCode?: number;
  error?: string;
  responseTime?: number;
}

export function ModelTester() {
  const [results, setResults] = useState<ModelTestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const modelsToTest = [
    { model: 'gemini-pro', apiVersion: 'v1beta' },
    { model: 'gemini-1.5-pro', apiVersion: 'v1beta' },
    { model: 'gemini-1.5-flash', apiVersion: 'v1beta' },
    { model: 'gemini-1.5-flash-latest', apiVersion: 'v1beta' },
    { model: 'gemini-pro', apiVersion: 'v1' },
    { model: 'gemini-1.5-pro', apiVersion: 'v1' },
    { model: 'gemini-1.5-flash', apiVersion: 'v1' },
  ];

  const testModel = async (model: string, apiVersion: string): Promise<ModelTestResult> => {
    const startTime = Date.now();
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent`;
    
    try {
      const response = await fetch(`${url}?key=AIzaSyCggWZ65woVi6tSjSSVtBnnSgvYSUp1glg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Hello, this is a test message.' }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100
          }
        })
      });

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        const hasResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        return {
          model,
          apiVersion,
          status: hasResponse ? 'success' : 'failed',
          statusCode: response.status,
          responseTime,
          error: hasResponse ? undefined : 'No content in response'
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          model,
          apiVersion,
          status: 'failed',
          statusCode: response.status,
          responseTime,
          error: errorData.error?.message || response.statusText
        };
      }
    } catch (error) {
      return {
        model,
        apiVersion,
        status: 'failed',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  };

  const runTests = async () => {
    setIsTesting(true);
    setResults([]);
    
    toast.info('Testing all Gemini models... This may take a moment.');

    // Initialize results with testing status
    const initialResults = modelsToTest.map(({ model, apiVersion }) => ({
      model,
      apiVersion,
      status: 'testing' as const
    }));
    setResults(initialResults);

    // Test each model
    for (let i = 0; i < modelsToTest.length; i++) {
      const { model, apiVersion } = modelsToTest[i];
      
      const result = await testModel(model, apiVersion);
      
      setResults(prev => prev.map((r, index) => 
        index === i ? result : r
      ));

      // Add small delay between requests to avoid rate limiting
      if (i < modelsToTest.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsTesting(false);
    
    const successCount = results.filter(r => r.status === 'success').length;
    if (successCount > 0) {
      toast.success(`Found ${successCount} working model(s)!`);
    } else {
      toast.error('No working models found. Check API key and permissions.');
    }
  };

  const getStatusIcon = (status: ModelTestResult['status']) => {
    switch (status) {
      case 'testing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: ModelTestResult['status']) => {
    switch (status) {
      case 'testing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
    }
  };

  return (
    <Card className="p-6 bg-black/40 border-[#6EE7B7]/30 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-[#FFD369] text-lg">Model Compatibility Test</h3>
          <p className="text-sm text-[#E5E7EB]/70">Test all Gemini models to find working endpoints</p>
        </div>
        <Button
          onClick={runTests}
          disabled={isTesting}
          className="bg-gradient-to-r from-[#73C783] to-[#6EE7B7] text-black hover:from-[#6EE7B7] hover:to-[#73C783]"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Test All Models
            </>
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={`${result.model}-${result.apiVersion}`}
                className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="text-sm text-[#E5E7EB]">
                      <span className="font-medium">{result.model}</span>
                      <span className="text-[#E5E7EB]/60 ml-2">({result.apiVersion})</span>
                    </div>
                    {result.error && (
                      <div className="text-xs text-red-400 mt-1">{result.error}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {result.responseTime && (
                    <span className="text-xs text-[#E5E7EB]/60">
                      {result.responseTime}ms
                    </span>
                  )}
                  {result.statusCode && (
                    <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                      {result.statusCode}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isTesting && results.length > 0 && (
            <div className="mt-4 p-3 bg-[#1E3A8A]/20 border border-[#6EE7B7]/30 rounded-lg">
              <h4 className="text-[#6EE7B7] text-sm font-medium mb-2">Summary</h4>
              <div className="text-sm text-[#E5E7EB]/90 space-y-1">
                <div>✅ Working: {results.filter(r => r.status === 'success').length}</div>
                <div>❌ Failed: {results.filter(r => r.status === 'failed').length}</div>
                
                {results.filter(r => r.status === 'success').length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#6EE7B7]/20">
                    <strong className="text-[#6EE7B7]">Recommended model:</strong>
                    <div className="mt-1">
                      {(() => {
                        const working = results.find(r => r.status === 'success');
                        return working ? (
                          <code className="text-xs bg-black/60 px-2 py-1 rounded text-[#FFD369]">
                            {working.apiVersion}/models/{working.model}:generateContent
                          </code>
                        ) : 'None found';
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
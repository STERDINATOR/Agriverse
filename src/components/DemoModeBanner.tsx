import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, X, Info, ExternalLink, Settings, Zap, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ApiKeyStorage } from '../utils/apiKeyStorage';
import { APIConfiguration } from './APIConfiguration';

export function DemoModeBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [apiStatus, setApiStatus] = useState<'demo' | 'real-time'>('demo');

  useEffect(() => {
    checkAPIStatus();
    
    // Check session dismissal
    if (sessionStorage.getItem('demoModeBannerDismissed')) {
      setIsDismissed(true);
    }
  }, []);

  const checkAPIStatus = () => {
    // Check if user has configured a DeepSeek API key
    const hasKey = ApiKeyStorage.hasDeepSeekKey();
    const isDemoMode = ApiKeyStorage.isDemoMode();
    
    setApiStatus(hasKey && !isDemoMode ? 'real-time' : 'demo');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('demoModeBannerDismissed', 'true');
  };

  const handleOpenConfig = () => {
    setShowConfig(true);
  };

  // Don't show if dismissed
  if (isDismissed) {
    return null;
  }

  // Show different message based on API status
  const isRealTime = apiStatus === 'real-time';

  return (
    <>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4">
        <Card className={`${
          isRealTime 
            ? 'bg-gradient-to-r from-green-500/95 to-emerald-500/95 border-green-400' 
            : 'bg-gradient-to-r from-[#FFD369]/95 to-[#FF8C42]/95 border-[#FFD369]'
        } shadow-2xl backdrop-blur-sm`}>
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  {isRealTime ? (
                    <CheckCircle2 className="w-5 h-5 text-black" />
                  ) : (
                    <Info className="w-5 h-5 text-black" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-black">
                    {isRealTime ? '✨ Real-Time AI Active' : 'Running in Demo Mode'}
                  </h3>
                  <Badge className="bg-black/20 text-black border-black/30">
                    {isRealTime ? (
                      <><Zap className="w-3 h-3 mr-1" /> Live AI Responses</>
                    ) : (
                      'Simulated AI Responses'
                    )}
                  </Badge>
                </div>
                
                {isRealTime ? (
                  <p className="text-sm text-black/90 mb-3">
                    Your DeepSeek API key is configured and working! All AI features (TERRA-AI, character chat, 
                    character creator) are using <strong>real-time AI responses</strong>. You can toggle back to 
                    Demo Mode in settings if needed.
                  </p>
                ) : (
                  <p className="text-sm text-black/90 mb-3">
                    All AI features are using intelligent simulated responses. <strong>All other features work normally</strong> including 
                    NASA climate data, farming, marketplace, and learning systems. Configure your DeepSeek API key for real-time AI!
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleOpenConfig}
                    size="sm"
                    className="bg-black text-[#FFD369] hover:bg-black/80"
                  >
                    <Settings className="w-3 h-3 mr-2" />
                    {isRealTime ? 'AI Settings' : 'Enable Real-Time AI'}
                  </Button>
                  
                  {!isRealTime && (
                    <Button
                      onClick={() => window.open('https://platform.deepseek.com/api_keys', '_blank')}
                      size="sm"
                      variant="outline"
                      className="border-black text-black hover:bg-black/10"
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Get DeepSeek API Key
                    </Button>
                  )}

                  <Button
                    onClick={() => {
                      toast.info(isRealTime 
                        ? 'Real-time AI provides dynamic, context-aware responses using DeepSeek AI' 
                        : 'Demo Mode provides realistic simulated responses based on game context'
                      );
                    }}
                    size="sm"
                    variant="ghost"
                    className="text-black hover:bg-black/10"
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="flex-shrink-0 text-black hover:bg-black/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {!isRealTime && (
              <div className="mt-3 pt-3 border-t border-black/20">
                <details className="text-xs text-black/80">
                  <summary className="cursor-pointer hover:text-black font-medium mb-1">
                    How to enable Real-Time AI
                  </summary>
                  <div className="mt-2 space-y-1 pl-4">
                    <p>1. Click "Enable Real-Time AI" button above</p>
                    <p>2. Get a free API key from <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="underline">DeepSeek Platform</a></p>
                    <p>3. Paste your API key (starts with "sk-") in the configuration</p>
                    <p>4. Click "Test Connection & Save" to activate</p>
                    <p className="mt-2 font-medium">✅ Your API key is stored locally and only used for AI requests</p>
                  </div>
                </details>
              </div>
            )}
          </div>
        </Card>
      </div>

      {showConfig && (
        <APIConfiguration onClose={() => {
          setShowConfig(false);
          checkAPIStatus();
        }} />
      )}
    </>
  );
}

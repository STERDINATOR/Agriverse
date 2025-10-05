import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Users,
  GraduationCap,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Globe,
  Tractor,
  Smartphone
} from 'lucide-react';

interface AccessibilityTutorialProps {
  onNavigate: (screen: string) => void;
}

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  audioScript: string;
  visual: React.ReactNode;
  interactiveElement?: React.ReactNode;
  keyTakeaway: string;
}

export function AccessibilityTutorial({ onNavigate }: AccessibilityTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [userType, setUserType] = useState<string | null>(null);

  const userTypes = [
    {
      id: 'beginner',
      title: 'New to Technology',
      description: 'I\'m not very familiar with computers or satellite data',
      icon: BookOpen,
      color: '#10B981'
    },
    {
      id: 'farmer',
      title: 'Experienced Farmer',
      description: 'I know farming but want to learn about NASA data',
      icon: Tractor,
      color: '#6366F1'
    },
    {
      id: 'tech-savvy',
      title: 'Tech-Savvy User',
      description: 'I\'m comfortable with technology and data analysis',
      icon: Smartphone,
      color: '#F59E0B'
    },
    {
      id: 'educator',
      title: 'Teacher/Educator',
      description: 'I want to learn to teach others about agricultural data',
      icon: GraduationCap,
      color: '#EF4444'
    }
  ];

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to AgriVerse',
      content: 'AgriVerse helps farmers use NASA satellite data to make better farming decisions. Think of satellites as helpful eyes in the sky that can see things we can\'t see from the ground.',
      audioScript: 'Welcome to AgriVerse! We\'re here to help you understand how NASA satellites can help with farming. Don\'t worry if this is new to you - we\'ll take it step by step.',
      visual: (
        <div className="text-center p-8">
          <div className="relative">
            <Globe className="w-24 h-24 text-[#6EE7B7] mx-auto mb-4" />
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFD369] rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              📡
            </motion.div>
          </div>
          <p className="text-[#E5E7EB] text-lg">Satellites + Farming = Better Decisions</p>
        </div>
      ),
      keyTakeaway: 'NASA satellites provide valuable information to help farmers make better decisions about their crops.'
    },
    {
      id: 'what-satellites-see',
      title: 'What Can Satellites See?',
      content: 'Satellites can measure things like soil moisture (how wet the soil is), plant health (how green and healthy crops are), and temperature. They take pictures using special cameras that can see things our eyes cannot.',
      audioScript: 'Satellites are like super-powered cameras in space. They can see how wet your soil is, how healthy your plants are, and how hot or cold the land is. It\'s like having a helpful friend watching your farm from the sky.',
      visual: (
        <div className="grid grid-cols-3 gap-4 p-6">
          <div className="text-center p-4 bg-[#1E3A8A]/20 rounded-lg">
            <div className="text-3xl mb-2">💧</div>
            <p className="text-[#6EE7B7] text-sm">Soil Moisture</p>
            <p className="text-[#94A3B8] text-xs">How wet the soil is</p>
          </div>
          <div className="text-center p-4 bg-[#73C783]/20 rounded-lg">
            <div className="text-3xl mb-2">🌱</div>
            <p className="text-[#73C783] text-sm">Plant Health</p>
            <p className="text-[#94A3B8] text-xs">How green crops are</p>
          </div>
          <div className="text-center p-4 bg-[#FFD369]/20 rounded-lg">
            <div className="text-3xl mb-2">🌡️</div>
            <p className="text-[#FFD369] text-sm">Temperature</p>
            <p className="text-[#94A3B8] text-xs">How hot the land is</p>
          </div>
        </div>
      ),
      keyTakeaway: 'Satellites can measure soil moisture, plant health, and temperature from space.'
    },
    {
      id: 'data-limitations',
      title: 'Understanding Data Limitations',
      content: 'Satellite data is very helpful, but it\'s not perfect. Think of it like weather forecasts - they give you a good idea, but you should also look outside your window. Satellites see large areas, so they might miss small details in your specific field.',
      audioScript: 'Just like weather forecasts, satellite data gives you helpful information, but it\'s not perfect. Satellites see big areas at once, so they might not catch every small detail in your specific field. That\'s why we always suggest using satellite data along with what you see and know about your own farm.',
      visual: (
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-900/20 rounded border border-green-500/30">
              <h4 className="text-green-400 text-sm mb-2">✅ Satellite Data Is Good For:</h4>
              <ul className="text-[#E5E7EB] text-xs space-y-1">
                <li>• Seeing big picture trends</li>
                <li>• Comparing different areas</li>
                <li>• Tracking changes over time</li>
                <li>• Planning ahead</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-900/20 rounded border border-yellow-500/30">
              <h4 className="text-yellow-400 text-sm mb-2">⚠️ Always Combine With:</h4>
              <ul className="text-[#E5E7EB] text-xs space-y-1">
                <li>• Your own observations</li>
                <li>• Local weather reports</li>
                <li>• Soil testing</li>
                <li>• Your farming experience</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      keyTakeaway: 'Satellite data is a helpful tool, but should be combined with local observations and farming experience.'
    },
    {
      id: 'simple-example',
      title: 'A Simple Example',
      content: 'Let\'s say your crops look a bit yellow. Satellite data might show that soil moisture is low in your area. This suggests you might need to water your crops. But you should also check your field in person - maybe the yellowing is from pests or a different problem.',
      audioScript: 'Here\'s a simple example: If your crops look yellow, satellite data might show that the soil in your area is dry. This gives you a clue that watering might help. But you should still walk your field to check - maybe the yellowing is from bugs or something else entirely.',
      visual: (
        <div className="p-6">
          <div className="bg-[#1E293B]/50 rounded-lg p-4 border border-[#1E3A8A]/30">
            <h4 className="text-[#FFD369] mb-3">Scenario: Yellow Crops 🌾</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#6EE7B7]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#6EE7B7] text-xs">1</span>
                </div>
                <div>
                  <p className="text-[#E5E7EB] text-sm">You notice crops looking yellow</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#6EE7B7]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#6EE7B7] text-xs">2</span>
                </div>
                <div>
                  <p className="text-[#E5E7EB] text-sm">Check satellite data - shows low soil moisture</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#6EE7B7]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#6EE7B7] text-xs">3</span>
                </div>
                <div>
                  <p className="text-[#E5E7EB] text-sm">Walk your field to confirm and look for other issues</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#73C783]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#73C783] text-xs">✓</span>
                </div>
                <div>
                  <p className="text-[#73C783] text-sm">Make informed decision about irrigation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      keyTakeaway: 'Use satellite data as a helpful clue, but always combine it with your own field observations.'
    },
    {
      id: 'getting-started',
      title: 'Getting Started in AgriVerse',
      content: 'In AgriVerse, we\'ve made everything as simple as possible. You can explore different farming scenarios, practice using NASA data, and learn at your own pace. Don\'t worry about making mistakes - this is a safe place to learn!',
      audioScript: 'We\'ve designed AgriVerse to be friendly and easy to use. You can practice with different farming situations, explore NASA data without any pressure, and learn step by step. Remember, there are no wrong answers here - this is your space to explore and learn.',
      visual: (
        <div className="grid grid-cols-2 gap-4 p-6">
          <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-4 text-center">
            <Lightbulb className="w-8 h-8 text-[#FFD369] mx-auto mb-2" />
            <h4 className="text-[#E5E7EB] text-sm mb-2">Learn by Doing</h4>
            <p className="text-[#94A3B8] text-xs">Try different scenarios and see what happens</p>
          </Card>
          <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-4 text-center">
            <Users className="w-8 h-8 text-[#6EE7B7] mx-auto mb-2" />
            <h4 className="text-[#E5E7EB] text-sm mb-2">Get Help</h4>
            <p className="text-[#94A3B8] text-xs">Virtual mentors guide you through each step</p>
          </Card>
          <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-4 text-center">
            <CheckCircle className="w-8 h-8 text-[#73C783] mx-auto mb-2" />
            <h4 className="text-[#E5E7EB] text-sm mb-2">Track Progress</h4>
            <p className="text-[#94A3B8] text-xs">See what you\'ve learned and what\'s next</p>
          </Card>
          <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-4 text-center">
            <HelpCircle className="w-8 h-8 text-[#FFD369] mx-auto mb-2" />
            <h4 className="text-[#E5E7EB] text-sm mb-2">Ask Questions</h4>
            <p className="text-[#94A3B8] text-xs">No question is too basic - we\'re here to help</p>
          </Card>
        </div>
      ),
      keyTakeaway: 'AgriVerse is designed to be a safe, supportive environment for learning about agricultural data.'
    }
  ];

  const currentTutorialStep = tutorialSteps[currentStep];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  // Simulate audio playback
  useEffect(() => {
    if (isPlaying && audioEnabled) {
      const timer = setTimeout(() => {
        setIsPlaying(false);
      }, 3000); // Simulate 3 second audio clip
      return () => clearTimeout(timer);
    }
  }, [isPlaying, audioEnabled]);

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 flex items-center justify-center">
        <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl mb-4 bg-gradient-to-r from-[#6EE7B7] to-[#73C783] bg-clip-text text-transparent">
              Welcome! Let's Personalize Your Experience
            </h2>
            <p className="text-[#E5E7EB]">
              Tell us about yourself so we can customize the tutorial for you:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setUserType(type.id)}
                className="p-6 text-left border rounded-lg transition-all hover:scale-105 bg-[#0F172A]/30 border-[#374151] hover:border-[#6EE7B7]/40 hover:bg-[#0F172A]/50"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${type.color}20` }}>
                    <type.icon className="w-6 h-6" style={{ color: type.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#E5E7EB] mb-2">{type.title}</h3>
                    <p className="text-[#94A3B8] text-sm">{type.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Button
          onClick={() => onNavigate('mainMenu')}
          className="mb-6 bg-[#1E3A8A]/20 text-[#6EE7B7] border border-[#1E3A8A]/40 hover:bg-[#1E3A8A]/30"
        >
          ← Back to Main Menu
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2 bg-gradient-to-r from-[#6EE7B7] to-[#73C783] bg-clip-text text-transparent">
              Getting Started Tutorial
            </h1>
            <Badge className="bg-[#FFD369]/20 text-[#FFD369]">
              {userTypes.find(t => t.id === userType)?.title}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-[#94A3B8] text-sm mb-2">
              Step {currentStep + 1} of {tutorialSteps.length}
            </div>
            <Progress value={((currentStep + 1) / tutorialSteps.length) * 100} className="w-32" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Audio Controls */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-[#1E293B]/30 rounded-lg border border-[#1E3A8A]/20">
          <Button
            onClick={() => setAudioEnabled(!audioEnabled)}
            size="sm"
            className={`${
              audioEnabled 
                ? 'bg-[#6EE7B7]/20 text-[#6EE7B7] border-[#6EE7B7]/40' 
                : 'bg-[#374151] text-[#94A3B8] border-[#4B5563]'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          
          {audioEnabled && (
            <>
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                size="sm"
                className="bg-[#FFD369]/20 text-[#FFD369] border border-[#FFD369]/40 hover:bg-[#FFD369]/30"
                disabled={!audioEnabled}
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'} Audio
              </Button>
              
              <div className="text-[#94A3B8] text-sm">
                {isPlaying ? '🔊 Playing audio explanation...' : 'Click play to hear audio explanation'}
              </div>
            </>
          )}
        </div>

        {/* Main Tutorial Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-8 mb-8">
              <h2 className="text-2xl text-[#E5E7EB] mb-6">{currentTutorialStep.title}</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[#E5E7EB] text-lg leading-relaxed mb-6">
                    {currentTutorialStep.content}
                  </p>
                  
                  {currentTutorialStep.interactiveElement && (
                    <div className="mb-6">
                      {currentTutorialStep.interactiveElement}
                    </div>
                  )}
                </div>
                
                <div className="bg-[#0F172A]/30 rounded-lg border border-[#374151] p-4">
                  {currentTutorialStep.visual}
                </div>
              </div>

              {/* Key Takeaway */}
              <div className="mt-8 p-4 bg-[#6EE7B7]/10 rounded-lg border border-[#6EE7B7]/20">
                <h4 className="text-[#6EE7B7] mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Key Takeaway
                </h4>
                <p className="text-[#E5E7EB] text-sm">{currentTutorialStep.keyTakeaway}</p>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="bg-[#374151] text-[#E5E7EB] border border-[#4B5563] hover:bg-[#4B5563] disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            <Button
              onClick={completeStep}
              className="bg-[#73C783]/20 text-[#73C783] border border-[#73C783]/40 hover:bg-[#73C783]/30"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Got It!
            </Button>

            {currentStep === tutorialSteps.length - 1 ? (
              <Button
                onClick={() => onNavigate('guidedFarmingPractice')}
                className="bg-[#6EE7B7]/20 text-[#6EE7B7] border border-[#6EE7B7]/40 hover:bg-[#6EE7B7]/30"
              >
                Start Practicing
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-[#6EE7B7]/20 text-[#6EE7B7] border border-[#6EE7B7]/40 hover:bg-[#6EE7B7]/30"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mt-8 p-6 bg-[#1E293B]/30 rounded-lg border border-[#1E3A8A]/20">
          <h3 className="text-[#6EE7B7] mb-4">Your Learning Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {tutorialSteps.map((step, index) => (
              <div
                key={step.id}
                className={`p-3 rounded text-center text-sm transition-colors ${
                  index === currentStep
                    ? 'bg-[#6EE7B7]/20 text-[#6EE7B7] border border-[#6EE7B7]/40'
                    : completedSteps.includes(index)
                    ? 'bg-[#73C783]/20 text-[#73C783] border border-[#73C783]/40'
                    : 'bg-[#374151]/20 text-[#94A3B8] border border-[#4B5563]/40'
                }`}
              >
                <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs">
                  {completedSteps.includes(index) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="text-xs">{step.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
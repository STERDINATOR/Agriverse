import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ArrowLeft, CloudRain, Sun, Snowflake, Wind, AlertCircle } from 'lucide-react';

interface ClimateTransitionProps {
  onNavigate: (screen: string) => void;
}

const weatherStages = [
  {
    name: 'Monsoon',
    icon: CloudRain,
    color: '#4ECDC4',
    description: 'Heavy rainfall saturating the soil',
    effects: ['Flooding risk', 'Root rot potential', 'Nutrient runoff'],
    duration: 45
  },
  {
    name: 'Drought',
    icon: Sun,
    color: '#FFD369',
    description: 'Extended dry period with high temperatures',
    effects: ['Water stress', 'Soil cracking', 'Crop wilting'],
    duration: 30
  },
  {
    name: 'Flash Flood',
    icon: CloudRain,
    color: '#FF6B6B',
    description: 'Sudden extreme precipitation event',
    effects: ['Erosion danger', 'Infrastructure damage', 'Seed displacement'],
    duration: 15
  },
  {
    name: 'Balance',
    icon: Sun,
    color: '#73C783',
    description: 'Optimal growing conditions achieved',
    effects: ['Increased yield', 'Healthy soil', 'Stable ecosystem'],
    duration: 60
  }
];

export function ClimateTransition({ onNavigate }: ClimateTransitionProps) {
  const [currentStage, setCurrentStage] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentStage(curr => (curr + 1) % weatherStages.length);
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const currentWeather = weatherStages[currentStage];
  const CurrentIcon = currentWeather.icon;

  return (
    <div className="min-h-screen w-full relative overflow-y-auto overflow-x-hidden">
      {/* Dynamic Background */}
      <motion.div
        key={currentStage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
        style={{
          background: currentStage === 0 ? 'linear-gradient(to bottom, #1E3A8A, #4ECDC4)' :
                     currentStage === 1 ? 'linear-gradient(to bottom, #FFD369, #FF6B6B)' :
                     currentStage === 2 ? 'linear-gradient(to bottom, #8B5A3C, #FF6B6B)' :
                     'linear-gradient(to bottom, #73C783, #6EE7B7)'
        }}
      />

      {/* Weather Effects */}
      <div className="absolute inset-0">
        {currentStage === 0 && (
          <>
            {/* Rain effect */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-8 bg-white/60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-2rem'
                }}
                animate={{
                  y: ['0vh', '110vh']
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </>
        )}

        {currentStage === 1 && (
          <>
            {/* Heat shimmer effect */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 20%, #FFD369 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 30%, #FF6B6B 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 70%, #FFD369 0%, transparent 50%)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            />
          </>
        )}

        {currentStage === 2 && (
          <>
            {/* Flood effect */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-[#4ECDC4]/60"
              animate={{
                height: ['0%', '30%', '20%', '40%', '15%']
              }}
              transition={{
                duration: 4,
                repeat: Infinity
              }}
            />
          </>
        )}

        {currentStage === 3 && (
          <>
            {/* Gentle particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#73C783] rounded-full opacity-40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  scale: [0.5, 1, 0.5],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <Button
          onClick={() => onNavigate('shardExplorer')}
          variant="ghost"
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Shard Map
        </Button>
        
        <h1 className="text-2xl text-white">Climate Transition Monitor</h1>

        <Button
          onClick={() => onNavigate('nasaData')}
          className="bg-white/20 text-white border border-white/30 hover:bg-white/30"
        >
          NASA Data
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-[calc(100vh-160px)] p-8">
        <div className="max-w-4xl w-full">
          {/* Current Weather Display */}
          <motion.div
            key={currentStage}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${currentWeather.color}20`, border: `3px solid ${currentWeather.color}` }}
              >
                <CurrentIcon className="w-12 h-12" style={{ color: currentWeather.color }} />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4">{currentWeather.name}</h2>
            <p className="text-xl text-white/80 mb-6">{currentWeather.description}</p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Stage Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-3 bg-white/20"
              />
            </div>
          </motion.div>

          {/* Effects and NASA Data */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Weather Effects */}
            <Card className="p-6 bg-black/30 border-white/20 backdrop-blur-sm">
              <h3 className="text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" style={{ color: currentWeather.color }} />
                Environmental Effects
              </h3>
              <div className="space-y-3">
                {currentWeather.effects.map((effect, index) => (
                  <motion.div
                    key={effect}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentWeather.color }}
                    />
                    <span className="text-white/80">{effect}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* NASA Climate Data */}
            <Card className="p-6 bg-black/30 border-white/20 backdrop-blur-sm">
              <h3 className="text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#6EE7B7] rounded-full animate-pulse" />
                NASA Climate Indicators
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Temperature Anomaly</span>
                  <span className="text-[#FF6B6B]">+{(1.2 + Math.sin(Date.now() / 5000) * 0.3).toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Precipitation Index</span>
                  <span className="text-[#4ECDC4]">{(85 + currentStage * 10).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Soil Moisture</span>
                  <span className="text-[#73C783]">{(60 - currentStage * 5).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Wind Speed</span>
                  <span className="text-[#FFD369]">{(12 + currentStage * 3).toFixed(0)} km/h</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Stage Timeline */}
          <div className="mt-8">
            <div className="flex justify-center space-x-8">
              {weatherStages.map((stage, index) => (
                <div
                  key={stage.name}
                  className={`text-center transition-opacity duration-500 ${
                    index === currentStage ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      index === currentStage ? 'ring-2 ring-white' : ''
                    }`}
                    style={{ backgroundColor: `${stage.color}20`, border: `2px solid ${stage.color}` }}
                  >
                    <stage.icon className="w-6 h-6" style={{ color: stage.color }} />
                  </div>
                  <span className="text-sm text-white/70">{stage.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 p-6 flex justify-center">
        <div className="flex gap-4">
          <Button
            onClick={() => onNavigate('farmingGameplay')}
            className="bg-white/20 text-white border border-white/30 hover:bg-white/30"
          >
            Adapt Farming Strategy
          </Button>
          <Button
            onClick={() => onNavigate('playerHub')}
            className="bg-[#73C783] text-black hover:bg-[#73C783]/80"
          >
            Return to Base
          </Button>
        </div>
      </div>
    </div>
  );
}
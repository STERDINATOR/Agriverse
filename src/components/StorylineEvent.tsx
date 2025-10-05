import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { X, AlertTriangle, Zap, Shield, Eye } from 'lucide-react';

interface StorylineEventProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

const events = [
  {
    id: 'locust-swarm',
    title: 'Locust Swarm Approaching',
    description: 'A massive swarm of genetically-enhanced locusts is heading toward your crops. NASA satellite imagery shows the swarm will arrive in 6 hours.',
    severity: 'high',
    image: '🦗',
    choices: [
      {
        id: 'water-orb',
        text: 'Use Water Orb Defense',
        description: 'Create a protective water barrier',
        cost: 'Water: -50L',
        effect: '+30% Crop Protection',
        color: '#4ECDC4'
      },
      {
        id: 'ai-drone',
        text: 'Deploy AI Drone Swarm',
        description: 'Counter-attack with friendly drones',
        cost: 'Energy: -75',
        effect: '+50% Swarm Dispersal',
        color: '#6EE7B7'
      },
      {
        id: 'hide-crops',
        text: 'Hide Crops Underground',
        description: 'Temporarily retract all vegetation',
        cost: 'Time: -2 days growth',
        effect: '+90% Crop Survival',
        color: '#8B5A3C'
      }
    ]
  },
  {
    id: 'soil-contamination',
    title: 'Soil Contamination Detected',
    description: 'Chemical runoff from a nearby industrial accident has seeped into your shard. The contamination will spread if not contained.',
    severity: 'medium',
    image: '☢️',
    choices: [
      {
        id: 'bio-remediation',
        text: 'Deploy Bio-Remediation Plants',
        description: 'Use engineered plants to absorb toxins',
        cost: 'Eco Points: -200',
        effect: '+70% Soil Recovery',
        color: '#73C783'
      },
      {
        id: 'quarantine',
        text: 'Quarantine Affected Area',
        description: 'Seal contaminated sections',
        cost: 'Farm Area: -25%',
        effect: '+100% Containment',
        color: '#FFD369'
      }
    ]
  }
];

export function StorylineEvent({ isOpen, onClose, onNavigate }: StorylineEventProps) {
  const [currentEvent] = React.useState(events[0]);
  const [selectedChoice, setSelectedChoice] = React.useState<string | null>(null);

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId);
    // Simulate choice resolution
    setTimeout(() => {
      onClose();
      onNavigate('farmingGameplay');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="max-w-4xl w-full"
          >
            <Card className="p-0 bg-black/90 border-[#FF6B6B]/30 backdrop-blur-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#FF6B6B]/20 border-2 border-[#FF6B6B] flex items-center justify-center text-3xl">
                      {currentEvent.image}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl text-[#E5E7EB]">{currentEvent.title}</h2>
                        <Badge 
                          className={`${
                            currentEvent.severity === 'high' ? 'bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/40' :
                            'bg-[#FFD369]/20 text-[#FFD369] border-[#FFD369]/40'
                          }`}
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {currentEvent.severity.toUpperCase()} PRIORITY
                        </Badge>
                      </div>
                      <p className="text-[#E5E7EB]/80">{currentEvent.description}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="text-[#E5E7EB]/60 hover:text-[#E5E7EB] hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Event Visual */}
              <div className="relative h-48 bg-gradient-to-br from-[#1E3A8A]/60 to-[#FF6B6B]/40 flex items-center justify-center overflow-hidden">
                {/* Animated background effects */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      'radial-gradient(circle at 20% 20%, #FF6B6B40 0%, transparent 50%)',
                      'radial-gradient(circle at 80% 80%, #FF6B6B60 0%, transparent 50%)',
                      'radial-gradient(circle at 50% 50%, #FF6B6B40 0%, transparent 50%)'
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* Threat visualization */}
                <div className="relative z-10 text-center text-[#E5E7EB]">
                  <motion.div
                    className="text-8xl mb-4"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentEvent.image}
                  </motion.div>
                  <div className="text-sm opacity-70">
                    Threat Level: {currentEvent.severity === 'high' ? 'CRITICAL' : 'MODERATE'}
                  </div>
                </div>

                {/* Danger particles */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-[#FF6B6B] rounded-full opacity-60"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>

              {/* Choice Selection */}
              <div className="p-6">
                <h3 className="text-xl text-[#E5E7EB] mb-4">Choose Your Response:</h3>
                
                {selectedChoice ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-[#73C783] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-black" />
                    </div>
                    <h4 className="text-xl text-[#73C783] mb-2">Action Executing...</h4>
                    <p className="text-[#E5E7EB]/70">
                      {currentEvent.choices.find(c => c.id === selectedChoice)?.description}
                    </p>
                    <motion.div
                      className="w-32 h-1 bg-[#73C783]/20 rounded-full mx-auto mt-4 overflow-hidden"
                    >
                      <motion.div
                        className="h-full bg-[#73C783]"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2 }}
                      />
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="grid gap-4">
                    {currentEvent.choices.map((choice, index) => (
                      <motion.div
                        key={choice.id}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className="p-4 bg-black/40 border-white/10 hover:border-white/30 cursor-pointer transition-all duration-300 hover:bg-black/60"
                          onClick={() => handleChoiceSelect(choice.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${choice.color}20`, border: `2px solid ${choice.color}` }}
                            >
                              {choice.id === 'water-orb' && <Shield className="w-6 h-6" style={{ color: choice.color }} />}
                              {choice.id === 'ai-drone' && <Zap className="w-6 h-6" style={{ color: choice.color }} />}
                              {choice.id === 'hide-crops' && <Eye className="w-6 h-6" style={{ color: choice.color }} />}
                              {choice.id === 'bio-remediation' && <Shield className="w-6 h-6" style={{ color: choice.color }} />}
                              {choice.id === 'quarantine' && <AlertTriangle className="w-6 h-6" style={{ color: choice.color }} />}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-[#E5E7EB]">{choice.text}</h4>
                                <Badge className="text-xs bg-white/10 text-[#E5E7EB]/70">
                                  {choice.cost}
                                </Badge>
                              </div>
                              <p className="text-sm text-[#E5E7EB]/70 mb-2">{choice.description}</p>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: choice.color }} />
                                <span className="text-xs" style={{ color: choice.color }}>{choice.effect}</span>
                              </div>
                            </div>

                            <div className="text-[#E5E7EB]/40">
                              <motion.div
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                →
                              </motion.div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex justify-between items-center text-sm text-[#E5E7EB]/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#6EE7B7] rounded-full animate-pulse" />
                    <span>Real-time event simulation</span>
                  </div>
                  <div>
                    Choose wisely - your decision affects the entire shard ecosystem
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play } from 'lucide-react';

interface StartPageProps {
  onNavigate: (screen: string) => void;
}

export function StartPage({ onNavigate }: StartPageProps) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Multi-layer Animated Background */}
      
      {/* Base Satellite/Farm Background */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.8, 0.9, 0.8]
        }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1599120657548-b0b0124c911c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTk1OTYwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      />
      
      {/* Animated Agricultural Fields Overlay */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        animate={{ 
          scale: [1.05, 1, 1.05],
          x: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 25, repeat: Infinity }}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1684229864513-8399b70a838d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHh8fDE3NTk1OTc2OTd8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Animated Game-like Gradient Overlay */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(30, 58, 138, 0.85) 0%, rgba(30, 27, 75, 0.80) 50%, rgba(15, 23, 42, 0.90) 100%)',
            'linear-gradient(90deg, rgba(30, 58, 138, 0.80) 0%, rgba(30, 27, 75, 0.85) 50%, rgba(15, 23, 42, 0.85) 100%)',
            'linear-gradient(135deg, rgba(30, 58, 138, 0.85) 0%, rgba(30, 27, 75, 0.80) 50%, rgba(15, 23, 42, 0.90) 100%)'
          ]
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      
      {/* Floating Farm Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`farm-${i}`}
            className="absolute text-4xl opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            {['🌾', '🚜', '🌱', '🌽', '🥕', '🍅', '🌿', '🌳'][i]}
          </motion.div>
        ))}
      </div>
      
      {/* Animated Data Grid Network */}
      <motion.div 
        className="absolute inset-0"
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(110, 231, 183, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(110, 231, 183, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </motion.div>
      
      {/* Climate Data Visualization Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`data-${i}`}
            className="absolute w-2 h-2 bg-[#6EE7B7] rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1, 0.5, 1, 0],
              opacity: [0, 0.8, 0.4, 0.8, 0]
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 6
            }}
          />
        ))}
      </div>
      
      {/* Pulsing Climate Monitoring Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={`ring-${ring}`}
            className="absolute border border-[#73C783]/20 rounded-full"
            animate={{
              scale: [0, 3, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: ring * 2
            }}
            style={{
              width: '100px',
              height: '100px'
            }}
          />
        ))}
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#6EE7B7]/30 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 12,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Logo/Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.div className="relative">
            <motion.h1 
              className="text-6xl md:text-8xl text-white mb-4 relative z-10"
              animate={{ 
                textShadow: [
                  '0 0 20px #6EE7B7', 
                  '0 0 40px #6EE7B7, 0 0 60px #73C783', 
                  '0 0 20px #6EE7B7'
                ] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              AgriVerse
            </motion.h1>
            
            {/* Animated Farm Icons around title */}
            <motion.div
              className="absolute -top-8 -left-8 text-4xl"
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1, 0.8],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🌾
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-8 text-3xl"
              animate={{
                rotate: [360, 0],
                y: [0, -10, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              🚜
            </motion.div>
            <motion.div
              className="absolute -bottom-4 left-4 text-4xl"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 2 }}
            >
              🌍
            </motion.div>
          </motion.div>
          
          <motion.div className="relative mb-3">
            <motion.p 
              className="text-xl md:text-2xl text-[#6EE7B7] relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              The Climate Survival Shards
            </motion.p>
            
            {/* Floating climate data elements */}
            <motion.div
              className="absolute -left-20 top-0 text-xs text-[#6EE7B7] opacity-60 bg-black/20 px-2 py-1 rounded"
              animate={{
                x: [0, 10, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              CO₂: 415ppm ↗
            </motion.div>
            <motion.div
              className="absolute -right-24 -top-1 text-xs text-[#FFD369] opacity-60 bg-black/20 px-2 py-1 rounded"
              animate={{
                x: [0, -10, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
            >
              Temp: +1.2°C 🌡️
            </motion.div>
            <motion.div
              className="absolute -left-16 -bottom-4 text-xs text-[#73C783] opacity-60 bg-black/20 px-2 py-1 rounded"
              animate={{
                y: [0, -5, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            >
              🌧️ Rainfall: -15%
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-base md:text-lg text-[#E5E7EB]/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Embark on an epic farming adventure across climate-altered worlds. 
            Master sustainable agriculture, battle environmental crises, and restore ecological balance 
            with the power of real NASA climate data and AI companions.
          </motion.p>
        </motion.div>

        {/* Enhanced Game-like CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          {/* Button Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#73C783] to-[#6EE7B7] rounded-2xl opacity-50 blur-lg"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Pulsing Ring */}
          <motion.div
            className="absolute inset-0 border-2 border-[#6EE7B7] rounded-2xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 0.3, 0.8]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          <Button
            onClick={() => onNavigate('playerHub')}
            className="relative bg-gradient-to-r from-[#73C783] to-[#6EE7B7] hover:from-[#6EE7B7] hover:to-[#73C783] text-black text-xl px-12 py-6 h-auto rounded-2xl transition-all duration-300 transform shadow-2xl border-2 border-[#73C783]/50"
          >
            <motion.div
              className="flex items-center"
              animate={{
                x: [0, 2, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play className="w-6 h-6 mr-3" />
              Start Journey
            </motion.div>
            
            {/* Button sparkles */}
            <motion.div
              className="absolute top-1 right-4 text-xs"
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              ✨
            </motion.div>
          </Button>
        </motion.div>

        {/* Subtitle */}
        <motion.p 
          className="text-[#E5E7EB]/60 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Your farming adventure awaits in the climate survival shards
        </motion.p>


      </div>
    </div>
  );
}
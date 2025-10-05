import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './components/ui/button';
import { StartPage } from './components/StartPage';
import { MainMenu } from './components/MainMenu';
import { PlayerHub } from './components/PlayerHub';
import { ShardExplorer } from './components/ShardExplorer';
import { ClimateTransition } from './components/ClimateTransition';
import { FarmingGameplay } from './components/FarmingGameplay';
import { NASADataPanel } from './components/NASADataPanel';
import { StorylineEvent } from './components/StorylineEvent';
import { MentorSelection } from './components/MentorSelection';
import { PetCompanion } from './components/PetCompanion';
import { BossBattle } from './components/BossBattle';
import { FarmCardInventory } from './components/FarmCardInventory';
import { SquadLobby } from './components/SquadLobby';
import { ArenaMode } from './components/ArenaMode';
import { GameProvider } from './contexts/GameContext';
import { Toaster } from './components/ui/sonner';
import { GameGuide } from './components/GameGuide';
import { TerraAI } from './components/TerraAI';
import { CharacterCustomization } from './components/CharacterCustomization';
import { PetCustomization } from './components/PetCustomization';
import { AnimatedFarmingGameplay } from './components/AnimatedFarmingGameplay';
import { CharacterChat } from './components/CharacterChat';
import { AICharacterCreator } from './components/AICharacterCreator';
import { WorldMap } from './components/WorldMap';
import { EnhancedWorldMap } from './components/EnhancedWorldMap';
import { GoogleMapsWorldExplorer } from './components/GoogleMapsWorldExplorer';
import { LocationShard } from './components/LocationShard';
import { GlobalMarketplace } from './components/GlobalMarketplace';
import { EnhancedCharacterChat } from './components/EnhancedCharacterChat';
import { EnhancedAICharacterCreator } from './components/EnhancedAICharacterCreator';
import { LearningHub } from './components/LearningHub';
import { FeaturesOverview } from './components/FeaturesOverview';
import { FarmShop } from './components/FarmShop';
import { GuidedFarmingPractice } from './components/GuidedFarmingPractice';
import { FarmDashboard } from './components/FarmDashboard';
import { APIDiagnostics } from './components/APIDiagnostics';
import { DemoModeBanner } from './components/DemoModeBanner';
import { NASAEducationalHub } from './components/NASAEducationalHub';
import { DataVisualizationCenter } from './components/DataVisualizationCenter';
import { AccessibilityTutorial } from './components/AccessibilityTutorial';
import { EnhancedNASADataService } from './components/EnhancedNASADataService';
import { GameFeaturesHub } from './components/GameFeaturesHub';
import { ComprehensiveFeaturesShowcase } from './components/ComprehensiveFeaturesShowcase';

type Screen = 
  | 'startPage'
  | 'mainMenu' 
  | 'playerHub' 
  | 'shardExplorer' 
  | 'climateTransition' 
  | 'farmingGameplay' 
  | 'animatedFarming'
  | 'nasaData'
  | 'mentorSelection'
  | 'petCompanion'
  | 'bossBattle'
  | 'farmCards'
  | 'squadLobby'
  | 'arenaMode'
  | 'terraAI'
  | 'characterCustomization'
  | 'petCustomization'
  | 'characterChat'
  | 'aiCharacterCreator'
  | 'worldMap'
  | 'enhancedWorldMap'
  | 'googleMapsExplorer'
  | 'locationShard'
  | 'globalMarketplace'
  | 'learningHub'
  | 'enhancedCharacterChat'
  | 'enhancedAICharacterCreator'
  | 'featuresOverview'
  | 'farmShop'
  | 'guidedFarmingPractice'
  | 'farmDashboard'
  | 'nasaEducationalHub'
  | 'dataVisualizationCenter'
  | 'accessibilityTutorial'
  | 'enhancedNASADataService'
  | 'gameFeaturesHub'
  | 'comprehensiveFeaturesShowcase';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('startPage');
  const [showStoryEvent, setShowStoryEvent] = useState(false);
  const [navigationData, setNavigationData] = useState<any>(null);

  const handleNavigate = (screen: Screen, data?: any) => {
    setCurrentScreen(screen);
    setNavigationData(data);
  };

  const handleStoryEventTrigger = () => {
    setShowStoryEvent(true);
  };

  const handleCloseStoryEvent = () => {
    setShowStoryEvent(false);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'startPage':
        return <StartPage onNavigate={handleNavigate} />;
      case 'mainMenu':
        return <MainMenu onNavigate={handleNavigate} />;
      case 'playerHub':
        return <PlayerHub onNavigate={handleNavigate} />;
      case 'shardExplorer':
        return <ShardExplorer onNavigate={handleNavigate} />;
      case 'climateTransition':
        return <ClimateTransition onNavigate={handleNavigate} />;
      case 'farmingGameplay':
        return <FarmingGameplay onNavigate={handleNavigate} />;
      case 'animatedFarming':
        return <AnimatedFarmingGameplay onNavigate={handleNavigate} />;
      case 'nasaData':
        return <NASADataPanel onNavigate={handleNavigate} />;
      case 'mentorSelection':
        return <MentorSelection onNavigate={handleNavigate} />;
      case 'petCompanion':
        return <PetCompanion onNavigate={handleNavigate} />;
      case 'bossBattle':
        return <BossBattle bossId="drought-titan" onNavigate={handleNavigate} />;
      case 'farmCards':
        return <FarmCardInventory onNavigate={handleNavigate} />;
      case 'squadLobby':
        return <SquadLobby onNavigate={handleNavigate} />;
      case 'arenaMode':
        return <ArenaMode onNavigate={handleNavigate} />;
      case 'terraAI':
        return <TerraAI onNavigate={handleNavigate} />;
      case 'characterCustomization':
        return <CharacterCustomization onNavigate={handleNavigate} />;
      case 'petCustomization':
        return <PetCustomization onNavigate={handleNavigate} />;
      case 'characterChat':
        return <CharacterChat onNavigate={handleNavigate} />;
      case 'aiCharacterCreator':
        return <AICharacterCreator onNavigate={handleNavigate} />;
      case 'worldMap':
        return <WorldMap onNavigate={handleNavigate} />;
      case 'enhancedWorldMap':
        return <EnhancedWorldMap onNavigate={handleNavigate} />;
      case 'googleMapsExplorer':
        return <GoogleMapsWorldExplorer onNavigate={handleNavigate} />;
      case 'locationShard':
        return <LocationShard onNavigate={handleNavigate} locationData={navigationData} />;
      case 'globalMarketplace':
        return <GlobalMarketplace onNavigate={handleNavigate} />;
      case 'learningHub':
        return <LearningHub onNavigate={handleNavigate} />;
      case 'enhancedCharacterChat':
        return <EnhancedCharacterChat onNavigate={handleNavigate} />;
      case 'enhancedAICharacterCreator':
        return <EnhancedAICharacterCreator onNavigate={handleNavigate} />;
      case 'featuresOverview':
        return <FeaturesOverview onNavigate={handleNavigate} />;
      case 'farmShop':
        return <FarmShop onNavigate={handleNavigate} />;
      case 'guidedFarmingPractice':
        return <GuidedFarmingPractice onNavigate={handleNavigate} />;
      case 'farmDashboard':
        return <FarmDashboard onNavigate={handleNavigate} />;
      case 'nasaEducationalHub':
        return <NASAEducationalHub onNavigate={handleNavigate} />;
      case 'dataVisualizationCenter':
        return <DataVisualizationCenter onNavigate={handleNavigate} />;
      case 'accessibilityTutorial':
        return <AccessibilityTutorial onNavigate={handleNavigate} />;
      case 'enhancedNASADataService':
        return <EnhancedNASADataService onNavigate={handleNavigate} />;
      case 'gameFeaturesHub':
        return <GameFeaturesHub onNavigate={handleNavigate} />;
      case 'comprehensiveFeaturesShowcase':
        return <ComprehensiveFeaturesShowcase onNavigate={handleNavigate} />;
      default:
        return <StartPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <div className="w-full h-full overflow-x-hidden overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ 
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="w-full min-h-full"
          >
            <div className="w-full min-h-screen overflow-y-auto">
              {renderScreen()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Story Event Overlay */}
      <StorylineEvent
        isOpen={showStoryEvent}
        onClose={handleCloseStoryEvent}
        onNavigate={handleNavigate}
      />

      {/* Game Debug Controls (for development) */}
      <div className="fixed bottom-4 left-4 z-50 flex gap-2">
        <Button
          onClick={handleStoryEventTrigger}
          size="sm"
          className="bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/30"
        >
          Trigger Event
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <DemoModeBanner />
      <AppContent />
      <GameGuide />
      <APIDiagnostics />
      <Toaster position="top-right" richColors />
    </GameProvider>
  );
}

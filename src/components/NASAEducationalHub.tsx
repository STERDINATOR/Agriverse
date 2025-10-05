import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Satellite, 
  Thermometer, 
  Droplets, 
  Sprout, 
  Info, 
  BookOpen, 
  Target,
  AlertTriangle,
  CheckCircle,
  Eye,
  Lightbulb
} from 'lucide-react';

interface NASAEducationalHubProps {
  onNavigate: (screen: string) => void;
}

export function NASAEducationalHub({ onNavigate }: NASAEducationalHubProps) {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [currentDataExample, setCurrentDataExample] = useState(0);

  const educationalModules = [
    {
      id: 'nasa-basics',
      title: 'NASA Agricultural Data Fundamentals',
      description: 'Learn what NASA satellite data can tell us about farming',
      icon: Satellite,
      duration: '15 min',
      difficulty: 'Beginner',
      concepts: [
        'What satellites can observe from space',
        'Different types of agricultural data',
        'Resolution and what it means for your farm',
        'Temporal frequency - how often data updates'
      ]
    },
    {
      id: 'soil-moisture',
      title: 'Understanding Soil Moisture Data',
      description: 'Decode soil moisture measurements and their farming applications',
      icon: Droplets,
      duration: '20 min',
      difficulty: 'Intermediate',
      concepts: [
        'Surface vs. root zone moisture',
        'SMAP data at 36km resolution',
        'When soil moisture data is most useful',
        'Limitations and seasonal variations'
      ]
    },
    {
      id: 'temperature-analysis',
      title: 'Land Surface Temperature Insights',
      description: 'Learn how temperature data guides farming decisions',
      icon: Thermometer,
      duration: '18 min',
      difficulty: 'Intermediate',
      concepts: [
        'Day vs. night temperature patterns',
        'Urban heat island effects on agriculture',
        'Frost prediction and crop protection',
        'Growing degree day calculations'
      ]
    },
    {
      id: 'vegetation-health',
      title: 'Vegetation Indices & Crop Health',
      description: 'Master NDVI and other vegetation health indicators',
      icon: Sprout,
      duration: '25 min',
      difficulty: 'Advanced',
      concepts: [
        'NDVI basics and interpretation',
        'Seasonal vegetation patterns',
        'Early stress detection in crops',
        'Comparing different field areas'
      ]
    }
  ];

  const dataLimitationsExamples = [
    {
      dataset: 'SMAP Soil Moisture',
      resolution: '36 km',
      limitation: 'Too coarse for individual field management',
      bestUse: 'Regional drought monitoring and irrigation planning',
      misuse: 'Deciding irrigation for a specific 10-acre field'
    },
    {
      dataset: 'MODIS Land Surface Temperature',
      resolution: '1 km',
      limitation: 'Surface temperature, not air temperature',
      bestUse: 'Identifying heat stress patterns across farms',
      misuse: 'Replacing weather station air temperature readings'
    },
    {
      dataset: 'Landsat NDVI',
      resolution: '30 m',
      limitation: '16-day revisit time, cloud interference',
      bestUse: 'Monthly crop health monitoring and yield prediction',
      misuse: 'Daily crop stress detection'
    }
  ];

  const practicalScenarios = [
    {
      title: 'Small-Scale Organic Farm (5 acres)',
      context: 'Family-owned vegetable farm in California',
      challenge: 'Water conservation during drought conditions',
      nasaData: ['SMAP soil moisture', 'MODIS evapotranspiration'],
      application: 'Use regional moisture trends to optimize irrigation timing',
      limitation: 'Data resolution too coarse for precise field management'
    },
    {
      title: 'Mid-Size Corn Operation (500 acres)',
      context: 'Commercial corn farm in Iowa',
      challenge: 'Early detection of crop stress',
      nasaData: ['Landsat NDVI', 'MODIS surface temperature'],
      application: 'Monitor vegetation health across field zones',
      limitation: 'Weather delays can affect satellite image availability'
    },
    {
      title: 'Large Agricultural Cooperative',
      context: 'Managing 10,000+ acres across multiple states',
      challenge: 'Regional yield forecasting and resource allocation',
      nasaData: ['Multiple satellite datasets', 'Climate models'],
      application: 'Regional trend analysis and strategic planning',
      limitation: 'Local microclimates may differ from satellite observations'
    }
  ];

  const interactiveQuiz = [
    {
      question: "A farmer wants to use satellite data to decide when to water their 2-acre tomato patch. Which NASA dataset would be MOST appropriate?",
      options: [
        "SMAP soil moisture (36km resolution)",
        "Local weather station data combined with field sensors", 
        "MODIS vegetation indices (250m resolution)",
        "GRACE groundwater data (300km resolution)"
      ],
      correct: 1,
      explanation: "For a 2-acre field, satellite data resolution is too coarse. Local sensors provide the precision needed for small-field irrigation decisions."
    },
    {
      question: "You notice your NDVI values are lower than expected in July. What should you check first?",
      options: [
        "Soil moisture levels immediately",
        "Recent cloud cover and image quality",
        "Pest infestations in the field",
        "Fertilizer application records"
      ],
      correct: 1,
      explanation: "Always verify data quality first. Clouds, atmospheric conditions, or sensor issues can affect NDVI readings."
    }
  ];

  const startLesson = (moduleId: string) => {
    setActiveLesson(moduleId);
  };

  const completeLesson = (moduleId: string) => {
    if (!completedLessons.includes(moduleId)) {
      setCompletedLessons([...completedLessons, moduleId]);
    }
    setActiveLesson(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDataExample((prev) => (prev + 1) % dataLimitationsExamples.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Button
          onClick={() => onNavigate('mainMenu')}
          className="mb-6 bg-[#1E3A8A]/20 text-[#6EE7B7] border border-[#1E3A8A]/40 hover:bg-[#1E3A8A]/30"
        >
          ← Back to Main Menu
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4 bg-gradient-to-r from-[#6EE7B7] to-[#73C783] bg-clip-text text-transparent">
            NASA Agricultural Data Academy
          </h1>
          <p className="text-[#E5E7EB] text-lg max-w-3xl mx-auto">
            Master the science behind satellite farming data. Learn what NASA datasets can and cannot tell you, 
            and how to apply this knowledge to real-world agricultural decisions.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-[#1E293B]/50 rounded-xl p-6 border border-[#1E3A8A]/30 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#6EE7B7] flex items-center gap-2">
              <Target className="w-5 h-5" />
              Learning Progress
            </h3>
            <Badge className="bg-[#FFD369]/20 text-[#FFD369]">
              {completedLessons.length} / {educationalModules.length} Complete
            </Badge>
          </div>
          <Progress 
            value={(completedLessons.length / educationalModules.length) * 100} 
            className="h-3"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="modules">Learning Modules</TabsTrigger>
            <TabsTrigger value="limitations">Data Limitations</TabsTrigger>
            <TabsTrigger value="scenarios">Real-World Cases</TabsTrigger>
            <TabsTrigger value="quiz">Knowledge Check</TabsTrigger>
          </TabsList>

          {/* Learning Modules */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educationalModules.map((module) => (
                <Card key={module.id} className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-[#6EE7B7]/10">
                      <module.icon className="w-6 h-6 text-[#6EE7B7]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-[#E5E7EB]">{module.title}</h3>
                        {completedLessons.includes(module.id) && (
                          <CheckCircle className="w-5 h-5 text-[#73C783]" />
                        )}
                      </div>
                      <p className="text-[#94A3B8] text-sm mb-3">{module.description}</p>
                      <div className="flex gap-2 mb-4">
                        <Badge className="bg-[#1E3A8A]/20 text-[#6EE7B7]">{module.duration}</Badge>
                        <Badge className="bg-[#FFD369]/20 text-[#FFD369]">{module.difficulty}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-[#E5E7EB] text-sm mb-2">You'll Learn:</h4>
                    <ul className="text-[#94A3B8] text-sm space-y-1">
                      {module.concepts.map((concept, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-[#6EE7B7] rounded-full mt-2 flex-shrink-0" />
                          {concept}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => startLesson(module.id)}
                    className="w-full bg-[#6EE7B7]/20 text-[#6EE7B7] border border-[#6EE7B7]/40 hover:bg-[#6EE7B7]/30"
                    disabled={activeLesson === module.id}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {completedLessons.includes(module.id) ? 'Review Lesson' : 'Start Learning'}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Data Limitations */}
          <TabsContent value="limitations" className="space-y-6">
            <div className="bg-[#1E293B]/50 rounded-xl p-6 border border-[#1E3A8A]/30 mb-6">
              <h3 className="text-[#FFD369] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Understanding Data Limitations is Critical
              </h3>
              <p className="text-[#E5E7EB] mb-4">
                NASA satellite data is incredibly powerful, but knowing its limitations prevents costly mistakes. 
                Here are real examples of what each dataset can and cannot do:
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentDataExample}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[#6EE7B7] mb-2">
                        {dataLimitationsExamples[currentDataExample].dataset}
                      </h4>
                      <p className="text-[#94A3B8] text-sm mb-4">
                        Resolution: {dataLimitationsExamples[currentDataExample].resolution}
                      </p>
                      <div className="space-y-3">
                        <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                          <h5 className="text-red-400 text-sm mb-1">❌ Limitation:</h5>
                          <p className="text-[#E5E7EB] text-sm">
                            {dataLimitationsExamples[currentDataExample].limitation}
                          </p>
                        </div>
                        <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                          <h5 className="text-green-400 text-sm mb-1">✅ Best Use:</h5>
                          <p className="text-[#E5E7EB] text-sm">
                            {dataLimitationsExamples[currentDataExample].bestUse}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-[#0F172A]/50 rounded-lg">
                      <h5 className="text-[#FFD369] text-sm mb-2">Common Misuse Example:</h5>
                      <p className="text-[#94A3B8] text-sm italic">
                        "{dataLimitationsExamples[currentDataExample].misuse}"
                      </p>
                      <div className="mt-3 p-2 bg-yellow-900/20 rounded border border-yellow-500/30">
                        <p className="text-yellow-400 text-xs">
                          💡 This would lead to poor decisions due to insufficient spatial resolution
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-4">
              {dataLimitationsExamples.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDataExample(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentDataExample ? 'bg-[#6EE7B7]' : 'bg-[#374151]'
                  }`}
                />
              ))}
            </div>
          </TabsContent>

          {/* Real-World Scenarios */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {practicalScenarios.map((scenario, index) => (
                <Card key={index} className="bg-[#1E293B]/50 border-[#1E3A8A]/30 p-6">
                  <h4 className="text-[#6EE7B7] mb-2">{scenario.title}</h4>
                  <p className="text-[#94A3B8] text-sm mb-4">{scenario.context}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-[#FFD369] text-sm mb-1">Challenge:</h5>
                      <p className="text-[#E5E7EB] text-sm">{scenario.challenge}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-[#6EE7B7] text-sm mb-2">NASA Data Used:</h5>
                      <div className="flex flex-wrap gap-1">
                        {scenario.nasaData.map((data, i) => (
                          <Badge key={i} className="bg-[#1E3A8A]/20 text-[#6EE7B7] text-xs">
                            {data}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-green-400 text-sm mb-1">Application:</h5>
                      <p className="text-[#E5E7EB] text-sm">{scenario.application}</p>
                    </div>
                    
                    <div className="p-3 bg-yellow-900/20 rounded border border-yellow-500/30">
                      <h5 className="text-yellow-400 text-xs mb-1">⚠️ Important Limitation:</h5>
                      <p className="text-[#E5E7EB] text-xs">{scenario.limitation}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Knowledge Check Quiz */}
          <TabsContent value="quiz" className="space-y-6">
            <div className="bg-[#1E293B]/50 rounded-xl p-6 border border-[#1E3A8A]/30">
              <h3 className="text-[#6EE7B7] mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Test Your Understanding
              </h3>
              <p className="text-[#E5E7EB] mb-6">
                These scenarios test your ability to choose appropriate NASA datasets and avoid common pitfalls.
              </p>

              <div className="space-y-8">
                {interactiveQuiz.map((question, index) => (
                  <Card key={index} className="bg-[#0F172A]/50 border-[#1E3A8A]/30 p-6">
                    <h4 className="text-[#E5E7EB] mb-4">
                      Question {index + 1}: {question.question}
                    </h4>
                    <div className="space-y-3 mb-4">
                      {question.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            optionIndex === question.correct
                              ? 'bg-green-900/20 border-green-500/30 text-green-400'
                              : 'bg-[#1E293B]/30 border-[#374151] text-[#E5E7EB] hover:bg-[#1E293B]/50'
                          }`}
                        >
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </button>
                      ))}
                    </div>
                    <div className="p-4 bg-[#1E293B]/30 rounded-lg border border-[#6EE7B7]/20">
                      <h5 className="text-[#6EE7B7] text-sm mb-2">💡 Explanation:</h5>
                      <p className="text-[#94A3B8] text-sm">{question.explanation}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Active Lesson Modal */}
      <AnimatePresence>
        {activeLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1E293B] rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[#1E3A8A]/30"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#6EE7B7] text-xl">Interactive Learning Session</h3>
                <Button
                  onClick={() => setActiveLesson(null)}
                  size="sm"
                  className="bg-[#374151] text-[#E5E7EB] hover:bg-[#4B5563]"
                >
                  Close
                </Button>
              </div>
              
              <div className="text-center py-12">
                <Satellite className="w-16 h-16 text-[#6EE7B7] mx-auto mb-4" />
                <h4 className="text-[#E5E7EB] text-lg mb-4">
                  {educationalModules.find(m => m.id === activeLesson)?.title}
                </h4>
                <p className="text-[#94A3B8] mb-6">
                  This interactive lesson would include step-by-step tutorials, data visualization examples, 
                  and hands-on exercises with real NASA datasets.
                </p>
                <Button
                  onClick={() => completeLesson(activeLesson)}
                  className="bg-[#6EE7B7]/20 text-[#6EE7B7] border border-[#6EE7B7]/40 hover:bg-[#6EE7B7]/30"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Suggestions */}
      <div className="max-w-7xl mx-auto mt-12 p-6 bg-[#1E293B]/30 rounded-xl border border-[#1E3A8A]/20">
        <h3 className="text-[#6EE7B7] mb-4">Ready to Apply Your Knowledge?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => onNavigate('guidedFarmingPractice')}
            className="bg-[#73C783]/20 text-[#73C783] border border-[#73C783]/40 hover:bg-[#73C783]/30"
          >
            Practice with Real Data
          </Button>
          <Button
            onClick={() => onNavigate('enhancedWorldMap')}
            className="bg-[#1E3A8A]/20 text-[#6EE7B7] border border-[#1E3A8A]/40 hover:bg-[#1E3A8A]/30"
          >
            Explore Climate Shards
          </Button>
          <Button
            onClick={() => onNavigate('farmDashboard')}
            className="bg-[#FFD369]/20 text-[#FFD369] border border-[#FFD369]/40 hover:bg-[#FFD369]/30"
          >
            Manage Your Farm
          </Button>
        </div>
      </div>
    </div>
  );
}
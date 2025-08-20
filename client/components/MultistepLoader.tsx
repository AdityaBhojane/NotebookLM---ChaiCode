import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Scissors,
  Layers3,
  Save,
  Check,
  Sparkles
} from 'lucide-react';
import { socket } from '@/apis/socket';

const MultistepLoader = ({ setContextLoader }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const [process, setProcess] = useState("")
  const steps = [
    {
      id: 1,
      title: 'Processing Data',
      icon: Database,
      description: 'Analyzing data',
      color: 'text-blue-500',
      bgGradient: 'from-blue-500/15 via-blue-400/10 to-transparent',
      duration: 2000
    },
    {
      id: 2,
      title: 'Chunking Data',
      icon: Scissors,
      description: 'Breaking pieces',
      color: 'text-purple-500',
      bgGradient: 'from-purple-500/15 via-purple-400/10 to-transparent',
      duration: 1500
    },
    {
      id: 3,
      title: 'Embedding Data',
      icon: Layers3,
      description: 'Creating vectors',
      color: 'text-emerald-500',
      bgGradient: 'from-emerald-500/15 via-emerald-400/10 to-transparent',
      duration: 2500
    },
    {
      id: 4,
      title: 'Storing Data',
      icon: Save,
      description: 'Saving database',
      color: 'text-orange-500',
      bgGradient: 'from-orange-500/15 via-orange-400/10 to-transparent',
      duration: 1800
    }
  ];

  useEffect(() => {
    const handler = (data: string) => {
      console.log(data);
      setProcess(data);
    };
    socket.on("processing", handler);
    return () => {
      socket.off("processing", handler);
    };
  }, []);


  useEffect(() => {
    const processSteps = async () => {
      setIsStepCompleted(false);
      if (process == "Processing") {
        setCurrentStep(0)
        setIsStepCompleted(true);
        console.log('step 1')
      }
      if (process == "Embedding") {
        console.log('step 2')
        setIsStepCompleted(false);
        setCurrentStep(1)
        setIsStepCompleted(true);
      }
      if (process == "Chunking") {
        console.log('step 3')
        setIsStepCompleted(false);
        setCurrentStep(2)
        setIsStepCompleted(true);
      } if (process == "Storing") {
        setIsStepCompleted(false);
        setCurrentStep(3)
        setIsStepCompleted(true);
        console.log('step 4')
      }
    }
    processSteps();
    setAllCompleted(true);
  }, [process]);

  const resetLoader = () => {
    setCurrentStep(0);
    setIsStepCompleted(false);
    setAllCompleted(false);

    setTimeout(() => {
      const processSteps = async () => {
        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(i);
          setIsStepCompleted(false);
          await new Promise(resolve => setTimeout(resolve, steps[i].duration));
          setIsStepCompleted(true);
          await new Promise(resolve => setTimeout(resolve, 600));
        }
        setAllCompleted(true);
      };
      processSteps();
    }, 100);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0
    }
  };

  const stepVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateY: -90
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotateY: 90
    }
  };


  useEffect(() => {
    let timer: string | number | NodeJS.Timeout;
    if (process == "Storing") {
      timer = setTimeout(() => {
        setContextLoader(false);
      }, 2000)
    }
    return () => clearTimeout(timer)
  }, [process])

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="fixed inset-0 z-50">
      {/* Lighter backdrop for better card visibility */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      />

      {/* Loader Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 120
          }}
          className="relative"
        >
          {/* Square Glass Card with enhanced visibility */}
          <div className="w-72 h-72 relative">
            {/* Enhanced Multi-layer Glass Background */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl rounded-2xl border border-white/25 shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/8 to-transparent rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/12 via-transparent to-purple-500/12 rounded-2xl" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col overflow-hidden rounded-2xl">
              {/* Header */}
              <motion.div
                className="flex-shrink-0 p-4 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-flex items-center justify-center w-8 h-8 mb-2 bg-white/25 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-blue-500" />
                </motion.div>

                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Processing Data
                </h2>

                <p className="text-xs text-gray-700 dark:text-gray-200">
                  Step {currentStep + 1} of {steps.length}
                </p>

                {/* Progress Dots */}
                <div className="flex justify-center space-x-1 mt-2">
                  {steps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-1 h-1 rounded-full transition-all duration-300 ${index === currentStep
                        ? 'bg-blue-500 w-3'
                        : index < currentStep
                          ? 'bg-emerald-500'
                          : 'bg-white/50'
                        }`}
                      layoutId={`dot-${index}`}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Current Step - Centered */}
              <div className="flex-1 flex items-center justify-center px-4 pb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      stiffness: 120,
                      damping: 20
                    }}
                    className="w-full"
                  >
                    {/* Step Card with better visibility */}
                    <div className={`relative p-4 rounded-xl backdrop-blur-sm border transition-all duration-500 ${isStepCompleted
                      ? 'bg-emerald-500/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                      : `bg-gradient-to-br ${currentStepData.bgGradient} border-white/30 shadow-xl`
                      }`}>

                      {/* Active glow effect */}
                      {!isStepCompleted && (
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/12 via-purple-500/12 to-transparent"
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}

                      <div className="relative text-center">
                        {/* Icon Container with better contrast */}
                        <div className={`relative w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all duration-500 ${isStepCompleted
                          ? 'bg-emerald-500 shadow-xl shadow-emerald-500/30'
                          : 'bg-white/30 backdrop-blur-sm border border-white/40 shadow-lg'
                          }`}>

                          <AnimatePresence mode="wait">
                            {isStepCompleted ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{
                                  duration: 0.4,
                                  type: "spring",
                                  stiffness: 200
                                }}
                              >
                                <Check className="w-6 h-6 text-white" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="active"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <motion.div
                                  animate={{
                                    y: [-2, 0, -2],
                                    rotate: [0, 4, -4, 0],
                                    scale: [1, 1.05, 1]
                                  }}
                                  transition={{
                                    duration: 1.6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <IconComponent className={`w-6 h-6 ${currentStepData.color}`} />
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Pulse rings for active step */}
                          {!isStepCompleted && (
                            <>
                              <motion.div
                                className="absolute inset-0 rounded-xl border border-blue-400/50"
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.6, 0, 0.6]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                              <motion.div
                                className="absolute inset-0 rounded-xl border border-purple-400/40"
                                animate={{
                                  scale: [1, 1.4, 1],
                                  opacity: [0.4, 0, 0.4]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 0.4
                                }}
                              />
                            </>
                          )}
                        </div>

                        {/* Content with better text contrast */}
                        <div>
                          <motion.h3
                            className={`font-bold text-base transition-colors duration-500 ${isStepCompleted
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-gray-900 dark:text-white'
                              }`}
                            layout
                          >
                            {currentStepData.title}
                          </motion.h3>

                          <motion.p
                            className={`text-xs mt-1 transition-colors duration-500 ${isStepCompleted
                              ? 'text-emerald-600/90 dark:text-emerald-300/90'
                              : 'text-gray-700 dark:text-gray-200'
                              }`}
                            layout
                          >
                            {isStepCompleted ? 'Completed!' : currentStepData.description}
                          </motion.p>

                          {/* Loading dots for active step */}
                          {!isStepCompleted && (
                            <motion.div
                              className="flex justify-center space-x-1 mt-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              {[0, 1, 2].map((dot) => (
                                <motion.div
                                  key={dot}
                                  className="w-1 h-1 bg-blue-500/80 rounded-full"
                                  animate={{
                                    opacity: [0.3, 1, 0.3],
                                    scale: [1, 1.2, 1]
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: dot * 0.2,
                                  }}
                                />
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MultistepLoader;
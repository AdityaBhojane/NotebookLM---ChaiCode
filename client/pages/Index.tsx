import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/use-theme';
import ContextSourcesPanel from '../components/ContextSourcesPanel';
import AssistantChatPanel from '../components/AssistantChatPanel';

const Index: React.FC = () => {
  const { sourceTheme, setSourceTheme } = useTheme();
  const [sources, setSources] = useState<string[]>([]);
  const [chatCount, setChatCount] = useState(0);
  const maxChats = 3;

  // Determine current agent based on sourceTheme
  const currentAgent = sourceTheme === 'nodejs' ? 'nodejs' : sourceTheme === 'javascript' ? 'javascript' : 'default';

  const handleSourcesChange = (newSources: string[]) => {
    setSources(newSources);

    // Auto-detect agent based on sources
    const sourcesText = newSources.join(' ').toLowerCase();
    if (sourcesText.includes('node') || sourcesText.includes('npm') || sourcesText.includes('express')) {
      setSourceTheme('nodejs');
    } else if (sourcesText.includes('javascript') || sourcesText.includes('react') || sourcesText.includes('vue') || sourcesText.includes('js')) {
      setSourceTheme('javascript');
    }
  };

  return (
    <motion.div
      className="h-full flex bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Left Panel - Context Sources */}
      <motion.div
        className="w-80 border-r border-gray-200 bg-white"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.1
        }}
        whileHover={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          transition: { duration: 0.2 }
        }}
      >
        <ContextSourcesPanel onSourcesChange={handleSourcesChange} />
      </motion.div>

      {/* Right Panel - Assistant Chat */}
      <motion.div
        className="flex-1"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.2
        }}
        whileHover={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          transition: { duration: 0.2 }
        }}
      >
        <AssistantChatPanel
          agent={currentAgent}
          chatCount={chatCount}
          maxChats={maxChats}
          sources={sources}
        />
      </motion.div>
    </motion.div>
  );
};

export default Index;

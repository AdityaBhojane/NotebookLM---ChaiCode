import React, { useState } from 'react';
import { Upload, Plus, FileText,  Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import AddContentModal from './AddContentModal';
import MultistepLoader from './MultistepLoader';

interface ContextSourcesPanelProps {
  onSourcesChange: (sources: string[]) => void;
}

const ContextSourcesPanel: React.FC<ContextSourcesPanelProps> = ({ onSourcesChange }) => {
  const [sources, setSources] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contextLoader, setContextLoader] = useState(false);

  const handleAddSources = (newSources: string[]) => {
    const updatedSources = [...sources, ...newSources];
    setSources(updatedSources);
    onSourcesChange(updatedSources);
  };

  const removeSource = (index: number) => {
    const updatedSources = sources.filter((_, i) => i !== index);
    setSources(updatedSources);
    onSourcesChange(updatedSources);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold">Context Sources</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Add content for the RAG system
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Add Button */}
        <motion.div
          whileHover={{
            scale: 1.02,
            rotate: [0, 1, -1, 0],
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Button
            variant="purple"
            className="w-full h-12 text-base font-medium relative overflow-hidden group"
            animated={true}
            onClick={() => setIsModalOpen(true)}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="relative z-10 flex items-center justify-center gap-2"
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Plus className="w-5 h-5" />
              </motion.div>
              Add Files, URLs & Context
            </motion.div>
          </Button>
        </motion.div>

        {/* Added Content Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Added Content ({sources.length})
          </h3>
          
          {sources.length === 0 ? (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">No content added yet</p>
              <p className="text-xs text-muted-foreground">
                Click the button above to add sources
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <AnimatePresence>
                {sources.map((source, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm flex-1 truncate">{source}</span>
                    <button
                      onClick={() => removeSource(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors text-lg font-medium"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Add Content Modal */}
        <AddContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSources={handleAddSources}
        setContextLoader={setContextLoader}
      />
      {contextLoader? <MultistepLoader setContextLoader={setContextLoader}/>:<></>}
    </div>
  );
};

export default ContextSourcesPanel;

import React, { useState } from 'react';
import { Upload, Link, Send, File, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface InputSourcesPanelProps {
  onSubmit: (query: string, sources: string[]) => void;
  disabled?: boolean;
}

const InputSourcesPanel: React.FC<InputSourcesPanelProps> = ({ onSubmit, disabled }) => {
  const [query, setQuery] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [sources, setSources] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query, sources);
      setQuery('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newSources = Array.from(files).map(file => file.name);
      setSources(prev => [...prev, ...newSources]);
    }
  };

  const handleUrlAdd = () => {
    if (urlInput.trim()) {
      setSources(prev => [...prev, urlInput]);
      setUrlInput('');
    }
  };

  const removeSource = (index: number) => {
    setSources(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col">
      <motion.div
        className="p-6 border-b"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-1">Input Sources</h2>
        <p className="text-sm text-muted-foreground">
          Add your query and sources to get started
        </p>
      </motion.div>

      <div className="flex-1 p-6 space-y-6">
        {/* Query Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Your Question</label>
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything about your sources..."
                className="w-full h-32 px-4 py-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                disabled={disabled}
              />
              <button
                type="submit"
                disabled={!query.trim() || disabled}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                  "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed",
                  "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                <Send className="w-4 h-4" />
                Submit Query
              </button>
            </div>
          </form>
        </div>

        {/* Upload Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Add Sources</h3>
          
          {/* File Upload */}
          <div className="space-y-2">
            <label className="block">
              <input
                type="file"
                multiple
                accept=".pdf,.csv,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
                disabled={disabled}
              />
              <div className={cn(
                "flex items-center gap-3 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
                "hover:border-primary/50 hover:bg-primary/5",
                disabled && "opacity-50 cursor-not-allowed"
              )}>
                <Upload className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Upload Files</p>
                  <p className="text-xs text-muted-foreground">PDF, CSV, TXT, MD</p>
                </div>
              </div>
            </label>
          </div>

          {/* URL Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                disabled={disabled}
              />
            </div>
            <button
              type="button"
              onClick={handleUrlAdd}
              disabled={!urlInput.trim() || disabled}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sources List */}
        {sources.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Added Sources</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {sources.map((source, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                >
                  {source.startsWith('http') ? (
                    <Link className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm flex-1 truncate">{source}</span>
                  <button
                    onClick={() => removeSource(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSourcesPanel;

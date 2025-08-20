import React, { useState } from 'react';
import { Upload, Link, Type, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import Modal from './ui/modal';
import { cn } from '../lib/utils';
import { indexData } from '@/apis/indexData';


interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSources: (sources: string[]) => void;
  setContextLoader: React.Dispatch<React.SetStateAction<boolean>>
}

const AddContentModal: React.FC<AddContentModalProps> = ({
  isOpen,
  onClose,
  onAddSources,
  setContextLoader
}) => {
  const [activeTab, setActiveTab] = useState<'files' | 'url' | 'context'>('files');
  const [urlInput, setUrlInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [files, setFiles] = useState<{ file: File; name: string; type: string }[]>([]);
  const [currentFile, setCurrentFile] = useState<{ file: File; name: string; type: string }>();

  const getFileCategory = (file: File): string => {
    if (file.type.includes("pdf")) return "pdf";
    if (file.type.startsWith("text/")) return "text";
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "other";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(
        Array.from(event.target.files).map(file => ({
          file,
          name: file.name,
          type: getFileCategory(file),
        }))
      );
      setCurrentFile(Array.from(event.target.files).map(file => ({
        file,
        name: file.name,
        type: getFileCategory(file),
      }))[0]);
      setContextInput("");
      setUrlInput("")
    }
  };


  const handleSubmit = async () => {
    const sources: string[] = [];

    if (activeTab === 'files' && files.length > 0) {
      sources.push(...files.map(file => file.name));
    } else if (activeTab === 'url' && urlInput.trim()) {
      sources.push(urlInput.trim());
    } else if (activeTab === 'context' && contextInput.trim()) {
      sources.push(`Context: ${contextInput.trim().substring(0, 50)}...`);
    }
    setContextLoader(true)

    if (currentFile) {
      try {
        let type = currentFile.type, file = currentFile.file;
        const response = await indexData(type, file)
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }else if(contextInput){
      try {
        let type = 'text', file = contextInput;
        const response = await indexData(type, file)
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }else if(urlInput){
      try {
        let type = 'website', file = urlInput;
        const response = await indexData(type, file)
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }

    if (sources.length > 0) {
      onAddSources(sources);
      handleClose();
    }
  };


  const handleClose = () => {
    setUrlInput('');
    setContextInput('');
    setFiles([]);
    setActiveTab('files');
    onClose();
  };

  const tabs = [
    { id: 'files', label: 'Files', icon: Upload },
    { id: 'url', label: 'URL', icon: Link },
    { id: 'context', label: 'Context', icon: Type },
  ] as const;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Content"
      className="max-w-md "
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex rounded-lg bg-muted p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-[200px]"
        >
          {activeTab === 'files' && (
            <div className="space-y-4">
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.csv,.txt,.md,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Choose files to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, CSV, TXT, MD, DOC, DOCX
                  </p>
                </div>
              </label>

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected files:</p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted rounded text-sm"
                      >
                        <Upload className="w-4 h-4 text-muted-foreground" />
                        <span className="flex-1 truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Website URL
                </label>
                <Input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value)
                    setCurrentFile(null);
                    setContextInput("")
                  }}
                  placeholder="https://example.com"
                  className="w-full"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Add a URL to extract content from websites, documentation, or articles.
              </p>
            </div>
          )}

          {activeTab === 'context' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Custom Context
                </label>
                <Textarea
                  value={contextInput}
                  onChange={(e) => {
                    setContextInput(e.target.value)
                    setUrlInput("")
                    setCurrentFile(null);
                  }}
                  placeholder="Enter your custom context or information..."
                  className="w-full h-32 resize-none"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Add custom context, instructions, or information for the AI to reference.
              </p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={
              (activeTab === 'files' && files.length === 0) ||
              (activeTab === 'url' && !urlInput.trim()) ||
              (activeTab === 'context' && !contextInput.trim())
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddContentModal;
function setContextLoader(arg0: boolean) {
  throw new Error('Function not implemented.');
}


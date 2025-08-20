import React from 'react';
import { FileText, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/use-theme';
import { cn } from '../lib/utils';
import ThemeToggle from './ui/theme-toggle';
import nodeIcon from "../assets/icons8-nodejs.svg";
import jsIcon from "../assets/icons8-javascript.svg";

const NavigationBar: React.FC = () => {
  const { theme, sourceTheme, toggleTheme, setSourceTheme } = useTheme();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              NotebookLM
            </span>
          </div>

          {/* Agent Icons and Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Agent Selection */}
            {/* <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setSourceTheme('nodejs')}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  sourceTheme === 'nodejs'
                    ? "bg-green-500 text-white shadow-md ring-1 ring-green-500/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                title="Node.js Assistant"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={cn(
                  "w-8 h-8 rounded flex items-center justify-center",
                  sourceTheme === 'nodejs' ? "bg-white" : "bg-slate-300"
                )}>
                  <img src={nodeIcon} alt="icon" className='w-full h-full p-[4px]' />
                </div>
              </motion.button>

              <motion.button
                onClick={() => setSourceTheme('javascript')}
                className={cn(
                  "rounded-lg transition-all duration-200",
                  sourceTheme === 'javascript'
                    ? "bg-yellow-500 text-white shadow-md ring-1 ring-yellow-500/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                title="JavaScript Assistant"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={jsIcon} alt="icon" className='w-12 h-12' />
              </motion.button>
            </div> */}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/use-theme';
import { cn } from '../../lib/utils';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    // Apply sweep animation using CSS and View Transitions API if available
    if ('startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        toggleTheme();
      });
    } else {
      // Fallback: Add transition class temporarily
      document.documentElement.classList.add('theme-transitioning');
      toggleTheme();
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 500);
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      className={cn(
        "relative p-2.5 rounded-xl overflow-hidden transition-all duration-300",
        "hover:scale-105 active:scale-95 shadow-lg border",
        isDark 
          ? "bg-gray-900 border-gray-700 text-yellow-400" 
          : "bg-amber-50 border-amber-200 text-gray-700"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Animated background sweep */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-xl",
          isDark 
            ? "bg-gradient-to-br from-slate-800 via-gray-900 to-black" 
            : "bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100"
        )}
        initial={false}
        animate={{
          clipPath: isDark 
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 0 0, 0 100%, 0 100%)"
        }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
      
      {/* Icon container */}
      <div className="relative z-10 w-6 h-6 flex items-center justify-center">
        {/* Sun icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            scale: isDark ? 0.3 : 1,
            rotate: isDark ? 180 : 0,
            opacity: isDark ? 0 : 1
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut"
          }}
        >
          <Sun className="w-5 h-5" />
        </motion.div>
        
        {/* Moon icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            scale: isDark ? 1 : 0.3,
            rotate: isDark ? 0 : -180,
            opacity: isDark ? 1 : 0
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
            delay: isDark ? 0.1 : 0
          }}
        >
          <Moon className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%', skewX: -20 }}
        animate={{ x: '200%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};

export default ThemeToggle;

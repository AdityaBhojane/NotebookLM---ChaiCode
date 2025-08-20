import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/use-theme';
import NavigationBar from './components/NavigationBar';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import './global.css';
import { socket } from './apis/socket';

function App() {

  
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <NavigationBar />
          <main className="h-[calc(100vh-80px)]">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

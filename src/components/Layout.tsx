import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import useStore from '../store';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const theme = useStore(state => state.theme);
  
  return (
    <div className={`homepage-root min-h-screen flex flex-col relative overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Animated glass background effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-accent/10 via-background/80 to-accent/5 blur-2xl opacity-80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/30 rounded-full blur-2xl opacity-40 animate-pulse-slow" />
      </div>
      <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar: togglable (open/close) on all screens */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Overlay fade-in/out */}
              <motion.div
                key="sidebar-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md pointer-events-auto"
                onClick={() => setSidebarOpen(false)}
              />
              {/* Sidebar slide-in/out */}
              <motion.div
                key="sidebar-panel"
                initial={{ x: -320, opacity: 0.7 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -320, opacity: 0.7 }}
                transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                className="fixed left-0 top-0 h-full w-72 z-50 bg-sidebar/80 backdrop-blur-xl shadow-soft rounded-r-2xl border-r-2 border-accent/30"
                style={{ willChange: 'transform, opacity' }}
              >
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <div className="homepage-root flex-1 flex justify-center items-start overflow-auto transition-all duration-300 ease-in-out">
          <motion.main
            className="w-full max-w-5xl mt-8 mb-8 px-4 md:px-8 py-8 rounded-2xl bg-card/80 shadow-soft backdrop-blur-xl animate-fade-in"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
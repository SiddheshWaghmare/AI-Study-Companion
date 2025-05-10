import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from './ui/Button';
import useStore from '../store';
import { motion } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, setTheme } = useStore(state => ({
    theme: state.theme,
    setTheme: state.setTheme
  }));

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };


  return (
    <header className="sticky top-0 z-30 homepage-navbar animate-fade-in">
      <div className="homepage-navbar-content" style={{paddingLeft: 0, marginLeft: 0, justifyContent: 'flex-start', width: '100vw', maxWidth: '100vw', boxSizing: 'border-box'}}>
        <div className="homepage-logo" style={{marginLeft: '12px', paddingLeft: 0}}>
          <Button variant="ghost" size="icon" onClick={onMenuClick} aria-label="Menu" style={{marginRight: 0, paddingLeft: 0, marginLeft: 0}}>
            <Menu className="h-6 w-6 text-accent" />
          </Button>
          <span className="logo-icon">🧠</span>
          <Link to="/" className="logo-text">StudyAI</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Dark mode' : 'Light mode'}
            className="glass-btn"
            style={{marginLeft: 10}}
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'light' ? 0 : 180 }}
              transition={{ duration: 0.5 }}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-accent" />
              ) : (
                <Sun className="h-5 w-5 text-accent" />
              )}
            </motion.div>
          </Button>
          <div style={{ marginLeft: 16 }}>
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
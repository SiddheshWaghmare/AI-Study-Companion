import React, { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import useStore from '../store';
import { logOut } from '../authHelpers';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#232946] hover:bg-purple-700 text-white focus:outline-none transition-colors duration-200"
        onClick={() => setOpen((v) => !v)}
        aria-label="Profile menu"
      >
        <User className="w-6 h-6" />
        <span className="hidden sm:inline font-semibold">{user?.name || user?.displayName || user?.email || 'Profile'}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#181d2f] rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-[#232946]">
          <div className="px-4 py-2 text-gray-900 dark:text-gray-100 font-semibold border-b border-gray-100 dark:border-[#232946]">
            {user?.name || user?.displayName || user?.email || 'Profile'}
          </div>
          <button
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-[#232946] font-medium transition-colors"
            onClick={async () => {
              setOpen(false);
              await logOut();
              setUser(null);
              navigate('/');
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

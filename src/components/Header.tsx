import React, { useState, useEffect } from 'react'; // Add React and useState
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import Logo from '../assets/kacchi-prime-logo.png';
import { useTheme } from '../context/ThemeContext'; // ThemeContext থেকে useTheme ইমপোর্ট

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme(); // গ্লোবাল থিম স্টেট
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setRole(profile?.role);
      }
    };

    window.addEventListener('scroll', handleScroll);
    checkUser();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? isDarkMode ? 'bg-gray-900 shadow-lg' : 'bg-white shadow-lg'
          : isDarkMode ? 'bg-gray-900/80 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
      } ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
    >
      <div className="container mx-auto px-4 py-1 flex justify-between items-center">
        <div className="logo flex items-center">
          <RouterLink to="/">
            <img
              src={Logo}
              alt="Kacchi Prime Logo"
              className="h-20 w-auto mr-3 object-contain"
            />
          </RouterLink>
        </div>
        
        <div className="hidden md:flex space-x-6">
          {!user ? (
            <RouterLink to="/login" className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
              লগ ইন
            </RouterLink>
          ) : role === 'admin' ? (
            <>
              <RouterLink to="/admin" className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
                এডমিন প্যানেল
              </RouterLink>
              <button 
                onClick={handleLogout}
                className={`px-6 py-2 rounded-md font-bold transition transform hover:scale-105 hover:shadow-lg ${isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-600 hover:bg-red-700 text-gray-900'}`}
              >
                লগআউট
              </button>
            </>
          ) : null}
          
          <ScrollLink to="special" smooth={true} duration={500} className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
            বিশেষত্ব
          </ScrollLink>
          <ScrollLink to="rarity" smooth={true} duration={500} className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
            কেন দুর্লভ
          </ScrollLink>
          <ScrollLink to="howtoget" smooth={true} duration={500} className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
            কিভাবে পাবেন
          </ScrollLink>
          <ScrollLink to="order" smooth={true} duration={500} className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
            প্যাকেজ
          </ScrollLink>
          <ScrollLink to="faq" smooth={true} duration={500} className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
            FAQ
          </ScrollLink>
        </div>
        
        <div className="flex items-center space-x-4">
          <ScrollLink 
            to="order" 
            smooth={true} 
            duration={500} 
            className={`hidden md:block px-6 py-2 rounded-md font-bold transition transform hover:scale-105 hover:shadow-lg ${isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-600 hover:bg-red-700 text-gray-900'}`}
          >
            অর্ডার করুন
          </ScrollLink>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
        
        <button 
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {isOpen && (
        <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} md:hidden`}>
          <div className="flex flex-col items-center py-4 space-y-4">
            {!user ? (
              <RouterLink 
                to="/login" 
                className={`w-full text-center py-2 ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
                onClick={() => setIsOpen(false)}
              >
                লগ ইন
              </RouterLink>
            ) : role === 'admin' ? (
              <>
                <RouterLink 
                  to="/admin" 
                  className={`w-full text-center py-2 ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
                  onClick={() => setIsOpen(false)}
                >
                  এডমিন প্যানেল
                </RouterLink>
                <button 
                  onClick={handleLogout}
                  className={`w-full py-3 text-center font-bold ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-600 text-gray-900'}`}
                >
                  লগআউট
                </button>
              </>
            ) : null}

            <ScrollLink 
              to="special" 
              smooth={true} 
              duration={500} 
              className={`w-full text-center py-2 ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
              onClick={() => setIsOpen(false)}
            >
              বিশেষত্ব
            </ScrollLink>
            <ScrollLink 
              to="rarity" 
              smooth={true} 
              duration={500} 
              className={`w-full text-center py-2 ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
              onClick={() => setIsOpen(false)}
            >
              কেন দুর্লভ
            </ScrollLink>
            <ScrollLink 
              to="howtoget" 
              smooth={true} 
              duration={500} 
              className={`w-full text-center py-2 ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
              onClick={() => setIsOpen(false)}
            >
              কিভাবে পাবেন
            </ScrollLink>
            <ScrollLink 
              to="order" 
              smooth={true} 
              duration={500} 
              className={`w-full text-center py-2 ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
              onClick={() => setIsOpen(false)}
            >
              প্যাকেজ
            </ScrollLink>
            <ScrollLink 
              to="faq" 
              smooth={true} 
              duration={500} 
              className={`w-full text-center py-2 ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </ScrollLink>
            <ScrollLink 
              to="order" 
              smooth={true} 
              duration={500} 
              className={`w-full py-3 text-center font-bold ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-600 text-gray-900'}`}
              onClick={() => setIsOpen(false)}
            >
              অর্ডার করুন
            </ScrollLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
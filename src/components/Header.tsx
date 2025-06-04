import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import Logo from '../assets/kacchi-prime-logo.png';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
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

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) console.error('Role fetch error');
            else setRole(data?.role);
          });
      } else {
        setRole(null);
      }
    });

    window.addEventListener('scroll', handleScroll);
    checkUser();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setIsOpen(false);
    navigate('/login');
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 overflow-x-hidden  ${
        isScrolled
          ? isDarkMode ? 'bg-gray-900 shadow-lg' : 'bg-white shadow-lg'
          : isDarkMode ? 'bg-gray-900/80 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
      } ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
    >
      <div className="container mx-auto px-4 py-0 flex justify-between items-center flex-wrap md:flex-nowrap">
        <div className="logo flex items-center">
          <RouterLink to="/">
            <img
              src={Logo}
              alt="Kacchi Prime Logo"
              className="h-16 w-auto mr-2 object-contain"
            />
          </RouterLink>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center flex-grow justify-center">
          {!user ? (
            <RouterLink to="/login" className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors text-sm md:text-base py-1`}>
              লগ ইন
            </RouterLink>
          ) : role === 'admin' ? (
            <>
              <RouterLink to="/admin" className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
                এডমিন প্যানেল
              </RouterLink>
              <button 
                onClick={handleLogout}
                className={`px-6 py-1 rounded-md font-bold transition transform hover:scale-105 hover:shadow-lg ${isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-600 hover:bg-red-700 text-gray-900'}`}
              >
                লগআউট
              </button>
            </>
          ) : null}

          <ScrollLink to="special" smooth duration={500} className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
            বিশেষত্ব
          </ScrollLink>
          <ScrollLink to="rarity" smooth duration={500} className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
            কেন দুর্লভ
          </ScrollLink>
          <ScrollLink to="howtoget" smooth duration={500} className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
            কিভাবে পাবেন
          </ScrollLink>
          <ScrollLink to="order" smooth duration={500} className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
            প্যাকেজ
          </ScrollLink>
          <ScrollLink to="faq" smooth duration={500} className={`cursor-pointer ${isDarkMode ? 'hover:text-[#FFD700]' : 'hover:text-red-600'} transition-colors`}>
            FAQ
          </ScrollLink>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-2 ml-auto mt-2 md:mt-0 shrink-0">
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button 
            onClick={toggleTheme}
            className={`p-9 rounded-full transition ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} md:hidden`}
          initial="hidden"
          animate="visible"
          variants={menuVariants}
        >
          <div className="flex flex-col items-center space-y-3 py-4">
            {!user ? (
              <motion.div variants={menuItemVariants}>
                <RouterLink 
                  to="/login" 
                  className={`w-full text-center py-2 text-lg ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
                  onClick={() => setIsOpen(false)}
                >
                  লগ ইন
                </RouterLink>
              </motion.div>
            ) : role === 'admin' ? (
              <>
                <motion.div variants={menuItemVariants}>
                  <RouterLink 
                    to="/admin" 
                    className={`w-full text-center py-2 text-lg ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    এডমিন প্যানেল
                  </RouterLink>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                  <button 
                    onClick={handleLogout}
                    className={`w-full py-2 text-center font-bold text-lg ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-600 text-gray-900'}`}
                  >
                    লগআউট
                  </button>
                </motion.div>
              </>
            ) : null}

            {["special", "rarity", "howtoget", "order", "faq"].map((id, index) => (
              <motion.div key={id} variants={menuItemVariants}>
                <ScrollLink 
                  to={id}
                  smooth 
                  duration={500} 
                  className={`w-full text-center py-2 text-lg ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-900'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {{
                    special: 'বিশেষত্ব',
                    rarity: 'কেন দুর্লভ',
                    howtoget: 'কিভাবে পাবেন',
                    order: 'প্যাকেজ',
                    faq: 'FAQ'
                  }[id]}
                </ScrollLink>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import Logo from '../assets/kacchi-prime-logo.png';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    checkUser();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // প্রথম রেন্ডারে চেক করার জন্য

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // স্টেটটি তৎক্ষণাৎ null করা
    await checkUser(); // আবার চেক করা নিশ্চিত করার জন্য
    setIsOpen(false); // মোবাইল মেনু বন্ধ করা
    navigate('/login'); // লগইন পেজে নেভিগেট
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black shadow-lg' : 'bg-black/80 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="logo flex items-center">
          <RouterLink to="/">
            <img
              src={Logo}
              alt="Kacchi Prime Logo"
              className="h-16 w-auto mr-3 object-contain"
            />
          </RouterLink>
          <h1 className="text-[#FFD700] text-2xl font-bold font-serif">Kacchi Prime</h1>
        </div>
        
        {user === null ? ( // user === null হলে মেনু দেখানো
          <div className="hidden md:flex space-x-8 text-white">
            <RouterLink to="/admin" className="cursor-pointer hover:text-[#FFD700] transition-colors">
              লগ ইন
            </RouterLink>
            <ScrollLink to="special" smooth={true} duration={500} className="cursor-pointer hover:text-[#FFD700] transition-colors">
              বিশেষত্ব
            </ScrollLink>
            <ScrollLink to="rarity" smooth={true} duration={500} className="cursor-pointer hover:text-[#FFD700] transition-colors">
              কেন দুর্লভ
            </ScrollLink>
            <ScrollLink to="howtoget" smooth={true} duration={500} className="cursor-pointer hover:text-[#FFD700] transition-colors">
              কিভাবে পাবেন
            </ScrollLink>
            <ScrollLink to="order" smooth={true} duration={500} className="cursor-pointer hover:text-[#FFD700] transition-colors">
              প্যাকেজ
            </ScrollLink>
            <ScrollLink to="faq" smooth={true} duration={500} className="cursor-pointer hover:text-[#FFD700] transition-colors">
              FAQ
            </ScrollLink>
          </div>
        ) : (
          <button 
            onClick={handleLogout}
            className="hidden md:block bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-bold transition transform hover:scale-105 hover:shadow-lg text-white"
          >
            লগআউট
          </button>
        )}
        
        {user === null ? ( // user === null হলে অর্ডার করুন বাটন দেখানো
          <ScrollLink 
            to="order" 
            smooth={true} 
            duration={500} 
            className="hidden md:block bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-bold transition transform hover:scale-105 hover:shadow-lg text-white"
          >
            অর্ডার করুন
          </ScrollLink>
        ) : null}
        
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-black">
          <div className="flex flex-col items-center py-4 space-y-4 text-white">
            {user === null ? ( // user === null হলে মোবাইল মেনু দেখানো
              <>
                <RouterLink 
                  to="/admin" 
                  className="w-full text-center py-2 hover:bg-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  লগ ইন
                </RouterLink>
                <ScrollLink 
                  to="special" 
                  smooth={true} 
                  duration={500} 
                  className="w-full text-center py-2 hover:bg-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  বিশেষত্ব
                </ScrollLink>
                <ScrollLink 
                  to="rarity" 
                  smooth={true} 
                  duration={500} 
                  className="w-full text-center py-2 hover:bg-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  কেন দুর্লভ
                </ScrollLink>
                <ScrollLink 
                  to="howtoget" 
                  smooth={true} 
                  duration={500} 
                  className="w-full text-center py-2 hover:bg-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  কিভাবে পাবেন
                </ScrollLink>
                <ScrollLink 
                  to="order" 
                  smooth={true} 
                  duration={500} 
                  className="w-full text-center py-2 hover:bg-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  প্যাকেজ
                </ScrollLink>
                <ScrollLink 
                  to="faq" 
                  smooth={true} 
                  duration={500} 
                  className="w-full text-center py-2 hover:bg-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  FAQ
                </ScrollLink>
                <ScrollLink 
                  to="order" 
                  smooth={true} 
                  duration={500} 
                  className="w-full bg-red-600 py-3 text-center font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  অর্ডার করুন
                </ScrollLink>
              </>
            ) : (
              <button 
                onClick={handleLogout}
                className="w-full bg-red-600 py-3 text-center font-bold"
              >
                লগআউট
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
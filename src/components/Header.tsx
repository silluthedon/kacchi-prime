import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black shadow-lg' : 'bg-black/80 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="logo">
          <h1 className="text-[#FFD700] text-2xl font-bold font-serif">Kacchi Prime</h1>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <Link to="special" smooth={true} duration={500} className="cursor-pointer hover:text-[#FFD700] transition-colors">
            বিশেষত্ব
          </Link>
          <Link to="rarity" smooth={true} duration={500} className="cursor-pointer hover:text-[#FFD700] transition-colors">
            কেন দুর্লভ
          </Link>
          <Link to="howtoget" smooth={true} duration={500} className="cursor-pointer hover:text-[#FFD700] transition-colors">
            কিভাবে পাবেন
          </Link>
          <Link to="order" smooth={true} duration={500} className="cursor-pointer hover:text-[#FFD700] transition-colors">
            প্যাকেজ
          </Link>
          <Link to="faq" smooth={true} duration={500} className="cursor-pointer hover:text-[#FFD700] transition-colors">
            FAQ
          </Link>
        </div>
        
        <Link 
          to="order" 
          smooth={true} 
          duration={500} 
          className="hidden md:block bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-bold transition transform hover:scale-105 hover:shadow-lg"
        >
          অর্ডার করুন
        </Link>
        
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black">
          <div className="flex flex-col items-center py-4 space-y-4">
            <Link 
              to="special" 
              smooth={true} 
              duration={500} 
              className="w-full text-center py-2 hover:bg-gray-900"
              onClick={() => setIsOpen(false)}
            >
              বিশেষত্ব
            </Link>
            <Link 
              to="rarity" 
              smooth={true} 
              duration={500} 
              className="w-full text-center py-2 hover:bg-gray-900"
              onClick={() => setIsOpen(false)}
            >
              কেন দুর্লভ
            </Link>
            <Link 
              to="howtoget" 
              smooth={true} 
              duration={500} 
              className="w-full text-center py-2 hover:bg-gray-900"
              onClick={() => setIsOpen(false)}
            >
              কিভাবে পাবেন
            </Link>
            <Link 
              to="order" 
              smooth={true} 
              duration={500} 
              className="w-full text-center py-2 hover:bg-gray-900"
              onClick={() => setIsOpen(false)}
            >
              প্যাকেজ
            </Link>
            <Link 
              to="faq" 
              smooth={true} 
              duration={500} 
              className="w-full text-center py-2 hover:bg-gray-900"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </Link>
            <Link 
              to="order" 
              smooth={true} 
              duration={500} 
              className="w-full bg-red-600 py-3 text-center font-bold"
              onClick={() => setIsOpen(false)}
            >
              অর্ডার করুন
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
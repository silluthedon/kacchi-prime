import React from 'react';
import { Link } from 'react-scroll';
import { CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Hero: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center pt-14 md:pt-16 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`} // গ্যাপের জন্য pt-20 (80px) এবং md:pt-24 (96px)
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? 'bg-gradient-to-b from-black/95 via-black/85 to-black/90'
              : 'bg-gradient-to-b from-white/75 via-white/60 to-white/75'
          }`}
          style={{
            backgroundImage:
              "url('https://img.freepik.com/premium-photo/mutton-biryani-with-fresh-coriander-leaves_1169880-91747.jpg?semt=ais_hybrid&w=740')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundBlendMode: 'overlay',
            filter: isDarkMode ? 'brightness(0.5)' : 'brightness(0.8)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 z-10 mt-8 md:mt-12">
        <div
          className={`text-center max-w-4xl mx-auto p-6 rounded-lg md:p-8 ${
            isDarkMode ? 'bg-black/75' : 'bg-white/85'
          } backdrop-blur-sm`}
        >
          <h1
            className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-xl animate-fadeIn ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            বিয়ের দাওয়াত ছাড়াই উপভোগ করুন
          </h1>
          <h2
            className={`text-xl md:text-3xl font-bold mb-8 animate-slideUp ${
              isDarkMode ? 'text-[#FFD700]' : 'text-red-600'
            } drop-shadow-xl`}
          >
            বিয়ে বাড়ির কাচ্চির প্রিমিয়াম স্বাদ
          </h2>

          <div className="flex flex-col space-y-4 mb-10 max-w-2xl mx-auto">
            <div className="flex items-center">
              <CheckCircle2 size={24} className="text-red-600 mr-3 flex-shrink-0" />
              <p
                className={`text-base md:text-lg text-left ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } drop-shadow-xl`}
              >
                বাছাই করা খাসির তুলতুলে প্রচুর মাংস
              </p>
            </div>
            <div className="flex items-center">
              <CheckCircle2 size={24} className="text-red-600 mr-3 flex-shrink-0" />
              <p
                className={`text-base md:text-lg text-left ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } drop-shadow-xl`}
              >
                ধবধবে সাদা প্রিমিয়াম চিনিগুড়া চাল
              </p>
            </div>
            <div className="flex items-center">
              <CheckCircle2 size={24} className="text-red-600 mr-3 flex-shrink-0" />
              <p
                className={`text-base md:text-lg text-left ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } drop-shadow-xl`}
              >
                অল্প তেল, প্রিমিয়াম মসলা ও উপাদানে রান্না
              </p>
            </div>
          </div>

          <Link
            to="order"
            smooth={true}
            duration={800}
            className={`inline-block bg-red-600 font-bold text-lg md:text-xl px-8 md:px-10 py-3 md:py-4 rounded-md shadow-lg hover:bg-red-700 transition transform hover:scale-105 hover:shadow-xl ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            অর্ডার করুন
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="block h-12 w-0.5 bg-red-600"></span>
        <span className="block h-4 w-4 mt-1 rounded-full border-2 border-red-600"></span>
      </div>
    </section>
  );
};

export default Hero;
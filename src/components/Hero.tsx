import React from 'react';
import { Link } from 'react-scroll';
import { CheckCircle2 } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/78 to-black/90" // গাঢ় ওভারলে
          style={{ 
            backgroundImage: "url('https://img.freepik.com/premium-photo/mutton-kacchi-biryani-with-salad-borhani-chui-pitha-served-dish-isolated-mat-top-view-indian-bangladeshi-food_689047-4948.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundBlendMode: 'overlay',
          }} 
        />
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
            <span className="text-white">বিয়ের দাওয়াত ছাড়াই উপভোগ করুন</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[#FFD700] drop-shadow-lg">
            বিয়ে বাড়ির কাচ্চির প্রিমিয়াম স্বাদ
          </h2>
          
          <div className="flex flex-col space-y-4 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center">
              <CheckCircle2 size={24} className="text-red-600 mr-3 flex-shrink-0" />
              <p className="text-lg text-left text-white drop-shadow-md">বাছাই করা খাসির তুলতুলে প্রচুর মাংস</p>
            </div>
            <div className="flex items-center">
              <CheckCircle2 size={24} className="text-red-600 mr-3 flex-shrink-0" />
              <p className="text-lg text-left text-white drop-shadow-md">ধবধবে সাদা প্রিমিয়াম চিনিগুড়া চাল</p>
            </div>
            <div className="flex items-center">
              <CheckCircle2 size={24} className="text-red-600 mr-3 flex-shrink-0" />
              <p className="text-lg text-left text-white drop-shadow-md">অল্প তেল, প্রিমিয়াম মসলা ও উপাদানে রান্না</p>
            </div>
          </div>
          
          <Link 
            to="order" 
            smooth={true} 
            duration={800}
            className="inline-block bg-red-600 text-white font-bold text-xl px-10 py-4 rounded-md shadow-lg hover:bg-red-700 transition transform hover:scale-105 hover:shadow-xl"
          >
            অর্ডার করুন
          </Link>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="block h-14 w-0.5 bg-red-600"></span>
        <span className="block h-4 w-4 mt-1 rounded-full border-2 border-red-600"></span>
      </div>
    </section>
  );
};

export default Hero;
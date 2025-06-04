import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface PackageCardProps {
  title: string;
  price: number;
  pricePerPerson: number;
  image: string;
  features: string[];
  popular?: boolean;
  index: number;
  onOrderClick: () => void;
  isDarkMode: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({
  title,
  price,
  pricePerPerson,
  image,
  features,
  popular = false,
  index,
  onOrderClick,
  isDarkMode,
}) => {
  console.log(`PackageCard ${title}: isDarkMode = ${isDarkMode}`); // ডিবাগিং লগ

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.2
      }
    }
  };

  return (
    <motion.div
      className={`rounded-lg overflow-hidden ${popular 
        ? 'border-2 border-[#FFD700] transform scale-105 shadow-xl shadow-[#FFD700]/10 z-10' 
        : 'border border-red-600 shadow-lg'}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {popular && (
        <div className={`font-bold text-center py-2 ${isDarkMode ? 'bg-[#FFD700] text-black' : 'bg-[#FFD700] text-black'}`}>
          সবচেয়ে জনপ্রিয়
        </div>
      )}
      
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
        />
      </div>
      
      <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <div className="mt-2 mb-4">
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-[#FFD700]' : 'text-red-600'}`}>{price.toLocaleString()} টাকা</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>({pricePerPerson} টাকা করে একজন)</p>
        </div>
        
        <div className="space-y-2 mt-4 mb-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center">
              <CheckCircle size={16} className="text-red-600 mr-2" />
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</p>
            </div>
          ))}
        </div>
        
        <button 
          onClick={onOrderClick}
          className={`w-full py-3 rounded-md font-bold transition transform hover:scale-105 ${
            popular 
              ? 'bg-[#FFD700] text-black hover:bg-[#e5c200] hover:shadow-[#FFD700]/20 hover:shadow-lg' 
              : isDarkMode 
                ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-600/20 hover:shadow-lg' 
                : 'bg-red-600 text-gray-900 hover:bg-red-700 hover:shadow-red-600/20 hover:shadow-lg'
          }`}
        >
          অর্ডার করুন
        </button>
      </div>
    </motion.div>
  );
};

export default PackageCard;
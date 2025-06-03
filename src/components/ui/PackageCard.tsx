import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PackageCardProps {
  title: string;
  price: number;
  pricePerPerson: number;
  image: string;
  features: string[];
  popular?: boolean;
  index: number;
  onOrderClick: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  title,
  price,
  pricePerPerson,
  image,
  features,
  popular = false,
  index,
  onOrderClick
}) => {
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
        <div className="bg-[#FFD700] text-black font-bold text-center py-2">
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
      
      <div className="p-6 bg-gradient-to-b from-gray-900 to-black">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <div className="mt-2 mb-4">
          <p className="text-[#FFD700] text-2xl font-bold">{price.toLocaleString()} টাকা</p>
          <p className="text-gray-400 text-sm">({pricePerPerson} টাকা করে একজন)</p>
        </div>
        
        <div className="space-y-2 mt-4 mb-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center">
              <CheckCircle size={16} className="text-red-600 mr-2" />
              <p className="text-gray-300 text-sm">{feature}</p>
            </div>
          ))}
        </div>
        
        <button 
          onClick={onOrderClick}
          className={`w-full py-3 rounded-md font-bold transition transform hover:scale-105 ${
            popular 
              ? 'bg-[#FFD700] text-black hover:bg-[#e5c200] hover:shadow-[#FFD700]/20 hover:shadow-lg' 
              : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-600/20 hover:shadow-lg'
          }`}
        >
          অর্ডার করুন
        </button>
      </div>
    </motion.div>
  );
};

export default PackageCard;
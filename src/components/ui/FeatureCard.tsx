import React from 'react';
import { motion } from 'framer-motion';
// Update the import path if ThemeContext is located elsewhere, for example:
import { useTheme } from '../../context/ThemeContext';
// Or create the ThemeContext file if it does not exist.

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ image, title, description, index }) => {
  const { isDarkMode } = useTheme(); // Global theme state

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
      className={`rounded-lg overflow-hidden border shadow-lg hover:-translate-y-1 transition-all duration-300 ${isDarkMode ? 'border-red-600 bg-gradient-to-b from-black to-gray-900 hover:shadow-red-600/20' : 'border-gray-300 bg-gradient-to-b from-gray-100 to-gray-200 hover:shadow-gray-500/20'}`}
      variants={cardVariants}
    >
      <div className="h-56 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
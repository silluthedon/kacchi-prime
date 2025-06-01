import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ image, title, description, index }) => {
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
      className="rounded-lg overflow-hidden border border-red-600 bg-gradient-to-b from-black to-gray-900 shadow-lg hover:shadow-red-600/20 transition-all duration-300 hover:-translate-y-1"
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
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
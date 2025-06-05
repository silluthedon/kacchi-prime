import React, { useState } from 'react';
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
  onOrderClick: (quantity: number, price: number) => void;
  isDarkMode: boolean;
  deliveryFee: number;
}

const PackageCard: React.FC<PackageCardProps> = ({
  title,
  price: initialPrice,
  pricePerPerson: initialPricePerPerson,
  image,
  features,
  popular = false,
  index,
  onOrderClick,
  isDarkMode,
  deliveryFee,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(initialPrice);
  const [pricePerPerson] = useState(initialPricePerPerson);

  const baseQuantity = title.includes('৪ জনের') ? 4 : title.includes('২০ জনের') ? 20 : 50;
  const handleIncrease = () => {
    let newQuantity;
    if (title.includes('৪ জনের')) {
      newQuantity = Math.min(quantity * baseQuantity + 1, 19);
    } else if (title.includes('২০ জনের')) {
      newQuantity = Math.min(quantity * baseQuantity + 2, 48);
    } else if (title.includes('৫০ জনের')) {
      newQuantity = quantity * baseQuantity + 5;
    }
    if (newQuantity > quantity * baseQuantity) {
      const newPrice = newQuantity * pricePerPerson + deliveryFee;
      setQuantity(Math.ceil(newQuantity / baseQuantity));
      setPrice(newPrice);
    }
  };

  const handleOrder = () => {
    const totalQuantity = quantity * baseQuantity;
    console.log('Order clicked - Quantity:', totalQuantity, 'Price:', price); // Debug log
    onOrderClick(totalQuantity, price);
  };

  console.log(`PackageCard ${title}: isDarkMode = ${isDarkMode}`);

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
      className="rounded-lg overflow-hidden border border-red-600 shadow-lg"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
        />
        {popular && (
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full border border-red-600 shadow-lg">
            সবচেয়ে জনপ্রিয়
          </div>
        )}
      </div>
      
      <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex flex-col justify-between h-[calc(100%-12rem)] min-h-[300px]`}>
        <div>
          <h3 
            className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            onClick={handleIncrease}
            style={{ cursor: 'pointer' }}
          >
            {title} <span className="text-red-600">+</span>
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>মোট পরিমাণ: {(quantity * baseQuantity).toLocaleString('bn-BD')} জন</p>
          <div className="mt-2 mb-4">
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-[#FFD700]' : 'text-red-600'}`}>{price.toLocaleString('bn-BD')} টাকা</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>({pricePerPerson.toLocaleString('bn-BD')} টাকা করে একজন)</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>ডেলিভারি চার্জ: {deliveryFee.toLocaleString('bn-BD')} টাকা</p>
          </div>
          
          <div className="space-y-2 mt-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center">
                <CheckCircle size={16} className="text-red-600 mr-2" />
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</p>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={handleOrder}
          className={`w-full py-3 rounded-md font-bold transition transform hover:scale-105 mt-4 ${
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
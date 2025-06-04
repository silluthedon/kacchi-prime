import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PackageCard from './ui/PackageCard';
import OrderModal from './ui/OrderModal';
import FaqSection from './FaqSection';
import { useOrderContext } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext'; // ThemeContext থেকে useTheme ইমপোর্ট

const OrderSection: React.FC = () => {
  const { selectedPackage, setSelectedPackage } = useOrderContext();
  const { isDarkMode } = useTheme(); // ThemeContext থেকে isDarkMode নেওয়া
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const packages = [
    {
      id: "4person",
      title: "৪ জনের প্যাকেজ",
      price: 3200,
      pricePerPerson: 800,
      image: "https://images.pexels.com/photos/7426867/pexels-photo-7426867.jpeg?auto=compress&cs=tinysrgb&w=1600",
      features: [
        "প্রিমিয়াম খাসির মাংস",
        "উন্নতমানের চিনিগুড়া চাল",
        "কাস্টম প্যাকেজিং",
        "ফ্রি হোম ডেলিভারি"
      ]
    },
    {
      id: "20person",
      title: "২০ জনের প্যাকেজ",
      price: 15500,
      pricePerPerson: 775,
      image: "https://img.freepik.com/premium-photo/fall-bone-meat-mutton-kacchi-biryani-realistic-photo_27550-6772.jpg",
      features: [
        "প্রিমিয়াম খাসির মাংস",
        "উন্নতমানের চিনিগুড়া চাল",
        "কাস্টম প্যাকেজিং",
        "ফ্রি হোম ডেলিভারি",
        "বোনাস সালাদ"
      ],
      popular: true
    },
    {
      id: "50person",
      title: "৫০ জনের প্যাকেজ",
      price: 37500,
      pricePerPerson: 750,
      image: "https://images.othoba.com/images/thumbs/0720187_mutton-kacchi-full-bashmoti.jpeg",
      features: [
        "প্রিমিয়াম খাসির মাংস",
        "উন্নতমানের চিনিগুড়া চাল",
        "কাস্টম প্যাকেজিং",
        "ফ্রি হোম ডেলিভারি",
        "বোনাস সালাদ",
        "বোনাস ফিরনি ডেজার্ট"
      ]
    }
  ];

  const handleOrderClick = (packageId: string) => {
    setSelectedPackage(packageId);
    setIsModalOpen(true);
  };

  return (
    <>
      <section
        id="order"
        className={`py-24 relative ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
      >
        <div
          className="absolute inset-0 bg-fixed opacity-5"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            filter: isDarkMode ? 'brightness(0.5)' : 'brightness(0.8)',
          }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 relative"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>অর্ডার করুন</span>
            <span className={isDarkMode ? 'text-[#FFD700]' : 'text-red-600'}> কাচ্চি প্রাইম</span>
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600"></span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {packages.map((pkg, index) => (
              <PackageCard
                key={pkg.id}
                title={pkg.title}
                price={pkg.price}
                pricePerPerson={pkg.pricePerPerson}
                image={pkg.image}
                features={pkg.features}
                popular={pkg.popular}
                index={index}
                onOrderClick={() => handleOrderClick(pkg.id)}
                isDarkMode={isDarkMode} // নতুন প্রোপ যোগ করা
              />
            ))}
          </div>
          
          <motion.p
            className={`text-center mt-10 italic ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            ন্যুনতম ৪ জনের অর্ডারে ঢাকার ভেতর ডেলিভারি চার্জ ফ্রী।
          </motion.p>
          
          <div className="mt-24">
            <FaqSection />
          </div>
        </div>
      </section>
      
      {isModalOpen && (
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          packages={packages}
        />
      )}
    </>
  );
};

export default OrderSection;
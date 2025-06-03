import React from 'react';
import { useTheme } from '../context/ThemeContext'; // ThemeContext থেকে useTheme ইমপোর্ট
import { motion } from 'framer-motion'; // Animation for consistency

const HowToGetSection: React.FC = () => {
  const { isDarkMode } = useTheme(); // ThemeContext থেকে isDarkMode নেওয়া

  return (
    <section
      id="howtoget"
      className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className={`text-3xl font-bold text-center mb-8 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          কিভাবে পাবেন
        </motion.h2>
        <motion.p
          className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          এই সেকশনে আপনার অর্ডার কীভাবে পাবেন তা ব্যাখ্যা করা হয়েছে। আমাদের সাথে যোগাযোগ করুন এবং আপনার পছন্দের প্যাকেজ অর্ডার করুন।
        </motion.p>
      </div>
    </section>
  );
};

export default HowToGetSection;
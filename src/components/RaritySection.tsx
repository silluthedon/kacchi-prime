import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext'; // ThemeContext থেকে useTheme ইমপোর্ট

const RaritySection: React.FC = () => {
  const { isDarkMode } = useTheme(); // গ্লোবাল থিম স্টেট

  const points = [
    {
      number: "১",
      text: "খরচ কমানোর জন্য হোটেল রেস্তোরাঁয় এই রেসিপিতে সাধারণত রান্না করা হয়না। ফলে, চাইলেও আপনি খেতে পারবেন না।"
    },
    {
      number: "২",
      text: "বাজারে সাধারণত আসল খাসির মাংস বিক্রি হয় কম। সেটি চেনা কঠিন। বেশিরভাগ ক্ষেত্রেই বিক্রি হয় কমদামী বকরি।"
    },
    {
      number: "৩",
      text: "বছরের পর বছর বাবুর্চিদের অথেনটিক কাচ্চি রান্নার যে দক্ষতা, সেটি এত সহজে নিজেদের পক্ষে আয়ত্ত করা ভীষণ কঠিন।"
    },
    {
      number: "৪",
      text: "সত্যিকারের দক্ষ বাবুর্চি পাওয়া কঠিন। আবার, ছোট আয়োজনে উচ্চ খরচে বাবুর্চি এনে রান্না করে পোষায়ও না।"
    }
  ];

  return (
    <section id="rarity" className={`py-24 relative ${isDarkMode ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300'}`}>
      <div 
        className="absolute inset-0 bg-fixed opacity-5"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/6210775/pexels-photo-6210775.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
          filter: isDarkMode ? 'brightness(0.5)' : 'brightness(0.9)', // Light mode brightness adjustment
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>অনুষ্ঠান কিংবা বিয়েবাড়ি ছাড়া</span>
          <span className={isDarkMode ? 'text-[#FFD700]' : 'text-red-600'}> এই কাচ্চি পাওয়া কঠিন কেন?</span>
          <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600"></span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
          {points.map((point, index) => (
            <motion.div 
              key={index}
              className={`flex ${index % 2 === 0 ? 'md:translate-y-12' : ''}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
            >
              <div className={`h-12 w-12 rounded-full ${isDarkMode ? 'bg-red-600' : 'bg-red-500'} flex items-center justify-center text-white font-bold text-xl flex-shrink-0 mr-6`}>
                {point.number}
              </div>
              <div>
                <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{point.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className={`mt-20 p-8 border rounded-lg text-center ${isDarkMode ? 'border-red-600 bg-gradient-to-r from-black via-gray-900 to-black' : 'border-gray-300 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300'}`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-[#FFD700]' : 'text-red-600'}`}>কাচ্চি প্রাইম-এ আমরা সমাধান করেছি এই সমস্যাগুলো</h3>
          <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>আমাদের দক্ষ বাবুর্চিরা অথেনটিক রেসিপি অনুসরণ করে এবং প্রিমিয়াম উপাদান ব্যবহার করে প্রস্তুত করেন বিয়েবাড়ির স্বাদে কাচ্চি</p>
        </motion.div>
      </div>
    </section>
  );
};

export default RaritySection;
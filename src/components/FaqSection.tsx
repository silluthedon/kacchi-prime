import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // ThemeContext থেকে useTheme ইমপোর্ট

const FaqSection: React.FC = () => {
  const { isDarkMode } = useTheme(); // ThemeContext থেকে isDarkMode নেওয়া
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "কাচ্চি বিরিয়ানি তো ৩০০ টাকা থেকে ৫০০ টাকার ভেতরেই পাওয়া যায়, আপনাদের দাম এত বেশি কেন?",
      answer: "আপনি এখানে মূল্য পরিশোধ করবেন প্রিমিয়াম কোয়ালিটির জন্য, যেটি স্বাভাবিকভাবেই বেশি হবে। 'কাচ্চি প্রাইম' এর মূল উদ্দেশ্য হচ্ছে বিয়ে বাড়ির অথেনটিক স্বাদের কাচ্চি ঘরে বসেই খাওয়ার সুযোগ করে দেয়া। কোয়ালিটি এবং অন্যান্য সবকিছু নিশ্চিত করতে গিয়ে যে খরচ, সেটির উপর ন্যুনতম লাভ ধরেই এই মূল্য ধরা হয়েছে।"
    },
    {
      question: "একজন কিংবা দুই জনের জন্য নিতে চাই, নেয়া যাবেনা?",
      answer: "নেয়া যাবে, কিন্তু সেক্ষেত্রে ডেলিভারি চার্জ যোগ হবে ২০০ টাকা।"
    },
    {
      question: "ডেলিভারি চার্জ এত বেশি কেন?",
      answer: "এটা যেহেতু খাবার, সেহেতু ইন্সট্যান্ট ডেলিভারি সার্ভিস ব্যবহার করে আমাদের ডেলিভারি দিতে হয় (বাইক সার্ভিস ডেলিভারি)। সেজন্য ডেলিভারি চার্জ বেশি।"
    },
    {
      question: "আপনাদের কাচ্চি কি মোটেই হোটেলের মতো না?",
      answer: "জি, আমাদের কাচ্চি সম্পূর্ণ বিয়েবাড়ির স্টাইলে বানানো হয়। আমরা একই উপাদান ব্যবহার করি যা ঐতিহ্যগত বিয়ের অনুষ্ঠানে ব্যবহার করা হয় - প্রিমিয়াম খাসির মাংস, উন্নতমানের চিনিগুড়া চাল, এবং সীমিত কিন্তু উন্নতমানের মসলা। এর ফলে আমাদের কাচ্চিতে উপাদানের আসল স্বাদ ও সুগন্ধ বজায় থাকে।"
    }
  ];
  
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="pt-10">
      <motion.h3
        className={`text-2xl md:text-3xl font-bold text-center mb-10 relative ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>সাধারণ</span>
        <span className={isDarkMode ? 'text-[#FFD700]' : 'text-red-600'}> জিজ্ঞাসা</span>
        <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-red-600"></span>
      </motion.h3>
      
      <div className="max-w-3xl mx-auto mt-8">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className={`mb-4 border rounded-lg overflow-hidden ${
              isDarkMode ? 'border-gray-800' : 'border-gray-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <button
              className={`w-full p-4 flex justify-between items-center focus:outline-none ${
                isDarkMode
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              } font-medium transition-colors`}
              onClick={() => toggleFaq(index)}
            >
              <span className="text-left">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="text-red-600 flex-shrink-0" size={20} />
              ) : (
                <ChevronDown className="text-red-600 flex-shrink-0" size={20} />
              )}
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 p-4' : 'max-h-0'
              } ${
                isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
              }`}
            >
              <p>{faq.answer}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
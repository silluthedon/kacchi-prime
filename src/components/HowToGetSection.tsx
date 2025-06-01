import React from 'react';
import { motion } from 'framer-motion';
import { Circle } from 'lucide-react';

const HowToGetSection: React.FC = () => {
  const points = [
    "ওয়েবসাইট এ অর্ডার করে হোম ডেলিভারি নিতে হবে।",
    "আপাতত শুধু শুক্রবার ডেলিভারি করা হবে। পরে বাড়ানো হবে।",
    "প্রি অর্ডার নেয়া হবে শুক্রবার থেকে বৃহস্পতিবার পর্যন্ত।",
    "বুকিং মানি জমা দিতে হবে ৫০%। বাকি টাকা ক্যাশ অন ডেলিভারি।",
    "অর্ডার করে কেউ না নিলে আমরা যেন লসে পড়ে না যাই সেজন্য বুকিং মানি নেয়া হবে।",
    "অনিচ্ছাকৃত কোন কারণে ডেলিভারি না দিতে পারলে পুরো টাকা ডেলিভারি ডেট এর ভেতর রিফান্ড করা হবে।"
  ];
  
  return (
    <section id="howtoget" className="py-24 bg-black relative">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6896379/pexels-photo-6896379.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-fixed opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-white">প্রিমিয়াম স্বাদের</span>
          <span className="text-[#FFD700]"> কাচ্চি প্রাইম কিভাবে পাওয়া যাবে?</span>
          <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600"></span>
        </motion.h2>
        
        <div className="max-w-3xl mx-auto mt-12 bg-gradient-to-b from-black to-gray-900 p-8 rounded-lg border border-gray-800 shadow-xl">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
          >
            {points.map((point, index) => (
              <motion.div 
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Circle 
                  size={20} 
                  className="text-red-600 mr-4 flex-shrink-0 mt-1" 
                  fill="#FF0000" 
                />
                <p className="text-lg">{point}</p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-10 p-4 border-l-4 border-red-600 bg-gray-900/50 rounded"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <p className="text-[#FFD700] font-medium">ঢাকার সকল এলাকায় ডেলিভারি করা হয়।</p>
            <p className="text-gray-300 text-sm mt-1">* অর্ডার কনফার্ম হওয়ার পর আমাদের টিম আপনার সাথে ডেলিভারি টাইম নিশ্চিত করবে</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowToGetSection;
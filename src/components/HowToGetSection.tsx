import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext'; // ThemeContext থেকে useTheme ইমপোর্ট
import { motion } from 'framer-motion'; // Animation for consistency
import { supabase } from '../utils/supabaseClient';

const HowToGetSection: React.FC = () => {
  const { isDarkMode } = useTheme(); // ThemeContext থেকে isDarkMode নেওয়া
  const [deliveryDays, setDeliveryDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliverySchedule = async () => {
      const { data, error } = await supabase
        .from('delivery_schedule')
        .select('day_of_week, is_enabled')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching delivery schedule:', error);
        setDeliveryDays([]);
      } else {
        const enabledDays = data
          .filter(day => day.is_enabled)
          .map(day => day.day_of_week);
        setDeliveryDays(enabledDays);
      }
      setLoading(false);
    };

    fetchDeliverySchedule();
  }, []);

  // Map English days to Bangla days for display
  const dayMap = {
    Monday: 'সোমবার',
    Tuesday: 'মঙ্গলবার',
    Wednesday: 'বুধবার',
    Thursday: 'বৃহস্পতিবার',
    Friday: 'শুক্রবার',
    Saturday: 'শনিবার',
    Sunday: 'রবিবার',
  };

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
          className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          এই সেকশনে আপনার অর্ডার কীভাবে পাবেন তা ব্যাখ্যা করা হয়েছে। আমাদের সাথে যোগাযোগ করুন এবং আপনার পছন্দের প্যাকেজ অর্ডার করুন।
        </motion.p>
        <motion.div
          className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {loading ? (
            <p>ডেলিভারি দিনগুলো লোড হচ্ছে...</p>
          ) : deliveryDays.length > 0 ? (
            <p>
              আমরা প্রতি{' '}
              {deliveryDays.map((day, index) => (
                <span key={day}>
                  {dayMap[day]}
                  {index < deliveryDays.length - 1 ? ', ' : ''}
                </span>
              ))}
              {' '}ডেলিভারি দিয়ে থাকি।
            </p>
          ) : (
            <p>বর্তমানে কোনো ডেলিভারি দিন নির্ধারিত নেই।</p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HowToGetSection;
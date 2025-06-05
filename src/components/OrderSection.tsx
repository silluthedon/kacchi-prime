import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PackageCard from './ui/PackageCard';
import OrderModal from './ui/OrderModal';
import FaqSection from './FaqSection';
import { useOrderContext } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../utils/supabaseClient';

const OrderSection: React.FC = () => {
  const { setSelectedPackage } = useOrderContext();
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('id, name, price, delivery_fee, bonus_firni, bonus_salad, bonus_borhani');

      if (error) {
        console.error('Error fetching packages:', error);
      } else {
        const enrichedPackages = data.map(pkg => ({
          ...pkg,
          pricePerPerson: pkg.price / (pkg.name.includes('৪') ? 4 : pkg.name.includes('২০') ? 20 : 50),
          image: pkg.name.includes('৪')
            ? 'https://images.pexels.com/photos/7426867/pexels-photo-7426867.jpeg?auto=compress&cs=tinysrgb&w=1600'
            : pkg.name.includes('২০')
            ? 'https://img.freepik.com/premium-photo/fall-bone-meat-mutton-kacchi-biryani-realistic-photo_27550-6772.jpg'
            : 'https://images.othoba.com/images/thumbs/0720187_mutton-kacchi-full-bashmoti.jpeg',
          features: [
            'প্রিমিয়াম খাসির মাংস',
            'উন্নতমানের চিনিগুড়া চাল',
            'কাস্টম প্যাকেজিং',
            ...(pkg.delivery_fee === 0 ? ['ফ্রি হোম ডেলিভারি'] : []),
            ...(pkg.bonus_firni ? ['বোনাস ফিরনি ডেজার্ট'] : []),
            ...(pkg.bonus_salad ? ['বোনাস সালাদ'] : []),
            ...(pkg.bonus_borhani ? ['বোনাস বোরহানি'] : []),
          ],
          popular: pkg.name.includes('২০'),
        })).sort((a, b) => {
          const order = { '৪': 1, '২০': 2, '৫০': 3 };
          const aNum = a.name.match(/[০-৯]+/)?.[0] || '০';
          const bNum = b.name.match(/[০-৯]+/)?.[0] || '০';
          return order[aNum] - order[bNum];
        });
        setPackages(enrichedPackages);
      }
    };

    fetchPackages();

    const subscription = supabase
      .channel('public:packages')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'packages' }, (payload) => {
        setPackages(prevPackages =>
          prevPackages.map(pkg =>
            pkg.id === payload.new.id
              ? {
                  ...pkg,
                  price: payload.new.price,
                  delivery_fee: payload.new.delivery_fee,
                  bonus_firni: payload.new.bonus_firni,
                  bonus_salad: payload.new.bonus_salad,
                  bonus_borhani: payload.new.bonus_borhani,
                  features: [
                    'প্রিমিয়াম খাসির মাংস',
                    'উন্নতমানের চিনিগুড়া চাল',
                    'কাস্টম প্যাকেজিং',
                    ...(payload.new.delivery_fee === 0 ? ['ফ্রি হোম ডেলিভারি'] : []),
                    ...(payload.new.bonus_firni ? ['বোনাস ফিরনি ডেজার্ট'] : []),
                    ...(payload.new.bonus_salad ? ['বোনাস সালাদ'] : []),
                    ...(payload.new.bonus_borhani ? ['বোনাস বোরহানি'] : []),
                  ],
                }
              : pkg
          ).sort((a, b) => {
            const order = { '৪': 1, '২০': 2, '৫০': 3 };
            const aNum = a.name.match(/[০-৯]+/)?.[0] || '০';
            const bNum = b.name.match(/[০-৯]+/)?.[0] || '০';
            return order[aNum] - order[bNum];
          })
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleOrderClick = (packageId: string, quantity: number, price: number) => {
    console.log('handleOrderClick - PackageID:', packageId, 'Quantity:', quantity, 'Price:', price);
    setSelectedPackage({ id: packageId, quantity, price });
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
                title={pkg.name}
                price={pkg.price}
                pricePerPerson={pkg.pricePerPerson}
                image={pkg.image}
                features={pkg.features}
                popular={pkg.popular}
                index={index}
                onOrderClick={(quantity, price) => handleOrderClick(pkg.id, quantity, price)}
                isDarkMode={isDarkMode}
                deliveryFee={pkg.delivery_fee || 0}
              />
            ))}
          </div>

          <motion.p
            className={`text-center mt-10 italic ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
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
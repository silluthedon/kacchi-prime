import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from './ui/FeatureCard';

const SpecialSection: React.FC = () => {
  const features = [
    {
      image: "https://img.freepik.com/premium-photo/raw-lamb-chops-fresh-mutton-meat-cutlets-ribs-dark-background-top-view_89816-56454.jpg",
      title: "১) মাংসের কোয়ালিটি",
      description: "খরচ কমাতে হোটেল রেস্তোরাঁয় ব্যবহার করা হয় অল্প পরিমাণে ছোট পিস এর কমদামী বকরির মাংস, যেগুলো একটু শক্ত, এবং কম স্বাদের। কিন্তু বিয়েবাড়ির আসল কাচ্চিতে ব্যবহার করা হয় বাছাই করা অরিজিনাল খাসির মাংস, এবং পরিমাণে থাকে বেশি।"
    },
    {
      image: "https://img3.exportersindia.com/product_images/bc-small/2023/9/8495908/traditional-basmati-rice-1620735769-5818663.jpg",
      title: "২) চালের কোয়ালিটি",
      description: "হোটেল রেস্তোরাঁয় সাধারণত ব্যবহার করা হয় বাসমতি চাল। কিন্তু, ঢাকাই কাচ্চির অথেনটিক রেসিপি অনুযায়ী বিয়েবাড়ির কাচ্চিতে ব্যবহার করা হয় বাছাই করা প্রিমিয়াম চিনিগুড়া চাল, যেটি খাসির তুলতুলে মাংসের সাথে পারফেক্ট কম্বিনেশন।"
    },
    {
      image: "https://img.freepik.com/premium-photo/food-critic-tasting-kacchi-biryani-highend-restaurant_636537-470590.jpg",
      title: "৩) রান্নার পদ্ধতি",
      description: "অল্প তেল, অরিজিনাল ঘি, এবং অল্প, কিন্তু প্রিমিয়াম মসলা ও উপাদানে রান্না হয় বিয়েবাড়ির কাচ্চি। ফলে, খাসির তুলতুলে মাংস এবং চালের প্রায় অরিজিনাল কালারটাই থাকে, অজস্র মসলার কারণে এর মূল স্বাদ এবং কালার হারিয়ে যায়না।"
    },
    {
      image: "https://img.freepik.com/premium-photo/ghee-being-poured-pot-kacchi-biryani_636537-471216.jpg",
      title: "৪) দক্ষ বাবুর্চি",
      description: "অল্প কয়েকজন দক্ষ বাবুর্চি বছরের পর বছর তাদের দক্ষতা এবং সিক্রেট কিছু ফর্মূলা ব্যবহার করে এই অথেনটিক কাচ্চি রান্নার দক্ষতা অর্জন করেছেন, যারা শুধুমাত্র বিয়ে কিংবা বিভিন্ন অনুষ্ঠানেই কাজ করেন।"
    }
  ];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <section id="special" className="py-20 bg-black relative">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6210939/pexels-photo-6210939.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-fixed opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-white">বিয়েবাড়ির কাচ্চির</span>
          <span className="text-[#FFD700]"> সিক্রেট কি?</span>
          <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600"></span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              image={feature.image}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialSection;
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Plus, Minus } from "lucide-react";

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
  pricePerPerson,
  image,
  features,
  popular = false,
  index,
  onOrderClick,
  isDarkMode,
  deliveryFee,
}) => {
  // Debug the title prop to ensure it's being passed correctly
  console.log(`PackageCard Title: ${title}`);

  // Determine base persons and package name based on title
  const basePersons = title === "৪ জনের প্যাকেজ" ? 4 : title === "২০ জনের প্যাকেজ" ? 20 : 50;
  const packageName = title === "৪ জনের প্যাকেজ"
    ? "৪ জনের প্যাকেজ"
    : title === "২০ জনের প্যাকেজ"
    ? "২০ জনের প্যাকেজ"
    : "৫০ জনের প্যাকেজ";

  const [totalPersons, setTotalPersons] = useState(basePersons);
  const [price, setPrice] = useState(initialPrice);
  const [count, setCount] = useState(0); // Tracks additional persons beyond minimum

  const handleIncrease = () => {
    let newCount, newTotalPersons;
    if (title === "৪ জনের প্যাকেজ") {
      newCount = Math.min(count + 1, 15); // Max 19 - 4 = 15
      newTotalPersons = Math.min(totalPersons + 1, 19);
    } else if (title === "২০ জনের প্যাকেজ") {
      newCount = Math.min(count + 2, 28); // Max 48 - 20 = 28
      newTotalPersons = Math.min(totalPersons + 2, 48);
    } else {
      newCount = count + 5;
      newTotalPersons = totalPersons + 5;
    }

    if (newTotalPersons !== totalPersons) {
      setCount(newCount);
      setTotalPersons(newTotalPersons);
      setPrice(newTotalPersons * pricePerPerson + deliveryFee);
    }
  };

  const handleDecrease = () => {
    let newCount, newTotalPersons;
    if (title === "৪ জনের প্যাকেজ") {
      newCount = Math.max(count - 1, 0); // Min 4 (0 extra)
      newTotalPersons = Math.max(totalPersons - 1, 4);
    } else if (title === "২০ জনের প্যাকেজ") {
      newCount = Math.max(count - 2, 0); // Min 20 (0 extra)
      newTotalPersons = Math.max(totalPersons - 2, 20);
    } else {
      newCount = Math.max(count - 5, 0); // Min 50 (0 extra)
      newTotalPersons = Math.max(totalPersons - 5, 50);
    }

    if (newTotalPersons !== totalPersons) {
      setCount(newCount);
      setTotalPersons(newTotalPersons);
      setPrice(newTotalPersons * pricePerPerson + deliveryFee);
    }
  };

  const handleOrder = () => {
    console.log("Order clicked - Quantity:", totalPersons, "Price:", price);
    onOrderClick(totalPersons, price);
  };

  console.log(`PackageCard ${title}: isDarkMode = ${isDarkMode}`);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.2,
      },
    },
  };

  return (
    <motion.div
      className="rounded-xl overflow-hidden border border-red-600 shadow-lg"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        {popular && (
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-yellow-600 text-white text-sm font-bold rounded-full shadow-lg">
            সবচেয়ে জনপ্রিয়
          </div>
        )}
      </div>

      <div
        className={`p-6 ${isDarkMode ? "bg-gray-900" : "bg-white"} flex flex-col justify-between h-[calc(100%-12rem)] min-h-[300px]`}
      >
        <div>
          <h3
            className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} flex items-center gap-2`}
            style={{ cursor: "default" }}
          >
            {packageName}
            <Plus
              size={25}
              className="text-red-500 hover:text-red-700 cursor-pointer transition-colors"
              onClick={handleIncrease}
            />
            {totalPersons > basePersons && (
              <>
                <span className="text-sm text-gray-500">[{count}]</span>
                <Minus
                  size={25}
                  className="text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                  onClick={handleDecrease}
                />
              </>
            )}
          </h3>
          <div className="mt-4 mb-6">
            <p
              className={`text-2xl font-bold ${isDarkMode ? "text-yellow-400" : "text-red-600"}`}
            >
              {price.toLocaleString("bn-BD")} টাকা
            </p>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              ({pricePerPerson.toLocaleString("bn-BD")} টাকা/জন)
            </p>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mt-2`}>
              ডেলিভারি ফি: {deliveryFee.toLocaleString("bn-BD")} টাকা
            </p>
          </div>

          <div className="space-y-2">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center">
                <CheckCircle size={16} className="text-red-600 mr-2" />
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleOrder}
          className={`w-full py-3 rounded-md font-bold transition transform hover:scale-105 mt-4 ${
            popular
              ? "bg-yellow-600 text-black hover:bg-yellow-700 hover:shadow-lg"
              : isDarkMode
              ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg"
              : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg"
          }`}
        >
          অর্ডার করুন
        </button>
      </div>
    </motion.div>
  );
};

export default PackageCard;
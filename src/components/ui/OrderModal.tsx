import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Phone, Mail, MapPin, Info, CheckCircle } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useOrderContext } from '../../context/OrderContext';
import { supabase } from '../../utils/supabaseClient';
import { useTheme } from '../../context/ThemeContext';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: any[];
}

type FormValues = {
  name: string;
  phone: string;
  email: string;
  packageId: string;
  address: string;
  additionalInfo: string;
};

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, packages }) => {
  const { isDarkMode } = useTheme();
  const { selectedPackage } = useOrderContext();
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(getNextFriday());
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      packageId: selectedPackage
    }
  });

  function getNextFriday(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToAdd = (5 - dayOfWeek + 7) % 7 || 7;
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysToAdd);
    return nextFriday;
  }

  const isFriday = (date: Date): boolean => date.getDay() === 5;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError(null);
    setFormData(data);

    const deliveryDateStr = deliveryDate?.toISOString().split('T')[0] || '';
    const selectedPkg = packages.find(pkg => pkg.id === data.packageId);
    const { error: supabaseError } = await supabase.from('orders').insert({
      customer_name: data.name,
      item: selectedPkg?.title || 'Unknown Package',
      quantity: 1,
      phone: data.phone,
      email: data.email || null,
      address: data.address,
      additional_info: data.additionalInfo || null,
      delivery_date: deliveryDateStr,
      order_status: 'pending',
      delivery_status: 'pending',
      payment_status: 'pending',
    });

    if (supabaseError) {
      setError('অর্ডার সেভ করতে ব্যর্থ হয়েছে: ' + supabaseError.message);
      return;
    }

    console.log({ ...data, deliveryDate });
    setTimeout(() => setOrderConfirmed(true), 1500);
  };

  const formatPrice = (packageId: string): string => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return '0';
    return (pkg.price * 0.5).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${
        isDarkMode ? 'bg-black/70' : 'bg-gray-900/50'
      } backdrop-blur-md`}
    >
      <motion.div
        className={`rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
          isDarkMode
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
            : 'bg-gradient-to-br from-white to-gray-50 text-gray-900'
        }`}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <motion.h3
            className="text-xl font-bold"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {orderConfirmed ? 'অর্ডার কনফার্ম হয়েছে!' : 'অর্ডার ফর্ম'}
          </motion.h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-700 transition ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <motion.p
              className="text-red-500 text-center mb-4 bg-red-100/80 p-2 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
          {orderConfirmed ? (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-24 h-24 rounded-full bg-green-600 mx-auto flex items-center justify-center mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <CheckCircle size={40} className="text-white" />
              </motion.div>
              <motion.h4
                className="text-2xl font-bold text-[#FFD700]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                অর্ডার কনফার্মড!
              </motion.h4>
              <motion.p
                className="text-gray-300 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                আমরা আপনার সাথে শীঘ্রই যোগাযোগ করব।
              </motion.p>
              <motion.p
                className="text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                ডেলিভারি তারিখ:{' '}
                {deliveryDate?.toLocaleDateString('bn-BD', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </motion.p>
              <motion.button
                onClick={onClose}
                className="mt-8 bg-red-600 text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ধন্যবাদ
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-col space-y-2">
                <label htmlFor="name" className="block font-medium">
                  আপনার নাম
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <input
                    type="text"
                    id="name"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-black border-gray-300'
                    }`}
                    placeholder="পূর্ণ নাম লিখুন"
                    {...register('name', { required: 'নাম আবশ্যক' })}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="phone" className="block font-medium">
                  ফোন নম্বর
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <input
                    type="tel"
                    id="phone"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-black border-gray-300'
                    }`}
                    placeholder="০১৭XXXXXXXX"
                    {...register('phone', {
                      required: 'ফোন নম্বর আবশ্যক',
                      pattern: {
                        value: /^(?:\+?88)?01[3-9]\d{8}$/,
                        message: 'সঠিক বাংলাদেশী ফোন নম্বর দিন',
                      },
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="block font-medium">
                  ইমেইল (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <input
                    type="email"
                    id="email"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-black border-gray-300'
                    }`}
                    placeholder="example@mail.com"
                    {...register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'সঠিক ইমেইল এড্রেস দিন',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="package" className="block font-medium">
                  প্যাকেজ
                </label>
                <div className="relative">
                  <select
                    id="package"
                    className={`w-full pl-4 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-black border-gray-300'
                    }`}
                    {...register('packageId', { required: 'প্যাকেজ নির্বাচন করুন' })}
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.title} - {pkg.price.toLocaleString()} টাকা
                      </option>
                    ))}
                  </select>
                </div>
                {errors.packageId && (
                  <p className="text-red-500 text-sm">{errors.packageId.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="deliveryDate" className="block font-medium">
                  ডেলিভারির তারিখ (শুধু শুক্রবার)
                </label>
                <div className="relative">
                  <DatePicker
                    selected={deliveryDate}
                    onChange={(date: Date | null) => setDeliveryDate(date)}
                    filterDate={isFriday}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-black border-gray-300'
                    }`}
                    placeholderText="শুক্রবারের তারিখ বাছাই করুন"
                  />
                </div>
                {!deliveryDate && (
                  <p className="text-red-500 text-sm">ডেলিভারির তারিখ আবশ্যক</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="address" className="block font-medium">
                  ডেলিভারি ঠিকানা
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className={`absolute left-3 top-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <textarea
                    id="address"
                    rows={3}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-black border-gray-300'
                    }`}
                    placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                    {...register('address', { required: 'ডেলিভারি ঠিকানা আবশ্যক' })}
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="additionalInfo" className="block font-medium">
                  অতিরিক্ত তথ্য (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <Info
                    size={18}
                    className={`absolute left-3 top-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <textarea
                    id="additionalInfo"
                    rows={2}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-black border-gray-300'
                    }`}
                    placeholder="যেকোন অতিরিক্ত তথ্য বা নির্দেশনা"
                    {...register('additionalInfo')}
                  />
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  type="submit"
                  className={`w-full py-3 rounded-md text-white font-bold transition transform ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900'
                      : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900'
                  }`}
                  disabled={!deliveryDate}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ৫০% বুকিং মানি দিয়ে অর্ডার করুন
                </motion.button>

                <p
                  className={`text-sm text-center mt-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  * অর্ডার কনফার্ম করার পর আমরা আপনার সাথে যোগাযোগ করব
                </p>
              </div>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OrderModal;
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useOrderContext } from '../../context/OrderContext';

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
  const { selectedPackage } = useOrderContext();
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(getNextFriday());
  const [paymentStep, setPaymentStep] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      packageId: selectedPackage
    }
  });

  function getNextFriday(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 5 is Friday
    const daysToAdd = (5 - dayOfWeek + 7) % 7 || 7; // If today is Friday, get next Friday
    
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysToAdd);
    return nextFriday;
  }

  const isFriday = (date: Date): boolean => {
    return date.getDay() === 5; // 5 represents Friday
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // In a real app, this would send the data to the server
    console.log({ ...data, deliveryDate });
    setPaymentStep(true);
  };

  const handlePayment = () => {
    // In a real app, this would integrate with a payment gateway
    setTimeout(() => {
      setOrderConfirmed(true);
    }, 1500);
  };

  const formatPrice = (packageId: string): string => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return '0';
    
    // 50% of the total price
    const bookingAmount = pkg.price * 0.5;
    return bookingAmount.toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-black border border-gray-800 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">
            {orderConfirmed ? 'অর্ডার কনফার্ম হয়েছে!' : paymentStep ? 'পেমেন্ট' : 'অর্ডার ফর্ম'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {orderConfirmed ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-600 mx-auto flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg\" className="h-10 w-10 text-white\" fill="none\" viewBox="0 0 24 24\" stroke="currentColor">
                  <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-[#FFD700] mb-4">অর্ডার কনফার্মড!</h4>
              <p className="text-gray-300 mb-6">আমরা আপনার সাথে শীঘ্রই যোগাযোগ করব।</p>
              <p className="text-white">ডেলিভারি তারিখ: {deliveryDate?.toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <button 
                onClick={onClose} 
                className="mt-8 bg-red-600 text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition"
              >
                ধন্যবাদ
              </button>
            </div>
          ) : paymentStep ? (
            <div className="py-4">
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <h4 className="text-white font-bold mb-2">বুকিং টাকা (৫০%)</h4>
                <p className="text-2xl text-[#FFD700] font-bold">{formatPrice(selectedPackage)} টাকা</p>
                <p className="text-gray-400 text-sm mt-1">* বাকি টাকা ডেলিভারির সময় পরিশোধ করতে হবে</p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <h4 className="text-white font-bold mb-4">পেমেন্ট মেথড</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="radio" id="bkash" name="payment" className="mr-3" defaultChecked />
                    <label htmlFor="bkash" className="text-white">বিকাশ</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="nagad" name="payment" className="mr-3" />
                    <label htmlFor="nagad" className="text-white">নগদ</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="card" name="payment" className="mr-3" />
                    <label htmlFor="card" className="text-white">ক্রেডিট/ডেবিট কার্ড</label>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:space-x-4 mt-8">
                <button 
                  onClick={() => setPaymentStep(false)}
                  className="py-3 px-6 border border-gray-600 rounded-md text-white font-medium hover:bg-gray-800 transition md:w-1/2"
                >
                  পেছনে যান
                </button>
                <button 
                  onClick={handlePayment}
                  className="py-3 px-6 bg-red-600 rounded-md text-white font-bold hover:bg-red-700 transition mt-4 md:mt-0 md:w-1/2"
                >
                  পেমেন্ট করুন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white mb-1">আপনার নাম</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="পূর্ণ নাম লিখুন"
                  {...register("name", { required: "নাম আবশ্যক" })}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-white mb-1">ফোন নম্বর</label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="০১৭XXXXXXXX"
                  {...register("phone", { 
                    required: "ফোন নম্বর আবশ্যক",
                    pattern: {
                      value: /^(?:\+?88)?01[3-9]\d{8}$/,
                      message: "সঠিক বাংলাদেশী ফোন নম্বর দিন"
                    }
                  })}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white mb-1">ইমেইল (ঐচ্ছিক)</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="example@mail.com"
                  {...register("email", { 
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "সঠিক ইমেইল এড্রেস দিন"
                    }
                  })}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              
              <div>
                <label htmlFor="package" className="block text-white mb-1">প্যাকেজ</label>
                <select
                  id="package"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  {...register("packageId", { required: "প্যাকেজ নির্বাচন করুন" })}
                >
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title} - {pkg.price.toLocaleString()} টাকা
                    </option>
                  ))}
                </select>
                {errors.packageId && <p className="text-red-500 text-sm mt-1">{errors.packageId.message}</p>}
              </div>
              
              <div>
                <label htmlFor="deliveryDate" className="block text-white mb-1">ডেলিভারির তারিখ (শুধু শুক্রবার)</label>
                <DatePicker
                  selected={deliveryDate}
                  onChange={(date) => setDeliveryDate(date)}
                  filterDate={isFriday}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 text-white"
                  placeholderText="শুক্রবারের তারিখ বাছাই করুন"
                />
                {!deliveryDate && <p className="text-red-500 text-sm mt-1">ডেলিভারির তারিখ আবশ্যক</p>}
              </div>
              
              <div>
                <label htmlFor="address" className="block text-white mb-1">ডেলিভারি ঠিকানা</label>
                <textarea
                  id="address"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                  {...register("address", { required: "ডেলিভারি ঠিকানা আবশ্যক" })}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>
              
              <div>
                <label htmlFor="additionalInfo" className="block text-white mb-1">অতিরিক্ত তথ্য (ঐচ্ছিক)</label>
                <textarea
                  id="additionalInfo"
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="যেকোন অতিরিক্ত তথ্য বা নির্দেশনা"
                  {...register("additionalInfo")}
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-3 bg-red-600 rounded-md text-white font-bold hover:bg-red-700 transition transform hover:scale-105"
                  disabled={!deliveryDate}
                >
                  ৫০% বুকিং মানি দিয়ে অর্ডার করুন
                </button>
                
                <p className="text-gray-400 text-sm text-center mt-4">
                  * অর্ডার কনফার্ম করার পর আমরা আপনার সাথে যোগাযোগ করব
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
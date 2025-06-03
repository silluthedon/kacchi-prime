import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center md:text-left">
            <h2 className="text-[#FFD700] text-2xl font-bold font-serif mb-4">Kacchi Prime</h2>
            <p className="text-gray-300">
              বিয়ে বাড়ির কাচ্চির প্রিমিয়াম স্বাদ এখন আপনার ডোরস্টেপে
            </p>
            <p className="text-gray-400 text-sm mt-4">
              &copy; {new Date().getFullYear()} Kacchi Prime. All rights reserved.|$|
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-white font-bold mb-4">যোগাযোগ</h3>
            <div className="flex items-center justify-center mb-3">
              <Mail size={16} className="text-red-600 mr-2" />
              <a href="mailto:support@kacchiprime.com" className="text-gray-300 hover:text-white transition">
                support@kacchiprime.com
              </a>
            </div>
            <div className="flex items-center justify-center">
              <Phone size={16} className="text-red-600 mr-2" />
              <a href="tel:+8801234567890" className="text-gray-300 hover:text-white transition">
                +880 1234-567890
              </a>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <h3 className="text-white font-bold mb-4">সোশ্যাল মিডিয়া</h3>
            <div className="flex items-center justify-center md:justify-end space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6 hover:text-[#FFD700]" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 hover:text-[#FFD700]" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6 hover:text-[#FFD700]" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>বিশেষ দ্রষ্টব্য: কাচ্চি প্রাইম এর সমস্ত খাবার হালাল উপাদান দিয়ে প্রস্তুত করা হয়।</p>
          <p className="mt-2">
            <a href="#" className="text-gray-400 hover:text-red-600 mr-4">গোপনীয়তা নীতি</a>
            <a href="#" className="text-gray-400 hover:text-red-600">শর্তাবলী</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
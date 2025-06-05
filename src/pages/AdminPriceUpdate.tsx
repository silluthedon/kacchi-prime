import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';

const AdminPriceUpdate = () => {
  const [packages, setPackages] = useState([]);
  const [newPrices, setNewPrices] = useState({});
  const [newDeliveryFees, setNewDeliveryFees] = useState({});
  const [bonusOptions, setBonusOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          setError('ইউজার লোড ব্যর্থ বা লগইন করা যায়নি।');
          toast.error('দয়া করে লগইন করুন।');
          navigate('/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || profile.role !== 'admin') {
          setError('আপনার এডমিন অ্যাক্সেস নেই।');
          toast.error('এডমিন অ্যাক্সেস প্রয়োজন।');
          navigate('/login');
          return;
        }

        setUser(user);
        fetchPackages();
      } catch (err) {
        setError('অজানা ত্রুটি: ' + err.message);
        toast.error('অজানা ত্রুটি: ' + err.message);
        navigate('/login');
      }
    };

    const fetchPackages = async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*');
      if (error) {
        console.error('Error fetching packages:', error);
      } else {
        setPackages(data);
        const initialPrices = data.reduce((acc, pkg) => ({ ...acc, [pkg.id]: pkg.price }), {});
        const initialFees = data.reduce((acc, pkg) => ({ ...acc, [pkg.id]: pkg.delivery_fee || 0 }), {});
        const initialBonuses = data.reduce((acc, pkg) => ({
          ...acc,
          [pkg.id]: {
            firni: pkg.bonus_firni || false,
            salad: pkg.bonus_salad || false,
            borhani: pkg.bonus_borhani || false,
          },
        }), {});
        setNewPrices(initialPrices);
        setNewDeliveryFees(initialFees);
        setBonusOptions(initialBonuses);
      }
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        if (session?.user) fetchPackages();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
      }
    });

    checkUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handlePriceUpdate = async (packageId) => {
    const newPrice = newPrices[packageId];
    const newFee = newDeliveryFees[packageId];
    const { firni, salad, borhani } = bonusOptions[packageId] || {};

    const updates = {};
    if (newPrice) updates.price = parseFloat(newPrice);
    if (newFee !== undefined && newFee !== null) updates.delivery_fee = parseFloat(newFee);
    updates.bonus_firni = firni ?? false;
    updates.bonus_salad = salad ?? false;
    updates.bonus_borhani = borhani ?? false;

    const { error } = await supabase
      .from('packages')
      .update(updates)
      .eq('id', packageId);

    if (error) {
      console.error('Error updating package:', error);
      toast.error('আপডেটে ত্রুটি: ' + error.message);
    } else {
      toast.success('দাম, ডেলিভারি চার্জ ও বোনাস অপশন সফলভাবে আপডেট করা হয়েছে!');
      const { data } = await supabase
        .from('packages')
        .select('*')
        .eq('id', packageId);
      setPackages(packages.map(pkg => pkg.id === packageId ? data[0] : pkg));
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 sm:p-6">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">ত্রুটি</h1>
          <p className="text-base sm:text-lg mb-4">{error}</p>
          <a href="/login" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm sm:text-base">
            লগইন পেজে ফিরুন
          </a>
        </div>
      </div>
    );
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 sm:p-6">
        <div className="text-center">
          <p className="text-base sm:text-lg">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">এডমিন পেজ: দাম ও ডেলিভারি চার্জ আপডেট</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="py-2 px-4 bg-gray-600 rounded-md text-white font-bold hover:bg-gray-700 transition text-sm sm:text-base w-full sm:w-auto"
          >
            অর্ডার পেজে ফিরুন
          </button>
          <button
            onClick={async () => {
              try {
                await supabase.auth.signOut();
                navigate('/login');
                toast.success('সফলভাবে লগআউট করা হয়েছে!');
              } catch (err) {
                console.error('Logout error:', err);
                toast.error('লগআউট ব্যর্থ: ' + err.message);
              }
            }}
            className="py-2 px-4 bg-red-600 rounded-md text-white font-bold hover:bg-red-700 transition text-sm sm:text-base w-full sm:w-auto"
          >
            লগআউট
          </button>
        </div>
      </div>

      {packages.map((pkg) => (
        <div key={pkg.id} className="mb-4 p-4 border border-gray-700 rounded">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold">{pkg.name}</h3>
              <p className="text-sm sm:text-base">বর্তমান দাম: {pkg.price} টাকা</p>
              <p className="text-sm sm:text-base">বর্তমান ডেলিভারি চার্জ: {pkg.delivery_fee || 0} টাকা</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <input
                type="number"
                value={newPrices[pkg.id] || ''}
                onChange={(e) => setNewPrices(prev => ({ ...prev, [pkg.id]: e.target.value }))}
                placeholder="নতুন দাম"
                className="p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm sm:text-base w-full sm:w-32"
              />
              <input
                type="number"
                value={newDeliveryFees[pkg.id] || ''}
                onChange={(e) => setNewDeliveryFees(prev => ({ ...prev, [pkg.id]: e.target.value }))}
                placeholder="নতুন ডেলিভারি চার্জ"
                className="p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm sm:text-base w-full sm:w-32"
              />
              <button
                onClick={() => handlePriceUpdate(pkg.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
              >
                আপডেট
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={bonusOptions[pkg.id]?.firni || false}
                onChange={(e) => setBonusOptions(prev => ({
                  ...prev,
                  [pkg.id]: { ...prev[pkg.id], firni: e.target.checked }
                }))}
                className="mr-2"
              />
              বোনাস ফিরনি ডেজার্ট
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={bonusOptions[pkg.id]?.salad || false}
                onChange={(e) => setBonusOptions(prev => ({
                  ...prev,
                  [pkg.id]: { ...prev[pkg.id], salad: e.target.checked }
                }))}
                className="mr-2"
              />
              বোনাস সালাদ
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={bonusOptions[pkg.id]?.borhani || false}
                onChange={(e) => setBonusOptions(prev => ({
                  ...prev,
                  [pkg.id]: { ...prev[pkg.id], borhani: e.target.checked }
                }))}
                className="mr-2"
              />
              বোনাস বোরহানি
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPriceUpdate;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || profile.role !== 'admin') {
        navigate('/login');
        return;
      }

      setUser(user);
      fetchOrders();
    };

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
          setOrders([]);
        } else {
          setOrders(data);
        }
      } catch (error) {
        console.error('Error:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">অ্যাডমিন পেজ: সব অর্ডার</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/login');
          }}
          className="py-2 px-4 bg-red-600 rounded-md text-white font-bold hover:bg-red-700 transition"
        >
          লগআউট
        </button>
      </div>
      {loading ? (
        <p className="text-lg">লোড হচ্ছে...</p>
      ) : orders.length === 0 ? (
        <p className="text-lg">কোনো অর্ডার নেই।</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-3 text-left">অর্ডার আইডি</th>
                <th className="border border-gray-700 p-3 text-left">কাস্টমার নাম</th>
                <th className="border border-gray-700 p-3 text-left">প্যাকেজ</th>
                <th className="border border-gray-700 p-3 text-left">পরিমাণ</th>
                <th className="border border-gray-700 p-3 text-left">ফোন</th>
                <th className="border border-gray-700 p-3 text-left">ইমেইল</th>
                <th className="border border-gray-700 p-3 text-left">ঠিকানা</th>
                <th className="border border-gray-700 p-3 text-left">অতিরিক্ত তথ্য</th>
                <th className="border border-gray-700 p-3 text-left">ডেলিভারি তারিখ</th>
                <th className="border border-gray-700 p-3 text-left">অর্ডারের তারিখ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-900">
                  <td className="border border-gray-700 p-3">{order.id}</td>
                  <td className="border border-gray-700 p-3">{order.customer_name || 'N/A'}</td>
                  <td className="border border-gray-700 p-3">{order.item || 'N/A'}</td>
                  <td className="border border-gray-700 p-3">{order.quantity || 'N/A'}</td>
                  <td className="border border-gray-700 p-3">{order.phone || 'N/A'}</td>
                  <td className="border border-gray-700 p-3">{order.email || 'N/A'}</td>
                  <td className="border border-gray-700 p-3">{order.address || 'N/A'}</td>
                  <td className="border border-gray-700 p-3">{order.additional_info || 'N/A'}</td>
                  <td className="border border-gray-700 p-3">
                    {order.delivery_date
                      ? new Date(order.delivery_date).toLocaleDateString('bn-BD')
                      : 'N/A'}
                  </td>
                  <td className="border border-gray-700 p-3">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('bn-BD')
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast'; // react-hot-toast আমদানি করা

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('created_at_desc');
  const [searchQuery, setSearchQuery] = useState('');

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
          toast.error('অর্ডার লোড করতে ব্যর্থ হয়েছে!'); // টোস্ট মেসেজ যোগ করা
          setOrders([]);
          setFilteredOrders([]);
        } else {
          setOrders(data);
          setFilteredOrders(data);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('একটি অজানা ত্রুটি ঘটেছে!'); // টোস্ট মেসেজ যোগ করা
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  // ফিল্টার, সার্চ, এবং সর্টিং ফাংশন
  useEffect(() => {
    let updatedOrders = [...orders];

    // সার্চ
    if (searchQuery) {
      updatedOrders = updatedOrders.filter(order =>
        order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) || // id স্ট্রিং হিসেবে তুলনা করা
        order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // ফিল্টারিং
    if (orderStatusFilter !== 'All') {
      updatedOrders = updatedOrders.filter(order => order.order_status === orderStatusFilter);
    }
    if (deliveryStatusFilter !== 'All') {
      updatedOrders = updatedOrders.filter(order => order.delivery_status === deliveryStatusFilter);
    }
    if (paymentStatusFilter !== 'All') {
      updatedOrders = updatedOrders.filter(order => order.payment_status === paymentStatusFilter);
    }

    // সর্টিং
    if (sortBy === 'created_at_desc') {
      updatedOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'created_at_asc') {
      updatedOrders.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'delivery_date_asc') {
      updatedOrders.sort((a, b) => {
        if (!a.delivery_date) return 1;
        if (!b.delivery_date) return -1;
        return new Date(a.delivery_date) - new Date(b.delivery_date);
      });
    } else if (sortBy === 'delivery_date_desc') {
      updatedOrders.sort((a, b) => {
        if (!a.delivery_date) return 1;
        if (!b.delivery_date) return -1;
        return new Date(b.delivery_date) - new Date(a.delivery_date);
      });
    }

    setFilteredOrders(updatedOrders);
  }, [orders, orderStatusFilter, deliveryStatusFilter, paymentStatusFilter, sortBy, searchQuery]);

  const handleStatusChange = async (orderId, field, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ [field]: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error(`Error updating ${field}:`, error);
        toast.error(`${field} আপডেটে ত্রুটি: ${error.message}`); // টোস্ট মেসেজ
        return;
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, [field]: newStatus } : order
        )
      );
      toast.success(`${field} সফলভাবে আপডেট করা হয়েছে!`, {
        duration: 3000,
        icon: '🎉',
      }); // টোস্ট মেসেজ
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('অজানা ত্রুটি: ' + err.message); // টোস্ট মেসেজ
    }
  };

  // ডেলিভারি ডেট আপডেট ফাংশন
  const handleDeliveryDateChange = async (orderId, newDeliveryDate) => {
    try {
      if (!newDeliveryDate) {
        toast.error('ডেলিভারি তারিখ নির্বাচন করুন!'); // টোস্ট মেসেজ
        return;
      }

      const { error } = await supabase
        .from('orders')
        .update({ delivery_date: newDeliveryDate })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating delivery date:', error);
        toast.error('ডেলিভারি ডেট আপডেটে ত্রুটি: ' + error.message); // টোস্ট মেসেজ
        return;
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, delivery_date: newDeliveryDate } : order
        )
      );
      toast.success('ডেলিভারি ডেট সফলভাবে আপডেট করা হয়েছে!', {
        duration: 3000,
        icon: '🎉',
      }); // টোস্ট মেসেজ
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('অজানা ত্রুটি: ' + err.message); // টোস্ট মেসেজ
    }
  };

  const getStatusColor = (status, type) => {
    if (type === 'order_status') {
      return {
        'Ordered': 'bg-orange-500',
        'Confirmed': 'bg-blue-500',
        'Date Assigned': 'bg-purple-500',
        'Delivered': 'bg-green-500',
      }[status] || 'bg-gray-500';
    } else if (type === 'delivery_status') {
      return {
        'OnTheWay': 'bg-yellow-500',
        'Delivered': 'bg-green-500',
        'Returned': 'bg-red-500',
      }[status] || 'bg-gray-500';
    } else if (type === 'payment_status') {
      return {
        'Unpaid': 'bg-gray-500',
        'PartiallyPaid': 'bg-orange-500',
        'FullyPaid': 'bg-green-500',
      }[status] || 'bg-gray-500';
    }
  };

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

      {/* সার্চ বার */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="অর্ডার আইডি, কাস্টমার নাম, বা ফোন নম্বর দিয়ে সার্চ করুন"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 text-white"
        />
      </div>

      {/* ফিল্টার এবং সর্টিং UI */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm mb-1">অর্ডার স্ট্যাটাস ফিল্টার</label>
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-600"
          >
            <option value="All">সব</option>
            <option value="Ordered">Ordered</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Date Assigned">Date Assigned</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">ডেলিভারি স্ট্যাটাস ফিল্টার</label>
          <select
            value={deliveryStatusFilter}
            onChange={(e) => setDeliveryStatusFilter(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-600"
          >
            <option value="All">সব</option>
            <option value="OnTheWay">On The Way</option>
            <option value="Delivered">Delivered</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">পেমেন্ট স্ট্যাটাস ফিল্টার</label>
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-600"
          >
            <option value="All">সব</option>
            <option value="Unpaid">Unpaid</option>
            <option value="FullyPaid">Fully Paid</option>
            <option value="PartiallyPaid">Partially Paid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">সাজানো</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-600"
          >
            <option value="created_at_desc">নতুন থেকে পুরোনো (অর্ডারের তারিখ)</option>
            <option value="created_at_asc">পুরোনো থেকে নতুন (অর্ডারের তারিখ)</option>
            <option value="delivery_date_asc">পুরোনো থেকে নতুন (ডেলিভারি তারিখ)</option>
            <option value="delivery_date_desc">নতুন থেকে পুরোনো (ডেলিভারি তারিখ)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <svg className="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : filteredOrders.length === 0 ? (
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
                <th className="border border-gray-700 p-3 text-left">অর্ডার স্ট্যাটাস</th>
                <th className="border border-gray-700 p-3 text-left">ডেলিভারি স্ট্যাটাস</th>
                <th className="border border-gray-700 p-3 text-left">পেমেন্ট স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
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
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={order.delivery_date ? order.delivery_date.split('T')[0] : ''}
                        onChange={(e) => handleDeliveryDateChange(order.id, e.target.value)}
                        className="bg-gray-800 text-white border border-gray-700 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-red-600"
                        min={new Date().toISOString().split('T')[0]} // আজকের তারিখের আগে ডেট নির্বাচন করা যাবে না
                      />
                    </div>
                  </td>
                  <td className="border border-gray-700 p-3">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('bn-BD')
                      : 'N/A'}
                  </td>
                  <td className="border border-gray-700 p-3">
                    <div className="relative inline-block">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(order.order_status, 'order_status')}`}>
                        {order.order_status}
                      </span>
                      <select
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, 'order_status', e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      >
                        <option value="Ordered">Ordered</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Date Assigned">Date Assigned</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </td>
                  <td className="border border-gray-700 p-3">
                    <div className="relative inline-block">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(order.delivery_status, 'delivery_status')}`}>
                        {order.delivery_status}
                      </span>
                      <select
                        value={order.delivery_status}
                        onChange={(e) => handleStatusChange(order.id, 'delivery_status', e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      >
                        <option value="OnTheWay">On The Way</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Returned">Returned</option>
                      </select>
                    </div>
                  </td>
                  <td className="border border-gray-700 p-3">
                    <div className="relative inline-block">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(order.payment_status, 'payment_status')}`}>
                        {order.payment_status}
                      </span>
                      <select
                        value={order.payment_status}
                        onChange={(e) => handleStatusChange(order.id, 'payment_status', e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="FullyPaid">Fully Paid</option>
                        <option value="PartiallyPaid">Partially Paid</option>
                      </select>
                    </div>
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
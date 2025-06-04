import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('created_at_desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [packages, setPackages] = useState([]);
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
        fetchOrders();
        fetchPackages();
      } catch (err) {
        setError('অজানা ত্রুটি: ' + err.message);
        toast.error('অজানা ত্রুটি: ' + err.message);
        navigate('/login');
      }
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
          toast.error('অর্ডার লোড করতে ব্যর্থ: ' + error.message);
          setOrders([]);
          setFilteredOrders([]);
        } else {
          setOrders(data);
          setFilteredOrders(data);
        }
      } catch (err) {
        console.error('Error:', err);
        toast.error('অজানা ত্রুটি: ' + err.message);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
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
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchOrders();
          fetchPackages();
        }
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

  useEffect(() => {
    let updatedOrders = [...orders];

    if (searchQuery) {
      updatedOrders = updatedOrders.filter(order =>
        order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (orderStatusFilter !== 'All') {
      updatedOrders = updatedOrders.filter(order => order.order_status === orderStatusFilter);
    }
    if (deliveryStatusFilter !== 'All') {
      updatedOrders = updatedOrders.filter(order => order.delivery_status === deliveryStatusFilter);
    }
    if (paymentStatusFilter !== 'All') {
      updatedOrders = updatedOrders.filter(order => order.payment_status === paymentStatusFilter);
    }

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
    console.log(`Updating ${field} for order ${orderId} to ${newStatus}`);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ [field]: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error(`Error updating ${field}:`, error);
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} আপডেটে ত্রুটি: ${error.message}`);
        return;
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, [field]: newStatus } : order
        )
      );
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} সফলভাবে আপডেট করা হয়েছে!`, {
        duration: 3000,
        icon: '🎉',
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('অজানা ত্রুটি: ' + err.message);
    }
  };

  const handleDeliveryDateChange = async (orderId, newDeliveryDate) => {
    console.log(`Updating delivery date for order ${orderId} to ${newDeliveryDate}`);
    try {
      if (!newDeliveryDate) {
        toast.error('ডেলিভারি তারিখ নির্বাচন করুন!');
        return;
      }

      const { error } = await supabase
        .from('orders')
        .update({ delivery_date: newDeliveryDate })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating delivery date:', error);
        toast.error('ডেলিভারি ডেট আপডেটে ত্রুটি: ' + error.message);
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
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('অজানা ত্রুটি: ' + err.message);
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ত্রুটি</h1>
          <p className="text-lg mb-4">{error}</p>
          <a
            href="/login"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            লগইন পেজে ফিরুন
          </a>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="text-center">
          <p className="text-lg">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">এডমিন পেজ: সব অর্ডার</h1>
        <div>
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
            className="py-2 px-4 bg-red-600 rounded-md text-white font-bold hover:bg-red-700 transition mr-4"
          >
            লগআউট
          </button>
          <button
            onClick={() => navigate('/admin/price-update')}
            className="py-2 px-4 bg-blue-600 rounded-md text-white font-bold hover:bg-blue-700 transition"
          >
            দাম ও ডেলিভারি চার্জ আপডেট
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="অর্ডার আইডি, কাস্টমার নাম, বা ফোন নম্বর দিয়ে সার্চ করুন"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 text-white"
        />
      </div>

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
                        min={new Date().toISOString().split('T')[0]}
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
                        {order.order_status || 'N/A'}
                      </span>
                      <select
                        value={order.order_status || ''}
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
                        {order.delivery_status || 'N/A'}
                      </span>
                      <select
                        value={order.delivery_status || ''}
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
                        {order.payment_status || 'N/A'}
                      </span>
                      <select
                        value={order.payment_status || ''}
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
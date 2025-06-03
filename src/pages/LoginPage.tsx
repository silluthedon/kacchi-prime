import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('লগইন ব্যর্থ: ইমেইল বা পাসওয়ার্ড ভুল।');
        return;
      }

      const user = data.user;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        setError('এই পেজটি শুধুমাত্র এডমিনদের জন্য।');
        await supabase.auth.signOut();
        return;
      }

      navigate('/admin');
    } catch (err) {
      setError('একটি ত্রুটি হয়েছে। পরে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">এডমিন লগইন</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">ইমেইল</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 text-white"
              placeholder="example@mail.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 text-white"
              placeholder="আপনার পাসওয়ার্ড"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-600 rounded-md text-white font-bold hover:bg-red-700 transition transform hover:scale-105"
          >
            লগইন
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
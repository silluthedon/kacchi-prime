import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@kacchi.com'); // ডিফল্ট ইমেইল সেট
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      console.log('Checking session on /login...');
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Initial session:', sessionData);

        const { data: { user }, error: sessionError } = await supabase.auth.getUser();
        if (sessionError) {
          console.error('Session check error:', sessionError.message);
          return;
        }
        if (user) {
          console.log('User logged in:', user.id, user.email);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError.message);
            return;
          }

          console.log('Profile:', profile);
          if (profile?.role === 'admin') {
            console.log('Redirecting to /admin');
            navigate('/admin');
          } else {
            console.log('Redirecting to /');
            navigate('/');
          }
        } else {
          console.log('No user found in session');
        }
      } catch (err) {
        console.error('Unexpected error in checkSession:', err.message);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN') {
        checkSession();
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login attempt with email:', email);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Sign-in error:', signInError.message);
        setError('লগইন ব্যর্থ: ইমেইল বা পাসওয়ার্ড ভুল।');
        toast.error('লগইন ব্যর্থ: ইমেইল বা পাসওয়ার্ড ভুল।');
        return;
      }

      // সেশন সিঙ্কের জন্য অপেক্ষা
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 সেকেন্ড অপেক্ষা
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Session after login:', sessionData);

      if (!sessionData.session) {
        console.error('Session not found after login');
        setError('সেশন তৈরি হয়নি। আবার চেষ্টা করুন।');
        toast.error('সেশন তৈরি হয়নি। আবার চেষ্টা করুন।');
        return;
      }

      const user = data.user;
      console.log('User signed in:', user.id, user.email);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError.message);
        setError('প্রোফাইল ডেটা লোড করতে ব্যর্থ: ' + profileError.message);
        toast.error('প্রোফাইল ডেটা লোড করতে ব্যর্থ।');
        await supabase.auth.signOut();
        return;
      }

      console.log('Profile:', profile);
      if (profile?.role !== 'admin') {
        console.warn('Non-admin user:', profile.role);
        setError('এই পেজটি শুধুমাত্র এডমিনদের জন্য।');
        toast.error('এই পেজটি শুধুমাত্র এডমিনদের জন্য।');
        await supabase.auth.signOut();
        return;
      }

      toast.success('সফলভাবে লগইন করা হয়েছে!');
      console.log('Navigating to /admin');
      navigate('/admin');
    } catch (err) {
      console.error('Unexpected login error:', err.message);
      setError('একটি ত্রুটি হয়েছে। পরে আবার চেষ্টা করুন।');
      toast.error('একটি ত্রুটি হয়েছে। পরে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 bg-red-600 rounded-md text-white font-bold hover:bg-red-700 transition transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'লগইন হচ্ছে...' : 'লগইন'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
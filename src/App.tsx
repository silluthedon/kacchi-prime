import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import SpecialSection from './components/SpecialSection';
import RaritySection from './components/RaritySection';
import HowToGetSection from './components/HowToGetSection';
import OrderSection from './components/OrderSection';
import Footer from './components/Footer';
import { OrderProvider } from './context/OrderContext';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage'; // নতুন লগইন পেজ ইমপোর্ট

function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Hero />
        <SpecialSection />
        <RaritySection />
        <HowToGetSection />
        <OrderSection />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <OrderProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;
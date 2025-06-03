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
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <OrderProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={
                  <>
                    <Hero />
                    <SpecialSection />
                    <RaritySection />
                    <HowToGetSection />
                    <OrderSection />
                  </>
                } />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<div className="text-center py-10 text-white">৪০৪: পেজ পাওয়া যায়নি</div>} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
      </OrderProvider>
    </ThemeProvider>
  );
}

export default App;
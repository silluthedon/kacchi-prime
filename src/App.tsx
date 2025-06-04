import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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
import AdminPriceUpdate from './pages/AdminPriceUpdate';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

// Component to conditionally render Header based on route
const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderPaths = ['/admin', '/admin/price-update', '/login'];

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <OrderProvider>
        <Router>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <SpecialSection />
                    <RaritySection />
                    <HowToGetSection />
                    <OrderSection />
                  </>
                }
              />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/price-update" element={<AdminPriceUpdate />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<div className="text-center py-10 text-white">৪০৪: পেজ পাওয়া যায়নি</div>} />
            </Routes>
          </Layout>
        </Router>
      </OrderProvider>
    </ThemeProvider>
  );
}

export default App;
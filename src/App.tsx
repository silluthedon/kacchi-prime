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
import { ThemeProvider } from './context/ThemeContext'; // Verify path

function App() {
  return (
    <ThemeProvider>
      <OrderProvider>
        <Router>
          <div className="min-h-screen">
            <Header />
            <main>
              <Hero />
              <SpecialSection />
              <RaritySection />
              <OrderSection />
            </main>
            <Footer />
          </div>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Root path "/" will render the above components */}
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </OrderProvider>
    </ThemeProvider>
  );
}

export default App;
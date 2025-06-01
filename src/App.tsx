import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SpecialSection from './components/SpecialSection';
import RaritySection from './components/RaritySection';
import HowToGetSection from './components/HowToGetSection';
import OrderSection from './components/OrderSection';
import Footer from './components/Footer';
import { OrderProvider } from './context/OrderContext';

function App() {
  return (
    <OrderProvider>
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
    </OrderProvider>
  );
}

export default App;
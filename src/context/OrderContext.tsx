import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedPackage {
  id: string;
  quantity: number;
  price: number;
}

interface OrderContextProps {
  selectedPackage: SelectedPackage | null;
  setSelectedPackage: (pkg: SelectedPackage | null) => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null); // Default to null

  return (
    <OrderContext.Provider value={{ selectedPackage, setSelectedPackage }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = (): OrderContextProps => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OrderContextProps {
  selectedPackage: string;
  setSelectedPackage: (packageId: string) => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState<string>("20person"); // Default to most popular package

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
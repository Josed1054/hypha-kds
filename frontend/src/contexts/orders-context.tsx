import { createContext, useContext, type PropsWithChildren } from 'react';
import { useOrdersRealtime, type UseOrdersRealtimeResult } from '@/hooks/useOrdersRealtime';

const OrdersContext = createContext<UseOrdersRealtimeResult | undefined>(undefined);

export const OrdersProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const ordersState = useOrdersRealtime();

  return <OrdersContext.Provider value={ordersState}>{children}</OrdersContext.Provider>;
};

export const useOrdersContext = (): UseOrdersRealtimeResult => {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error('useOrdersContext must be used within OrdersProvider');
  }

  return context;
};

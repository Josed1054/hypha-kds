import { NewOrderForm } from '@/components/NewOrderForm';
import { useOrdersContext } from '@/contexts/orders-context';
import type { CreateOrderMutation } from '@/generated/graphql';

export const NewOrderView = (): JSX.Element => {
  const { upsertOrderInCache } = useOrdersContext();

  const handleOrderCreated = (order: CreateOrderMutation['createOrder']): void => {
    upsertOrderInCache(order);
  };

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">New Order Entry</h1>
        <p className="text-sm text-muted-foreground">Create orders to test the API and real-time board updates.</p>
      </header>

      <NewOrderForm onOrderCreated={handleOrderCreated} />
    </section>
  );
};

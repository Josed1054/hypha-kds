import { RotateCcw } from 'lucide-react';
import { OrderBoard } from '@/components/OrderBoard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useOrdersContext } from '@/contexts/orders-context';

export const DashboardView = (): JSX.Element => {
  const { orders, loading, error, refetch } = useOrdersContext();

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Chef Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Update order statuses while tracking the full kitchen flow.
        </p>
      </header>

      {loading && orders.length === 0 ? (
        <Alert>
          <AlertTitle>Loading orders</AlertTitle>
          <AlertDescription>Fetching the latest order state from the API.</AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <Alert variant="destructive" className="flex items-center justify-between">
          <div>
            <AlertTitle>Could not load orders</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-4">
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Retry
          </Button>
        </Alert>
      ) : null}

      <OrderBoard orders={orders} mode="interactive" />
    </section>
  );
};

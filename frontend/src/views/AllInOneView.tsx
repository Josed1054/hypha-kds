import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";
import type { CreateOrderMutation } from "@/generated/graphql";
import { NewOrderForm } from "@/components/NewOrderForm";
import { OrderBoard } from "@/components/OrderBoard";
import { RotateCcw } from "lucide-react";
import { useOrdersContext } from "@/contexts/orders-context";

export const AllInOneView = (): JSX.Element => {
  const { orders, loading, error, refetch, upsertOrderInCache } =
    useOrdersContext();

  const handleOrderCreated = (
    order: CreateOrderMutation["createOrder"],
  ): void => {
    upsertOrderInCache(order);
  };

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          All-in-One Operator View
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and manage orders from a single screen.
        </p>
      </header>

      {loading && orders.length === 0 ? (
        <Alert>
          <AlertTitle>Loading orders</AlertTitle>
          <AlertDescription>
            Fetching the latest order state from the API.
          </AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <Alert
          variant="destructive"
          className="flex items-center justify-between"
        >
          <div>
            <AlertTitle>Could not load orders</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="ml-4"
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Retry
          </Button>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(280px,360px)_1fr]">
        <NewOrderForm onOrderCreated={handleOrderCreated} />
        <OrderBoard orders={orders} mode="interactive" />
      </div>
    </section>
  );
};

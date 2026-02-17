import { OrderCard } from '@/components/OrderCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { GetOrdersQuery, OrderStatus } from '@/generated/graphql';

type Order = GetOrdersQuery['getOrders'][number];

interface OrderColumnProps {
  title: string;
  orders: Order[];
  actionLabel?: string;
  nextStatus?: OrderStatus;
}

export const OrderColumn = ({
  title,
  orders,
  actionLabel,
  nextStatus
}: OrderColumnProps): JSX.Element => {
  return (
    <Card className="border-slate-300/70 bg-white/95">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <Badge variant="outline">{orders.length}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders</p>
        ) : (
          <ScrollArea className="h-[28rem] pr-2">
            <div className="space-y-3">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  actionLabel={actionLabel}
                  nextStatus={nextStatus}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

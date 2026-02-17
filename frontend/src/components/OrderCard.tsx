import { useState } from 'react';
import { Clock3 } from 'lucide-react';
import { useMutation } from '@apollo/client';
import {
  UpdateOrderStatusDocument,
  type GetOrdersQuery,
  type OrderStatus
} from '@/generated/graphql';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Order = GetOrdersQuery['getOrders'][number];

interface OrderCardProps {
  order: Order;
  actionLabel?: string;
  nextStatus?: OrderStatus;
}

const statusBadgeVariant: Record<OrderStatus, 'secondary' | 'default' | 'outline'> = {
  PENDING: 'secondary',
  IN_PROGRESS: 'default',
  COMPLETED: 'outline'
};

const statusLabel: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
};

export const OrderCard = ({ order, actionLabel, nextStatus }: OrderCardProps): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [updateStatus, { loading }] = useMutation(UpdateOrderStatusDocument, {
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });

  const handleStatusUpdate = async (): Promise<void> => {
    if (!nextStatus) {
      return;
    }

    setErrorMessage(null);

    await updateStatus({
      variables: {
        input: {
          id: order.id,
          status: nextStatus
        }
      },
      optimisticResponse: {
        updateOrderStatus: {
          __typename: 'Order',
          id: order.id,
          items: order.items,
          status: nextStatus,
          createdAt: order.createdAt
        }
      }
    });
  };

  return (
    <Card className="border-slate-300/70 bg-white/95">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-semibold">Order #{order.id.slice(-6)}</CardTitle>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock3 className="h-3 w-3" />
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <Badge variant={statusBadgeVariant[order.status]}>{statusLabel[order.status]}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <ul className="space-y-1.5">
          {order.items.map((item, index) => (
            <li key={`${order.id}-${index}`} className="text-sm text-foreground/95">
              <span className="mr-2 text-primary">•</span>
              {item}
            </li>
          ))}
        </ul>

        {actionLabel && nextStatus ? (
          <Button
            type="button"
            onClick={handleStatusUpdate}
            disabled={loading}
            className={cn('w-full', loading && 'cursor-wait')}
          >
            {loading ? 'Updating...' : actionLabel}
          </Button>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive" className="py-2">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
};

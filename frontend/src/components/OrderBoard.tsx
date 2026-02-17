import { OrderColumn } from '@/components/OrderColumn';
import type { GetOrdersQuery, OrderStatus } from '@/generated/graphql';

type Order = GetOrdersQuery['getOrders'][number];

interface OrderBoardProps {
  orders: Order[];
  mode: 'readonly' | 'interactive';
}

const sortByCreatedAtDesc = (orders: Order[]): Order[] => {
  return [...orders].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
};

const getOrdersByStatus = (orders: Order[], status: OrderStatus): Order[] => {
  return sortByCreatedAtDesc(orders.filter((order) => order.status === status));
};

export const OrderBoard = ({ orders, mode }: OrderBoardProps): JSX.Element => {
  const pendingOrders = getOrdersByStatus(orders, 'PENDING');
  const inProgressOrders = getOrdersByStatus(orders, 'IN_PROGRESS');
  const completedOrders = getOrdersByStatus(orders, 'COMPLETED');
  const isInteractive = mode === 'interactive';

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <OrderColumn
        title="Pending"
        orders={pendingOrders}
        actionLabel={isInteractive ? 'Start Cooking' : undefined}
        nextStatus={isInteractive ? 'IN_PROGRESS' : undefined}
      />
      <OrderColumn
        title="In Progress"
        orders={inProgressOrders}
        actionLabel={isInteractive ? 'Mark Ready' : undefined}
        nextStatus={isInteractive ? 'COMPLETED' : undefined}
      />
      <OrderColumn title="Completed" orders={completedOrders} />
    </div>
  );
};

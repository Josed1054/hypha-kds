export const ORDER_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderDTO {
  id: string;
  items: string[];
  status: OrderStatus;
  createdAt: Date;
}

import { OrderModel, type OrderDocument } from '../models/Order';
import mongoose from 'mongoose';
import type { OrderDTO, OrderStatus } from '../types/order';
import { InputValidationError, NotFoundError } from '../utils/errors';
import { assertValidStatusTransition } from '../utils/statusTransition';

const toOrderDTO = (order: OrderDocument): OrderDTO => ({
  id: order.id,
  items: order.items,
  status: order.status,
  createdAt: order.createdAt
});

const normalizeItems = (items: string[]): string[] => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new InputValidationError('items must contain at least one entry');
  }

  const normalizedItems = items
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (normalizedItems.length === 0) {
    throw new InputValidationError('items must contain at least one non-empty entry');
  }

  return normalizedItems;
};

const getOrders = async (): Promise<OrderDTO[]> => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  return orders.map(toOrderDTO);
};

const createOrder = async (items: string[]): Promise<OrderDTO> => {
  const normalizedItems = normalizeItems(items);
  const order = await OrderModel.create({
    items: normalizedItems,
    status: 'PENDING'
  });

  return toOrderDTO(order);
};

const updateOrderStatus = async (id: string, status: OrderStatus): Promise<OrderDTO> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new InputValidationError('id must be a valid order identifier');
  }

  const order = await OrderModel.findById(id);

  if (!order) {
    throw new NotFoundError(`Order with id ${id} was not found`);
  }

  assertValidStatusTransition(order.status, status);

  if (order.status !== status) {
    order.status = status;
    await order.save();
  }

  return toOrderDTO(order);
};

export const OrderService = {
  getOrders,
  createOrder,
  updateOrderStatus
};

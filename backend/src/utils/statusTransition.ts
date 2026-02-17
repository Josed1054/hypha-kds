import type { OrderStatus } from '../types/order';
import { InvalidStatusTransitionError } from './errors';

const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, Set<OrderStatus>> = {
  PENDING: new Set<OrderStatus>(['PENDING', 'IN_PROGRESS']),
  IN_PROGRESS: new Set<OrderStatus>(['IN_PROGRESS', 'COMPLETED']),
  COMPLETED: new Set<OrderStatus>(['COMPLETED'])
};

export const canTransitionStatus = (from: OrderStatus, to: OrderStatus): boolean => {
  return ALLOWED_STATUS_TRANSITIONS[from].has(to);
};

export const assertValidStatusTransition = (from: OrderStatus, to: OrderStatus): void => {
  if (!canTransitionStatus(from, to)) {
    throw new InvalidStatusTransitionError(from, to);
  }
};

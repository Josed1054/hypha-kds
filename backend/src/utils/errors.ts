import type { OrderStatus } from '../types/order';

export class InputValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InputValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class InvalidStatusTransitionError extends Error {
  readonly from: OrderStatus;
  readonly to: OrderStatus;

  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Invalid status transition from ${from} to ${to}`);
    this.name = 'InvalidStatusTransitionError';
    this.from = from;
    this.to = to;
  }
}

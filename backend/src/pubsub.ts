import { PubSub, type PubSubEngine } from 'graphql-subscriptions';
import type { OrderDTO } from './types/order';

export const ORDER_UPDATED_TOPIC = 'ORDER_UPDATED';

export type OrderUpdatedEvent = {
  orderUpdated: OrderDTO;
};

type PubSubEvents = {
  ORDER_UPDATED: [OrderUpdatedEvent];
};

export type AppPubSub = PubSubEngine;

export const pubsub: AppPubSub = new PubSub();

import type { SubscriptionResolvers } from '../../generated/graphql';
import { ORDER_UPDATED_TOPIC } from '../../pubsub';
import type { OrderDTO } from '../../types/order';

export const subscriptionResolvers: SubscriptionResolvers = {
  orderUpdated: {
    subscribe: (_parent, _args, context) => {
      return context.pubsub.asyncIterator([ORDER_UPDATED_TOPIC]) as unknown as AsyncIterable<{
        orderUpdated: OrderDTO;
      }>;
    }
  }
};

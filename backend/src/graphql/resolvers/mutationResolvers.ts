import type { MutationResolvers } from '../../generated/graphql';
import { ORDER_UPDATED_TOPIC } from '../../pubsub';
import { OrderService } from '../../services/orderService';
import { mapToGraphQLError } from './errorMapper';

export const mutationResolvers: MutationResolvers = {
  createOrder: async (_parent, { input }, context) => {
    try {
      const order = await OrderService.createOrder(input.items);
      await context.pubsub.publish(ORDER_UPDATED_TOPIC, {
        orderUpdated: order
      });
      return order;
    } catch (error) {
      return mapToGraphQLError(error);
    }
  },

  updateOrderStatus: async (_parent, { input }, context) => {
    try {
      const updatedOrder = await OrderService.updateOrderStatus(input.id, input.status);
      await context.pubsub.publish(ORDER_UPDATED_TOPIC, {
        orderUpdated: updatedOrder
      });
      return updatedOrder;
    } catch (error) {
      return mapToGraphQLError(error);
    }
  }
};

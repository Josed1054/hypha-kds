import type { QueryResolvers } from '../../generated/graphql';
import { OrderService } from '../../services/orderService';
import { mapToGraphQLError } from './errorMapper';

export const queryResolvers: QueryResolvers = {
  getOrders: async () => {
    try {
      return await OrderService.getOrders();
    } catch (error) {
      return mapToGraphQLError(error);
    }
  }
};

import { useCallback } from 'react';
import { useQuery, useSubscription, type ApolloError } from '@apollo/client';
import {
  GetOrdersDocument,
  OrderUpdatedDocument,
  type GetOrdersQuery,
  type OrderStatus
} from '@/generated/graphql';

type CachedOrder = GetOrdersQuery['getOrders'][number];

type UpsertableOrder = {
  __typename?: 'Order';
  id: string;
  items: string[];
  status: OrderStatus;
  createdAt: string;
};

const normalizeOrder = (order: UpsertableOrder): CachedOrder => {
  return {
    __typename: order.__typename,
    id: order.id,
    items: order.items,
    status: order.status,
    createdAt: order.createdAt
  };
};

const upsertOrderList = (orders: CachedOrder[], incomingOrder: CachedOrder): CachedOrder[] => {
  const existingIndex = orders.findIndex((order) => order.id === incomingOrder.id);

  if (existingIndex === -1) {
    return [incomingOrder, ...orders];
  }

  const nextOrders = [...orders];
  nextOrders[existingIndex] = incomingOrder;
  return nextOrders;
};

export interface UseOrdersRealtimeResult {
  orders: CachedOrder[];
  loading: boolean;
  error?: ApolloError;
  refetch: () => Promise<void>;
  upsertOrderInCache: (incomingOrder: UpsertableOrder) => void;
}

export const useOrdersRealtime = (): UseOrdersRealtimeResult => {
  const { data, loading, error, refetch, client } = useQuery(GetOrdersDocument, {
    fetchPolicy: 'cache-and-network'
  });

  const upsertOrderInCache = useCallback(
    (incomingOrder: UpsertableOrder): void => {
      const normalizedOrder = normalizeOrder(incomingOrder);

      client.cache.updateQuery(
        {
          query: GetOrdersDocument
        },
        (currentData) => {
          if (!currentData) {
            return {
              getOrders: [normalizedOrder]
            };
          }

          return {
            getOrders: upsertOrderList(currentData.getOrders, normalizedOrder)
          };
        }
      );
    },
    [client]
  );

  useSubscription(OrderUpdatedDocument, {
    onData: ({ data: subscriptionData }) => {
      const incomingOrder = subscriptionData.data?.orderUpdated;

      if (!incomingOrder) {
        return;
      }

      upsertOrderInCache(incomingOrder);
    }
  });

  return {
    orders: data?.getOrders ?? [],
    loading,
    error: error ?? undefined,
    refetch: async () => {
      await refetch();
    },
    upsertOrderInCache
  };
};

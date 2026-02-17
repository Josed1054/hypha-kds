import { DateTimeResolver } from 'graphql-scalars';
import type { Resolvers } from '../../generated/graphql';
import { mutationResolvers } from './mutationResolvers';
import { queryResolvers } from './queryResolvers';
import { subscriptionResolvers } from './subscriptionResolvers';

export const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Subscription: subscriptionResolvers
};

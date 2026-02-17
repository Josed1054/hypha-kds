import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
  type NormalizedCacheObject
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const httpUrl = import.meta.env.VITE_GRAPHQL_HTTP_URL ?? 'http://localhost:4000/graphql';
const wsUrl = import.meta.env.VITE_GRAPHQL_WS_URL ?? 'ws://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: httpUrl
});

const wsClient = createClient({
  url: wsUrl
});

const wsLink = new GraphQLWsLink(
  wsClient as unknown as ConstructorParameters<typeof GraphQLWsLink>[0]
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

export const apolloClient: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Order: {
        keyFields: ['id']
      }
    }
  })
});

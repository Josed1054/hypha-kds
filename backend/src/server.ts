import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import mongoose from 'mongoose';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { resolvers } from './graphql/resolvers';
import { pubsub } from './pubsub';
import type { GraphQLContext } from './types/context';

dotenv.config();

const port = Number(process.env.PORT ?? 4000);
const mongoDbUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/hypha-kds';
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

const typeDefs = readFileSync(join(__dirname, 'graphql/schema.graphql'), 'utf8');

const startServer = async (): Promise<void> => {
  await mongoose.connect(mongoDbUri);

  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  });

  const wsCleanup = useServer(
    {
      schema,
      context: async (): Promise<GraphQLContext> => ({
        pubsub
      })
    },
    wsServer
  );

  const apolloServer = new ApolloServer<GraphQLContext>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsCleanup.dispose();
            }
          };
        }
      }
    ]
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({ origin: corsOrigin }),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async (): Promise<GraphQLContext> => ({
        pubsub
      })
    })
  );

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  await new Promise<void>((resolve) => {
    httpServer.listen({ port }, resolve);
  });

  console.log(`HTTP GraphQL endpoint ready at http://localhost:${port}/graphql`);
  console.log(`WebSocket subscriptions ready at ws://localhost:${port}/graphql`);
};

startServer().catch((error) => {
  console.error('Server startup failed', error);
  process.exit(1);
});

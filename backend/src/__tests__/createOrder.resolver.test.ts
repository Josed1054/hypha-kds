import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { resolvers } from '../graphql/resolvers';
import { OrderModel } from '../models/Order';
import { pubsub } from '../pubsub';
import type { GraphQLContext } from '../types/context';

const typeDefs = readFileSync(join(__dirname, '..', 'graphql', 'schema.graphql'), 'utf8');

type CreateOrderFullResult = {
  createOrder: {
    id: string;
    items: string[];
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  };
};

type CreateOrderStatusResult = {
  createOrder: {
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  };
};

describe('createOrder resolver', () => {
  let mongoServer: MongoMemoryServer;
  let server: ApolloServer<GraphQLContext>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        ip: '127.0.0.1'
      }
    });
    await mongoose.connect(mongoServer.getUri());

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    });

    server = new ApolloServer<GraphQLContext>({ schema });
    await server.start();
  });

  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await OrderModel.deleteMany({});
    }
  });

  afterAll(async () => {
    if (server) {
      await server.stop();
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it('creates an order with valid items', async () => {
    const result = await server.executeOperation<CreateOrderFullResult>(
      {
        query: `
          mutation CreateOrder($input: CreateOrderInput!) {
            createOrder(input: $input) {
              id
              items
              status
            }
          }
        `,
        variables: {
          input: {
            items: ['Burger', 'Fries']
          }
        }
      },
      {
        contextValue: { pubsub }
      }
    );

    expect(result.body.kind).toBe('single');

    if (result.body.kind !== 'single') {
      throw new Error('Expected single result body');
    }

    expect(result.body.singleResult.errors).toBeUndefined();
    const data = result.body.singleResult.data;
    expect(data).toBeDefined();
    if (!data) {
      throw new Error('Expected response data');
    }
    expect(data.createOrder.items).toEqual(['Burger', 'Fries']);
    expect(data.createOrder.status).toBe('PENDING');
    expect(data.createOrder.id).toBeDefined();
  });

  it('rejects empty items arrays', async () => {
    const result = await server.executeOperation(
      {
        query: `
          mutation CreateOrder($input: CreateOrderInput!) {
            createOrder(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: {
            items: []
          }
        }
      },
      {
        contextValue: { pubsub }
      }
    );

    expect(result.body.kind).toBe('single');

    if (result.body.kind !== 'single') {
      throw new Error('Expected single result body');
    }

    expect(result.body.singleResult.data).toBeNull();
    expect(result.body.singleResult.errors?.[0].extensions?.code).toBe('BAD_USER_INPUT');
  });

  it('rejects whitespace-only item values', async () => {
    const result = await server.executeOperation(
      {
        query: `
          mutation CreateOrder($input: CreateOrderInput!) {
            createOrder(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: {
            items: ['   ', '\t']
          }
        }
      },
      {
        contextValue: { pubsub }
      }
    );

    expect(result.body.kind).toBe('single');

    if (result.body.kind !== 'single') {
      throw new Error('Expected single result body');
    }

    expect(result.body.singleResult.data).toBeNull();
    expect(result.body.singleResult.errors?.[0].extensions?.code).toBe('BAD_USER_INPUT');
  });

  it('sets status to PENDING by default', async () => {
    const result = await server.executeOperation<CreateOrderStatusResult>(
      {
        query: `
          mutation CreateOrder($input: CreateOrderInput!) {
            createOrder(input: $input) {
              status
            }
          }
        `,
        variables: {
          input: {
            items: ['Pizza']
          }
        }
      },
      {
        contextValue: { pubsub }
      }
    );

    expect(result.body.kind).toBe('single');

    if (result.body.kind !== 'single') {
      throw new Error('Expected single result body');
    }

    expect(result.body.singleResult.errors).toBeUndefined();
    const data = result.body.singleResult.data;
    expect(data).toBeDefined();
    if (!data) {
      throw new Error('Expected response data');
    }
    expect(data.createOrder.status).toBe('PENDING');
  });
});

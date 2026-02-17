import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './backend/src/graphql/schema.graphql',
  generates: {
    './backend/src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../types/context#GraphQLContext',
        enumsAsTypes: true,
        scalars: {
          DateTime: 'Date'
        },
        mappers: {
          Order: '../types/order#OrderDTO'
        }
      }
    },
    './frontend/src/generated/graphql.ts': {
      documents: ['./frontend/src/graphql/**/*.graphql'],
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        enumsAsTypes: true,
        scalars: {
          DateTime: 'string'
        }
      }
    }
  }
};

export default config;

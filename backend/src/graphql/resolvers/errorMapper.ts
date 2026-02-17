import { GraphQLError } from 'graphql';
import {
  InputValidationError,
  InvalidStatusTransitionError,
  NotFoundError
} from '../../utils/errors';

export const mapToGraphQLError = (error: unknown): never => {
  if (error instanceof InputValidationError || error instanceof InvalidStatusTransitionError) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: 'BAD_USER_INPUT'
      }
    });
  }

  if (error instanceof NotFoundError) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: 'NOT_FOUND'
      }
    });
  }

  console.error('Unhandled resolver error:', error);
  throw new GraphQLError('An unexpected error occurred while processing the request', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR'
    }
  });
};

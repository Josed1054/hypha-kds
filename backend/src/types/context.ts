import type { AppPubSub } from '../pubsub';

export interface GraphQLContext {
  pubsub: AppPubSub;
}

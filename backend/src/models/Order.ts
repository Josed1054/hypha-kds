import { model, Schema, type HydratedDocument } from 'mongoose';
import { ORDER_STATUSES, type OrderStatus } from '../types/order';

interface OrderRecord {
  items: string[];
  status: OrderStatus;
  createdAt: Date;
}

const stripMongoId = (
  _doc: unknown,
  ret: Record<string, unknown> & { _id?: unknown }
): Record<string, unknown> => {
  const { _id, ...rest } = ret;
  return rest;
};

const orderSchema = new Schema<OrderRecord>(
  {
    items: {
      type: [String],
      required: true
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'PENDING',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: stripMongoId
    },
    toObject: {
      virtuals: true,
      transform: stripMongoId
    }
  }
);

orderSchema.virtual('id').get(function idGetter(this: HydratedDocument<OrderRecord>) {
  return this._id.toHexString();
});

export type OrderDocument = HydratedDocument<OrderRecord>;
export const OrderModel = model<OrderRecord>('Order', orderSchema);

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { OrderModel } from '../models/Order';
import { OrderService } from '../services/orderService';

describe('OrderService status transitions', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        ip: '127.0.0.1'
      }
    });
    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await OrderModel.deleteMany({});
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it('rejects direct transition from PENDING to COMPLETED', async () => {
    const order = await OrderService.createOrder(['Burger']);

    await expect(OrderService.updateOrderStatus(order.id, 'COMPLETED')).rejects.toThrow(
      'Invalid status transition from PENDING to COMPLETED'
    );
  });

  it('supports valid transition chain PENDING -> IN_PROGRESS -> COMPLETED', async () => {
    const order = await OrderService.createOrder(['Salad']);

    const inProgress = await OrderService.updateOrderStatus(order.id, 'IN_PROGRESS');
    expect(inProgress.status).toBe('IN_PROGRESS');

    const completed = await OrderService.updateOrderStatus(order.id, 'COMPLETED');
    expect(completed.status).toBe('COMPLETED');
  });
});

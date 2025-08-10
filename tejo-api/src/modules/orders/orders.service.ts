import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

type CartItem = { productId: string; variantId?: string; qty: number };

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createFromCart(userId: string | null, items: CartItem[], currency = 'EUR') {
    // compute totals and check stock
    const productIds = Array.from(new Set(items.map((i) => i.productId)));
    const products = await this.prisma.product.findMany({ where: { id: { in: productIds } } });
    let itemsTotal = 0;
    const orderItems = items.map((i) => {
      const p = products.find((pp) => pp.id === i.productId)!;
      const price = Number(p.price);
      itemsTotal += price * i.qty;
      return { productId: i.productId, variantId: i.variantId ?? null, name: p.name, sku: null, price, quantity: i.qty, image: p.images?.[0] ?? null, attributes: {} } as any;
    });
    const shippingTotal = 0;
    const discountTotal = 0;
    const taxTotal = 0;
    const total = itemsTotal + shippingTotal + taxTotal - discountTotal;

    const orderData: any = {
      status: 'PENDING',
      total, currency,
      paymentProvider: 'stripe',
      shippingAddress: {},
      billingAddress: {},
      itemsTotal: itemsTotal as any, shippingTotal: shippingTotal as any, discountTotal: discountTotal as any, taxTotal: taxTotal as any,
      items: { create: orderItems },
    };
    if (userId) orderData.userId = userId;
    const order = await this.prisma.order.create({ data: orderData, include: { items: true } });
    return order;
  }

  async markPaid(orderId: string, paymentId: string) {
    const order = await this.prisma.order.update({ where: { id: orderId }, data: { status: 'PAID' as any, paymentId } });
    // Inventory OUT movements
    const items = await this.prisma.orderItem.findMany({ where: { orderId } });
    for (const it of items) {
      await this.prisma.inventoryMovement.create({ data: { productId: it.productId, variantId: it.variantId ?? undefined, type: 'OUT', qty: it.quantity as any, refType: 'ORDER', refId: orderId } });
    }
    // Loyalty increment
    if (order.userId) {
      const user = await this.prisma.user.findUnique({ where: { id: order.userId } });
      const spend = Number(user?.lifetimeSpend || 0) + Number(order.total);
      await this.prisma.user.update({ where: { id: order.userId }, data: { lifetimeSpend: spend as any } });
    }
    return order;
  }

  async reserve(orderId: string) {
    const items = await this.prisma.orderItem.findMany({ where: { orderId } });
    for (const it of items) {
      await this.prisma.inventoryMovement.create({ data: { productId: it.productId, variantId: it.variantId ?? undefined, type: 'RESERVE', qty: it.quantity as any, refType: 'ORDER', refId: orderId } });
    }
  }

  async release(orderId: string) {
    const items = await this.prisma.orderItem.findMany({ where: { orderId } });
    for (const it of items) {
      await this.prisma.inventoryMovement.create({ data: { productId: it.productId, variantId: it.variantId ?? undefined, type: 'RELEASE', qty: it.quantity as any, refType: 'ORDER', refId: orderId } });
    }
  }
}



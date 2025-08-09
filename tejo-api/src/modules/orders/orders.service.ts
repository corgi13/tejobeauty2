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
      return { productId: i.productId, variantId: i.variantId ?? null, name: p.name, sku: null, price, qty: i.qty, image: p.images?.[0] ?? null, attributes: {} };
    });
    const shippingTotal = 0;
    const discountTotal = 0;
    const taxTotal = 0;
    const total = itemsTotal + shippingTotal + taxTotal - discountTotal;

    const order = await this.prisma.order.create({
      data: {
        userId: userId ?? undefined,
        status: 'pending',
        total, currency,
        paymentProvider: 'stripe',
        shippingAddress: {},
        billingAddress: {},
        itemsTotal, shippingTotal, discountTotal, taxTotal,
        items: { create: orderItems },
      },
      include: { items: true },
    });
    return order;
  }

  async markPaid(orderId: string, paymentId: string) {
    const order = await this.prisma.order.update({ where: { id: orderId }, data: { status: 'paid', paymentId } });
    // Inventory OUT movements
    const items = await this.prisma.orderItem.findMany({ where: { orderId } });
    for (const it of items) {
      await this.prisma.inventoryMovement.create({ data: { productId: it.productId, variantId: it.variantId ?? undefined, type: 'OUT', qty: it.qty, refType: 'ORDER', refId: orderId } });
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
      await this.prisma.inventoryMovement.create({ data: { productId: it.productId, variantId: it.variantId ?? undefined, type: 'RESERVE', qty: it.qty, refType: 'ORDER', refId: orderId } });
    }
  }

  async release(orderId: string) {
    const items = await this.prisma.orderItem.findMany({ where: { orderId } });
    for (const it of items) {
      await this.prisma.inventoryMovement.create({ data: { productId: it.productId, variantId: it.variantId ?? undefined, type: 'RELEASE', qty: it.qty, refType: 'ORDER', refId: orderId } });
    }
  }
}



import { Body, Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import Stripe from 'stripe';
import { Response, Request } from 'express';
import { PrismaService } from '../../prisma.service';
import { raw } from 'body-parser';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' } as any);

@Controller('payments')
export class PaymentsController {
  constructor(private orders: OrdersService, private prisma: PrismaService) {}

  @Post('checkout')
  async checkout(@Req() req: any, @Body() body: { items: Array<{ productId: string; variantId?: string; qty: number }>; currency?: string }) {
    const order = await this.orders.createFromCart(req.user?.id ?? null, body.items, body.currency ?? 'EUR');
    await this.orders.reserve(order.id);
    const provider = (process.env.PAYMENT_PROVIDER || 'stripe').toLowerCase();
    if (provider === 'stripe') {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: order.items.map((i: any) => ({ price_data: { currency: order.currency.toLowerCase(), product_data: { name: i.name }, unit_amount: Math.round(Number(i.price) * 100) }, quantity: i.quantity })),
        success_url: (process.env.FRONTEND_ORIGIN || 'http://localhost:3000') + '/order/success',
        cancel_url: (process.env.FRONTEND_ORIGIN || 'http://localhost:3000') + '/cart',
        metadata: { orderId: order.id },
      });
      await this.prisma.order.update({ where: { id: order.id }, data: { status: 'PENDING', paymentProvider: 'stripe', paymentId: session.id } });
      return { url: session.url };
    } else if (provider === 'mollie') {
      // Minimal stub; integrate Mollie Orders API later
      await this.prisma.order.update({ where: { id: order.id }, data: { status: 'PENDING', paymentProvider: 'mollie', paymentId: 'mollie_stub' } });
      return { url: (process.env.FRONTEND_ORIGIN || 'http://localhost:3000') + '/order/success' };
    }
    return { url: (process.env.FRONTEND_ORIGIN || 'http://localhost:3000') + '/order/success' };
  }

  // Stripe webhook: configure raw body in main.ts
  @Post('webhook')
  async webhook(@Req() req: Request, @Res() res: Response, @Headers('stripe-signature') sig: string) {
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent((req as any).rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Idempotency by event id
    const exists = await this.prisma.webhookEvent.findUnique({ where: { eventId: event.id } });
    if (exists) return res.json({ received: true, duplicate: true });
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = (session.metadata as any)?.orderId as string;
      if (orderId) await this.orders.markPaid(orderId, session.id);
    }
    if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed' || event.type === 'payment_intent.payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await this.prisma.order.findFirst({ where: { paymentId: session.id } });
      if (order) await this.orders.release(order.id);
    }
    await this.prisma.webhookEvent.create({ data: { eventId: event.id, provider: 'stripe', eventType: event.type } });
    return res.json({ received: true });
  }

  @Post('simulate')
  async simulate(@Body() body: { orderId: string; status: 'paid' | 'expired' }) {
    if (body.status === 'paid') {
      await this.orders.markPaid(body.orderId, 'simulated');
    } else {
      await this.orders.release(body.orderId);
      await this.prisma.order.update({ where: { id: body.orderId }, data: { status: 'CANCELLED' } });
    }
    return { ok: true };
  }
}



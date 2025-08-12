import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get current date and date 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    // Get all statistics in parallel
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      monthlyGrowth
    ] = await Promise.all([
      // Total products
      prisma.product.count(),
      
      // Total users
      prisma.user.count(),
      
      // Total orders
      prisma.order.count(),
      
      // Total revenue
      prisma.order.aggregate({
        where: {
          status: { in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] }
        },
        _sum: {
          totalAmount: true
        }
      }),
      
      // Recent orders (last 5)
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      
      // Monthly growth calculation
      prisma.order.aggregate({
        where: {
          createdAt: { gte: thirtyDaysAgo }
        },
        _sum: {
          totalAmount: true
        }
      })
    ]);

    // Calculate monthly growth percentage
    const currentMonthRevenue = monthlyGrowth._sum?.totalAmount || 0;
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const previousMonthRevenue = await prisma.order.aggregate({
      where: {
        createdAt: { 
          gte: previousMonthStart,
          lte: previousMonthEnd
        },
        status: { in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] }
      },
      _sum: {
        totalAmount: true
      }
    });

    const prevRevenue = Number(previousMonthRevenue._sum?.totalAmount || 0);
    const currentMonthRevenueNum = Number(currentMonthRevenue);
    const growthPercentage = prevRevenue > 0 
      ? ((currentMonthRevenueNum - prevRevenue) / prevRevenue) * 100 
      : 0;

    // Get top products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        price: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true }
        });
        return {
          id: item.productId,
          name: product?.name || 'Unknown Product',
          totalSold: item._sum.quantity || 0,
          revenue: (item._sum.quantity || 0) * (item._sum.price || 0)
        };
      })
    );

    return NextResponse.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum?.totalAmount || 0,
      recentOrders: recentOrders.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.user?.name || 'Unknown Customer',
        total: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt.toISOString()
      })),
      topProducts: topProductsWithDetails
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const isActive = searchParams.get('isActive');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    };

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === 'productCount') {
      orderBy._count = { products: sortOrder };
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else {
      orderBy.name = sortOrder;
    }

    // Get categories with pagination and product count
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
          imageUrl: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              products: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.category.count({ where })
    ]);

    // Transform categories to include productCount
    const transformedCategories = categories.map(category => ({
      ...category,
      productCount: category._count.products
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: transformedCategories,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Category search error:', error);
    return NextResponse.json(
      { error: 'Failed to search categories' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const author = searchParams.get('author');
    const isPublished = searchParams.get('isPublished');
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { author: { contains: query, mode: 'insensitive' } }
      ]
    };

    if (author) {
      where.author = { contains: author, mode: 'insensitive' };
    }

    if (isPublished !== null && isPublished !== undefined) {
      where.isPublished = isPublished === 'true';
    }

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === 'title') {
      orderBy.title = sortOrder;
    } else if (sortBy === 'author') {
      orderBy.author = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else {
      orderBy.publishedAt = sortOrder;
    }

    // Get blog posts with pagination
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        select: {
          id: true,
          title: true,
          excerpt: true,
          imageUrl: true,
          author: true,
          isPublished: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          slug: true
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Blog search error:', error);
    return NextResponse.json(
      { error: 'Failed to search blog posts' },
      { status: 500 }
    );
  }
}
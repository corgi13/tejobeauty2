import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

export interface SearchFilters {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  rating?: number;
  tags?: string[];
  attributes?: Record<string, string>;
}

export interface SearchOptions {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchProducts(filters: SearchFilters = {}, options: SearchOptions = {}) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    // Text search
    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
        { brand: { contains: filters.query, mode: 'insensitive' } },
        { tags: { hasSome: [filters.query] } },
        { searchKeywords: { hasSome: [filters.query] } },
      ];
    }

    // Category filter
    if (filters.category) {
      where.category = {
        OR: [
          { slug: filters.category },
          { name: { contains: filters.category, mode: 'insensitive' } },
        ],
      };
    }

    // Brand filter
    if (filters.brand) {
      where.brand = { contains: filters.brand, mode: 'insensitive' };
    }

    // Price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    // Stock filter
    if (filters.inStock) {
      where.stock = { gt: 0 };
    }

    // Featured filter
    if (filters.isFeatured) {
      where.isFeatured = true;
    }

    // New filter
    if (filters.isNew) {
      where.isNew = true;
    }

    // On sale filter
    if (filters.isOnSale) {
      where.isOnSale = true;
    }

    // Rating filter
    if (filters.rating) {
      where.rating = { gte: filters.rating };
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }

    // Build order by clause
    let orderBy: any = {};
    if (sortBy === 'popularity') {
      orderBy.reviewCount = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Execute search
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
              attributes: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
      filters,
    };
  }

  async getSearchSuggestions(query: string, limit: number = 10) {
    if (!query || query.length < 2) {
      return [];
    }

    const suggestions = await this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } },
        ],
      },
      select: {
        id: true,
        name: true,
        brand: true,
        slug: true,
        images: true,
        price: true,
      },
      take: limit,
      orderBy: { reviewCount: 'desc' },
    });

    return suggestions;
  }

  async getSearchFilters() {
    const [
      categories,
      brands,
      priceRange,
      tags,
    ] = await Promise.all([
      // Categories
      this.prisma.category.findMany({
        where: {
          products: {
            some: { isActive: true },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: { products: true },
          },
        },
        orderBy: { name: 'asc' },
      }),

      // Brands
      this.prisma.product.groupBy({
        by: ['brand'],
        where: { isActive: true, brand: { not: null } },
        _count: { brand: true },
        orderBy: { brand: 'asc' },
      }),

      // Price range
      this.prisma.product.aggregate({
        where: { isActive: true },
        _min: { price: true },
        _max: { price: true },
      }),

      // Tags
      this.prisma.product.findMany({
        where: { isActive: true },
        select: { tags: true },
      }),
    ]);

    // Extract unique tags
    const allTags = new Set<string>();
    tags.forEach(product => {
      product.tags.forEach(tag => allTags.add(tag));
    });

    return {
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        count: cat._count.products,
      })),
      brands: brands.map(brand => ({
        name: brand.brand,
        count: brand._count.brand,
      })),
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 0,
      },
      tags: Array.from(allTags).sort(),
    };
  }

  async getPopularProducts(limit: number = 10) {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: [
        { reviewCount: 'desc' },
        { rating: 'desc' },
      ],
      take: limit,
    });
  }

  async getRelatedProducts(productId: string, limit: number = 6) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        categoryId: true,
        brand: true,
        tags: true,
      },
    });

    if (!product) {
      return [];
    }

    return this.prisma.product.findMany({
      where: {
        id: { not: productId },
        isActive: true,
        OR: [
          { categoryId: product.categoryId },
          { brand: product.brand },
          { tags: { hasSome: product.tags } },
        ],
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
          },
        },
      },
      orderBy: { reviewCount: 'desc' },
      take: limit,
    });
  }
}

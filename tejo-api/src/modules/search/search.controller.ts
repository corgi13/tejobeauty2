import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchService, SearchFilters, SearchOptions } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('products')
  @ApiOperation({ summary: 'Search products with advanced filtering' })
  @ApiResponse({ status: 200, description: 'Search results' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query' })
  @ApiQuery({ name: 'category', required: false, description: 'Category filter' })
  @ApiQuery({ name: 'brand', required: false, description: 'Brand filter' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price' })
  @ApiQuery({ name: 'inStock', required: false, description: 'In stock only' })
  @ApiQuery({ name: 'isFeatured', required: false, description: 'Featured products only' })
  @ApiQuery({ name: 'isNew', required: false, description: 'New products only' })
  @ApiQuery({ name: 'isOnSale', required: false, description: 'On sale products only' })
  @ApiQuery({ name: 'rating', required: false, description: 'Minimum rating' })
  @ApiQuery({ name: 'tags', required: false, description: 'Tags filter (comma-separated)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc/desc)' })
  async searchProducts(
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('inStock') inStock?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('isNew') isNew?: string,
    @Query('isOnSale') isOnSale?: string,
    @Query('rating') rating?: string,
    @Query('tags') tags?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    const filters: SearchFilters = {
      query,
      category,
      brand,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      inStock: inStock === 'true',
      isFeatured: isFeatured === 'true',
      isNew: isNew === 'true',
      isOnSale: isOnSale === 'true',
      rating: rating ? parseFloat(rating) : undefined,
      tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
    };

    const options: SearchOptions = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    };

    return this.searchService.searchProducts(filters, options);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get search suggestions' })
  @ApiResponse({ status: 200, description: 'Search suggestions' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of suggestions' })
  async getSuggestions(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.getSearchSuggestions(query, limit ? parseInt(limit) : 10);
  }

  @Get('filters')
  @ApiOperation({ summary: 'Get available search filters' })
  @ApiResponse({ status: 200, description: 'Available filters' })
  async getFilters() {
    return this.searchService.getSearchFilters();
  }
<<<<<<< Current (Your changes)
=======

  @Get('popular')
  @ApiOperation({ summary: 'Get popular products' })
  @ApiResponse({ status: 200, description: 'Popular products' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of products' })
  async getPopularProducts(@Query('limit') limit?: string) {
    return this.searchService.getPopularProducts(limit ? parseInt(limit) : 10);
  }

  @Get('related/:productId')
  @ApiOperation({ summary: 'Get related products' })
  @ApiResponse({ status: 200, description: 'Related products' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of products' })
  async getRelatedProducts(
    @Param('productId') productId: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.getRelatedProducts(productId, limit ? parseInt(limit) : 6);
  }

  @Get('typeahead')
  @ApiOperation({ summary: 'Get typeahead search results' })
  @ApiResponse({ status: 200, description: 'Typeahead results' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  async getTypeahead(@Query('q') query: string) {
    return this.searchService.getSearchSuggestions(query, 5);
  }
>>>>>>> Incoming (Background Agent changes)
}



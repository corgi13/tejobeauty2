"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/ui/ProductCard';
import { MovingBorder } from '@/components/ui/MovingBorder';
import { api } from '@/lib/api';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface SearchFilters {
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
}

interface SearchOptions {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isOnSale?: boolean;
  isFeatured?: boolean;
  stock: number;
  variants?: any[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface SearchResult {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: SearchFilters;
}

interface FilterOptions {
  categories: Array<{ id: string; name: string; slug: string; count: number }>;
  brands: Array<{ name: string; count: number }>;
  priceRange: { min: number; max: number };
  tags: string[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>({});
  const [localOptions, setLocalOptions] = useState<SearchOptions>({});

  // Initialize filters from URL params
  useEffect(() => {
    if (!searchParams) return;
    
    const filters: SearchFilters = {};
    const options: SearchOptions = {};

    // Parse search params
    if (searchParams.get('query')) filters.query = searchParams.get('query')!;
    if (searchParams.get('category')) filters.category = searchParams.get('category')!;
    if (searchParams.get('brand')) filters.brand = searchParams.get('brand')!;
    if (searchParams.get('minPrice')) filters.minPrice = parseFloat(searchParams.get('minPrice')!);
    if (searchParams.get('maxPrice')) filters.maxPrice = parseFloat(searchParams.get('maxPrice')!);
    if (searchParams.get('inStock')) filters.inStock = searchParams.get('inStock') === 'true';
    if (searchParams.get('isFeatured')) filters.isFeatured = searchParams.get('isFeatured') === 'true';
    if (searchParams.get('isNew')) filters.isNew = searchParams.get('isNew') === 'true';
    if (searchParams.get('isOnSale')) filters.isOnSale = searchParams.get('isOnSale') === 'true';
    if (searchParams.get('rating')) filters.rating = parseFloat(searchParams.get('rating')!);
    if (searchParams.get('tags')) filters.tags = searchParams.get('tags')!.split(',');
    if (searchParams.get('page')) options.page = parseInt(searchParams.get('page')!);
    if (searchParams.get('limit')) options.limit = parseInt(searchParams.get('limit')!);
    if (searchParams.get('sortBy')) options.sortBy = searchParams.get('sortBy') as any;
    if (searchParams.get('sortOrder')) options.sortOrder = searchParams.get('sortOrder') as any;

    setLocalFilters(filters);
    setLocalOptions(options);
  }, [searchParams]);

  // Load search results and filter options
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [searchResponse, filtersResponse] = await Promise.all([
          api.get('/search/products', { params: { ...localFilters, ...localOptions } }),
          api.get('/search/filters'),
        ]);

        setSearchResult(searchResponse.data);
        setFilterOptions(filtersResponse.data);
      } catch (error) {
        console.error('Error loading search results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [localFilters, localOptions]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, String(value));
        }
      }
    });
    
    router.push(`/search?${params.toString()}`);
  };

  const updateOptions = (newOptions: Partial<SearchOptions>) => {
    const updatedOptions = { ...localOptions, ...newOptions };
    setLocalOptions(updatedOptions);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries({ ...localFilters, ...updatedOptions }).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, String(value));
        }
      }
    });
    
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setLocalFilters({});
    router.push('/search');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rezultati pretrage
          </h1>
          {searchResult && (
            <p className="text-gray-600">
              Pronađeno {searchResult.pagination.total} proizvoda
            </p>
          )}
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <MovingBorder className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filteri</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Očisti sve
                </button>
              </div>

              {/* Search Query */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pretraga
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={localFilters.query || ''}
                    onChange={(e) => updateFilters({ query: e.target.value })}
                    placeholder="Pretraži proizvode..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              {filterOptions?.categories && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Kategorije</h3>
                  <div className="space-y-2">
                    {filterOptions.categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.slug}
                          checked={localFilters.category === category.slug}
                          onChange={(e) => updateFilters({ category: e.target.value })}
                          className="h-4 w-4 text-gold focus:ring-gold border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {category.name} ({category.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {filterOptions?.brands && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Brendovi</h3>
                  <div className="space-y-2">
                    {filterOptions.brands.map((brand) => (
                      <label key={brand.name} className="flex items-center">
                        <input
                          type="radio"
                          name="brand"
                          value={brand.name}
                          checked={localFilters.brand === brand.name}
                          onChange={(e) => updateFilters({ brand: e.target.value })}
                          className="h-4 w-4 text-gold focus:ring-gold border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {brand.name} ({brand.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              {filterOptions?.priceRange && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Cijena</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min</label>
                      <input
                        type="number"
                        value={localFilters.minPrice || ''}
                        onChange={(e) => updateFilters({ minPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder={filterOptions.priceRange.min.toString()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Max</label>
                      <input
                        type="number"
                        value={localFilters.maxPrice || ''}
                        onChange={(e) => updateFilters({ maxPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder={filterOptions.priceRange.max.toString()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Brzi filteri</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.inStock || false}
                      onChange={(e) => updateFilters({ inStock: e.target.checked })}
                      className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Samo na stanju</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.isNew || false}
                      onChange={(e) => updateFilters({ isNew: e.target.checked })}
                      className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Novi proizvodi</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.isOnSale || false}
                      onChange={(e) => updateFilters({ isOnSale: e.target.checked })}
                      className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Na akciji</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.isFeatured || false}
                      onChange={(e) => updateFilters({ isFeatured: e.target.checked })}
                      className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Preporučeno</span>
                  </label>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Ocjena</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={localFilters.rating === rating}
                        onChange={(e) => updateFilters({ rating: parseInt(e.target.value) })}
                        className="h-4 w-4 text-gold focus:ring-gold border-gray-300"
                      />
                      <span className="ml-2 flex items-center">
                        {renderStars(rating)}
                        <span className="ml-1 text-sm text-gray-700">i više</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </MovingBorder>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <select
                  value={`${localOptions.sortBy || 'createdAt'}-${localOptions.sortOrder || 'desc'}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    updateOptions({ sortBy: sortBy as any, sortOrder: sortOrder as any });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="createdAt-desc">Najnoviji</option>
                  <option value="name-asc">Naziv A-Z</option>
                  <option value="name-desc">Naziv Z-A</option>
                  <option value="price-asc">Cijena: niža-viša</option>
                  <option value="price-desc">Cijena: viša-niža</option>
                  <option value="rating-desc">Najbolje ocijenjeni</option>
                  <option value="popularity-desc">Najpopularniji</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <FunnelIcon className="h-4 w-4" />
                Filteri
              </button>
            </div>

            {/* Products Grid */}
            {searchResult?.products && searchResult.products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResult.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {searchResult.pagination.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => updateOptions({ page: searchResult.pagination.page - 1 })}
                        disabled={!searchResult.pagination.hasPrev}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      
                      {Array.from({ length: searchResult.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => updateOptions({ page })}
                          className={`px-3 py-2 border rounded-lg text-sm ${
                            page === searchResult.pagination.page
                              ? 'bg-gold text-white border-gold'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => updateOptions({ page: searchResult.pagination.page + 1 })}
                        disabled={!searchResult.pagination.hasNext}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nema rezultata</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Pokušajte promijeniti filtere ili pretražiti drugačiji pojam.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

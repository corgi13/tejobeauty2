'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'src/hooks/useForm';
import { useApi, useApiMutation } from 'src/hooks/useApi';
import { formatPrice } from 'src/utils/format';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockCount: number;
  inStock: boolean;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stockCount: string;
  imageUrl: string;
}

export default function AdminProducts() {
  const t = useTranslations('Admin');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products
  const { data: productsResponse, isLoading, error, refetch } = useApi<ProductsResponse>(
    `/api/admin/products?page=${currentPage}&limit=10&search=${search}&category=${categoryFilter}&status=${stockFilter}`
  );

  // Create product mutation
  const createProduct = useApiMutation('/api/admin/products', {
    onSuccess: () => {
      setIsCreateDialogOpen(false);
      refetch();
    },
  });

  // Update product mutation
  const updateProduct = useApiMutation(`/api/admin/products/${editingProduct?.id}`, {
    method: 'PUT',
    onSuccess: () => {
      setEditingProduct(null);
      refetch();
    },
  });

  // Delete product mutation
  const deleteProduct = useApiMutation(`/api/admin/products/${editingProduct?.id}`, {
    method: 'DELETE',
    onSuccess: () => {
      setEditingProduct(null);
      refetch();
    },
  });

  // Toggle product status mutation
  const toggleProductStatus = useApiMutation(`/api/admin/products/${editingProduct?.id}`, {
    method: 'PUT',
    onSuccess: () => {
      refetch();
    },
  });

  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;

  const form = useForm<ProductFormData>({
    initialValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      stockCount: '',
      imageUrl: '',
    },
    onSubmit: async (values) => {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          ...values,
          isActive: editingProduct.isActive,
        });
      } else {
        await createProduct.mutateAsync(values);
      }
    },
    validate: (values) => {
      const errors = [];
      if (!values.name.trim()) errors.push({ field: 'name', message: 'Name is required' });
      if (!values.description.trim()) errors.push({ field: 'description', message: 'Description is required' });
      if (!values.price || parseFloat(values.price) <= 0) errors.push({ field: 'price', message: 'Valid price is required' });
      if (!values.category) errors.push({ field: 'category', message: 'Category is required' });
      if (!values.stockCount || parseInt(values.stockCount) < 0) errors.push({ field: 'stockCount', message: 'Valid stock count is required' });
      return errors;
    },
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stockCount: product.stockCount.toString(),
      imageUrl: product.imageUrl || '',
    });
  };

  const handleDelete = async (product: Product) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setEditingProduct(product);
      await deleteProduct.mutateAsync({});
    }
  };

  const handleToggleStatus = async (product: Product) => {
    setEditingProduct(product);
    await toggleProductStatus.mutateAsync({
      ...product,
      isActive: !product.isActive,
    });
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    form.reset();
    setIsCreateDialogOpen(true);
  };

  const categories = ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Tools', 'Bath & Body'];

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading products</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('products')}</h1>
          <p className="text-muted-foreground">
            {t('manageProductsDescription')}
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addProduct')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('searchProducts')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('selectStockStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="inStock">{t('inStock')}</SelectItem>
                <SelectItem value="outOfStock">{t('outOfStock')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('productsList')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('product')}</TableHead>
                    <TableHead>{t('category')}</TableHead>
                    <TableHead>{t('price')}</TableHead>
                    <TableHead>{t('stock')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <Badge variant={product.inStock ? 'default' : 'destructive'}>
                          {product.stockCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                          {product.isActive ? t('active') : t('inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(product)}
                          >
                            {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    {t('showing')} {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} {t('of')} {pagination.total} {t('products')}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      {t('previous')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      {t('next')}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('noProductsFound')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || !!editingProduct} onOpenChange={() => {
        setIsCreateDialogOpen(false);
        setEditingProduct(null);
        form.reset();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? t('editProduct') : t('addProduct')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('productName')}</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.values.name}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  placeholder={t('enterProductName')}
                  className={form.getFieldError('name') ? 'border-red-500' : ''}
                />
                {form.getFieldError('name') && (
                  <p className="text-sm text-red-500">{form.getFieldError('name')}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t('category')}</Label>
                <Select
                  value={form.values.category}
                  onValueChange={(value) => form.setValue('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.getFieldError('category') && (
                  <p className="text-sm text-red-500">{form.getFieldError('category')}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">{t('price')}</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.values.price}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  placeholder="0.00"
                  className={form.getFieldError('price') ? 'border-red-500' : ''}
                />
                {form.getFieldError('price') && (
                  <p className="text-sm text-red-500">{form.getFieldError('price')}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockCount">{t('stockCount')}</Label>
                <Input
                  id="stockCount"
                  name="stockCount"
                  type="number"
                  min="0"
                  value={form.values.stockCount}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  placeholder="0"
                  className={form.getFieldError('stockCount') ? 'border-red-500' : ''}
                />
                {form.getFieldError('stockCount') && (
                  <p className="text-sm text-red-500">{form.getFieldError('stockCount')}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">{t('imageUrl')}</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.values.imageUrl}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea
                id="description"
                name="description"
                value={form.values.description}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder={t('enterProductDescription')}
                rows={4}
                className={form.getFieldError('description') ? 'border-red-500' : ''}
              />
              {form.getFieldError('description') && (
                <p className="text-sm text-red-500">{form.getFieldError('description')}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingProduct(null);
                  form.reset();
                }}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                disabled={form.isSubmitting || createProduct.isLoading || updateProduct.isLoading}
              >
                {form.isSubmitting || createProduct.isLoading || updateProduct.isLoading
                  ? t('saving')
                  : editingProduct
                  ? t('updateProduct')
                  : t('createProduct')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}



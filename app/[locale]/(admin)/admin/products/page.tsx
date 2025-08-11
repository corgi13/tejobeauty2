'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from 'src/hooks/useForm';
import { useApi } from 'src/hooks/useApi';
import { formatPrice } from 'src/utils/format';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  slug: string;
  imageUrl?: string;
  stockCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
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
  price: number;
  categoryId: string;
  slug: string;
  imageUrl: string;
  stockCount: number;
  isActive: boolean;
}

export default function ProductsPage() {
  const t = useTranslations('admin.products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Create form
  const form = useForm<ProductFormData>({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      slug: '',
      imageUrl: '',
      stockCount: 0,
      isActive: true
    },
    validate: (values) => {
      const errors = [];
      if (!values.name.trim()) errors.push({ field: 'name', message: 'Name is required' });
      if (!values.description.trim()) errors.push({ field: 'description', message: 'Description is required' });
      if (values.price <= 0) errors.push({ field: 'price', message: 'Price must be greater than 0' });
      if (!values.categoryId) errors.push({ field: 'categoryId', message: 'Category is required' });
      if (!values.slug.trim()) errors.push({ field: 'slug', message: 'Slug is required' });
      if (values.stockCount < 0) errors.push({ field: 'stockCount', message: 'Stock count cannot be negative' });
      return errors;
    },
    onSubmit: async (values) => {
      if (editingProduct) {
        try {
          const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
          });
          
          if (response.ok) {
            const updatedProduct = await response.json();
            setProducts(prev => prev.map(prod => 
              prod.id === editingProduct.id ? updatedProduct : prod
            ));
            setIsEditDialogOpen(false);
            setEditingProduct(null);
            form.reset();
          }
        } catch (error) {
          console.error('Error updating product:', error);
        }
      } else {
        try {
          const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
          });
          
          if (response.ok) {
            const newProduct = await response.json();
            setProducts(prev => [newProduct, ...prev]);
            setIsCreateDialogOpen(false);
            form.reset();
          }
        } catch (error) {
          console.error('Error creating product:', error);
        }
      }
    }
  });

  // API hooks
  const { data: productsResponse, loading, error, execute: fetchProducts } = useApi<ProductsResponse>();
  const { data: categoriesResponse, execute: fetchCategories } = useApi<{ data: Category[] }>();

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts(async () => {
      const response = await fetch(`/api/admin/products?page=${currentPage}&limit=10&search=${search}&category=${categoryFilter}&status=${stockFilter}`);
      return response.json();
    });
  }, [currentPage, search, categoryFilter, stockFilter]);

  useEffect(() => {
    fetchCategories(async () => {
      const response = await fetch('/api/admin/categories');
      return response.json();
    });
  }, []);

  // Update products state when data changes
  useEffect(() => {
    if (productsResponse?.data) {
      setProducts(productsResponse.data);
      setTotalPages(productsResponse.pagination.totalPages);
    }
  }, [productsResponse]);

  // Update categories state when data changes
  useEffect(() => {
    if (categoriesResponse?.data) {
      setCategories(categoriesResponse.data);
    }
  }, [categoriesResponse]);

  // Update edit form when editingProduct changes
  useEffect(() => {
    if (editingProduct && isEditDialogOpen) {
      form.setValue('name', editingProduct.name);
      form.setValue('description', editingProduct.description);
      form.setValue('price', editingProduct.price);
      form.setValue('categoryId', editingProduct.categoryId);
      form.setValue('slug', editingProduct.slug);
      form.setValue('imageUrl', editingProduct.imageUrl || '');
      form.setValue('stockCount', editingProduct.stockCount);
      form.setValue('isActive', editingProduct.isActive);
    }
  }, [editingProduct, isEditDialogOpen]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setProducts(prev => prev.filter(prod => prod.id !== productId));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, isActive: !product.isActive })
      });
      
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(prev => prev.map(prod => 
          prod.id === product.id ? updatedProduct : prod
        ));
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const handleCloseCreate = () => {
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleCloseEdit = () => {
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    form.reset();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('addNew')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('allCategories')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('allStatuses')}</SelectItem>
                <SelectItem value="inStock">{t('inStock')}</SelectItem>
                <SelectItem value="outOfStock">{t('outOfStock')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setCategoryFilter('');
                setStockFilter('');
              }}
            >
              {t('clearFilters')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('allProducts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('category')}</TableHead>
                <TableHead>{t('price')}</TableHead>
                <TableHead>{t('stock')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category?.name || '-'}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.stockCount}</TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? t('active') : t('inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(product)}
                      >
                        {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Product Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('createProduct')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="create-name">{t('name')}</Label>
              <Input
                id="create-name"
                value={form.values.name}
                onChange={(e) => form.setValue('name', e.target.value)}
                className={form.errors.find(e => e.field === 'name') ? 'border-red-500' : ''}
              />
              {form.errors.find(e => e.field === 'name') && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors.find(e => e.field === 'name')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="create-description">{t('description')}</Label>
              <Textarea
                id="create-description"
                value={form.values.description}
                onChange={(e) => form.setValue('description', e.target.value)}
                rows={3}
                className={form.errors.find(e => e.field === 'description') ? 'border-red-500' : ''}
              />
              {form.errors.find(e => e.field === 'description') && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors.find(e => e.field === 'description')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="create-price">{t('price')}</Label>
              <Input
                id="create-price"
                type="number"
                step="0.01"
                value={form.values.price}
                onChange={(e) => form.setValue('price', parseFloat(e.target.value) || 0)}
                className={form.errors.find(e => e.field === 'price') ? 'border-red-500' : ''}
              />
              {form.errors.find(e => e.field === 'price') && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors.find(e => e.field === 'price')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="create-categoryId">{t('category')}</Label>
              <Select value={form.values.categoryId} onValueChange={(value) => form.setValue('categoryId', value)}>
                <SelectTrigger className={form.errors.find(e => e.field === 'categoryId') ? 'border-red-500' : ''}>
                  <SelectValue placeholder={t('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.errors.find(e => e.field === 'categoryId') && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors.find(e => e.field === 'categoryId')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="create-slug">{t('slug')}</Label>
              <Input
                id="create-slug"
                value={form.values.slug}
                onChange={(e) => form.setValue('slug', e.target.value)}
                className={form.errors.find(e => e.field === 'slug') ? 'border-red-500' : ''}
              />
              {form.errors.find(e => e.field === 'slug') && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors.find(e => e.field === 'slug')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="create-imageUrl">{t('imageUrl')}</Label>
              <Input
                id="create-imageUrl"
                value={form.values.imageUrl}
                onChange={(e) => form.setValue('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="create-stockCount">{t('stockCount')}</Label>
              <Input
                id="create-stockCount"
                type="number"
                value={form.values.stockCount}
                onChange={(e) => form.setValue('stockCount', parseInt(e.target.value) || 0)}
                className={form.errors.find(e => e.field === 'stockCount') ? 'border-red-500' : ''}
              />
              {form.errors.find(e => e.field === 'stockCount') && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors.find(e => e.field === 'stockCount')?.message}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="create-isActive"
                checked={form.values.isActive}
                onChange={(e) => form.setValue('isActive', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="create-isActive">{t('active')}</Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseCreate}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={form.isSubmitting}>
                {form.isSubmitting ? t('creating') : t('create')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('editProduct')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">{t('name')}</Label>
              <Input
                id="edit-name"
                value={form.values.name}
                onChange={(e) => form.setValue('name', e.target.value)}
                className={form.errors.find(e => e.field === 'name') ? 'border-red-500' : ''}
              />
              {form.errors.find(e => e.field === 'name') && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors.find(e => e.field === 'name')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-description">{t('description')}</Label>
              <Textarea
                id="edit-description"
                value={form.values.description}
                onChange={(e) => form.setValue('description', e.target.value)}
                rows={3}
                className={form.errors.find(e => e.field === 'description') ? 'border-red-500' : ''}
              />
              {form.errors.find(e => e.field === 'description') && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors.find(e => e.field === 'description')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-price">{t('price')}</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={form.values.price}
                onChange={(e) => form.setValue('price', parseFloat(e.target.value) || 0)}
                className={form.errors.find(e => e.field === 'price') ? 'border-red-500' : ''}
              />
              {form.errors.find(e => e.field === 'price') && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors.find(e => e.field === 'price')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-categoryId">{t('category')}</Label>
              <Select value={form.values.categoryId} onValueChange={(value) => form.setValue('categoryId', value)}>
                <SelectTrigger className={form.errors.find(e => e.field === 'categoryId') ? 'border-red-500' : ''}>
                  <SelectValue placeholder={t('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.errors.find(e => e.field === 'categoryId') && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors.find(e => e.field === 'categoryId')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-slug">{t('slug')}</Label>
              <Input
                id="edit-slug"
                value={form.values.slug}
                onChange={(e) => form.setValue('slug', e.target.value)}
                className={form.errors.find(e => e.field === 'slug') ? 'border-red-500' : ''}
              />
              {form.errors.find(e => e.field === 'slug') && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors.find(e => e.field === 'slug')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-imageUrl">{t('imageUrl')}</Label>
              <Input
                id="edit-imageUrl"
                value={form.values.imageUrl}
                onChange={(e) => form.setValue('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-stockCount">{t('stockCount')}</Label>
              <Input
                id="edit-stockCount"
                type="number"
                value={form.values.stockCount}
                onChange={(e) => form.setValue('stockCount', parseInt(e.target.value) || 0)}
                className={form.errors.find(e => e.field === 'stockCount') ? 'border-red-500' : ''}
              />
              {form.errors.find(e => e.field === 'stockCount') && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors.find(e => e.field === 'stockCount')?.message}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isActive"
                checked={form.values.isActive}
                onChange={(e) => form.setValue('isActive', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="edit-isActive">{t('active')}</Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseEdit}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={form.isSubmitting}>
                {form.isSubmitting ? t('updating') : t('update')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
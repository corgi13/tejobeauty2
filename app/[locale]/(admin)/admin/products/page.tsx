'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from '../../../src/hooks/useForm';
import { useApi } from '../../../src/hooks/useApi';

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

  useEffect(() => {
    if (categoriesResponse?.data) {
      setCategories(categoriesResponse.data);
    }
  }, [categoriesResponse]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setValue('name', product.name);
    form.setValue('description', product.description);
    form.setValue('price', product.price);
    form.setValue('categoryId', product.categoryId);
    form.setValue('slug', product.slug);
    form.setValue('imageUrl', product.imageUrl || '');
    form.setValue('stockCount', product.stockCount);
    form.setValue('isActive', product.isActive);
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
        setProducts(prev => prev.map(prod => 
          prod.id === product.id ? { ...prod, isActive: !prod.isActive } : prod
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Products</h1>
      <p>Total products: {products.length}</p>
    </div>
  );
}
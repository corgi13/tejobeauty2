'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from 'src/hooks/useForm';
import { useApi } from 'src/hooks/useApi';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse {
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CategoryFormData {
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  isActive: boolean;
}

export default function CategoriesPage() {
  const t = useTranslations('admin.categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Create form
  const createForm = useForm<CategoryFormData>({
    initialValues: {
      name: '',
      description: '',
      slug: '',
      imageUrl: '',
      isActive: true
    },
    validate: (values) => {
      const errors = [];
      if (!values.name.trim()) errors.push({ field: 'name', message: 'Name is required' });
      if (!values.slug.trim()) errors.push({ field: 'slug', message: 'Slug is required' });
      if (values.description && values.description.length > 500) {
        errors.push({ field: 'description', message: 'Description must be less than 500 characters' });
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        
        if (response.ok) {
          const newCategory = await response.json();
          setCategories(prev => [newCategory, ...prev]);
          setIsCreateDialogOpen(false);
          createForm.reset();
        }
      } catch (error) {
        console.error('Error creating category:', error);
      }
    }
  });

  // Edit form
  const editForm = useForm<CategoryFormData>({
    initialValues: {
      name: '',
      description: '',
      slug: '',
      imageUrl: '',
      isActive: true
    },
    validate: (values) => {
      const errors = [];
      if (!values.name.trim()) errors.push({ field: 'name', message: 'Name is required' });
      if (!values.slug.trim()) errors.push({ field: 'slug', message: 'Slug is required' });
      if (values.description && values.description.length > 500) {
        errors.push({ field: 'description', message: 'Description must be less than 500 characters' });
      }
      return errors;
    },
    onSubmit: async (values) => {
      if (editingCategory) {
        try {
          const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
          });
          
          if (response.ok) {
            const updatedCategory = await response.json();
            setCategories(prev => prev.map(cat => 
              cat.id === editingCategory.id ? updatedCategory : cat
            ));
            setIsEditDialogOpen(false);
            setEditingCategory(null);
            editForm.reset();
          }
        } catch (error) {
          console.error('Error updating category:', error);
        }
      }
    }
  });

  // API hooks
  const { data: categoriesData, loading, error, execute: fetchCategories } = useApi<CategoriesResponse>();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories(async () => {
      const response = await fetch(`/api/admin/categories?page=${currentPage}&limit=10&search=${searchTerm}`);
      return response.json();
    });
  }, [currentPage, searchTerm]);

  // Update categories state when data changes
  useEffect(() => {
    if (categoriesData?.data) {
      setCategories(categoriesData.data);
      setTotalPages(categoriesData.pagination.totalPages);
    }
  }, [categoriesData]);

  // Update edit form when editingCategory changes
  useEffect(() => {
    if (editingCategory && isEditDialogOpen) {
      editForm.setValue('name', editingCategory.name);
      editForm.setValue('description', editingCategory.description || '');
      editForm.setValue('slug', editingCategory.slug);
      editForm.setValue('imageUrl', editingCategory.imageUrl || '');
      editForm.setValue('isActive', editingCategory.isActive);
    }
  }, [editingCategory, isEditDialogOpen]);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...category, isActive: !category.isActive })
      });
      
      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories(prev => prev.map(cat => 
          cat.id === category.id ? updatedCategory : cat
        ));
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  const handleCloseCreate = () => {
    setIsCreateDialogOpen(false);
    createForm.reset();
  };

  const handleCloseEdit = () => {
    setIsEditDialogOpen(false);
    setEditingCategory(null);
    editForm.reset();
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('allCategories')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('description')}</TableHead>
                <TableHead>{t('slug')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {category.description || '-'}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? t('active') : t('inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(category)}
                      >
                        {category.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
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

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('createCategory')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="create-name">{t('name')}</Label>
              <Input
                id="create-name"
                value={createForm.values.name}
                onChange={(e) => createForm.setValue('name', e.target.value)}
                className={createForm.errors.find(e => e.field === 'name') ? 'border-red-500' : ''}
              />
              {createForm.errors.find(e => e.field === 'name') && (
                <p className="text-red-500 text-sm mt-1">
                  {createForm.errors.find(e => e.field === 'name')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="create-description">{t('description')}</Label>
              <Textarea
                id="create-description"
                value={createForm.values.description}
                onChange={(e) => createForm.setValue('description', e.target.value)}
                rows={3}
                className={createForm.errors.find(e => e.field === 'description') ? 'border-red-500' : ''}
              />
              {createForm.errors.find(e => e.field === 'description') && (
                <p className="text-red-500 text-sm mt-1">
                  {createForm.errors.find(e => e.field === 'description')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="create-slug">{t('slug')}</Label>
              <Input
                id="create-slug"
                value={createForm.values.slug}
                onChange={(e) => createForm.setValue('slug', e.target.value)}
                className={createForm.errors.find(e => e.field === 'slug') ? 'border-red-500' : ''}
              />
              {createForm.errors.find(e => e.field === 'slug') && (
                <p className="text-red-500 text-sm mt-1">
                  {createForm.errors.find(e => e.field === 'slug')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="create-imageUrl">{t('imageUrl')}</Label>
              <Input
                id="create-imageUrl"
                value={createForm.values.imageUrl}
                onChange={(e) => createForm.setValue('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="create-isActive"
                checked={createForm.values.isActive}
                onChange={(e) => createForm.setValue('isActive', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="create-isActive">{t('active')}</Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseCreate}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={createForm.isSubmitting}>
                {createForm.isSubmitting ? t('creating') : t('create')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('editCategory')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">{t('name')}</Label>
              <Input
                id="edit-name"
                value={editForm.values.name}
                onChange={(e) => editForm.setValue('name', e.target.value)}
                className={editForm.errors.find(e => e.field === 'name') ? 'border-red-500' : ''}
              />
              {editForm.errors.find(e => e.field === 'name') && (
                <p className="text-red-500 text-sm mt-1">
                  {editForm.errors.find(e => e.field === 'name')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-description">{t('description')}</Label>
              <Textarea
                id="edit-description"
                value={editForm.values.description}
                onChange={(e) => editForm.setValue('description', e.target.value)}
                rows={3}
                className={editForm.errors.find(e => e.field === 'description') ? 'border-red-500' : ''}
              />
              {editForm.errors.find(e => e.field === 'description') && (
                <p className="text-red-500 text-sm mt-1">
                  {editForm.errors.find(e => e.field === 'description')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-slug">{t('slug')}</Label>
              <Input
                id="edit-slug"
                value={editForm.values.slug}
                onChange={(e) => editForm.setValue('slug', e.target.value)}
                className={editForm.errors.find(e => e.field === 'slug') ? 'border-red-500' : ''}
              />
              {editForm.errors.find(e => e.field === 'slug') && (
                <p className="text-red-500 text-sm mt-1">
                  {editForm.errors.find(e => e.field === 'slug')?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-imageUrl">{t('imageUrl')}</Label>
              <Input
                id="edit-imageUrl"
                value={editForm.values.imageUrl}
                onChange={(e) => editForm.setValue('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isActive"
                checked={editForm.values.isActive}
                onChange={(e) => editForm.setValue('isActive', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="edit-isActive">{t('active')}</Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseEdit}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={editForm.isSubmitting}>
                {editForm.isSubmitting ? t('updating') : t('update')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
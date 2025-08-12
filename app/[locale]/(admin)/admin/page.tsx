'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApi } from '../../../src/hooks/useApi';
import { formatPrice, formatDateTime } from '../../../src/utils/format';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const t = useTranslations('Admin');
  
  const { data: stats, loading, error, execute: fetchStats } = useApi<DashboardStats>();

  // Fetch dashboard stats on component mount
  useEffect(() => {
    fetchStats(async () => {
      const response = await fetch('/api/admin/dashboard');
      return response.json();
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </CardTitle>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error loading dashboard: {error}</p>
        <Button onClick={() => fetchStats(async () => {
          const response = await fetch('/api/admin/dashboard');
          return response.json();
        })}>
          Retry
        </Button>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-8">No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        <Button onClick={() => fetchStats(async () => {
          const response = await fetch('/api/admin/dashboard');
          return response.json();
        })}>
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalProducts')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalOrders')}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentOrders')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('orderNumber')}</TableHead>
                <TableHead>{t('customerName')}</TableHead>
                <TableHead>{t('total')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentOrders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      {t('view')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>{t('topProducts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('productName')}</TableHead>
                <TableHead>{t('totalSold')}</TableHead>
                <TableHead>{t('revenue')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.topProducts.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.totalSold}</TableCell>
                  <TableCell>{formatPrice(product.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
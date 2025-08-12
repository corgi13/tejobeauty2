'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function AdminDashboard() {
  const t = useTranslations('Admin');
  
  useEffect(() => {
    console.log('Admin dashboard mounted');
  }, []);

  return <div>Admin Dashboard</div>;
}

import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default', freeShippingThreshold: 80 as any, loyaltyTiers: [{ name: 'Bronze', threshold: 0 }, { name: 'Silver', threshold: 200 }, { name: 'Gold', threshold: 500 }] as any },
  });

  // admin user
  const pass = await argon2.hash('admin123');
  await prisma.user.upsert({ where: { email: 'admin@tejo.local' }, update: {}, create: { email: 'admin@tejo.local', name: 'Admin', passwordHash: pass, isAdmin: true } });

  // categories + sample products
  const cats = [
    { slug: 'skincare', name: 'Skincare', description: 'Skincare' },
    { slug: 'nails', name: 'Nails', description: 'Nails' },
  ];
  for (const c of cats) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c as any });
  }
  for (let i = 1; i <= 8; i++) {
    await prisma.product.upsert({
      where: { slug: `sample-${i}` },
      update: {},
      create: {
        name: `Sample Product ${i}`,
        slug: `sample-${i}`,
        description: 'High quality beauty product',
        price: (19.99 + i) as any,
        images: [],
        category: i % 2 === 0 ? 'skincare' : 'nails',
        brand: 'Tejo',
        countInStock: 100,
      },
    });
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});



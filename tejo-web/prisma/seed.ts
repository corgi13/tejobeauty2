import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tejo-beauty.com' },
    update: {},
    create: {
      email: 'admin@tejo-beauty.com',
      name: 'Admin User',
      isAdmin: true,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'face-care' },
      update: {},
      create: {
        name: 'Nega lica',
        description: 'Proizvodi za njegu lica i kože',
        slug: 'face-care',
        imageUrl: '/images/categories/face-care.jpg',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'body-care' },
      update: {},
      create: {
        name: 'Nega tijela',
        description: 'Proizvodi za njegu tijela',
        slug: 'body-care',
        imageUrl: '/images/categories/body-care.jpg',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'hair-care' },
      update: {},
      create: {
        name: 'Nega kose',
        description: 'Proizvodi za njegu kose',
        slug: 'hair-care',
        imageUrl: '/images/categories/hair-care.jpg',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'makeup' },
      update: {},
      create: {
        name: 'Šminka',
        description: 'Prirodna šminka i kozmetika',
        slug: 'makeup',
        imageUrl: '/images/categories/makeup.jpg',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Categories created:', categories.length);

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'anti-aging-serum' },
      update: {},
      create: {
        name: 'Anti-aging serum',
        description: 'Napredni serum protiv starenja s prirodnim sastojcima',
        price: 89.99,
        categoryId: categories[0].id, // face-care
        slug: 'anti-aging-serum',
        imageUrl: '/images/products/anti-aging-serum.jpg',
        inStock: true,
        stockCount: 50,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'hydrating-moisturizer' },
      update: {},
      create: {
        name: 'Hidratantna krema',
        description: 'Intenzivna hidratacija za sve tipove kože',
        price: 65.50,
        categoryId: categories[0].id, // face-care
        slug: 'hydrating-moisturizer',
        imageUrl: '/images/products/hydrating-moisturizer.jpg',
        inStock: true,
        stockCount: 75,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'body-lotion' },
      update: {},
      create: {
        name: 'Krema za tijelo',
        description: 'Njegujuća krema za tijelo s prirodnim uljima',
        price: 45.00,
        categoryId: categories[1].id, // body-care
        slug: 'body-lotion',
        imageUrl: '/images/products/body-lotion.jpg',
        inStock: true,
        stockCount: 60,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'shampoo' },
      update: {},
      create: {
        name: 'Prirodni šampon',
        description: 'Šampon s prirodnim sastojcima za sve tipove kose',
        price: 35.00,
        categoryId: categories[2].id, // hair-care
        slug: 'shampoo',
        imageUrl: '/images/products/shampoo.jpg',
        inStock: true,
        stockCount: 80,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'natural-foundation' },
      update: {},
      create: {
        name: 'Prirodna podloga',
        description: 'Podloga s prirodnim sastojcima za prirodan izgled',
        price: 55.00,
        categoryId: categories[3].id, // makeup
        slug: 'natural-foundation',
        imageUrl: '/images/products/natural-foundation.jpg',
        inStock: true,
        stockCount: 40,
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Products created:', products.length);

  // Create blog posts
  const blogPosts = await Promise.all([
    prisma.blogPost.upsert({
      where: { slug: '10-steps-perfect-routine' },
      update: {},
      create: {
        title: '10 koraka za savršenu rutinu',
        content: 'Detaljan vodič kako kreirati savršenu rutinu njegovanja kože...',
        excerpt: 'Naučite kako kreirati rutinu koja će vašoj koži dati ono što joj treba.',
        slug: '10-steps-perfect-routine',
        imageUrl: '/images/blog/perfect-routine.jpg',
        author: 'Tejo Beauty Team',
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'natural-ingredients-benefits' },
      update: {},
      create: {
        title: 'Prednosti prirodnih sastojaka',
        content: 'Zašto su prirodni sastojci bolji za vašu kožu...',
        excerpt: 'Otkrijte zašto su prirodni sastojci ključni za zdravu kožu.',
        slug: 'natural-ingredients-benefits',
        imageUrl: '/images/blog/natural-ingredients.jpg',
        author: 'Tejo Beauty Team',
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Blog posts created:', blogPosts.length);

  // Create orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: adminUser.id,
        status: 'CONFIRMED',
        total: 155.49,
        paymentMethod: 'card',
        shippingAddress: {
          street: '123 Main St',
          city: 'Zagreb',
          postalCode: '10000',
          country: 'Croatia'
        },
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: 89.99,
              productName: products[0].name,
            },
            {
              productId: products[1].id,
              quantity: 1,
              price: 65.50,
              productName: products[1].name,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: adminUser.id,
        status: 'SHIPPED',
        total: 80.00,
        paymentMethod: 'card',
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Split',
          postalCode: '21000',
          country: 'Croatia'
        },
        items: {
          create: [
            {
              productId: products[2].id,
              quantity: 1,
              price: 45.00,
              productName: products[2].name,
            },
            {
              productId: products[3].id,
              quantity: 1,
              price: 35.00,
              productName: products[3].name,
            },
          ],
        },
      },
    }),
  ]);

  console.log('✅ Orders created:', orders.length);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
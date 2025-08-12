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

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'prod-1' },
      update: {},
      create: {
        id: 'prod-1',
        name: 'Tejo Gold Serum',
        description: 'Premium anti-aging serum with gold particles and natural extracts',
        price: 89.99,
        category: 'Serums',
        imageUrl: 'https://res.cloudinary.com/tejo-beauty/image/upload/v1/products/gold-serum',
        inStock: true,
        stockCount: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-2' },
      update: {},
      create: {
        id: 'prod-2',
        name: 'Cream Luxe Moisturizer',
        description: 'Rich, hydrating moisturizer for all skin types',
        price: 65.00,
        category: 'Moisturizers',
        imageUrl: 'https://res.cloudinary.com/tejo-beauty/image/upload/v1/products/cream-moisturizer',
        inStock: true,
        stockCount: 75,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-3' },
      update: {},
      create: {
        id: 'prod-3',
        name: 'Sage Cleansing Gel',
        description: 'Gentle cleansing gel with sage and natural ingredients',
        price: 45.00,
        category: 'Cleansers',
        imageUrl: 'https://res.cloudinary.com/tejo-beauty/image/upload/v1/products/sage-cleanser',
        inStock: true,
        stockCount: 100,
      },
    }),
  ]);

  console.log('✅ Products created:', products.length);

  // Create sample blog posts
  const blogPosts = await Promise.all([
    prisma.blogPost.upsert({
      where: { id: 'blog-1' },
      update: {},
      create: {
        id: 'blog-1',
        title: 'The Science Behind Gold in Skincare',
        content: 'Gold has been used in skincare for centuries...',
        excerpt: 'Discover why gold is one of the most effective ingredients in modern skincare',
        author: 'Dr. Elena Rodriguez',
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
    prisma.blogPost.upsert({
      where: { id: 'blog-2' },
      update: {},
      create: {
        id: 'blog-2',
        title: 'Natural Ingredients for Healthy Skin',
        content: 'Nature provides us with the best ingredients...',
        excerpt: 'Learn about the benefits of natural ingredients in your skincare routine',
        author: 'Dr. Elena Rodriguez',
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Blog posts created:', blogPosts.length);

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.upsert({
      where: { id: 'order-1' },
      update: {},
      create: {
        id: 'order-1',
        userId: adminUser.id,
        status: 'CONFIRMED',
        total: 154.99,
        paymentMethod: 'Credit Card',
        shippingAddress: {
          street: '123 Beauty Lane',
          city: 'Zagreb',
          country: 'Croatia',
          postalCode: '10000',
        },
      },
    }),
  ]);

  console.log('✅ Orders created:', orders.length);

  // Create order items
  const orderItems = await Promise.all([
    prisma.orderItem.upsert({
      where: { id: 'item-1' },
      update: {},
      create: {
        id: 'item-1',
        orderId: orders[0].id,
        productId: products[0].id,
        quantity: 1,
        price: 89.99,
      },
    }),
    prisma.orderItem.upsert({
      where: { id: 'item-2' },
      update: {},
      create: {
        id: 'item-2',
        orderId: orders[0].id,
        productId: products[1].id,
        quantity: 1,
        price: 65.00,
      },
    }),
  ]);

  console.log('✅ Order items created:', orderItems.length);

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
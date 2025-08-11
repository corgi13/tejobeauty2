import 'dotenv/config';
import { Queue, Worker, QueueEvents, JobsOptions, Job } from 'bullmq';
import IORedis from 'ioredis';
import axios from 'axios';
import { MeiliSearch } from 'meilisearch';

// Enhanced Redis connection with better error handling
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
});

connection.on('connect', () => {
  console.log('✅ Redis connection established');
});

connection.on('error', (error) => {
  console.error('❌ Redis connection error:', error);
});

connection.on('close', () => {
  console.log('🔌 Redis connection closed');
});

// Enhanced queue creation with better error handling
function createQueue(name: string) {
  const queue = new Queue(name, { connection });
  const events = new QueueEvents(name, { connection });
  
  events.on('failed', ({ jobId, failedReason, prev }) => {
    console.error(`❌ [${name}] Job ${jobId} failed:`, failedReason);
    console.error(`Previous state: ${prev}`);
  });

  events.on('completed', ({ jobId, returnvalue }) => {
    console.log(`✅ [${name}] Job ${jobId} completed successfully`);
  });

  events.on('stalled', ({ jobId }) => {
    console.warn(`⚠️ [${name}] Job ${jobId} stalled`);
  });

  return queue;
}

export const queues = {
  email: createQueue('email'),
  feeds: createQueue('feeds'),
  searchReindex: createQueue('search-reindex'),
  lowStock: createQueue('inventory-low-stock'),
  loyalty: createQueue('loyalty-recalc'),
  images: createQueue('image-derivatives'),
  notifications: createQueue('notifications'),
  analytics: createQueue('analytics'),
};

const jobsDefault: JobsOptions = { 
  removeOnComplete: 100, 
  removeOnFail: 500,
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
};

// Enhanced search reindex worker with better error handling and logging
new Worker('search-reindex', async (job: Job) => {
  const { type = 'products', force = false } = job.data || {};
  const startTime = Date.now();
  
  console.log(`🔄 Starting search reindex for type: ${type}`);
  
  try {
    const client = new MeiliSearch({ 
      host: process.env.MEILI_URL!, 
      apiKey: process.env.MEILI_MASTER_KEY 
    });

    if (type === 'products') {
      console.log('📦 Reindexing products...');
      
      const { data: products } = await axios.get(
        `${process.env.API_BASE_URL}/api/v1/products?take=1000&include=variants,categories`,
        { timeout: 30000 }
      );
      
      const index = client.index('products');
      
      // Enhanced index settings
      await index.updateSettings({ 
        filterableAttributes: ['category', 'brand', 'price_range', 'in_stock', 'rating'],
        searchableAttributes: ['name', 'description', 'brand', 'category', 'tags'],
        sortableAttributes: ['price', 'created_at', 'rating', 'popularity'],
        rankingRules: [
          'words',
          'typo',
          'proximity',
          'attribute',
          'sort',
          'exactness'
        ],
      });

      const documents = products.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        brand: p.brand,
        category: p.category,
        tags: p.tags || [],
        rating: p.rating || 0,
        in_stock: p.in_stock || false,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));

      await index.addDocuments(documents);
      console.log(`✅ Indexed ${documents.length} products`);
    }

    if (type === 'blog') {
      console.log('📝 Reindexing blog posts...');
      
      const { data: posts } = await axios.get(
        `${process.env.API_BASE_URL}/api/v1/blog?take=1000`,
        { timeout: 30000 }
      );
      
      const index = client.index('blog');
      
      await index.updateSettings({ 
        searchableAttributes: ['title', 'excerpt', 'content', 'tags', 'author'],
        filterableAttributes: ['category', 'tags', 'author', 'published'],
        sortableAttributes: ['published_at', 'created_at', 'views'],
      });

      const documents = posts.map((b: any) => ({
        id: b.id,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        tags: b.tags || [],
        author: b.author,
        category: b.category,
        published: b.published,
        published_at: b.published_at,
        created_at: b.created_at,
        views: b.views || 0,
      }));

      await index.addDocuments(documents);
      console.log(`✅ Indexed ${documents.length} blog posts`);
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Search reindex completed for ${type} in ${duration}ms`);
    
    return { 
      ok: true, 
      type, 
      duration,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Search reindex failed for ${type}:`, error);
    throw error;
  }
}, { 
  connection,
  concurrency: 1, // Process one job at a time for search reindex
});

// Enhanced low stock worker
new Worker('inventory-low-stock', async (job: Job) => {
  try {
    console.log('📊 Checking low stock inventory...');
    
    // Get low stock products
    const { data: lowStockProducts } = await axios.get(
      `${process.env.API_BASE_URL}/api/v1/products?stock_below=10`,
      { timeout: 15000 }
    );

    if (lowStockProducts.length > 0) {
      console.log(`⚠️ Found ${lowStockProducts.length} products with low stock`);
      
      // Send notification to admins (stub)
      await queues.notifications.add('low-stock-alert', {
        products: lowStockProducts,
        threshold: 10,
      });
    }

    return { 
      ok: true, 
      lowStockCount: lowStockProducts.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Low stock check failed:', error);
    throw error;
  }
}, { connection });

// Enhanced loyalty recalculation worker
new Worker('loyalty-recalc', async (job: Job) => {
  const { userId } = job.data || {};
  
  if (!userId) {
    throw new Error('User ID is required for loyalty recalculation');
  }

  try {
    console.log(`💎 Recalculating loyalty for user: ${userId}`);
    
    const response = await axios.post(
      `${process.env.API_BASE_URL}/api/v1/users/${userId}/loyalty/recalc`,
      {},
      { timeout: 30000 }
    );

    console.log(`✅ Loyalty recalculation completed for user: ${userId}`);
    
    return { 
      ok: true, 
      userId,
      loyaltyData: response.data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Loyalty recalculation failed for user ${userId}:`, error);
    throw error;
  }
}, { connection });

// Enhanced feeds generation worker
new Worker('feeds', async (job: Job) => {
  const { type = 'gmc', format = 'xml' } = job.data || {};
  
  try {
    console.log(`📡 Generating ${format} feed for ${type}`);
    
    // Generate different types of feeds
    if (type === 'gmc') {
      // Google Merchant Center feed
      const { data: products } = await axios.get(
        `${process.env.API_BASE_URL}/api/v1/products?take=1000&include=variants`,
        { timeout: 30000 }
      );
      
      // Process products for GMC format
      const gmcFeed = products.map((p: any) => ({
        id: p.id,
        title: p.name,
        description: p.description,
        price: `${p.price} EUR`,
        availability: p.in_stock ? 'in stock' : 'out of stock',
        condition: 'new',
        brand: p.brand,
        gtin: p.gtin,
        mpn: p.mpn,
      }));

      // Save or send feed (stub)
      console.log(`✅ Generated GMC feed with ${gmcFeed.length} products`);
    }

    if (type === 'facebook') {
      // Facebook Catalog feed
      console.log('✅ Generated Facebook catalog feed');
    }

    return { 
      ok: true, 
      type, 
      format,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Feed generation failed for ${type}:`, error);
    throw error;
  }
}, { connection });

// Enhanced image derivatives worker
new Worker('image-derivatives', async (job: Job) => {
  const { imageId, sizes = ['thumbnail', 'medium', 'large'] } = job.data || {};
  
  try {
    console.log(`🖼️ Processing image derivatives for: ${imageId}`);
    
    // Process different image sizes (stub)
    for (const size of sizes) {
      console.log(`Processing ${size} size for image ${imageId}`);
      // Image processing logic would go here
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing
    }

    console.log(`✅ Image derivatives completed for: ${imageId}`);
    
    return { 
      ok: true, 
      imageId,
      sizes,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Image processing failed for ${imageId}:`, error);
    throw error;
  }
}, { connection });

// New notification worker
new Worker('notifications', async (job: Job) => {
  const { type, data } = job.data || {};
  
  try {
    console.log(`🔔 Processing notification: ${type}`);
    
    switch (type) {
      case 'low-stock-alert':
        // Send email to admins
        console.log('📧 Sending low stock alert email');
        break;
      case 'order-confirmation':
        // Send order confirmation
        console.log('📧 Sending order confirmation');
        break;
      default:
        console.log(`📧 Sending ${type} notification`);
    }

    return { 
      ok: true, 
      type,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Notification failed for ${type}:`, error);
    throw error;
  }
}, { connection });

// New analytics worker
new Worker('analytics', async (job: Job) => {
  const { event, data } = job.data || {};
  
  try {
    console.log(`📊 Processing analytics event: ${event}`);
    
    // Process analytics events (stub)
    // This could include tracking page views, conversions, etc.
    
    return { 
      ok: true, 
      event,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Analytics processing failed for ${event}:`, error);
    throw error;
  }
}, { connection });

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  
  // Close all queues
  await Promise.all(Object.values(queues).map(queue => queue.close()));
  
  // Close Redis connection
  await connection.quit();
  
  console.log('✅ Worker shutdown completed');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  
  // Close all queues
  await Promise.all(Object.values(queues).map(queue => queue.close()));
  
  // Close Redis connection
  await connection.quit();
  
  console.log('✅ Worker shutdown completed');
  process.exit(0);
});

console.log('🚀 Tejo Worker started successfully!');
console.log('📋 Available queues:', Object.keys(queues));
console.log('🔗 Redis URL:', process.env.REDIS_URL || 'redis://localhost:6379');
console.log('🔍 MeiliSearch URL:', process.env.MEILI_URL || 'http://localhost:7700');
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');



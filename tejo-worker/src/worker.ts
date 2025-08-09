import 'dotenv/config';
import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';
import axios from 'axios';
import { MeiliSearch } from 'meilisearch';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

function createQueue(name: string) {
  const queue = new Queue(name, { connection });
  const events = new QueueEvents(name, { connection });
  events.on('failed', ({ jobId, failedReason }) => console.error(`[${name}] job ${jobId} failed:`, failedReason));
  return queue;
}

export const queues = {
  email: createQueue('email'),
  feeds: createQueue('feeds'),
  searchReindex: createQueue('search-reindex'),
  lowStock: createQueue('inventory-low-stock'),
  loyalty: createQueue('loyalty-recalc'),
  images: createQueue('image-derivatives'),
};

const jobsDefault: JobsOptions = { removeOnComplete: 100, removeOnFail: 500 };

// Search reindex worker
new Worker('search-reindex', async (job) => {
  const type = job.data?.type || 'products';
  const client = new MeiliSearch({ host: process.env.MEILI_URL!, apiKey: process.env.MEILI_MASTER_KEY });
  if (type === 'products') {
    const { data } = await axios.get(`${process.env.API_BASE_URL}/products?take=1000`);
    const index = client.index('products');
    await index.updateSettings({ filterableAttributes: ['category', 'brand'], searchableAttributes: ['name', 'description'] });
    await index.addDocuments(data.map((p: any) => ({ id: p.id, slug: p.slug, name: p.name, description: p.description, price: p.price, brand: p.brand, category: p.category })));
  }
  if (type === 'blog') {
    const { data } = await axios.get(`${process.env.API_BASE_URL}/blog?take=1000`);
    const index = client.index('blog');
    await index.updateSettings({ searchableAttributes: ['title', 'excerpt'] });
    await index.addDocuments(data.map((b: any) => ({ id: b.id, title: b.title, excerpt: b.excerpt, tags: b.tags })));
  }
  return { ok: true };
}, { connection });

// Low stock
new Worker('inventory-low-stock', async () => {
  // stub: would email admins
  return { ok: true };
}, { connection });

// Loyalty recalculation
new Worker('loyalty-recalc', async (job) => {
  const userId = job.data?.userId as string;
  if (!userId) return;
  await axios.post(`${process.env.API_BASE_URL}/users/${userId}/loyalty/recalc`).catch(() => undefined);
}, { connection });

// Feeds generation
new Worker('feeds', async (job) => {
  const type = job.data?.type || 'gmc';
  console.log('Generating feed', type);
  return { ok: true };
}, { connection });

// Image derivatives
new Worker('image-derivatives', async () => ({ ok: true }), { connection });

console.log('Worker started. Queues:', Object.keys(queues));



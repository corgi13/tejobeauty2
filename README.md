# Tejo-Beauty E-commerce System

A complete, production-ready e-commerce platform for natural beauty and wellness products, built with modern technologies and designed for scalability.

## 🏗️ Architecture

The system consists of four separate repositories:

- **`tejo-web`** - Next.js 15 frontend with App Router
- **`tejo-api`** - NestJS 11 backend API
- **`tejo-worker`** - BullMQ background job processor
- **`tejo-infra`** - Infrastructure scripts and configuration

## 🚀 Features

### Frontend (tejo-web)
- **Next.js 15** with App Router and React 18.2.0
- **TypeScript 5.9+** for type safety
- **Tailwind CSS** with custom design system
- **Internationalization** with `next-intl` (hr, en, de, pt, es, it)
- **State Management** with Zustand (cart, wishlist, recently viewed)
- **Form Handling** with React Hook Form
- **Data Fetching** with React Query/SWR
- **PWA** capabilities
- **SEO Optimized** with dynamic metadata and structured data

### Backend (tejo-api)
- **NestJS 11** with Express v5
- **Prisma 6** with PostgreSQL 16/17
- **JWT Authentication** with httpOnly cookies
- **File Uploads** with Multer and Cloudinary
- **Payment Processing** with Stripe and Mollie
- **API Documentation** with Swagger
- **Rate Limiting** and CORS protection
- **Global Exception Handling**

### Worker (tejo-worker)
- **BullMQ** for background job processing
- **Redis** for job queue management
- **Email Processing** (stubbed)
- **Search Reindexing** for Meilisearch
- **Inventory Management**
- **Loyalty Calculations**

### Infrastructure (tejo-infra)
- **Hetzner Dedicated Server** setup
- **Ubuntu 22.04** configuration
- **Nginx** reverse proxy with HTTP/2
- **Certbot** for TLS certificates
- **Systemd** service management
- **Docker** development environment
- **Backup and Restore** scripts

## 🎨 Design System

### Brand Colors
- **Gold** (#D4AF37) - Primary brand color
- **Cream** (#F5F5DC) - Secondary color
- **Blush** (#FFB6C1) - Accent color
- **Onyx** (#1A1A1A) - Text color

### Typography
- **Playfair Display** - Headings
- **Montserrat** - Body text

### UI Components
- **21st.dev** inspired components
- **Aceternity UI** moving borders and effects
- **Modern animations** and micro-interactions
- **Responsive design** for all devices

## 🛍️ E-commerce Features

### Product Management
- **Product Catalog** with categories and filters
- **Product Detail Pages** with image galleries
- **Inventory Management** with stock tracking
- **B2B Pricing** for customer groups
- **Product Reviews** with moderation

### Shopping Experience
- **Shopping Cart** with persistent storage
- **Wishlist** functionality
- **Recently Viewed** products
- **Search** with typeahead and faceting
- **Coupons and Promotions**
- **Free Shipping** thresholds

### Checkout Process
- **Multi-step Checkout** with progress indicators
- **Payment Methods** (Stripe, Mollie)
- **Order Management** with status tracking
- **Email Notifications** (stubbed)
- **Order History** for customers

### Admin Panel
- **Product CRUD** operations
- **Blog Management**
- **Order Management**
- **Review Moderation**
- **Image Upload** with Cloudinary
- **Analytics Dashboard** (planned)

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 16+
- Redis
- Docker (optional)

### Quick Start

1. **Clone all repositories:**
```bash
git clone <tejo-web-repo>
git clone <tejo-api-repo>
git clone <tejo-worker-repo>
git clone <tejo-infra-repo>
```

2. **Setup Database:**
```bash
cd tejo-api
npm install
npx prisma migrate dev
npx prisma db seed
```

3. **Start API:**
```bash
cd tejo-api
npm run start:dev
```

4. **Start Worker:**
```bash
cd tejo-worker
npm install
npm run dev
```

5. **Start Frontend:**
```bash
cd tejo-web
npm install
npm run dev
```

### Environment Variables

#### tejo-web/.env
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### tejo-api/.env
```env
DATABASE_URL="postgresql://user:password@localhost:5432/tejo_beauty"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-jwt-secret"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
REVALIDATE_SECRET="your-revalidate-secret"
```

## 🚀 Production Deployment

### Server Setup
1. **Provision Hetzner dedicated server** (Ubuntu 22.04)
2. **Run bootstrap script:**
```bash
bash /opt/tejo-infra/scripts/bootstrap_server.sh
```

### Manual Deployment
1. **Build applications:**
```bash
cd tejo-web && npm run build
cd tejo-api && npm run build
cd tejo-worker && npm run build
```

2. **Setup systemd services**
3. **Configure Nginx**
4. **Setup SSL with Certbot**
5. **Configure backups**

## 📊 Performance & SEO

### Performance Optimizations
- **Next.js Image Optimization**
- **Code Splitting** and lazy loading
- **Static Generation** with ISR
- **CDN Integration** with Cloudinary
- **Database Indexing** with Prisma

### SEO Features
- **Dynamic Metadata** generation
- **Structured Data** (JSON-LD)
- **Sitemaps** per locale
- **Robots.txt** configuration
- **Hreflang** tags
- **Open Graph** and Twitter cards

### Search Integration
- **Meilisearch** for faceted search
- **Typeahead** suggestions
- **Synonyms** and typo tolerance
- **Real-time indexing**

## 🔒 Security

### Authentication & Authorization
- **JWT tokens** with refresh mechanism
- **HttpOnly cookies** for security
- **Role-based access** control
- **Admin panel** protection

### Data Protection
- **Input validation** with class-validator
- **SQL injection** prevention with Prisma
- **XSS protection** with proper escaping
- **CSRF protection** with tokens

### Payment Security
- **PCI compliance** with Stripe
- **Webhook verification** for idempotency
- **Secure payment** processing

## 📈 Monitoring & Analytics

### Application Monitoring
- **Error tracking** and logging
- **Performance monitoring**
- **Uptime monitoring**
- **Database monitoring**

### Business Analytics
- **Order tracking**
- **Revenue analytics**
- **Customer behavior** analysis
- **Inventory reports**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the relevant repository
- Contact the development team
- Check the documentation in each repository

## 🎯 Roadmap

### Phase 2 Features
- **Advanced Analytics** dashboard
- **Email Marketing** integration
- **Loyalty Program** implementation
- **Mobile App** development
- **Multi-warehouse** support
- **Advanced Shipping** options

### Phase 3 Features
- **AI-powered** product recommendations
- **Chat Support** integration
- **Advanced Reporting** tools
- **API for Third-party** integrations
- **White-label** solutions

---

**Tejo-Beauty** - Natural beauty, naturally delivered. ✨

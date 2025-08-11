# Tejo-Beauty - Modern Beauty E-commerce Platform

A comprehensive, modern beauty and skincare e-commerce platform built with the latest web technologies as of August 2025.

## 🚀 Features

### Core Functionality
- **Multi-language Support**: Internationalization (i18n) with Croatian, English, German, Portuguese, Spanish, and Italian
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI Components**: Built with Radix UI for accessibility and customization
- **Type Safety**: Full TypeScript implementation

### Admin Panel
- **Dashboard**: Real-time statistics, revenue tracking, and order overview
- **Product Management**: Full CRUD operations with image uploads and inventory tracking
- **Order Management**: Order status updates, customer information, and shipping details
- **Blog Management**: Content creation, publishing, and preview functionality
- **User Management**: Customer accounts and admin user management

### E-commerce Features
- **Product Catalog**: Categorized products with search and filtering
- **Shopping Cart**: Persistent cart with local storage
- **Order Processing**: Complete order workflow from cart to delivery
- **Payment Integration**: Stripe payment processing (ready for integration)
- **Inventory Management**: Real-time stock tracking and alerts

### Technical Features
- **Database**: PostgreSQL with Prisma ORM
- **API Routes**: RESTful API endpoints for all functionality
- **Form Handling**: Custom form hooks with validation
- **State Management**: React hooks for local and global state
- **Performance**: Next.js 15 with App Router and optimizations

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.4.6** - React framework with App Router
- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.9.0** - Type-safe development
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Radix UI** - Accessible UI components

### Backend & Database
- **Prisma 5.22.0** - Next-generation ORM
- **PostgreSQL** - Reliable relational database
- **Next.js API Routes** - Serverless API endpoints

### Development Tools
- **ESLint 9.9.0** - Code linting and quality
- **PostCSS 8.4.41** - CSS processing
- **next-intl 4.3.4** - Internationalization

### Utilities & Libraries
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional CSS classes
- **lucide-react** - Beautiful icons
- **Custom Hooks** - Reusable React logic

## 📁 Project Structure

```
tejo-web/
├── app/                          # Next.js App Router
│   ├── [locale]/                # Internationalized routes
│   │   ├── (admin)/            # Admin panel routes
│   │   │   └── admin/          # Admin pages
│   │   │       ├── page.tsx    # Dashboard
│   │   │       ├── products/   # Product management
│   │   │       ├── orders/     # Order management
│   │   │       └── blog/       # Blog management
│   │   └── layout.tsx          # Root layout
│   ├── api/                     # API routes
│   │   └── admin/              # Admin API endpoints
│   └── globals.css             # Global styles
├── src/
│   ├── components/              # Reusable components
│   │   ├── ui/                 # Base UI components
│   │   └── admin/              # Admin-specific components
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   └── messages/                # i18n translation files
├── prisma/                      # Database schema and migrations
├── public/                      # Static assets
└── package.json                 # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tejo-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   - Database connection string
   - API keys for external services
   - Application URLs

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed database with sample data
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Admin Access
- **URL**: `/admin`
- **Default Admin**: `admin@tejo-beauty.com`
- **Password**: Set during database seeding

## 📊 Available Scripts

```json
{
  "dev": "Start development server",
  "build": "Build for production",
  "start": "Start production server",
  "lint": "Run ESLint",
  "db:generate": "Generate Prisma client",
  "db:push": "Push schema to database",
  "db:studio": "Open Prisma Studio",
  "db:migrate": "Run database migrations",
  "db:seed": "Seed database with sample data"
}
```

## 🌍 Internationalization

The application supports multiple languages:
- **Croatian (hr)** - Default locale
- **English (en)** - International
- **German (de)** - European market
- **Portuguese (pt)** - Lusophone market
- **Spanish (es)** - Hispanic market
- **Italian (it)** - Mediterranean market

Translation files are located in `src/messages/` and automatically loaded based on the current locale.

## 🗄️ Database Schema

### Core Models
- **User**: Customer accounts and admin users
- **Product**: Product catalog with inventory
- **BlogPost**: Content management system
- **Order**: Customer orders and status tracking
- **OrderItem**: Individual items within orders

### Key Features
- **Relationships**: Proper foreign key relationships
- **Indexing**: Optimized database queries
- **Validation**: Data integrity constraints
- **Audit Trail**: Created/updated timestamps

## 🎨 Design System

### Color Palette
- **Primary**: Onyx (#1a1a1a) - Main brand color
- **Secondary**: Gold (#d4af37) - Accent color
- **Neutral**: Cream (#f5f5dc) - Background tones
- **Success**: Sage (#9ca3af) - Positive actions
- **Warning**: Rose (#e11d48) - Alerts and errors

### Typography
- **Headings**: Modern sans-serif fonts
- **Body**: Readable text with proper line heights
- **Responsive**: Scalable font sizes across devices

### Components
- **Buttons**: Multiple variants and sizes
- **Forms**: Accessible input components
- **Cards**: Content containers with shadows
- **Tables**: Data display with sorting
- **Dialogs**: Modal interactions

## 🔒 Security Features

- **Input Validation**: Server-side and client-side validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **XSS Prevention**: Content Security Policy headers
- **CSRF Protection**: Built-in Next.js protection
- **Environment Variables**: Secure configuration management

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Tailwind CSS responsive utilities
- **Touch Friendly**: Proper touch targets and gestures
- **Performance**: Optimized images and lazy loading

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

## 📈 Performance

- **Next.js 15**: Latest performance optimizations
- **Image Optimization**: Automatic image compression
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Built-in caching strategies
- **Bundle Analysis**: Webpack bundle analyzer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality rules
- **Prettier**: Code formatting
- **Conventional Commits**: Git commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔄 Updates

### Latest Updates (August 2025)
- ✅ Upgraded to Next.js 15.4.6
- ✅ Upgraded to React 19.1.1
- ✅ Upgraded to TypeScript 5.9.0
- ✅ Upgraded to Tailwind CSS 4.1.11
- ✅ Upgraded to Prisma 5.22.0
- ✅ Added comprehensive admin panel
- ✅ Implemented internationalization
- ✅ Added database schema and API routes
- ✅ Created reusable UI components
- ✅ Added form handling and validation
- ✅ Implemented responsive design system

## 📞 Support

For support and questions:
- **Email**: support@tejo-beauty.com
- **Documentation**: [docs.tejo-beauty.com](https://docs.tejo-beauty.com)
- **Issues**: GitHub Issues page

---

**Built with ❤️ using the latest web technologies**
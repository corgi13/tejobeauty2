# Tejo Beauty - Premium Skincare Application

A modern, full-stack skincare e-commerce application built with Next.js 15, TypeScript, and the latest web technologies.

## 🚀 Features

- **Multi-language Support**: English, Croatian, Italian, German, Portuguese, Spanish
- **Admin Panel**: Complete CRUD operations for products, blog posts, and orders
- **Modern UI/UX**: Built with Tailwind CSS 4 and Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Image Management**: Cloudinary integration for product images
- **Responsive Design**: Mobile-first approach with modern animations
- **SEO Optimized**: Built-in SEO features and meta tags
- **Performance**: Next.js 15 with App Router and optimizations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, CSS Modules
- **UI Components**: Radix UI, Framer Motion
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js
- **Image Storage**: Cloudinary
- **State Management**: Zustand, SWR
- **Forms**: React Hook Form, Zod validation
- **Internationalization**: next-intl
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tejo-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run analyze` - Analyze bundle size
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Prisma Studio
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## 🌍 Internationalization

The application supports multiple languages:
- Croatian (hr)
- English (en) - Default
- German (de)
- Italian (it)
- Portuguese (pt)
- Spanish (es)

Language files are located in `src/messages/` directory.

## 🗄️ Database Schema

The application includes the following models:
- **User**: Authentication and user management
- **Product**: Product catalog with categories
- **BlogPost**: Blog content management
- **Order**: Order management and tracking
- **OrderItem**: Individual order items

## 🔐 Admin Access

Admin panel is accessible at `/admin` with the following demo credentials:
- Email: `admin@tejo-beauty.com`
- Password: Check the seed script for the current password

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices
- Tablets
- Desktop computers
- High-resolution displays

## 🎨 Design System

Built with a comprehensive design system including:
- Custom color palette (Onyx, Gold, Cream, Sage, Rose)
- Typography scale
- Spacing system
- Animation library
- Component library

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized for all metrics
- **Bundle Size**: Optimized with tree shaking and code splitting
- **Image Optimization**: Next.js Image component with WebP/AVIF support

## 🔒 Security

- **XSS Protection**: Built-in Next.js security features
- **CSRF Protection**: Form validation and CSRF tokens
- **SQL Injection**: Prisma ORM with parameterized queries
- **Authentication**: Secure session management
- **Environment Variables**: Secure configuration management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

This application is regularly updated with:
- Latest Next.js features
- Security patches
- Performance improvements
- New UI components
- Enhanced functionality

---

**Built with ❤️ using the latest web technologies**

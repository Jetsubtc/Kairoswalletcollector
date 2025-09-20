# HyperWalletCollector - Kairos Prediction Game

A modern wallet collection application for the Kairos Prediction Game, built with Astro and PostgreSQL.

## 🚀 Features

- **Wallet Collection**: Secure submission of Twitter handles and EVM wallet addresses
- **Admin Dashboard**: Protected admin panel to view all submissions with CSV export
- **Database Storage**: PostgreSQL database with proper validation and duplicate prevention
- **Responsive Design**: Beautiful retro arcade theme with animations
- **Serverless Ready**: Optimized for Vercel deployment with serverless functions

## 🛠️ Tech Stack

- **Frontend**: Astro framework with custom CSS animations
- **Backend**: Express.js server with PostgreSQL
- **Database**: PostgreSQL with connection pooling
- **Deployment**: Vercel (recommended) or GitHub Pages

## 📋 Prerequisites

1. Node.js 18+ 
2. PostgreSQL database (local or cloud)
3. Git repository (for deployment)

## 🔧 Local Development

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd hyperwalletcollector
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**
   ```bash
   npm run db:init
   npm run db:test
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables:
     - `DATABASE_URL` - Your PostgreSQL connection string
     - `ADMIN_USERNAME` - Admin username (default: admin)
     - `ADMIN_PASSWORD` - Admin password (default: admin123)

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-project.vercel.app`

### Database Providers

Recommended PostgreSQL providers:
- **Supabase** (Free tier available)
- **Render** (Free tier available)
- **ElephantSQL** (Free tier available)
- **Neon** (Free tier available)

## 🔐 Admin Access

- **URL**: `https://your-domain.com/admin`
- **Default Credentials**: 
  - Username: `admin`
  - Password: `admin123`
- **Features**:
  - View all wallet submissions
  - Export data as CSV
  - Real-time statistics

## 📊 API Endpoints

- `GET /api/wallets` - Get all wallet submissions
- `POST /api/wallets` - Submit a new wallet
- `GET /api/admin/wallets` - Admin endpoint (requires authentication)

## 🗄️ Database Schema

```sql
CREATE TABLE wallets (
  id SERIAL PRIMARY KEY,
  twitter_handle VARCHAR(100) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(twitter_handle, wallet_address)
);
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `ADMIN_USERNAME` | Admin username | `admin` |
| `ADMIN_PASSWORD` | Admin password | `admin123` |
| `NODE_ENV` | Environment | `development` |

### Build Commands

```bash
npm run build    # Build for production
npm run preview  # Preview production build
npm run dev      # Start development server
npm start        # Start production server
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify `DATABASE_URL` is correct
   - Check database accessibility from your deployment platform
   - Ensure SSL settings match your database provider

2. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check Node.js version (18+ required)

3. **API Routes Not Working**
   - Verify Vercel configuration in `vercel.json`
   - Check function runtime settings

### Support

For issues and questions:
1. Check the [DATABASE_SETUP.md](DATABASE_SETUP.md) guide
2. Review Vercel deployment logs
3. Test locally with `npm run dev`

## 📝 License

This project is part of the Kairos Prediction Game ecosystem.

---

**Latest Update**: Fixed Vercel deployment configuration and added comprehensive documentation.
# Database Setup Guide

This guide will help you set up PostgreSQL database for the HyperWallet Collector application.

## Prerequisites

1. PostgreSQL database (local or cloud-based)
2. Database credentials (host, port, username, password, database name)

## Database Providers

You can use any of these PostgreSQL providers:

1. **Local PostgreSQL** - Install PostgreSQL on your machine
2. **Supabase** - https://supabase.com/
3. **Render** - https://render.com/
4. **ElephantSQL** - https://www.elephantsql.com/
5. **Heroku Postgres** - https://www.heroku.com/postgres

## Admin Credentials

The admin dashboard requires authentication with username and password. These can be configured using environment variables:

- `ADMIN_USERNAME` - Admin username (default: admin)
- `ADMIN_PASSWORD` - Admin password (default: admin123)

For production deployments, you should set strong credentials using these environment variables.

## Setup Instructions

### 1. Configure Environment Variables

Copy the [.env.example](file:///Users/sithu/Downloads/HyperWalletCollector%202/.env.example) file to create a [.env](file:///Users/sithu/Downloads/HyperWalletCollector%202/.env) file:

```bash
cp .env.example .env
```

Edit the [.env](file:///Users/sithu/Downloads/HyperWalletCollector%202/.env) file and update the `DATABASE_URL` with your database credentials:

```env
# For local PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# For Supabase
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# For Render
DATABASE_URL=postgresql://user:password@host:port/database
```

### 2. Initialize the Database

Run the database initialization script to create the required tables:

```bash
npm run db:init
```

This will:
- Test the database connection
- Create the `wallets` table if it doesn't exist

### 3. Test the Database

Run the database test script to verify everything is working:

```bash
npm run db:test
```

This will:
- Insert a test wallet record
- Retrieve the wallet count
- Fetch all wallets

## Database Schema

The application uses a single table called `wallets` with the following schema:

```sql
CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  twitter_handle VARCHAR(100) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(twitter_handle, wallet_address)
);
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
# Build the application
npm run build

# Start the server
npm start
```

## Deployment

### Vercel Deployment

When deploying to Vercel:

1. Set the `DATABASE_URL` environment variable in your Vercel project settings
2. Set the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables for admin access
3. Connect your GitHub repository to Vercel
4. Vercel will automatically detect and deploy your application

### Other Platforms (Render, etc.)

When deploying to platforms like Render or similar:

1. Set the `DATABASE_URL` environment variable in your deployment platform
2. Set the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables for admin access
3. The database will be automatically initialized on first request
4. Ensure your deployment platform supports Node.js applications

## Troubleshooting

### Connection Issues

If you're having trouble connecting to the database:

1. Verify your `DATABASE_URL` is correct
2. Ensure your database is accessible from your application environment
3. Check that your database credentials are correct
4. For cloud providers, ensure your IP is whitelisted if required

### Table Creation Issues

If the wallets table isn't being created:

1. Run `npm run db:init` manually
2. Check the console output for error messages
3. Verify your database user has CREATE TABLE permissions
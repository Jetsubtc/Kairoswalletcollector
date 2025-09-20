# Kairoswalletcollector

This is a wallet collector application built with Astro.

## Deployment

This application is deployed to GitHub Pages using the `deploy.sh` script.

Latest deployment: Fri Sep 19 2025 22:15:00 GMT+0000

## Features

- Collects wallet addresses and stores them in a PostgreSQL database
- Retro arcade styling
- Animated loading screen
- Form submission via API endpoints

## Database Setup

This application now uses a PostgreSQL database to store wallet submissions. See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed instructions.

## Deployment

### Vercel Deployment

This application is configured to work with Vercel. To deploy:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Set the required environment variables in Vercel project settings:
   - `DATABASE_URL` - Your PostgreSQL database connection string
   - `ADMIN_USERNAME` - Admin username for the dashboard
   - `ADMIN_PASSWORD` - Admin password for the dashboard

### GitHub Pages Deployment

To deploy to GitHub Pages:

1. Run the [deploy.sh](file:///Users/sithu/Downloads/HyperWalletCollector%202/deploy.sh) script
2. Ensure your database is accessible from GitHub Pages (you may need a different approach for the admin dashboard)

## Testing

To test the database functionality, run `npm run db:test`

## Note

If you're seeing this file instead of the application, please check that GitHub Pages is properly configured to serve from the `gh-pages` branch.
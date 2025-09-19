# Deployment Guide

This guide explains how to deploy the HyperWallet Collector application as a static site to GitHub Pages or Vercel.

## Prerequisites

1. A GitHub account (for GitHub Pages deployment)
2. A Vercel account (for Vercel deployment)

## Deployment Options

### GitHub Pages Deployment

#### Automatic Deployment with deploy.sh Script

The project includes a [deploy.sh](file:///Users/sithu/Downloads/HyperWalletCollector%202/deploy.sh) script that automates the deployment process:

1. Make sure the script is executable:
   ```bash
   chmod +x deploy.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

This script will:
- Install dependencies
- Build the static site
- Deploy to the `gh-pages` branch

#### Manual GitHub Pages Deployment

1. Build the static site:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist/` directory

3. Push the contents of `dist/` to your `gh-pages` branch

#### GitHub Pages Configuration

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the sidebar
3. Under "Build and deployment", select "Deploy from a branch"
4. Select "gh-pages" as the branch
5. Set the folder to "/ (root)"
6. Click "Save"

### Vercel Deployment

#### Deploy from GitHub

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### Deploy using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## Vercel Configuration

The project includes a [vercel.json](file:///Users/sithu/Downloads/HyperWalletCollector%202/vercel.json) file with the correct configuration for static site deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

## Troubleshooting

### 404 Errors

If you're seeing 404 errors after deployment:

#### For GitHub Pages:
1. Verify that the `gh-pages` branch contains the built files
2. Check that GitHub Pages is configured to serve from the `gh-pages` branch
3. Ensure the `.nojekyll` file is present in the `gh-pages` branch
4. Wait a few minutes for GitHub to process the deployment

#### For Vercel:
1. Check the deployment logs in your Vercel dashboard
2. Verify that the build completed successfully
3. Ensure the Output Directory is set to `dist`
4. Check that the [vercel.json](file:///Users/sithu/Downloads/HyperWalletCollector%202/vercel.json) file is correctly configured

### Form Submission Issues

The form uses Formspree for static form handling. If submissions aren't working:

1. Verify that the form action URL is correct
2. Check that you've created a form on Formspree and replaced `YOUR_FORM_ID` with your actual form ID
3. Make sure the form includes the correct method (`POST`)

## Monitoring

After deployment, you can monitor your application through:
1. GitHub Pages status (for GitHub Pages deployments)
2. Vercel's dashboard (for Vercel deployments)
3. Formspree dashboard (for form submissions)
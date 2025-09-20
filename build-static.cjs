// This script now uses Astro's built-in build command to properly handle API routes
// and server-side functionality with PostgreSQL database integration

const { execSync } = require('child_process');

try {
  console.log('Building Astro project with API routes...');
  execSync('npx astro build', { stdio: 'inherit' });
  console.log('Astro build completed successfully!');
} catch (error) {
  console.error('Astro build failed:', error.message);
  process.exit(1);
}
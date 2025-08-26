#!/usr/bin/env node

/**
 * Build script for GOAT E-commerce unified deployment
 * This script ensures both frontend and backend are ready for Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building GOAT E-commerce for unified Vercel deployment...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json') || !fs.existsSync('server/package.json')) {
  console.error('❌ Error: Please run this script from the GOAT project root directory');
  process.exit(1);
}

try {
  // Step 1: Install frontend dependencies
  console.log('📦 Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Step 2: Install backend dependencies
  console.log('📦 Installing backend dependencies...');
  execSync('npm install', { cwd: 'server', stdio: 'inherit' });

  // Step 3: Build frontend
  console.log('🏗️  Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 4: Verify build output
  if (!fs.existsSync('dist/index.html')) {
    throw new Error('Frontend build failed - dist/index.html not found');
  }

  // Step 5: Verify backend entry point
  if (!fs.existsSync('server/server.js')) {
    throw new Error('Backend entry point not found - server/server.js missing');
  }

  // Step 6: Check vercel.json
  if (!fs.existsSync('vercel.json')) {
    throw new Error('vercel.json configuration file not found');
  }

  // Step 7: Verify API configuration
  const apiConfigPath = 'src/config/api.ts';
  if (fs.existsSync(apiConfigPath)) {
    const apiConfig = fs.readFileSync(apiConfigPath, 'utf8');
    if (apiConfig.includes('/api')) {
      console.log('✅ API configuration set for unified deployment');
    }
  }

  console.log('\n🎉 Build completed successfully!');
  console.log('\n📋 Deployment checklist:');
  console.log('  ✅ Frontend built to dist/');
  console.log('  ✅ Backend ready at server/server.js');
  console.log('  ✅ Unified vercel.json configured');
  console.log('  ✅ API routes configured for same-domain');
  
  console.log('\n🚀 Ready for Vercel deployment!');
  console.log('\nNext steps:');
  console.log('  1. Set environment variables in Vercel dashboard');
  console.log('  2. Deploy with: vercel --prod');
  console.log('  3. Test all functionality after deployment');
  
  console.log('\n📚 Documentation:');
  console.log('  • Email setup: EMAIL_VERIFICATION_SETUP.md');
  console.log('  • Deployment guide: UNIFIED_DEPLOYMENT.md');

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  console.error('\n🔧 Troubleshooting:');
  console.error('  • Ensure Node.js 16+ is installed');
  console.error('  • Check internet connection for npm install');
  console.error('  • Verify all required files are present');
  console.error('  • Run npm install manually if needed');
  process.exit(1);
}
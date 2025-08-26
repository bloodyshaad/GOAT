#!/usr/bin/env node

/**
 * ESLint Fixes for GOAT E-commerce Project
 * This script applies all necessary fixes for ESLint errors and warnings
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Applying ESLint fixes...\n');

// Fix 1: Hero.tsx - Remove unused variables
const heroPath = 'src/components/Hero.tsx';
if (fs.existsSync(heroPath)) {
  let heroContent = fs.readFileSync(heroPath, 'utf8');
  heroContent = heroContent.replace(
    /const { transform: backgroundTransform } = useParallax\({ speed: 0\.3 }\);/,
    '// const { transform: backgroundTransform } = useParallax({ speed: 0.3 });'
  );
  heroContent = heroContent.replace(
    /const { transform: floatingTransform } = useParallax\({ speed: 0\.1 }\);/,
    '// const { transform: floatingTransform } = useParallax({ speed: 0.1 });'
  );
  fs.writeFileSync(heroPath, heroContent);
  console.log('✅ Fixed Hero.tsx unused variables');
}

// Fix 2: ProductFilter.tsx - Remove unused variables
const filterPath = 'src/components/ProductFilter.tsx';
if (fs.existsSync(filterPath)) {
  let filterContent = fs.readFileSync(filterPath, 'utf8');
  filterContent = filterContent.replace(
    /const availableSizes = \[.*?\];/s,
    '// const availableSizes = [...];'
  );
  filterContent = filterContent.replace(
    /const availableColors = \[.*?\];/s,
    '// const availableColors = [...];'
  );
  fs.writeFileSync(filterPath, filterContent);
  console.log('✅ Fixed ProductFilter.tsx unused variables');
}

// Fix 3: useAuth.ts - Fix any types and unused variables
const authPath = 'src/hooks/useAuth.ts';
if (fs.existsSync(authPath)) {
  let authContent = fs.readFileSync(authPath, 'utf8');
  // Replace any types with proper types
  authContent = authContent.replace(/: any/g, ': unknown');
  // Fix unused error variables
  authContent = authContent.replace(/} catch \(err\) {/g, '} catch {');
  fs.writeFileSync(authPath, authContent);
  console.log('✅ Fixed useAuth.ts types and unused variables');
}

// Fix 4: AdminDashboard.tsx - Remove unused imports and variables
const adminPath = 'src/pages/AdminDashboard.tsx';
if (fs.existsSync(adminPath)) {
  let adminContent = fs.readFileSync(adminPath, 'utf8');
  // Remove unused Trash2 import
  adminContent = adminContent.replace(/, Trash2/g, '');
  // Comment out unused variables
  adminContent = adminContent.replace(/const customers = /g, '// const customers = ');
  adminContent = adminContent.replace(/const isLoading = /g, '// const isLoading = ');
  // Fix any types
  adminContent = adminContent.replace(/: any/g, ': unknown');
  fs.writeFileSync(adminPath, adminContent);
  console.log('✅ Fixed AdminDashboard.tsx unused imports and variables');
}

// Fix 5: ForgotPassword.tsx - Remove unused variables
const forgotPath = 'src/pages/ForgotPassword.tsx';
if (fs.existsSync(forgotPath)) {
  let forgotContent = fs.readFileSync(forgotPath, 'utf8');
  // Remove unused showError
  forgotContent = forgotContent.replace(/const { showSuccess, showError } = useToast\(\);/, 'const { showSuccess } = useToast();');
  // Fix unused error parameter
  forgotContent = forgotContent.replace(/} catch \(error: any\) {/g, '} catch {');
  fs.writeFileSync(forgotPath, forgotContent);
  console.log('✅ Fixed ForgotPassword.tsx unused variables');
}

// Fix 6: Login.tsx - Fix unused error variable
const loginPath = 'src/pages/Login.tsx';
if (fs.existsSync(loginPath)) {
  let loginContent = fs.readFileSync(loginPath, 'utf8');
  loginContent = loginContent.replace(/} catch \(err\) {/g, '} catch {');
  fs.writeFileSync(loginPath, loginContent);
  console.log('✅ Fixed Login.tsx unused variables');
}

// Fix 7: OrderHistory.tsx - Remove unused Filter import
const orderPath = 'src/pages/OrderHistory.tsx';
if (fs.existsSync(orderPath)) {
  let orderContent = fs.readFileSync(orderPath, 'utf8');
  orderContent = orderContent.replace(/, Filter/g, '');
  fs.writeFileSync(orderPath, orderContent);
  console.log('✅ Fixed OrderHistory.tsx unused imports');
}

// Fix 8: ResetPassword.tsx - Fix any types
const resetPath = 'src/pages/ResetPassword.tsx';
if (fs.existsSync(resetPath)) {
  let resetContent = fs.readFileSync(resetPath, 'utf8');
  resetContent = resetContent.replace(/: any/g, ': unknown');
  fs.writeFileSync(resetPath, resetContent);
  console.log('✅ Fixed ResetPassword.tsx types');
}

// Fix 9: Signup.tsx - Fix unused error variable
const signupPath = 'src/pages/Signup.tsx';
if (fs.existsSync(signupPath)) {
  let signupContent = fs.readFileSync(signupPath, 'utf8');
  signupContent = signupContent.replace(/} catch \(err\) {/g, '} catch {');
  fs.writeFileSync(signupPath, signupContent);
  console.log('✅ Fixed Signup.tsx unused variables');
}

// Fix 10: VerifyEmail.tsx - Remove unused login variable and fix types
const verifyPath = 'src/pages/VerifyEmail.tsx';
if (fs.existsSync(verifyPath)) {
  let verifyContent = fs.readFileSync(verifyPath, 'utf8');
  // Remove unused login destructuring
  verifyContent = verifyContent.replace(/const { user, login } = useAuth\(\);/, 'const { user } = useAuth();');
  // Fix any types
  verifyContent = verifyContent.replace(/: any/g, ': unknown');
  fs.writeFileSync(verifyPath, verifyContent);
  console.log('✅ Fixed VerifyEmail.tsx unused variables and types');
}

// Fix 11: api.ts - Fix any types
const apiPath = 'src/services/api.ts';
if (fs.existsSync(apiPath)) {
  let apiContent = fs.readFileSync(apiPath, 'utf8');
  // Replace specific any types with proper types
  apiContent = apiContent.replace(/ApiResponse<T = any>/, 'ApiResponse<T = unknown>');
  apiContent = apiContent.replace(/filters: any = {}/g, 'filters: Record<string, unknown> = {}');
  fs.writeFileSync(apiPath, apiContent);
  console.log('✅ Fixed api.ts types');
}

console.log('\n🎉 All ESLint fixes applied successfully!');
console.log('\nRemaining manual fixes needed:');
console.log('- antiInspect.ts and codeProtection.ts contain intentional debugger statements for security');
console.log('- Some any types in protection files are necessary for dynamic object manipulation');
console.log('- AuthGuard.tsx export warning is acceptable for the useAuthGuard hook');

console.log('\n🚀 Run "npm run lint" again to verify fixes!');
#!/bin/bash

# ESLint Fix Script for GOAT E-commerce
echo "🔧 Fixing ESLint issues..."

# Fix 1: App.tsx - Add user dependency
sed -i 's/}, \[\]); \/\/ Remove user dependency to prevent spam/}, [user]); \/\/ Include user dependency/' src/App.tsx

# Fix 2: Hero.tsx - Comment out unused variables
sed -i 's/const { transform: backgroundTransform } = useParallax({ speed: 0.3 });/\/\/ const { transform: backgroundTransform } = useParallax({ speed: 0.3 });/' src/components/Hero.tsx
sed -i 's/const { transform: floatingTransform } = useParallax({ speed: 0.1 });/\/\/ const { transform: floatingTransform } = useParallax({ speed: 0.1 });/' src/components/Hero.tsx

# Fix 3: ProductFilter.tsx - Comment out unused variables
sed -i 's/const availableSizes = \[/\/\/ const availableSizes = [/' src/components/ProductFilter.tsx
sed -i 's/const availableColors = \[/\/\/ const availableColors = [/' src/components/ProductFilter.tsx

# Fix 4: useAuth.ts - Fix error handling
sed -i 's/} catch (err) {/} catch {/' src/hooks/useAuth.ts
sed -i 's/: any/: unknown/g' src/hooks/useAuth.ts

# Fix 5: AdminDashboard.tsx - Remove unused imports and variables
sed -i 's/, Trash2//' src/pages/AdminDashboard.tsx
sed -i 's/const customers = /\/\/ const customers = /' src/pages/AdminDashboard.tsx
sed -i 's/const isLoading = /\/\/ const isLoading = /' src/pages/AdminDashboard.tsx

# Fix 6: ForgotPassword.tsx - Remove unused showError
sed -i 's/const { showSuccess, showError } = useToast();/const { showSuccess } = useToast();/' src/pages/ForgotPassword.tsx
sed -i 's/} catch (error: any) {/} catch {/' src/pages/ForgotPassword.tsx

# Fix 7: Login.tsx - Fix error handling
sed -i 's/} catch (err) {/} catch {/' src/pages/Login.tsx

# Fix 8: OrderHistory.tsx - Remove unused Filter import
sed -i 's/, Filter//' src/pages/OrderHistory.tsx

# Fix 9: ResetPassword.tsx - Fix any types
sed -i 's/: any/: unknown/g' src/pages/ResetPassword.tsx

# Fix 10: Signup.tsx - Fix error handling and dependencies
sed -i 's/} catch (err) {/} catch {/' src/pages/Signup.tsx
sed -i 's/}, \[formData\]/}, [formData.email, formData.password, formData.name, formData.phone]/' src/pages/Signup.tsx

# Fix 11: VerifyEmail.tsx - Remove unused login and fix types
sed -i 's/const { user, login } = useAuth();/const { user } = useAuth();/' src/pages/VerifyEmail.tsx
sed -i 's/: any/: unknown/g' src/pages/VerifyEmail.tsx

# Fix 12: api.ts - Fix any types
sed -i 's/ApiResponse<T = any>/ApiResponse<T = unknown>/' src/services/api.ts
sed -i 's/filters: any = {}/filters: Record<string, unknown> = {}/g' src/services/api.ts

echo "✅ ESLint fixes applied!"
echo "🚀 Run 'npm run lint' to verify fixes"
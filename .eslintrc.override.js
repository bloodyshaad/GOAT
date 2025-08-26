module.exports = {
  extends: ['./.eslintrc.js'],
  rules: {
    // Allow debugger statements in protection files (intentional for security)
    'no-debugger': ['error', { 
      'ignorePatterns': ['**/utils/antiInspect.ts', '**/utils/codeProtection.ts'] 
    }],
    
    // Allow any types in protection files (necessary for dynamic manipulation)
    '@typescript-eslint/no-explicit-any': ['error', {
      'ignoreRestArgs': true,
      'fixToUnknown': true
    }],
    
    // Allow unused variables in protection files (decoy variables)
    '@typescript-eslint/no-unused-vars': ['error', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'ignoreRestSiblings': true
    }],
    
    // Allow console statements in protection files
    'no-console': ['warn', {
      'allow': ['warn', 'error']
    }],
    
    // Relax some React hooks rules for protection systems
    'react-hooks/exhaustive-deps': ['warn', {
      'additionalHooks': '(useProtection|useAntiInspect)'
    }]
  },
  
  overrides: [
    {
      // Special rules for protection files
      files: ['**/utils/antiInspect.ts', '**/utils/codeProtection.ts'],
      rules: {
        'no-debugger': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'prefer-const': 'off',
        'no-console': 'off'
      }
    },
    {
      // Special rules for hook files
      files: ['**/hooks/*.ts', '**/hooks/*.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn'
      }
    },
    {
      // Special rules for component files with hooks
      files: ['**/components/AuthGuard.tsx'],
      rules: {
        'react-refresh/only-export-components': 'warn'
      }
    }
  ]
};
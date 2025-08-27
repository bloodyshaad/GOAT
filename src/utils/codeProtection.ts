/**
 * Advanced Code Protection System (Production-Safe Version)
 * Additional layers of protection against code inspection
 */

class CodeProtection {
  private protectionEnabled = true;
  private obfuscationLevel = 2; // Reduced from 3

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Only enable in production
    if (import.meta.env.DEV) {
      console.log('🔒 Code protection disabled in development mode');
      return;
    }

    // Add delay and error handling
    setTimeout(() => {
      try {
        this.initProtection();
      } catch (error) {
        console.warn('Code protection initialization failed:', error);
        this.protectionEnabled = false;
      }
    }, 1500);
  }

  private initProtection() {
    if (!this.protectionEnabled) return;

    this.hideSourceMaps();
    this.preventDebugging();
    this.protectLocalStorage();
    this.addAntiTamperChecks();
    this.createDecoyFunctions();
  }

  // Hide source maps (safer implementation)
  private hideSourceMaps() {
    try {
      // Intercept network requests to block source map requests
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const url = args[0] as string;
        if (typeof url === 'string' && (url.includes('.map') || url.includes('sourcemap'))) {
          return Promise.reject(new Error('Source maps are not available'));
        }
        return originalFetch.apply(this, args);
      };
    } catch (error) {
      console.warn('Source map protection failed:', error);
    }
  }

  // Prevent debugging (less aggressive)
  private preventDebugging() {
    try {
      // Light anti-debugging check
      let lastTime = Date.now();
      const checkInterval = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - lastTime > 3000) {
          // Likely stepped through debugger - just log it
          console.warn('🔒 Debugging activity detected');
        }
        lastTime = currentTime;
      }, 1000);

      // Clear interval after 30 seconds to avoid performance issues
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 30000);
    } catch (error) {
      console.warn('Debug protection failed:', error);
    }
  }

  // Protect local storage (minimal approach)
  private protectLocalStorage() {
    try {
      // Add some fake data to confuse inspectors
      const fakeData = {
        'app_config': 'production_mode',
        'theme_preference': 'auto',
        'last_visit': Date.now().toString()
      };

      Object.entries(fakeData).forEach(([key, value]) => {
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, value);
        }
      });
    } catch (error) {
      console.warn('LocalStorage protection failed:', error);
    }
  }

  // Add anti-tamper checks (minimal)
  private addAntiTamperChecks() {
    try {
      // Check for common tampering tools (less aggressive)
      const suspiciousGlobals = [
        '__REACT_DEVTOOLS_GLOBAL_HOOK__',
        '__VUE_DEVTOOLS_GLOBAL_HOOK__'
      ];

      const checkGlobals = () => {
        suspiciousGlobals.forEach(global => {
          if ((window as any)[global]) {
            console.warn(`🔒 Development tool detected: ${global}`);
          }
        });
      };

      // Check once after delay
      setTimeout(checkGlobals, 3000);
    } catch (error) {
      console.warn('Anti-tamper check failed:', error);
    }
  }

  // Create decoy functions (minimal)
  private createDecoyFunctions() {
    try {
      // Add minimal fake functions
      (window as any).getAppInfo = () => {
        return {
          name: 'GOAT E-commerce',
          version: '1.0.0',
          build: 'production'
        };
      };

      (window as any).debugMode = false;
    } catch (error) {
      console.warn('Decoy function creation failed:', error);
    }
  }

  // Public configuration methods
  public setObfuscationLevel(level: number) {
    this.obfuscationLevel = Math.max(1, Math.min(3, level));
  }

  public disable() {
    this.protectionEnabled = false;
  }

  public enable() {
    this.protectionEnabled = true;
  }
}

// Initialize protection with error handling
let codeProtection: CodeProtection | null = null;

try {
  codeProtection = new CodeProtection();
} catch (error) {
  console.warn('Code protection failed to initialize:', error);
}

export default codeProtection;
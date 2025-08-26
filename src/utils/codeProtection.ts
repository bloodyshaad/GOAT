/**
 * Advanced Code Protection System
 * Additional layers of protection against code inspection
 */

class CodeProtection {
  private protectionEnabled = true;
  private obfuscationLevel = 3;

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

    this.protectGlobalObjects();
    this.hideSourceMaps();
    this.preventDebugging();
    this.obfuscateNetworkRequests();
    this.protectLocalStorage();
    this.addAntiTamperChecks();
    this.createDecoyFunctions();
    this.protectAgainstExtensions();
  }

  // Protect global objects
  private protectGlobalObjects() {
    // Protect window object
    const originalWindow = window;
    
    // Override common debugging properties
    Object.defineProperty(window, 'console', {
      get: () => {
        throw new Error('Access denied');
      },
      set: () => {
        throw new Error('Modification denied');
      }
    });

    // Protect document methods
    const originalQuerySelector = document.querySelector;
    const originalQuerySelectorAll = document.querySelectorAll;
    const originalGetElementById = document.getElementById;

    document.querySelector = function(selector: string) {
      if (selector.includes('script') || selector.includes('style')) {
        console.warn('🔒 Suspicious selector blocked:', selector);
        return null;
      }
      return originalQuerySelector.call(this, selector);
    };

    document.querySelectorAll = function(selector: string) {
      if (selector.includes('script') || selector.includes('style')) {
        console.warn('🔒 Suspicious selector blocked:', selector);
        return document.createDocumentFragment().querySelectorAll(selector);
      }
      return originalQuerySelectorAll.call(this, selector);
    };

    // Protect against eval
    (window as any).eval = () => {
      throw new Error('eval is disabled for security reasons');
    };

    // Protect against Function constructor
    (window as any).Function = () => {
      throw new Error('Function constructor is disabled for security reasons');
    };
  }

  // Hide source maps
  private hideSourceMaps() {
    // Remove source map comments from scripts
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.textContent) {
        script.textContent = script.textContent.replace(/\/\/# sourceMappingURL=.*/g, '');
        script.textContent = script.textContent.replace(/\/\*# sourceMappingURL=.*\*\//g, '');
      }
    });

    // Intercept network requests to block source map requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0] as string;
      if (url.includes('.map') || url.includes('sourcemap')) {
        return Promise.reject(new Error('Source maps are not available'));
      }
      return originalFetch.apply(this, args);
    };
  }

  // Prevent debugging
  private preventDebugging() {
    // Anti-debugging loop
    setInterval(() => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      
      if (end - start > 100) {
        // Debugger was likely open
        this.triggerAntiDebugResponse();
      }
    }, 1000);

    // Detect step debugging
    let lastTime = Date.now();
    setInterval(() => {
      const currentTime = Date.now();
      if (currentTime - lastTime > 2000) {
        // Likely stepped through debugger
        this.triggerAntiDebugResponse();
      }
      lastTime = currentTime;
    }, 100);

    // Override setTimeout/setInterval to detect debugging
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;

    window.setTimeout = function(callback: Function, delay: number, ...args: any[]) {
      const start = Date.now();
      return originalSetTimeout(() => {
        const elapsed = Date.now() - start;
        if (elapsed > delay + 1000) {
          // Execution was delayed, possibly by debugger
          console.warn('🔒 Debugging detected via setTimeout delay');
        }
        callback.apply(this, args);
      }, delay);
    };
  }

  // Obfuscate network requests
  private obfuscateNetworkRequests() {
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method: string, url: string, ...args: any[]) {
      // Log suspicious requests
      if (url.includes('api') || url.includes('admin')) {
        console.warn('🔒 API request intercepted');
      }
      
      // Obfuscate the URL in dev tools
      const obfuscatedUrl = this.obfuscateUrl(url);
      return originalXHROpen.call(this, method, obfuscatedUrl, ...args);
    };

    XMLHttpRequest.prototype.send = function(data?: any) {
      // Add fake headers to confuse inspectors
      this.setRequestHeader('X-Fake-Token', 'fake_token_' + Math.random());
      this.setRequestHeader('X-Decoy-Key', 'decoy_' + Date.now());
      
      return originalXHRSend.call(this, data);
    };

    // Add obfuscateUrl method
    (XMLHttpRequest.prototype as any).obfuscateUrl = function(url: string): string {
      // Simple obfuscation - in production you'd want something more sophisticated
      return url.replace(/api/g, 'a' + 'p' + 'i');
    };
  }

  // Protect local storage
  private protectLocalStorage() {
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    const originalRemoveItem = localStorage.removeItem;

    localStorage.setItem = function(key: string, value: string) {
      // Encrypt sensitive data
      if (key.includes('token') || key.includes('auth') || key.includes('user')) {
        console.warn('🔒 Sensitive data access detected');
        value = btoa(value); // Simple encoding - use proper encryption in production
      }
      return originalSetItem.call(this, key, value);
    };

    localStorage.getItem = function(key: string) {
      const value = originalGetItem.call(this, key);
      if (value && (key.includes('token') || key.includes('auth') || key.includes('user'))) {
        try {
          return atob(value); // Simple decoding
        } catch {
          return value;
        }
      }
      return value;
    };

    // Add fake data to confuse inspectors
    localStorage.setItem('fake_api_key', 'fake_key_12345');
    localStorage.setItem('decoy_token', 'decoy_token_67890');
    localStorage.setItem('dummy_secret', 'dummy_secret_data');
  }

  // Add anti-tamper checks
  private addAntiTamperChecks() {
    // Check for common tampering tools
    const suspiciousGlobals = [
      'webpackJsonp',
      '__REACT_DEVTOOLS_GLOBAL_HOOK__',
      '__VUE_DEVTOOLS_GLOBAL_HOOK__',
      'ng',
      'angular',
      '$0', '$1', '$2', '$3', '$4', // Chrome dev tools variables
      'inspect',
      'copy',
      'clear',
      'dir',
      'dirxml',
      'table',
      'trace',
      'profile',
      'profileEnd'
    ];

    suspiciousGlobals.forEach(global => {
      if ((window as any)[global]) {
        console.warn(`🔒 Suspicious global detected: ${global}`);
        try {
          delete (window as any)[global];
        } catch (e) {
          // Some globals can't be deleted
        }
      }
    });

    // Monitor for new suspicious globals
    setInterval(() => {
      suspiciousGlobals.forEach(global => {
        if ((window as any)[global]) {
          console.warn(`🔒 Suspicious global re-detected: ${global}`);
          this.triggerAntiTamperResponse();
        }
      });
    }, 5000);

    // Check for DOM modifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Check for suspicious elements
              if (element.tagName === 'SCRIPT' && 
                  !element.hasAttribute('data-goat-allowed')) {
                console.warn('🔒 Unauthorized script injection detected');
                element.remove();
                this.triggerAntiTamperResponse();
              }
              
              if (element.id && element.id.includes('react-devtools')) {
                console.warn('🔒 React DevTools detected');
                element.remove();
                this.triggerAntiTamperResponse();
              }
            }
          });
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }

  // Create decoy functions
  private createDecoyFunctions() {
    // Add fake API functions
    (window as any).fakeApiCall = () => {
      console.warn('🔒 Decoy function called');
      return Promise.resolve({ fake: 'data' });
    };

    (window as any).adminAccess = () => {
      console.warn('🔒 Fake admin function called');
      this.triggerAntiTamperResponse();
    };

    (window as any).getSecretKey = () => {
      console.warn('🔒 Fake secret function called');
      return 'fake_secret_key_12345';
    };

    // Add fake React/Vue components
    (window as any).React = {
      createElement: () => {
        console.warn('🔒 Fake React detected');
        return null;
      }
    };

    // Add fake debugging utilities
    (window as any).debug = {
      log: () => console.warn('🔒 Fake debug function'),
      info: () => console.warn('🔒 Fake debug function'),
      error: () => console.warn('🔒 Fake debug function')
    };
  }

  // Protect against browser extensions
  private protectAgainstExtensions() {
    // Detect common extension patterns
    const extensionDetectors = [
      () => !!(window as any).chrome && !!(window as any).chrome.runtime,
      () => !!(window as any).browser && !!(window as any).browser.runtime,
      () => !!(window as any).moz && !!(window as any).moz.extension,
      () => document.documentElement.hasAttribute('data-extension'),
      () => document.documentElement.hasAttribute('cz-shortcut-listen')
    ];

    extensionDetectors.forEach((detector, index) => {
      try {
        if (detector()) {
          console.warn(`🔒 Browser extension detected (method ${index + 1})`);
          this.triggerExtensionResponse();
        }
      } catch (e) {
        // Ignore errors from extension detection
      }
    });

    // Monitor for extension-injected elements
    setInterval(() => {
      const suspiciousSelectors = [
        '[data-extension]',
        '[data-reactroot]',
        '.extension-root',
        '#extension-root',
        '[class*="extension"]',
        '[id*="extension"]'
      ];

      suspiciousSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.warn(`🔒 Extension elements detected: ${selector}`);
          elements.forEach(el => el.remove());
        }
      });
    }, 3000);
  }

  // Response handlers
  private triggerAntiDebugResponse() {
    console.warn('🔒 Anti-debug response triggered');
    
    // Redirect or show warning
    if (Math.random() < 0.3) { // 30% chance
      window.location.href = 'https://google.com';
    } else {
      // Blur content temporarily
      document.body.style.filter = 'blur(20px)';
      setTimeout(() => {
        document.body.style.filter = '';
      }, 5000);
    }
  }

  private triggerAntiTamperResponse() {
    console.warn('🔒 Anti-tamper response triggered');
    
    // Show fake error
    const fakeError = document.createElement('div');
    fakeError.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff0000;
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 999999;
      font-family: monospace;
    `;
    fakeError.textContent = 'System Error: Unauthorized access detected';
    document.body.appendChild(fakeError);

    setTimeout(() => {
      fakeError.remove();
    }, 3000);
  }

  private triggerExtensionResponse() {
    console.warn('🔒 Extension response triggered');
    
    // Disable some functionality
    document.body.style.pointerEvents = 'none';
    setTimeout(() => {
      document.body.style.pointerEvents = '';
    }, 2000);
  }

  // Public configuration methods
  public setObfuscationLevel(level: number) {
    this.obfuscationLevel = Math.max(1, Math.min(5, level));
  }

  public disable() {
    this.protectionEnabled = false;
  }

  public enable() {
    this.protectionEnabled = true;
  }
}

// Initialize protection
const codeProtection = new CodeProtection();

export default codeProtection;
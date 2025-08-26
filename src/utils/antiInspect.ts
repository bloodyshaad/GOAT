/**
 * Anti-Inspection Protection System
 * Prevents users from inspecting the website code
 */

class AntiInspectProtection {
  private isProtectionActive = true;
  private devToolsOpen = false;
  private warningCount = 0;
  private maxWarnings = 3;
  private redirectUrl = 'https://google.com';

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Only enable in production
    if (import.meta.env.DEV) {
      console.log('🔒 Anti-inspection disabled in development mode');
      return;
    }

    this.disableRightClick();
    this.disableKeyboardShortcuts();
    this.disableTextSelection();
    this.detectDevTools();
    this.disableConsole();
    this.preventSourceView();
    this.addVisualWarnings();
    this.obfuscateContent();
    this.detectInspectionAttempts();
  }

  // Disable right-click context menu
  private disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showWarning('Right-click is disabled for security reasons');
      return false;
    });

    // Disable drag and drop
    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });

    // Disable image saving
    document.addEventListener('dragstart', (e) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
        return false;
      }
    });
  }

  // Disable keyboard shortcuts for developer tools
  private disableKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // F12 - Developer Tools
      if (e.key === 'F12') {
        e.preventDefault();
        this.handleInspectionAttempt('F12 key blocked');
        return false;
      }

      // Ctrl+Shift+I - Developer Tools
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        this.handleInspectionAttempt('Ctrl+Shift+I blocked');
        return false;
      }

      // Ctrl+Shift+J - Console
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        this.handleInspectionAttempt('Console access blocked');
        return false;
      }

      // Ctrl+Shift+C - Element Inspector
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        this.handleInspectionAttempt('Element inspector blocked');
        return false;
      }

      // Ctrl+U - View Source
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        this.handleInspectionAttempt('View source blocked');
        return false;
      }

      // Ctrl+S - Save Page
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.handleInspectionAttempt('Save page blocked');
        return false;
      }

      // Ctrl+A - Select All (in some contexts)
      if (e.ctrlKey && e.key === 'a' && e.target === document.body) {
        e.preventDefault();
        return false;
      }

      // Ctrl+P - Print (can reveal source)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        this.handleInspectionAttempt('Print blocked');
        return false;
      }
    });
  }

  // Disable text selection
  private disableTextSelection() {
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });

    // Add CSS to prevent selection
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Detect if developer tools are open
  private detectDevTools() {
    const devtools = { open: false, orientation: null };
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || 
          window.outerWidth - window.innerWidth > 200) {
        if (!devtools.open) {
          devtools.open = true;
          this.devToolsOpen = true;
          this.handleDevToolsDetected();
        }
      } else {
        devtools.open = false;
        this.devToolsOpen = false;
      }
    }, 500);

    // Alternative detection method
    const threshold = 160;
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        this.handleDevToolsDetected();
      }
    }, 1000);

    // Console detection
    const devToolsChecker = () => {
      const before = new Date();
      debugger;
      const after = new Date();
      if (after.getTime() - before.getTime() > 100) {
        this.handleDevToolsDetected();
      }
    };

    setInterval(devToolsChecker, 1000);
  }

  // Disable console
  private disableConsole() {
    // Override console methods
    const noop = () => {};
    const consoleWarning = () => {
      this.handleInspectionAttempt('Console access detected');
    };

    if (typeof console !== 'undefined') {
      console.log = consoleWarning;
      console.warn = consoleWarning;
      console.error = consoleWarning;
      console.info = consoleWarning;
      console.debug = consoleWarning;
      console.trace = consoleWarning;
      console.dir = consoleWarning;
      console.dirxml = consoleWarning;
      console.group = consoleWarning;
      console.groupCollapsed = consoleWarning;
      console.groupEnd = noop;
      console.time = noop;
      console.timeEnd = noop;
      console.profile = noop;
      console.profileEnd = noop;
      console.count = noop;
      console.clear = consoleWarning;
      console.table = consoleWarning;
      console.assert = consoleWarning;
    }

    // Prevent console from being redefined
    Object.defineProperty(window, 'console', {
      get: () => ({
        log: consoleWarning,
        warn: consoleWarning,
        error: consoleWarning,
        info: consoleWarning,
        debug: consoleWarning,
        trace: consoleWarning,
        dir: consoleWarning,
        dirxml: consoleWarning,
        group: consoleWarning,
        groupCollapsed: consoleWarning,
        groupEnd: noop,
        time: noop,
        timeEnd: noop,
        profile: noop,
        profileEnd: noop,
        count: noop,
        clear: consoleWarning,
        table: consoleWarning,
        assert: consoleWarning
      }),
      set: () => {
        this.handleInspectionAttempt('Console redefinition blocked');
      }
    });
  }

  // Prevent viewing page source
  private preventSourceView() {
    // Disable Ctrl+U
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        this.handleInspectionAttempt('View source blocked');
        return false;
      }
    });

    // Clear page source periodically
    setInterval(() => {
      if (document.documentElement.outerHTML.length > 1000000) {
        // If someone is trying to access large amounts of HTML
        this.handleInspectionAttempt('Large HTML access detected');
      }
    }, 5000);
  }

  // Add visual warnings
  private addVisualWarnings() {
    // Create warning overlay
    const createWarningOverlay = (message: string) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(255, 0, 0, 0.9);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        z-index: 999999;
        text-align: center;
        font-family: Arial, sans-serif;
      `;
      overlay.innerHTML = `
        <div>
          <h1>⚠️ SECURITY WARNING ⚠️</h1>
          <p>${message}</p>
          <p>This action has been logged.</p>
          <p>Redirecting in 3 seconds...</p>
        </div>
      `;
      document.body.appendChild(overlay);

      setTimeout(() => {
        window.location.href = this.redirectUrl;
      }, 3000);
    };

    // Store the function for later use
    (window as any).__showSecurityWarning = createWarningOverlay;
  }

  // Obfuscate content
  private obfuscateContent() {
    // Add fake elements to confuse inspectors
    const addFakeElements = () => {
      const fakeDiv = document.createElement('div');
      fakeDiv.style.display = 'none';
      fakeDiv.innerHTML = `
        <!-- Fake API endpoints -->
        <script>
          const API_KEY = "fake_key_12345";
          const SECRET_TOKEN = "fake_token_67890";
          const DATABASE_URL = "fake_db_url";
        </script>
        <!-- Fake sensitive data -->
        <div data-secret="fake_secret_data">
          <span class="hidden-api">fake_api_endpoint</span>
          <span class="admin-token">fake_admin_token</span>
        </div>
      `;
      document.body.appendChild(fakeDiv);
    };

    // Add fake elements periodically
    setTimeout(addFakeElements, 1000);
    setInterval(addFakeElements, 30000);

    // Obfuscate class names and IDs periodically
    setInterval(() => {
      const elements = document.querySelectorAll('[class], [id]');
      elements.forEach((el, index) => {
        if (Math.random() < 0.1) { // 10% chance
          const randomClass = 'obf_' + Math.random().toString(36).substring(7);
          el.classList.add(randomClass);
        }
      });
    }, 10000);
  }

  // Detect various inspection attempts
  private detectInspectionAttempts() {
    // Monitor for unusual activity
    let clickCount = 0;
    let keyCount = 0;

    document.addEventListener('click', () => {
      clickCount++;
      if (clickCount > 100) { // Unusual clicking pattern
        this.handleInspectionAttempt('Unusual clicking pattern detected');
        clickCount = 0;
      }
    });

    document.addEventListener('keydown', () => {
      keyCount++;
      if (keyCount > 200) { // Unusual key pressing
        this.handleInspectionAttempt('Unusual keyboard activity detected');
        keyCount = 0;
      }
    });

    // Reset counters periodically
    setInterval(() => {
      clickCount = 0;
      keyCount = 0;
    }, 60000);

    // Monitor for script injection attempts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
                if (!element.hasAttribute('data-goat-allowed')) {
                  this.handleInspectionAttempt('Unauthorized script/style injection detected');
                  element.remove();
                }
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Handle developer tools detection
  private handleDevToolsDetected() {
    if (!this.isProtectionActive) return;

    this.warningCount++;
    
    if (this.warningCount >= this.maxWarnings) {
      this.redirectUser('Developer tools detected multiple times');
    } else {
      this.showWarning(`Developer tools detected! Warning ${this.warningCount}/${this.maxWarnings}`);
      
      // Blur the page content
      document.body.style.filter = 'blur(10px)';
      document.body.style.pointerEvents = 'none';
      
      setTimeout(() => {
        document.body.style.filter = '';
        document.body.style.pointerEvents = '';
      }, 3000);
    }
  }

  // Handle inspection attempts
  private handleInspectionAttempt(reason: string) {
    if (!this.isProtectionActive) return;

    this.warningCount++;
    console.warn(`🔒 Security: ${reason}`);

    if (this.warningCount >= this.maxWarnings) {
      this.redirectUser(reason);
    } else {
      this.showWarning(`Security violation: ${reason}`);
    }
  }

  // Show warning message
  private showWarning(message: string) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-family: Arial, sans-serif;
      max-width: 300px;
    `;
    toast.textContent = `⚠️ ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 5000);
  }

  // Redirect user
  private redirectUser(reason: string) {
    if (typeof (window as any).__showSecurityWarning === 'function') {
      (window as any).__showSecurityWarning(`Access denied: ${reason}`);
    } else {
      alert(`Security violation detected: ${reason}\nRedirecting...`);
      window.location.href = this.redirectUrl;
    }
  }

  // Public methods for configuration
  public setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  public setMaxWarnings(count: number) {
    this.maxWarnings = count;
  }

  public disable() {
    this.isProtectionActive = false;
  }

  public enable() {
    this.isProtectionActive = true;
  }
}

// Initialize protection
const antiInspect = new AntiInspectProtection();

// Export for configuration
export default antiInspect;
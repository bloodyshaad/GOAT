/**
 * Anti-Inspection Protection System (Production-Safe Version)
 * Prevents users from inspecting the website code while maintaining functionality
 */

class AntiInspectProtection {
  private isProtectionActive = true;
  private devToolsOpen = false;
  private warningCount = 0;
  private maxWarnings = 5; // Increased tolerance
  private redirectUrl = 'https://google.com';

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Only enable in production and check if it's actually needed
    if (import.meta.env.DEV) {
      console.log('🔒 Anti-inspection disabled in development mode');
      return;
    }

    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      this.initProtection();
    }, 1000);
  }

  private initProtection() {
    try {
      this.disableRightClick();
      this.disableKeyboardShortcuts();
      this.disableTextSelection();
      this.detectDevTools();
      this.preventSourceView();
      this.addVisualWarnings();
      this.obfuscateContent();
    } catch (error) {
      console.warn('Protection system initialization failed:', error);
      // Disable protection if it causes errors
      this.isProtectionActive = false;
    }
  }

  // Disable right-click context menu (less aggressive)
  private disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
      // Allow right-click on input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return true;
      }
      e.preventDefault();
      this.showWarning('Right-click is disabled for security reasons');
      return false;
    });

    // Disable drag and drop for images only
    document.addEventListener('dragstart', (e) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
        return false;
      }
    });
  }

  // Disable keyboard shortcuts for developer tools (safer implementation)
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
        this.handleInspectionAttempt('Developer tools blocked');
        return false;
      }

      // Ctrl+Shift+J - Console
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        this.handleInspectionAttempt('Console access blocked');
        return false;
      }

      // Ctrl+U - View Source
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        this.handleInspectionAttempt('View source blocked');
        return false;
      }
    });
  }

  // Disable text selection (with exceptions)
  private disableTextSelection() {
    // Add CSS to prevent selection
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Detect if developer tools are open (safer method)
  private detectDevTools() {
    let devtools = { open: false };
    
    const checkDevTools = () => {
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
    };

    // Check less frequently to avoid performance issues
    setInterval(checkDevTools, 2000);
  }

  // Prevent viewing page source
  private preventSourceView() {
    // Override common view source shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        this.handleInspectionAttempt('View source blocked');
        return false;
      }
    });
  }

  // Add visual warnings (non-intrusive)
  private addVisualWarnings() {
    // Store the function for later use
    (window as any).__showSecurityWarning = (message: string) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        z-index: 999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
        max-width: 300px;
      `;
      overlay.innerHTML = `
        <div>
          <h4>⚠️ Security Notice</h4>
          <p>${message}</p>
        </div>
      `;
      document.body.appendChild(overlay);

      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.remove();
        }
      }, 5000);
    };
  }

  // Obfuscate content (minimal approach)
  private obfuscateContent() {
    // Add minimal fake elements
    const addFakeElements = () => {
      const fakeDiv = document.createElement('div');
      fakeDiv.style.display = 'none';
      fakeDiv.innerHTML = `
        <!-- Security notice: This is a protected application -->
        <span data-info="goat-ecommerce-v1.0"></span>
      `;
      document.body.appendChild(fakeDiv);
    };

    setTimeout(addFakeElements, 2000);
  }

  // Handle developer tools detection (less aggressive)
  private handleDevToolsDetected() {
    if (!this.isProtectionActive) return;

    this.warningCount++;
    
    if (this.warningCount >= this.maxWarnings) {
      this.showWarning('Multiple security violations detected. Please use the application normally.');
    } else {
      this.showWarning(`Developer tools detected! Warning ${this.warningCount}/${this.maxWarnings}`);
    }
  }

  // Handle inspection attempts (gentler approach)
  private handleInspectionAttempt(reason: string) {
    if (!this.isProtectionActive) return;

    this.warningCount++;
    
    if (this.warningCount >= this.maxWarnings) {
      this.showWarning('Please use the application normally for the best experience.');
    } else {
      this.showWarning(`Security notice: ${reason}`);
    }
  }

  // Show warning message (non-blocking)
  private showWarning(message: string) {
    // Create toast notification that doesn't block functionality
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      z-index: 999999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 280px;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    toast.textContent = `⚠️ ${message}`;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, 4000);
  }

  // Public methods for configuration
  public setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  public setMaxWarnings(count: number) {
    this.maxWarnings = Math.max(1, count);
  }

  public disable() {
    this.isProtectionActive = false;
  }

  public enable() {
    this.isProtectionActive = true;
  }
}

// Initialize protection with error handling
let antiInspect: AntiInspectProtection | null = null;

try {
  antiInspect = new AntiInspectProtection();
} catch (error) {
  console.warn('Anti-inspection protection failed to initialize:', error);
}

// Export for configuration
export default antiInspect;
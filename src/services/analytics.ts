// Advanced Analytics Service for GOAT E-commerce Platform

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  value?: number;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export interface ProductViewEvent {
  productId: string;
  productName: string;
  category: string;
  price: number;
}

export interface AddToCartEvent {
  productId: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
}

export interface PurchaseEvent {
  orderId: string;
  products: Array<{
    productId: string;
    productName: string;
    category: string;
    price: number;
    quantity: number;
  }>;
  totalValue: number;
  currency: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadEvents();
    this.setupBeforeUnload();
  }

  // Core tracking methods
  public track(event: string, properties?: Record<string, unknown>, value?: number): void {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      value,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.events.push(analyticsEvent);
    this.saveEvents();

    // Reduce console logging - only log important events in development
    if (process.env.NODE_ENV === 'development') {
      const importantEvents = [
        'page_view',
        'product_view',
        'add_to_cart',
        'purchase',
        'identify',
        'session_start',
        'session_end',
        'error',
        'recommendation_converted'
      ];
      
      // Only log important events or 5% of other events to reduce console spam
      if (importantEvents.includes(event) || Math.random() < 0.05) {
        console.log('Analytics Event:', analyticsEvent);
      }
    }
  }

  public trackPageView(path: string, title?: string): void {
    this.track('page_view', {
      path,
      title: title || document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });
  }

  public trackProductView(product: ProductViewEvent): void {
    this.track('product_view', {
      productId: product.productId,
      productName: product.productName,
      category: product.category,
      price: product.price
    }, product.price);
  }

  public trackAddToCart(item: AddToCartEvent): void {
    this.track('add_to_cart', {
      productId: item.productId,
      productName: item.productName,
      category: item.category,
      price: item.price,
      quantity: item.quantity
    }, item.price * item.quantity);
  }

  public trackPurchase(purchase: PurchaseEvent): void {
    this.track('purchase', {
      orderId: purchase.orderId,
      products: purchase.products,
      currency: purchase.currency,
      itemCount: purchase.products.length
    }, purchase.totalValue);
  }

  public trackSearch(query: string, results?: number): void {
    this.track('search', {
      query,
      results: results || 0
    });
  }

  public trackExperiment(experimentId: string, variantId: string): void {
    this.track('experiment_exposure', {
      experimentId,
      variantId
    });
  }

  public trackError(error: string, context?: Record<string, unknown>): void {
    this.track('error', {
      error,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }

  // User identification
  public identify(userId: string, properties?: Record<string, unknown>): void {
    this.userId = userId;
    this.track('identify', {
      userId,
      ...properties
    });
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  // Session management
  public startSession(): void {
    this.sessionId = this.generateSessionId();
    this.track('session_start');
  }

  public endSession(): void {
    this.track('session_end');
    this.saveEvents();
  }

  // Data retrieval
  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public getEventsByType(eventType: string): AnalyticsEvent[] {
    return this.events.filter(event => event.event === eventType);
  }

  public getEventsByTimeRange(startTime: number, endTime: number): AnalyticsEvent[] {
    return this.events.filter(event => 
      event.timestamp >= startTime && event.timestamp <= endTime
    );
  }

  public getUserEvents(userId: string): AnalyticsEvent[] {
    return this.events.filter(event => event.userId === userId);
  }

  public getSessionEvents(sessionId: string): AnalyticsEvent[] {
    return this.events.filter(event => event.sessionId === sessionId);
  }

  // Analytics insights
  public getTopProducts(limit: number = 10): Array<{ productId: string; views: number; purchases: number }> {
    const productStats = new Map<string, { views: number; purchases: number }>();

    this.events.forEach(event => {
      if (event.event === 'product_view' && event.properties?.productId) {
        const productId = event.properties.productId as string;
        const stats = productStats.get(productId) || { views: 0, purchases: 0 };
        stats.views++;
        productStats.set(productId, stats);
      } else if (event.event === 'purchase' && event.properties?.products) {
        const products = event.properties.products as Array<{ productId: string }>;
        products.forEach(product => {
          const stats = productStats.get(product.productId) || { views: 0, purchases: 0 };
          stats.purchases++;
          productStats.set(product.productId, stats);
        });
      }
    });

    return Array.from(productStats.entries())
      .map(([productId, stats]) => ({ productId, ...stats }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  public getConversionRate(): number {
    const sessions = new Set(this.events.map(event => event.sessionId));
    const purchaseSessions = new Set(
      this.events
        .filter(event => event.event === 'purchase')
        .map(event => event.sessionId)
    );

    return sessions.size > 0 ? purchaseSessions.size / sessions.size : 0;
  }

  public getAverageOrderValue(): number {
    const purchases = this.events.filter(event => event.event === 'purchase');
    if (purchases.length === 0) return 0;

    const totalValue = purchases.reduce((sum, event) => sum + (event.value || 0), 0);
    return totalValue / purchases.length;
  }

  // Configuration
  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public clearEvents(): void {
    this.events = [];
    this.saveEvents();
  }

  // Private methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private loadEvents(): void {
    try {
      const stored = localStorage.getItem('goat_analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics events:', error);
      this.events = [];
    }
  }

  private saveEvents(): void {
    try {
      // Keep only the last 1000 events to prevent localStorage from growing too large
      const eventsToSave = this.events.slice(-1000);
      localStorage.setItem('goat_analytics_events', JSON.stringify(eventsToSave));
      this.events = eventsToSave;
    } catch (error) {
      console.error('Failed to save analytics events:', error);
    }
  }

  private setupBeforeUnload(): void {
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }
}

// Singleton instance
export const analytics = new AnalyticsService();

// React hook for analytics
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackProductView: analytics.trackProductView.bind(analytics),
    trackAddToCart: analytics.trackAddToCart.bind(analytics),
    trackPurchase: analytics.trackPurchase.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    identify: analytics.identify.bind(analytics),
    getEvents: analytics.getEvents.bind(analytics)
  };
};

// Export default instance
export default analytics;
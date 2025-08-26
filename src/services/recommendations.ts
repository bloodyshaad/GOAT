// AI-Powered Recommendation Engine for GOAT E-commerce Platform

import { products, type Product } from '../data/products';
import { analytics } from './analytics';

export interface RecommendationContext {
  type: 'homepage' | 'product' | 'cart' | 'checkout' | 'category' | 'search';
  productId?: string;
  categoryId?: string;
  searchQuery?: string;
  cartItems?: string[];
  userSegment?: 'new' | 'returning' | 'vip';
}

export interface Recommendation {
  product: Product;
  score: number;
  algorithm: string;
  reason: string;
  confidence: number;
}

export interface RecommendationSet {
  recommendations: Recommendation[];
  title: string;
  subtitle?: string;
  algorithm: string;
}

export interface UserBehavior {
  userId?: string;
  sessionId: string;
  action: 'view' | 'cart' | 'purchase' | 'wishlist' | 'search';
  productId?: string;
  category?: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

export interface UserProfile {
  userId?: string;
  preferences: {
    categories: Record<string, number>;
    priceRange: { min: number; max: number };
    brands: Record<string, number>;
    styles: Record<string, number>;
  };
  behavior: {
    totalViews: number;
    totalPurchases: number;
    averageOrderValue: number;
    lastActivity: number;
    sessionCount: number;
  };
  segments: string[];
}

class RecommendationEngine {
  private userBehaviors: UserBehavior[] = [];
  private userProfiles: Map<string, UserProfile> = new Map();
  private productSimilarity: Map<string, Map<string, number>> = new Map();
  private trendingProducts: string[] = [];

  constructor() {
    this.loadData();
    this.calculateProductSimilarity();
    this.updateTrendingProducts();
  }

  // Main recommendation method
  public getRecommendations(
    context: RecommendationContext,
    userId?: string,
    limit: number = 8
  ): RecommendationSet {
    const userProfile = userId ? this.getUserProfile(userId) : null;
    
    switch (context.type) {
      case 'homepage':
        return this.getHomepageRecommendations(userProfile, limit);
      case 'product':
        return this.getProductPageRecommendations(context.productId!, userProfile, limit);
      case 'cart':
        return this.getCartRecommendations(context.cartItems!, userProfile, limit);
      case 'category':
        return this.getCategoryRecommendations(context.categoryId!, userProfile, limit);
      case 'search':
        return this.getSearchRecommendations(context.searchQuery!, userProfile, limit);
      default:
        return this.getFallbackRecommendations(limit);
    }
  }

  // User behavior tracking
  public trackUserBehavior(
    action: UserBehavior['action'],
    context: Record<string, unknown>,
    userId?: string
  ): void {
    const behavior: UserBehavior = {
      userId,
      sessionId: analytics.getEvents().find(e => e.event === 'session_start')?.sessionId || 'unknown',
      action,
      productId: context.productId as string,
      category: context.category as string,
      timestamp: Date.now(),
      context
    };

    this.userBehaviors.push(behavior);
    this.updateUserProfile(behavior);
    this.saveData();
  }

  // Recommendation algorithms
  private getHomepageRecommendations(userProfile: UserProfile | null, limit: number): RecommendationSet {
    const recommendations: Recommendation[] = [];

    if (userProfile) {
      // Personalized recommendations based on user preferences
      const personalizedRecs = this.getPersonalizedRecommendations(userProfile, limit / 2);
      recommendations.push(...personalizedRecs);
    }

    // Add trending products
    const trendingRecs = this.getTrendingRecommendations(limit - recommendations.length);
    recommendations.push(...trendingRecs);

    // Fill remaining slots with popular products
    if (recommendations.length < limit) {
      const popularRecs = this.getPopularRecommendations(limit - recommendations.length);
      recommendations.push(...popularRecs);
    }

    return {
      recommendations: recommendations.slice(0, limit),
      title: userProfile ? 'Recommended for You' : 'Trending Now',
      subtitle: 'Curated based on your preferences and current trends',
      algorithm: 'hybrid_homepage'
    };
  }

  private getProductPageRecommendations(productId: string, userProfile: UserProfile | null, limit: number): RecommendationSet {
    const recommendations: Recommendation[] = [];
    const currentProduct = products.find(p => p.id === productId);

    if (!currentProduct) {
      return this.getFallbackRecommendations(limit);
    }

    // Similar products based on content
    const similarRecs = this.getSimilarProducts(productId, limit / 2);
    recommendations.push(...similarRecs);

    // Collaborative filtering recommendations
    if (userProfile) {
      const collaborativeRecs = this.getCollaborativeRecommendations(productId, userProfile, limit / 2);
      recommendations.push(...collaborativeRecs);
    }

    // Fill with category-based recommendations
    if (recommendations.length < limit) {
      const categoryRecs = this.getCategoryBasedRecommendations(currentProduct.category, limit - recommendations.length);
      recommendations.push(...categoryRecs);
    }

    return {
      recommendations: recommendations.slice(0, limit),
      title: 'You might also like',
      subtitle: 'Based on this product and your preferences',
      algorithm: 'product_similarity'
    };
  }

  private getCartRecommendations(cartItems: string[], userProfile: UserProfile | null, limit: number): RecommendationSet {
    const recommendations: Recommendation[] = [];

    // Frequently bought together
    const frequentlyBoughtRecs = this.getFrequentlyBoughtTogether(cartItems, limit / 2);
    recommendations.push(...frequentlyBoughtRecs);

    // Complementary products
    const complementaryRecs = this.getComplementaryProducts(cartItems, limit / 2);
    recommendations.push(...complementaryRecs);

    return {
      recommendations: recommendations.slice(0, limit),
      title: 'Complete your look',
      subtitle: 'Items that go well with your cart',
      algorithm: 'cart_based'
    };
  }

  private getCategoryRecommendations(categoryId: string, userProfile: UserProfile | null, limit: number): RecommendationSet {
    const categoryProducts = products.filter(p => p.category === categoryId);
    const recommendations: Recommendation[] = [];

    // Sort by popularity and rating
    const sortedProducts = categoryProducts
      .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
      .slice(0, limit);

    sortedProducts.forEach((product, index) => {
      recommendations.push({
        product,
        score: 1 - (index / sortedProducts.length),
        algorithm: 'category_popular',
        reason: `Popular in ${categoryId}`,
        confidence: 0.8
      });
    });

    return {
      recommendations,
      title: `Popular in ${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}`,
      subtitle: 'Top-rated products in this category',
      algorithm: 'category_based'
    };
  }

  private getSearchRecommendations(query: string, userProfile: UserProfile | null, limit: number): RecommendationSet {
    const searchResults = this.searchProducts(query);
    const recommendations: Recommendation[] = [];

    searchResults.slice(0, limit).forEach((product, index) => {
      recommendations.push({
        product,
        score: 1 - (index / searchResults.length),
        algorithm: 'search_relevance',
        reason: `Matches "${query}"`,
        confidence: 0.9
      });
    });

    return {
      recommendations,
      title: `Results for "${query}"`,
      subtitle: `${searchResults.length} products found`,
      algorithm: 'search_based'
    };
  }

  // Algorithm implementations
  private getPersonalizedRecommendations(userProfile: UserProfile, limit: number): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const preferredCategories = Object.entries(userProfile.preferences.categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    preferredCategories.forEach(([category, score]) => {
      const categoryProducts = products
        .filter(p => p.category === category)
        .filter(p => p.price >= userProfile.preferences.priceRange.min && 
                    p.price <= userProfile.preferences.priceRange.max)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, Math.ceil(limit / preferredCategories.length));

      categoryProducts.forEach(product => {
        recommendations.push({
          product,
          score: score * (product.rating / 5),
          algorithm: 'personalized',
          reason: `Based on your interest in ${category}`,
          confidence: 0.85
        });
      });
    });

    return recommendations.slice(0, limit);
  }

  private getTrendingRecommendations(limit: number): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    this.trendingProducts.slice(0, limit).forEach((productId, index) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        recommendations.push({
          product,
          score: 1 - (index / this.trendingProducts.length),
          algorithm: 'trending',
          reason: 'Trending now',
          confidence: 0.7
        });
      }
    });

    return recommendations;
  }

  private getPopularRecommendations(limit: number): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const popularProducts = products
      .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
      .slice(0, limit);

    popularProducts.forEach((product, index) => {
      recommendations.push({
        product,
        score: 1 - (index / popularProducts.length),
        algorithm: 'popularity',
        reason: 'Highly rated',
        confidence: 0.75
      });
    });

    return recommendations;
  }

  private getSimilarProducts(productId: string, limit: number): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const similarities = this.productSimilarity.get(productId);

    if (similarities) {
      const sortedSimilar = Array.from(similarities.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit);

      sortedSimilar.forEach(([similarProductId, similarity]) => {
        const product = products.find(p => p.id === similarProductId);
        if (product) {
          recommendations.push({
            product,
            score: similarity,
            algorithm: 'content_similarity',
            reason: 'Similar style and features',
            confidence: 0.8
          });
        }
      });
    }

    return recommendations;
  }

  private getCollaborativeRecommendations(productId: string, userProfile: UserProfile, limit: number): Recommendation[] {
    // Simplified collaborative filtering
    const recommendations: Recommendation[] = [];
    const usersWhoViewedThis = this.userBehaviors
      .filter(b => b.productId === productId && b.action === 'view')
      .map(b => b.userId)
      .filter(Boolean);

    const otherProductsViewed = this.userBehaviors
      .filter(b => usersWhoViewedThis.includes(b.userId) && b.productId !== productId)
      .reduce((acc, b) => {
        if (b.productId) {
          acc[b.productId] = (acc[b.productId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    const sortedProducts = Object.entries(otherProductsViewed)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);

    sortedProducts.forEach(([otherProductId, count]) => {
      const product = products.find(p => p.id === otherProductId);
      if (product) {
        recommendations.push({
          product,
          score: count / usersWhoViewedThis.length,
          algorithm: 'collaborative_filtering',
          reason: 'Others who viewed this also liked',
          confidence: 0.7
        });
      }
    });

    return recommendations;
  }

  private getCategoryBasedRecommendations(category: string, limit: number): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const categoryProducts = products
      .filter(p => p.category === category)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);

    categoryProducts.forEach((product, index) => {
      recommendations.push({
        product,
        score: 1 - (index / categoryProducts.length),
        algorithm: 'category_based',
        reason: `Popular in ${category}`,
        confidence: 0.6
      });
    });

    return recommendations;
  }

  private getFrequentlyBoughtTogether(cartItems: string[], limit: number): Recommendation[] {
    // Simplified implementation - in reality, this would use purchase history data
    const recommendations: Recommendation[] = [];
    const cartCategories = cartItems
      .map(id => products.find(p => p.id === id)?.category)
      .filter(Boolean);

    const complementaryCategories = this.getComplementaryCategories(cartCategories as string[]);
    
    complementaryCategories.forEach(category => {
      const categoryProducts = products
        .filter(p => p.category === category && !cartItems.includes(p.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, Math.ceil(limit / complementaryCategories.length));

      categoryProducts.forEach(product => {
        recommendations.push({
          product,
          score: 0.8,
          algorithm: 'frequently_bought_together',
          reason: 'Frequently bought together',
          confidence: 0.75
        });
      });
    });

    return recommendations.slice(0, limit);
  }

  private getComplementaryProducts(cartItems: string[], limit: number): Recommendation[] {
    // Similar to frequently bought together but focuses on complementary items
    return this.getFrequentlyBoughtTogether(cartItems, limit);
  }

  private getFallbackRecommendations(limit: number): RecommendationSet {
    return {
      recommendations: this.getPopularRecommendations(limit),
      title: 'Popular Products',
      subtitle: 'Customer favorites',
      algorithm: 'fallback'
    };
  }

  // Utility methods
  private searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  }

  private getComplementaryCategories(categories: string[]): string[] {
    // Define complementary category relationships
    const complementaryMap: Record<string, string[]> = {
      'men': ['accessories'],
      'women': ['accessories'],
      'accessories': ['men', 'women']
    };

    const complementary = new Set<string>();
    categories.forEach(category => {
      const complements = complementaryMap[category] || [];
      complements.forEach(comp => complementary.add(comp));
    });

    return Array.from(complementary);
  }

  private calculateProductSimilarity(): void {
    products.forEach(product1 => {
      const similarities = new Map<string, number>();
      
      products.forEach(product2 => {
        if (product1.id !== product2.id) {
          const similarity = this.calculateSimilarity(product1, product2);
          similarities.set(product2.id, similarity);
        }
      });
      
      this.productSimilarity.set(product1.id, similarities);
    });
  }

  private calculateSimilarity(product1: Product, product2: Product): number {
    let similarity = 0;
    
    // Category similarity
    if (product1.category === product2.category) {
      similarity += 0.4;
    }
    
    // Price similarity
    const priceDiff = Math.abs(product1.price - product2.price);
    const maxPrice = Math.max(product1.price, product2.price);
    const priceSimiliarity = 1 - (priceDiff / maxPrice);
    similarity += priceSimiliarity * 0.3;
    
    // Rating similarity
    const ratingDiff = Math.abs(product1.rating - product2.rating);
    const ratingSimiliarity = 1 - (ratingDiff / 5);
    similarity += ratingSimiliarity * 0.3;
    
    return Math.max(0, Math.min(1, similarity));
  }

  private updateTrendingProducts(): void {
    // Calculate trending based on recent views and purchases
    const recentBehaviors = this.userBehaviors.filter(
      b => Date.now() - b.timestamp < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    );

    const productScores = new Map<string, number>();
    
    recentBehaviors.forEach(behavior => {
      if (behavior.productId) {
        const currentScore = productScores.get(behavior.productId) || 0;
        const actionWeight = behavior.action === 'purchase' ? 3 : behavior.action === 'cart' ? 2 : 1;
        productScores.set(behavior.productId, currentScore + actionWeight);
      }
    });

    this.trendingProducts = Array.from(productScores.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([productId]) => productId)
      .slice(0, 20);
  }

  private updateUserProfile(behavior: UserBehavior): void {
    if (!behavior.userId) return;

    let profile = this.userProfiles.get(behavior.userId);
    if (!profile) {
      profile = {
        userId: behavior.userId,
        preferences: {
          categories: {},
          priceRange: { min: 0, max: 1000 },
          brands: {},
          styles: {}
        },
        behavior: {
          totalViews: 0,
          totalPurchases: 0,
          averageOrderValue: 0,
          lastActivity: Date.now(),
          sessionCount: 0
        },
        segments: []
      };
    }

    // Update behavior stats
    profile.behavior.lastActivity = behavior.timestamp;
    if (behavior.action === 'view') profile.behavior.totalViews++;
    if (behavior.action === 'purchase') profile.behavior.totalPurchases++;

    // Update category preferences
    if (behavior.category) {
      profile.preferences.categories[behavior.category] = 
        (profile.preferences.categories[behavior.category] || 0) + 1;
    }

    this.userProfiles.set(behavior.userId, profile);
  }

  private getUserProfile(userId: string): UserProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  private loadData(): void {
    try {
      const behaviorData = localStorage.getItem('goat_user_behaviors');
      if (behaviorData) {
        this.userBehaviors = JSON.parse(behaviorData);
      }

      const profileData = localStorage.getItem('goat_user_profiles');
      if (profileData) {
        const profiles = JSON.parse(profileData);
        this.userProfiles = new Map(Object.entries(profiles));
      }
    } catch (error) {
      console.error('Failed to load recommendation data:', error);
    }
  }

  private saveData(): void {
    try {
      // Keep only recent behaviors (last 30 days)
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      this.userBehaviors = this.userBehaviors.filter(b => b.timestamp > thirtyDaysAgo);
      
      localStorage.setItem('goat_user_behaviors', JSON.stringify(this.userBehaviors));
      
      const profilesObj = Object.fromEntries(this.userProfiles);
      localStorage.setItem('goat_user_profiles', JSON.stringify(profilesObj));
    } catch (error) {
      console.error('Failed to save recommendation data:', error);
    }
  }
}

// Singleton instance
export const recommendationEngine = new RecommendationEngine();

// Export for testing and advanced usage
export default recommendationEngine;
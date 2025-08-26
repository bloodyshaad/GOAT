// Advanced A/B Testing Framework for GOAT E-commerce Platform

import { analytics } from './analytics';

export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  targetAudience: {
    percentage: number;
    conditions?: {
      userType?: 'new' | 'returning' | 'all';
      location?: string[];
      device?: 'mobile' | 'desktop' | 'tablet' | 'all';
      minOrders?: number;
      maxOrders?: number;
    };
  };
  variants: ExperimentVariant[];
  metrics: {
    primary: string;
    secondary: string[];
  };
  results?: ExperimentResults;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  weight: number; // Percentage of traffic (0-100)
  config: Record<string, unknown>;
}

export interface ExperimentResults {
  totalParticipants: number;
  variantResults: {
    [variantId: string]: {
      participants: number;
      conversions: number;
      conversionRate: number;
      revenue: number;
      averageOrderValue: number;
      confidence: number;
      isWinner?: boolean;
    };
  };
  statisticalSignificance: boolean;
  winningVariant?: string;
}

export interface UserExperiment {
  experimentId: string;
  variantId: string;
  assignedAt: number;
  converted?: boolean;
  conversionValue?: number;
}

class ABTestingService {
  private experiments: Map<string, Experiment> = new Map();
  private userExperiments: Map<string, UserExperiment[]> = new Map();
  private userId?: string;

  constructor() {
    this.loadExperiments();
    this.loadUserExperiments();
  }

  // Experiment Management
  public createExperiment(experiment: Omit<Experiment, 'results'>): void {
    const fullExperiment: Experiment = {
      ...experiment,
      results: undefined
    };
    
    this.experiments.set(experiment.id, fullExperiment);
    this.saveExperiments();
  }

  public getExperiment(experimentId: string): Experiment | undefined {
    return this.experiments.get(experimentId);
  }

  public getAllExperiments(): Experiment[] {
    return Array.from(this.experiments.values());
  }

  public startExperiment(experimentId: string): void {
    const experiment = this.experiments.get(experimentId);
    if (experiment) {
      experiment.status = 'running';
      experiment.startDate = new Date().toISOString();
      this.saveExperiments();
    }
  }

  public stopExperiment(experimentId: string): void {
    const experiment = this.experiments.get(experimentId);
    if (experiment) {
      experiment.status = 'completed';
      experiment.endDate = new Date().toISOString();
      this.calculateResults(experimentId);
      this.saveExperiments();
    }
  }

  // User Assignment
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public getVariant(experimentId: string): string | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'running') {
      return null;
    }

    // Check if user is already assigned
    const userKey = this.userId || 'anonymous';
    const userExperiments = this.userExperiments.get(userKey) || [];
    const existingAssignment = userExperiments.find(ue => ue.experimentId === experimentId);
    
    if (existingAssignment) {
      return existingAssignment.variantId;
    }

    // Check if user qualifies for experiment
    if (!this.userQualifies(experiment)) {
      return null;
    }

    // Assign user to variant
    const variantId = this.assignUserToVariant(experiment);
    if (variantId) {
      const userExperiment: UserExperiment = {
        experimentId,
        variantId,
        assignedAt: Date.now()
      };

      userExperiments.push(userExperiment);
      this.userExperiments.set(userKey, userExperiments);
      this.saveUserExperiments();

      // Track experiment exposure
      analytics.trackExperiment(experimentId, variantId);
    }

    return variantId;
  }

  public getVariantConfig(experimentId: string): Record<string, unknown> | null {
    const variantId = this.getVariant(experimentId);
    if (!variantId) return null;

    const experiment = this.experiments.get(experimentId);
    const variant = experiment?.variants.find(v => v.id === variantId);
    
    return variant?.config || null;
  }

  // Conversion Tracking
  public trackConversion(experimentId: string, value?: number): void {
    const userKey = this.userId || 'anonymous';
    const userExperiments = this.userExperiments.get(userKey) || [];
    const userExperiment = userExperiments.find(ue => ue.experimentId === experimentId);

    if (userExperiment && !userExperiment.converted) {
      userExperiment.converted = true;
      userExperiment.conversionValue = value;
      this.saveUserExperiments();

      // Track conversion event
      analytics.track('experiment_conversion', {
        category: 'experiment',
        action: 'conversion',
        label: experimentId,
        value,
        experimentId,
        variantId: userExperiment.variantId
      });
    }
  }

  // Results and Analytics
  public calculateResults(experimentId: string): ExperimentResults | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return null;

    const results: ExperimentResults = {
      totalParticipants: 0,
      variantResults: {},
      statisticalSignificance: false
    };

    // Calculate results for each variant
    experiment.variants.forEach(variant => {
      const participants = this.getVariantParticipants(experimentId, variant.id);
      const conversions = participants.filter(p => p.converted).length;
      const revenue = participants.reduce((sum, p) => sum + (p.conversionValue || 0), 0);

      results.variantResults[variant.id] = {
        participants: participants.length,
        conversions,
        conversionRate: participants.length > 0 ? conversions / participants.length : 0,
        revenue,
        averageOrderValue: conversions > 0 ? revenue / conversions : 0,
        confidence: this.calculateConfidence(participants, conversions)
      };

      results.totalParticipants += participants.length;
    });

    // Determine statistical significance and winner
    results.statisticalSignificance = this.hasStatisticalSignificance(results);
    if (results.statisticalSignificance) {
      results.winningVariant = this.determineWinner(results);
      if (results.winningVariant) {
        results.variantResults[results.winningVariant].isWinner = true;
      }
    }

    experiment.results = results;
    return results;
  }

  public getExperimentResults(experimentId: string): ExperimentResults | null {
    const experiment = this.experiments.get(experimentId);
    return experiment?.results || null;
  }

  // React Hooks
  public useExperiment(experimentId: string): {
    variant: string | null;
    config: Record<string, unknown> | null;
    trackConversion: (value?: number) => void;
  } {
    const variant = this.getVariant(experimentId);
    const config = this.getVariantConfig(experimentId);
    
    return {
      variant,
      config,
      trackConversion: (value?: number) => this.trackConversion(experimentId, value)
    };
  }

  // Private Methods
  private userQualifies(experiment: Experiment): boolean {
    const { targetAudience } = experiment;
    
    // Check percentage targeting
    const hash = this.hashUserId(this.userId || 'anonymous');
    if (hash % 100 >= targetAudience.percentage) {
      return false;
    }

    // Additional conditions can be checked here
    // For now, we'll assume all users qualify if they pass the percentage check
    return true;
  }

  private assignUserToVariant(experiment: Experiment): string | null {
    const hash = this.hashUserId(this.userId || 'anonymous');
    let cumulativeWeight = 0;
    const targetWeight = hash % 100;

    for (const variant of experiment.variants) {
      cumulativeWeight += variant.weight;
      if (targetWeight < cumulativeWeight) {
        return variant.id;
      }
    }

    return experiment.variants[0]?.id || null;
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private getVariantParticipants(experimentId: string, variantId: string): UserExperiment[] {
    const allParticipants: UserExperiment[] = [];
    
    for (const userExperiments of this.userExperiments.values()) {
      const participation = userExperiments.find(
        ue => ue.experimentId === experimentId && ue.variantId === variantId
      );
      if (participation) {
        allParticipants.push(participation);
      }
    }
    
    return allParticipants;
  }

  private calculateConfidence(participants: UserExperiment[], conversions: number): number {
    if (participants.length < 30) return 0; // Not enough data
    
    const conversionRate = conversions / participants.length;
    const standardError = Math.sqrt((conversionRate * (1 - conversionRate)) / participants.length);
    
    // Simplified confidence calculation (95% confidence interval)
    const marginOfError = 1.96 * standardError;
    return Math.max(0, Math.min(100, (1 - marginOfError) * 100));
  }

  private hasStatisticalSignificance(results: ExperimentResults): boolean {
    const variants = Object.values(results.variantResults);
    if (variants.length < 2) return false;
    
    // Check if any variant has sufficient confidence and sample size
    return variants.some(variant => 
      variant.confidence > 95 && variant.participants > 100
    );
  }

  private determineWinner(results: ExperimentResults): string | null {
    let bestVariant: string | null = null;
    let bestConversionRate = 0;
    
    Object.entries(results.variantResults).forEach(([variantId, result]) => {
      if (result.conversionRate > bestConversionRate && result.confidence > 95) {
        bestConversionRate = result.conversionRate;
        bestVariant = variantId;
      }
    });
    
    return bestVariant;
  }

  private loadExperiments(): void {
    const stored = localStorage.getItem('goat_experiments');
    if (stored) {
      const experiments = JSON.parse(stored);
      this.experiments = new Map(Object.entries(experiments));
    }
  }

  private saveExperiments(): void {
    const experimentsObj = Object.fromEntries(this.experiments);
    localStorage.setItem('goat_experiments', JSON.stringify(experimentsObj));
  }

  private loadUserExperiments(): void {
    const stored = localStorage.getItem('goat_user_experiments');
    if (stored) {
      const userExperiments = JSON.parse(stored);
      this.userExperiments = new Map(Object.entries(userExperiments));
    }
  }

  private saveUserExperiments(): void {
    const userExperimentsObj = Object.fromEntries(this.userExperiments);
    localStorage.setItem('goat_user_experiments', JSON.stringify(userExperimentsObj));
  }
}

// Singleton instance
export const abTesting = new ABTestingService();

// React hook
export const useABTest = (experimentId: string) => {
  return abTesting.useExperiment(experimentId);
};

// Predefined experiments for GOAT
export const initializeDefaultExperiments = () => {
  // Hero CTA Button Test
  abTesting.createExperiment({
    id: 'hero_cta_test',
    name: 'Hero CTA Button Test',
    description: 'Test different CTA button texts on the hero section',
    status: 'draft',
    startDate: new Date().toISOString(),
    targetAudience: {
      percentage: 50,
      conditions: {
        userType: 'all'
      }
    },
    variants: [
      {
        id: 'control',
        name: 'Control - Shop Collection',
        description: 'Original button text',
        weight: 50,
        config: {
          buttonText: 'Shop Collection',
          buttonColor: 'black'
        }
      },
      {
        id: 'variant_a',
        name: 'Variant A - Discover Now',
        description: 'Alternative button text',
        weight: 50,
        config: {
          buttonText: 'Discover Now',
          buttonColor: 'black'
        }
      }
    ],
    metrics: {
      primary: 'click_through_rate',
      secondary: ['time_on_page', 'bounce_rate']
    }
  });

  // Product Grid Layout Test
  abTesting.createExperiment({
    id: 'product_grid_layout',
    name: 'Product Grid Layout Test',
    description: 'Test different product grid layouts',
    status: 'draft',
    startDate: new Date().toISOString(),
    targetAudience: {
      percentage: 30,
      conditions: {
        userType: 'all'
      }
    },
    variants: [
      {
        id: 'control',
        name: 'Control - 4 Column Grid',
        description: 'Standard 4 column grid',
        weight: 50,
        config: {
          columns: 4,
          showQuickAdd: true,
          showWishlist: true
        }
      },
      {
        id: 'variant_a',
        name: 'Variant A - 3 Column Grid',
        description: 'Larger product cards in 3 columns',
        weight: 50,
        config: {
          columns: 3,
          showQuickAdd: true,
          showWishlist: true
        }
      }
    ],
    metrics: {
      primary: 'add_to_cart_rate',
      secondary: ['product_view_rate', 'wishlist_add_rate']
    }
  });
};
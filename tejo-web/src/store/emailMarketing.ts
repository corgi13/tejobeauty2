import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EmailCampaign {
  id: string;
  name: string;
  type: 'abandoned_cart' | 'welcome' | 'recommendations' | 'promotional' | 'reorder';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  subject: string;
  content: string;
  targetAudience: string[];
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AbandonedCart {
  id: string;
  userId?: string;
  email: string;
  cartItems: any[];
  subtotal: number;
  abandonedAt: Date;
  recoveredAt?: Date;
  emailSent: boolean;
  emailSentAt?: Date;
  recoveryAttempts: number;
  lastEmailSent?: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: 'abandoned_cart' | 'welcome' | 'recommendations' | 'promotional' | 'reorder';
  subject: string;
  content: string;
  variables: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailPreference {
  userId?: string;
  email: string;
  marketingEmails: boolean;
  abandonedCartEmails: boolean;
  recommendationEmails: boolean;
  promotionalEmails: boolean;
  reorderReminders: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  lastEmailSent?: Date;
  unsubscribedAt?: Date;
}

export interface Recommendation {
  id: string;
  userId?: string;
  email: string;
  productId: string;
  productName: string;
  reason: 'browsing_history' | 'purchase_history' | 'similar_users' | 'trending' | 'category';
  score: number;
  sentAt?: Date;
  clickedAt?: Date;
  purchasedAt?: Date;
  createdAt: Date;
}

type EmailMarketingState = {
  campaigns: EmailCampaign[];
  abandonedCarts: AbandonedCart[];
  templates: EmailTemplate[];
  preferences: EmailPreference[];
  recommendations: Recommendation[];
  
  // Campaign management
  createCampaign: (campaign: Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCampaign: (id: string, updates: Partial<EmailCampaign>) => void;
  deleteCampaign: (id: string) => void;
  sendCampaign: (id: string) => Promise<void>;
  
  // Abandoned cart management
  trackAbandonedCart: (cart: Omit<AbandonedCart, 'id' | 'abandonedAt' | 'emailSent' | 'recoveryAttempts'>) => void;
  recoverCart: (id: string) => void;
  sendAbandonedCartEmail: (id: string) => Promise<void>;
  getAbandonedCarts: (hours?: number) => AbandonedCart[];
  
  // Template management
  createTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updates: Partial<EmailTemplate>) => void;
  deleteTemplate: (id: string) => void;
  getTemplate: (type: string) => EmailTemplate | undefined;
  
  // Email preferences
  updatePreferences: (email: string, preferences: Partial<EmailPreference>) => void;
  unsubscribe: (email: string, type?: string) => void;
  resubscribe: (email: string) => void;
  getPreferences: (email: string) => EmailPreference | undefined;
  
  // Recommendations
  addRecommendation: (recommendation: Omit<Recommendation, 'id' | 'createdAt'>) => void;
  markRecommendationClicked: (id: string) => void;
  markRecommendationPurchased: (id: string) => void;
  getRecommendations: (email: string, limit?: number) => Recommendation[];
  generateRecommendations: (email: string, userId?: string) => Promise<void>;
  
  // Analytics
  getCampaignStats: (campaignId: string) => any;
  getAbandonedCartStats: () => any;
  getRecommendationStats: () => any;
  
  // Utility functions
  canSendEmail: (email: string, type: string) => boolean;
  shouldSendAbandonedCartEmail: (cartId: string) => boolean;
  cleanupOldData: () => void;
};

// Generate unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useEmailMarketing = create<EmailMarketingState>()(
  persist(
    (set, get) => ({
      campaigns: [],
      abandonedCarts: [],
      templates: [],
      preferences: [],
      recommendations: [],
      
      // Campaign management
      createCampaign: (campaignData) => {
        const { campaigns } = get();
        const newCampaign: EmailCampaign = {
          ...campaignData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set({ campaigns: [...campaigns, newCampaign] });
      },
      
      updateCampaign: (id, updates) => {
        const { campaigns } = get();
        const updatedCampaigns = campaigns.map(campaign =>
          campaign.id === id
            ? { ...campaign, ...updates, updatedAt: new Date() }
            : campaign
        );
        set({ campaigns: updatedCampaigns });
      },
      
      deleteCampaign: (id) => {
        const { campaigns } = get();
        set({ campaigns: campaigns.filter(campaign => campaign.id !== id) });
      },
      
      sendCampaign: async (id) => {
        const { campaigns } = get();
        const campaign = campaigns.find(c => c.id === id);
        if (!campaign) return;
        
        // Update campaign status
        get().updateCampaign(id, { 
          status: 'sending',
          sentAt: new Date()
        });
        
        // Simulate sending emails
        console.log(`Sending campaign: ${campaign.name} to ${campaign.targetAudience.length} recipients`);
        
        // Update status to sent
        setTimeout(() => {
          get().updateCampaign(id, { status: 'sent' });
        }, 1000);
      },
      
      // Abandoned cart management
      trackAbandonedCart: (cartData) => {
        const { abandonedCarts } = get();
        const newCart: AbandonedCart = {
          ...cartData,
          id: generateId(),
          abandonedAt: new Date(),
          emailSent: false,
          recoveryAttempts: 0,
        };
        set({ abandonedCarts: [...abandonedCarts, newCart] });
      },
      
      recoverCart: (id) => {
        const { abandonedCarts } = get();
        const updatedCarts = abandonedCarts.map(cart =>
          cart.id === id
            ? { ...cart, recoveredAt: new Date() }
            : cart
        );
        set({ abandonedCarts: updatedCarts });
      },
      
      sendAbandonedCartEmail: async (id) => {
        const { abandonedCarts } = get();
        const cart = abandonedCarts.find(c => c.id === id);
        if (!cart) return;
        
        // Check if we can send email
        if (!get().canSendEmail(cart.email, 'abandoned_cart')) {
          return;
        }
        
        // Update cart
        const updatedCarts = abandonedCarts.map(c =>
          c.id === id
            ? {
                ...c,
                emailSent: true,
                emailSentAt: new Date(),
                lastEmailSent: new Date(),
                recoveryAttempts: c.recoveryAttempts + 1,
              }
            : c
        );
        set({ abandonedCarts: updatedCarts });
        
        // Send email (simulated)
        console.log(`Sending abandoned cart email to ${cart.email}`);
      },
      
      getAbandonedCarts: (hours = 24) => {
        const { abandonedCarts } = get();
        const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
        return abandonedCarts.filter(cart => 
          cart.abandonedAt > cutoffTime && 
          !cart.recoveredAt &&
          cart.recoveryAttempts < 3
        );
      },
      
      // Template management
      createTemplate: (templateData) => {
        const { templates } = get();
        const newTemplate: EmailTemplate = {
          ...templateData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set({ templates: [...templates, newTemplate] });
      },
      
      updateTemplate: (id, updates) => {
        const { templates } = get();
        const updatedTemplates = templates.map(template =>
          template.id === id
            ? { ...template, ...updates, updatedAt: new Date() }
            : template
        );
        set({ templates: updatedTemplates });
      },
      
      deleteTemplate: (id) => {
        const { templates } = get();
        set({ templates: templates.filter(template => template.id !== id) });
      },
      
      getTemplate: (type) => {
        const { templates } = get();
        return templates.find(template => template.type === type && template.isDefault);
      },
      
      // Email preferences
      updatePreferences: (email, preferences) => {
        const { preferences: existingPreferences } = get();
        const existing = existingPreferences.find(p => p.email === email);
        
        if (existing) {
          const updatedPreferences = existingPreferences.map(p =>
            p.email === email
              ? { ...p, ...preferences }
              : p
          );
          set({ preferences: updatedPreferences });
        } else {
          const newPreference: EmailPreference = {
            email,
            marketingEmails: true,
            abandonedCartEmails: true,
            recommendationEmails: true,
            promotionalEmails: true,
            reorderReminders: true,
            frequency: 'weekly',
            ...preferences,
          };
          set({ preferences: [...existingPreferences, newPreference] });
        }
      },
      
      unsubscribe: (email, type) => {
        const { preferences } = get();
        const updatedPreferences = preferences.map(p => {
          if (p.email === email) {
            if (type) {
              return { ...p, [type]: false };
            } else {
              return { ...p, unsubscribedAt: new Date() };
            }
          }
          return p;
        });
        set({ preferences: updatedPreferences });
      },
      
      resubscribe: (email) => {
        const { preferences } = get();
        const updatedPreferences = preferences.map(p =>
          p.email === email
            ? { ...p, unsubscribedAt: undefined }
            : p
        );
        set({ preferences: updatedPreferences });
      },
      
      getPreferences: (email) => {
        const { preferences } = get();
        return preferences.find(p => p.email === email);
      },
      
      // Recommendations
      addRecommendation: (recommendationData) => {
        const { recommendations } = get();
        const newRecommendation: Recommendation = {
          ...recommendationData,
          id: generateId(),
          createdAt: new Date(),
        };
        set({ recommendations: [...recommendations, newRecommendation] });
      },
      
      markRecommendationClicked: (id) => {
        const { recommendations } = get();
        const updatedRecommendations = recommendations.map(rec =>
          rec.id === id
            ? { ...rec, clickedAt: new Date() }
            : rec
        );
        set({ recommendations: updatedRecommendations });
      },
      
      markRecommendationPurchased: (id) => {
        const { recommendations } = get();
        const updatedRecommendations = recommendations.map(rec =>
          rec.id === id
            ? { ...rec, purchasedAt: new Date() }
            : rec
        );
        set({ recommendations: updatedRecommendations });
      },
      
      getRecommendations: (email, limit = 10) => {
        const { recommendations } = get();
        return recommendations
          .filter(rec => rec.email === email && !rec.sentAt)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);
      },
      
      generateRecommendations: async (email, userId) => {
        // Simulate AI-powered recommendation generation
        console.log(`Generating recommendations for ${email}`);
        
        // This would typically call an AI service or use ML models
        const mockRecommendations = [
          {
            productId: 'prod_1',
            productName: 'Natural Face Cream',
            reason: 'browsing_history' as const,
            score: 0.95,
          },
          {
            productId: 'prod_2',
            productName: 'Organic Shampoo',
            reason: 'similar_users' as const,
            score: 0.87,
          },
        ];
        
        mockRecommendations.forEach(rec => {
          get().addRecommendation({
            userId,
            email,
            ...rec,
          });
        });
      },
      
      // Analytics
      getCampaignStats: (campaignId) => {
        const { campaigns } = get();
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign) return null;
        
        return {
          name: campaign.name,
          status: campaign.status,
          sentAt: campaign.sentAt,
          targetAudience: campaign.targetAudience.length,
        };
      },
      
      getAbandonedCartStats: () => {
        const { abandonedCarts } = get();
        const total = abandonedCarts.length;
        const recovered = abandonedCarts.filter(c => c.recoveredAt).length;
        const pending = abandonedCarts.filter(c => !c.recoveredAt && !c.emailSent).length;
        
        return {
          total,
          recovered,
          pending,
          recoveryRate: total > 0 ? (recovered / total) * 100 : 0,
        };
      },
      
      getRecommendationStats: () => {
        const { recommendations } = get();
        const total = recommendations.length;
        const clicked = recommendations.filter(r => r.clickedAt).length;
        const purchased = recommendations.filter(r => r.purchasedAt).length;
        
        return {
          total,
          clicked,
          purchased,
          clickRate: total > 0 ? (clicked / total) * 100 : 0,
          conversionRate: clicked > 0 ? (purchased / clicked) * 100 : 0,
        };
      },
      
      // Utility functions
      canSendEmail: (email, type) => {
        const { preferences } = get();
        const userPrefs = preferences.find(p => p.email === email);
        
        if (!userPrefs) return true; // Default to allowing emails
        
        if (userPrefs.unsubscribedAt) return false;
        
        switch (type) {
          case 'abandoned_cart':
            return userPrefs.abandonedCartEmails;
          case 'recommendations':
            return userPrefs.recommendationEmails;
          case 'promotional':
            return userPrefs.promotionalEmails;
          case 'reorder':
            return userPrefs.reorderReminders;
          default:
            return userPrefs.marketingEmails;
        }
      },
      
      shouldSendAbandonedCartEmail: (cartId) => {
        const { abandonedCarts } = get();
        const cart = abandonedCarts.find(c => c.id === cartId);
        if (!cart) return false;
        
        // Check if enough time has passed since last email
        if (cart.lastEmailSent) {
          const hoursSinceLastEmail = (Date.now() - cart.lastEmailSent.getTime()) / (1000 * 60 * 60);
          if (hoursSinceLastEmail < 24) return false;
        }
        
        // Check if we haven't exceeded max attempts
        if (cart.recoveryAttempts >= 3) return false;
        
        return true;
      },
      
      cleanupOldData: () => {
        const { abandonedCarts, recommendations } = get();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        // Remove old abandoned carts
        const updatedCarts = abandonedCarts.filter(cart => 
          cart.abandonedAt > thirtyDaysAgo || cart.recoveredAt
        );
        
        // Remove old recommendations
        const updatedRecommendations = recommendations.filter(rec => 
          rec.createdAt > thirtyDaysAgo
        );
        
        set({ 
          abandonedCarts: updatedCarts,
          recommendations: updatedRecommendations,
        });
      },
    }),
    { 
      name: 'tejo-email-marketing',
      partialize: (state) => ({
        campaigns: state.campaigns,
        abandonedCarts: state.abandonedCarts,
        templates: state.templates,
        preferences: state.preferences,
        recommendations: state.recommendations,
      }),
    }
  )
);

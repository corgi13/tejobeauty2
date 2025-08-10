import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LoyaltyTier {
  id: string;
  name: string;
  level: number;
  minPoints: number;
  maxPoints?: number;
  benefits: string[];
  discountPercent: number;
  freeShipping: boolean;
  prioritySupport: boolean;
  exclusiveAccess: boolean;
  color: string;
  icon: string;
}

export interface LoyaltyPoints {
  id: string;
  userId?: string;
  email: string;
  currentPoints: number;
  lifetimePoints: number;
  tier: LoyaltyTier;
  pointsHistory: PointsTransaction[];
  rewards: Reward[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PointsTransaction {
  id: string;
  type: 'earned' | 'spent' | 'expired' | 'bonus' | 'adjustment';
  amount: number;
  reason: string;
  orderId?: string;
  productId?: string;
  campaignId?: string;
  expiresAt?: Date;
  createdAt: Date;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'free_product' | 'free_shipping' | 'points_bonus' | 'exclusive_access';
  pointsCost: number;
  value: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  validFrom: Date;
  validUntil?: Date;
  conditions?: string[];
  image?: string;
  category?: string;
}

export interface UserReward {
  id: string;
  userId?: string;
  email: string;
  rewardId: string;
  reward: Reward;
  status: 'active' | 'used' | 'expired';
  earnedAt: Date;
  usedAt?: Date;
  expiresAt?: Date;
  orderId?: string;
}

export interface LoyaltyCampaign {
  id: string;
  name: string;
  description: string;
  type: 'points_multiplier' | 'bonus_points' | 'tier_boost' | 'special_reward';
  multiplier?: number;
  bonusPoints?: number;
  rewardId?: string;
  conditions: string[];
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  targetAudience: string[];
  usageCount: number;
  maxUsage?: number;
}

type LoyaltyState = {
  tiers: LoyaltyTier[];
  userPoints: Record<string, LoyaltyPoints>;
  rewards: Reward[];
  userRewards: UserReward[];
  campaigns: LoyaltyCampaign[];
  
  // Tier management
  getTier: (points: number) => LoyaltyTier;
  getNextTier: (currentPoints: number) => LoyaltyTier | null;
  getTierProgress: (currentPoints: number) => { current: number; next: number; percentage: number };
  
  // Points management
  addPoints: (email: string, amount: number, reason: string, orderId?: string) => void;
  spendPoints: (email: string, amount: number, reason: string) => boolean;
  getPoints: (email: string) => LoyaltyPoints;
  getPointsHistory: (email: string) => PointsTransaction[];
  
  // Rewards management
  createReward: (reward: Omit<Reward, 'id' | 'usedCount'>) => void;
  updateReward: (id: string, updates: Partial<Reward>) => void;
  deleteReward: (id: string) => void;
  getAvailableRewards: (email: string) => Reward[];
  redeemReward: (email: string, rewardId: string) => boolean;
  getUserRewards: (email: string) => UserReward[];
  
  // Campaign management
  createCampaign: (campaign: Omit<LoyaltyCampaign, 'id' | 'usageCount'>) => void;
  updateCampaign: (id: string, updates: Partial<LoyaltyCampaign>) => void;
  deleteCampaign: (id: string) => void;
  getActiveCampaigns: (email: string) => LoyaltyCampaign[];
  applyCampaign: (email: string, campaignId: string, orderId?: string) => void;
  
  // Analytics and insights
  getLoyaltyStats: (email: string) => any;
  getLeaderboard: (limit?: number) => LoyaltyPoints[];
  getTierDistribution: () => Record<string, number>;
  
  // Utility functions
  calculateOrderPoints: (orderTotal: number, email: string) => number;
  checkRewardEligibility: (email: string, rewardId: string) => boolean;
  cleanupExpiredData: () => void;
  exportLoyaltyData: (email: string) => string;
};

// Default loyalty tiers
const defaultTiers: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    level: 1,
    minPoints: 0,
    maxPoints: 999,
    benefits: ['5% discount on all purchases'],
    discountPercent: 5,
    freeShipping: false,
    prioritySupport: false,
    exclusiveAccess: false,
    color: '#CD7F32',
    icon: '🥉',
  },
  {
    id: 'silver',
    name: 'Silver',
    level: 2,
    minPoints: 1000,
    maxPoints: 4999,
    benefits: ['10% discount', 'Free shipping on orders over €50'],
    discountPercent: 10,
    freeShipping: true,
    prioritySupport: false,
    exclusiveAccess: false,
    color: '#C0C0C0',
    icon: '🥈',
  },
  {
    id: 'gold',
    name: 'Gold',
    level: 3,
    minPoints: 5000,
    maxPoints: 19999,
    benefits: ['15% discount', 'Free shipping', 'Priority support'],
    discountPercent: 15,
    freeShipping: true,
    prioritySupport: true,
    exclusiveAccess: false,
    color: '#FFD700',
    icon: '🥇',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    level: 4,
    minPoints: 20000,
    benefits: ['20% discount', 'Free shipping', 'Priority support', 'Exclusive access'],
    discountPercent: 20,
    freeShipping: true,
    prioritySupport: true,
    exclusiveAccess: true,
    color: '#E5E4E2',
    icon: '💎',
  },
];

// Generate unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useLoyalty = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      tiers: defaultTiers,
      userPoints: {},
      rewards: [],
      userRewards: [],
      campaigns: [],
      
      // Tier management
      getTier: (points) => {
        const { tiers } = get();
        const sortedTiers = tiers.sort((a, b) => b.level - a.level);
        return sortedTiers.find(tier => points >= tier.minPoints) || tiers[0];
      },
      
      getNextTier: (currentPoints) => {
        const { tiers } = get();
        const currentTier = get().getTier(currentPoints);
        const nextTier = tiers.find(tier => tier.level === currentTier.level + 1);
        return nextTier || null;
      },
      
      getTierProgress: (currentPoints) => {
        const currentTier = get().getTier(currentPoints);
        const nextTier = get().getNextTier(currentPoints);
        
        if (!nextTier) {
          return { current: currentPoints, next: currentPoints, percentage: 100 };
        }
        
        const tierRange = nextTier.minPoints - currentTier.minPoints;
        const userProgress = currentPoints - currentTier.minPoints;
        const percentage = Math.min(100, (userProgress / tierRange) * 100);
        
        return {
          current: currentPoints,
          next: nextTier.minPoints,
          percentage: Math.round(percentage),
        };
      },
      
      // Points management
      addPoints: (email, amount, reason, orderId) => {
        const { userPoints } = get();
        const existing = userPoints[email];
        
        const transaction: PointsTransaction = {
          id: generateId(),
          type: 'earned',
          amount,
          reason,
          orderId,
          createdAt: new Date(),
        };
        
        if (existing) {
          const updatedPoints: LoyaltyPoints = {
            ...existing,
            currentPoints: existing.currentPoints + amount,
            lifetimePoints: existing.lifetimePoints + amount,
            tier: get().getTier(existing.currentPoints + amount),
            pointsHistory: [...existing.pointsHistory, transaction],
            updatedAt: new Date(),
          };
          
          set({
            userPoints: {
              ...userPoints,
              [email]: updatedPoints,
            },
          });
        } else {
          const newPoints: LoyaltyPoints = {
            id: generateId(),
            email,
            currentPoints: amount,
            lifetimePoints: amount,
            tier: get().getTier(amount),
            pointsHistory: [transaction],
            rewards: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set({
            userPoints: {
              ...userPoints,
              [email]: newPoints,
            },
          });
        }
      },
      
      spendPoints: (email, amount, reason) => {
        const { userPoints } = get();
        const existing = userPoints[email];
        
        if (!existing || existing.currentPoints < amount) {
          return false;
        }
        
        const transaction: PointsTransaction = {
          id: generateId(),
          type: 'spent',
          amount: -amount,
          reason,
          createdAt: new Date(),
        };
        
        const updatedPoints: LoyaltyPoints = {
          ...existing,
          currentPoints: existing.currentPoints - amount,
          tier: get().getTier(existing.currentPoints - amount),
          pointsHistory: [...existing.pointsHistory, transaction],
          updatedAt: new Date(),
        };
        
        set({
          userPoints: {
            ...userPoints,
            [email]: updatedPoints,
          },
        });
        
        return true;
      },
      
      getPoints: (email) => {
        const { userPoints } = get();
        return userPoints[email] || {
          id: generateId(),
          email,
          currentPoints: 0,
          lifetimePoints: 0,
          tier: get().getTier(0),
          pointsHistory: [],
          rewards: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
      
      getPointsHistory: (email) => {
        const points = get().getPoints(email);
        return points.pointsHistory.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      
      // Rewards management
      createReward: (rewardData) => {
        const { rewards } = get();
        const newReward: Reward = {
          ...rewardData,
          id: generateId(),
          usedCount: 0,
        };
        set({ rewards: [...rewards, newReward] });
      },
      
      updateReward: (id, updates) => {
        const { rewards } = get();
        const updatedRewards = rewards.map(reward =>
          reward.id === id ? { ...reward, ...updates } : reward
        );
        set({ rewards: updatedRewards });
      },
      
      deleteReward: (id) => {
        const { rewards } = get();
        set({ rewards: rewards.filter(reward => reward.id !== id) });
      },
      
      getAvailableRewards: (email) => {
        const { rewards } = get();
        const userPoints = get().getPoints(email);
        const now = new Date();
        
        return rewards.filter(reward => {
          if (!reward.isActive) return false;
          if (reward.validFrom > now) return false;
          if (reward.validUntil && reward.validUntil < now) return false;
          if (reward.maxUses && reward.usedCount >= reward.maxUses) return false;
          if (userPoints.currentPoints < reward.pointsCost) return false;
          return true;
        });
      },
      
      redeemReward: (email, rewardId) => {
        const { rewards, userRewards } = get();
        const reward = rewards.find(r => r.id === rewardId);
        const userPoints = get().getPoints(email);
        
        if (!reward || !get().checkRewardEligibility(email, rewardId)) {
          return false;
        }
        
        // Spend points
        if (!get().spendPoints(email, reward.pointsCost, `Redeemed: ${reward.name}`)) {
          return false;
        }
        
        // Create user reward
        const userReward: UserReward = {
          id: generateId(),
          email,
          rewardId,
          reward,
          status: 'active',
          earnedAt: new Date(),
          expiresAt: reward.validUntil,
        };
        
        // Update reward usage count
        get().updateReward(rewardId, { usedCount: reward.usedCount + 1 });
        
        set({ userRewards: [...userRewards, userReward] });
        return true;
      },
      
      getUserRewards: (email) => {
        const { userRewards } = get();
        return userRewards
          .filter(ur => ur.email === email)
          .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime());
      },
      
      // Campaign management
      createCampaign: (campaignData) => {
        const { campaigns } = get();
        const newCampaign: LoyaltyCampaign = {
          ...campaignData,
          id: generateId(),
          usageCount: 0,
        };
        set({ campaigns: [...campaigns, newCampaign] });
      },
      
      updateCampaign: (id, updates) => {
        const { campaigns } = get();
        const updatedCampaigns = campaigns.map(campaign =>
          campaign.id === id ? { ...campaign, ...updates } : campaign
        );
        set({ campaigns: updatedCampaigns });
      },
      
      deleteCampaign: (id) => {
        const { campaigns } = get();
        set({ campaigns: campaigns.filter(campaign => campaign.id !== id) });
      },
      
      getActiveCampaigns: (email) => {
        const { campaigns } = get();
        const now = new Date();
        
        return campaigns.filter(campaign => {
          if (!campaign.isActive) return false;
          if (campaign.validFrom > now) return false;
          if (campaign.validUntil < now) return false;
          if (campaign.maxUsage && campaign.usageCount >= campaign.maxUsage) return false;
          if (campaign.targetAudience.length > 0 && !campaign.targetAudience.includes(email)) return false;
          return true;
        });
      },
      
      applyCampaign: (email, campaignId, orderId) => {
        const { campaigns } = get();
        const campaign = campaigns.find(c => c.id === campaignId);
        
        if (!campaign) return;
        
        // Apply campaign effects
        switch (campaign.type) {
          case 'points_multiplier':
            // This would be applied during order processing
            console.log(`Applying ${campaign.multiplier}x points multiplier for ${email}`);
            break;
          case 'bonus_points':
            if (campaign.bonusPoints) {
              get().addPoints(email, campaign.bonusPoints, `Campaign: ${campaign.name}`, orderId);
            }
            break;
          case 'tier_boost':
            // Temporarily boost tier for this order
            console.log(`Applying tier boost for ${email}`);
            break;
          case 'special_reward':
            if (campaign.rewardId) {
              get().redeemReward(email, campaign.rewardId);
            }
            break;
        }
        
        // Update campaign usage
        get().updateCampaign(campaignId, { usageCount: campaign.usageCount + 1 });
      },
      
      // Analytics and insights
      getLoyaltyStats: (email) => {
        const userPoints = get().getPoints(email);
        const pointsHistory = get().getPointsHistory(email);
        const userRewards = get().getUserRewards(email);
        const nextTier = get().getNextTier(userPoints.currentPoints);
        const progress = get().getTierProgress(userPoints.currentPoints);
        
        const monthlyPoints = pointsHistory
          .filter(transaction => {
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return transaction.createdAt > monthAgo && transaction.type === 'earned';
          })
          .reduce((sum, transaction) => sum + transaction.amount, 0);
        
        return {
          currentPoints: userPoints.currentPoints,
          lifetimePoints: userPoints.lifetimePoints,
          currentTier: userPoints.tier,
          nextTier,
          progress,
          monthlyPoints,
          totalRewards: userRewards.length,
          activeRewards: userRewards.filter(r => r.status === 'active').length,
          pointsToNextTier: nextTier ? nextTier.minPoints - userPoints.currentPoints : 0,
        };
      },
      
      getLeaderboard: (limit = 10) => {
        const { userPoints } = get();
        return Object.values(userPoints)
          .sort((a, b) => b.lifetimePoints - a.lifetimePoints)
          .slice(0, limit);
      },
      
      getTierDistribution: () => {
        const { userPoints } = get();
        const distribution: Record<string, number> = {};
        
        Object.values(userPoints).forEach(points => {
          const tierName = points.tier.name;
          distribution[tierName] = (distribution[tierName] || 0) + 1;
        });
        
        return distribution;
      },
      
      // Utility functions
      calculateOrderPoints: (orderTotal, email) => {
        const basePoints = Math.floor(orderTotal * 10); // 10 points per euro
        const userPoints = get().getPoints(email);
        const activeCampaigns = get().getActiveCampaigns(email);
        
        let multiplier = 1;
        activeCampaigns.forEach(campaign => {
          if (campaign.type === 'points_multiplier' && campaign.multiplier) {
            multiplier *= campaign.multiplier;
          }
        });
        
        // Tier bonus
        const tierBonus = userPoints.tier.level * 0.1; // 10% bonus per tier level
        multiplier += tierBonus;
        
        return Math.floor(basePoints * multiplier);
      },
      
      checkRewardEligibility: (email, rewardId) => {
        const userPoints = get().getPoints(email);
        const reward = get().rewards.find(r => r.id === rewardId);
        
        if (!reward) return false;
        if (userPoints.currentPoints < reward.pointsCost) return false;
        if (!reward.isActive) return false;
        
        const now = new Date();
        if (reward.validFrom > now) return false;
        if (reward.validUntil && reward.validUntil < now) return false;
        if (reward.maxUses && reward.usedCount >= reward.maxUses) return false;
        
        return true;
      },
      
      cleanupExpiredData: () => {
        const { userRewards } = get();
        const now = new Date();
        
        // Mark expired rewards
        const updatedUserRewards = userRewards.map(ur => {
          if (ur.status === 'active' && ur.expiresAt && ur.expiresAt < now) {
            return { ...ur, status: 'expired' as const };
          }
          return ur;
        });
        
        set({ userRewards: updatedUserRewards });
      },
      
      exportLoyaltyData: (email) => {
        const userPoints = get().getPoints(email);
        const pointsHistory = get().getPointsHistory(email);
        const userRewards = get().getUserRewards(email);
        const stats = get().getLoyaltyStats(email);
        
        const exportData = {
          userPoints: {
            ...userPoints,
            createdAt: userPoints.createdAt.toISOString(),
            updatedAt: userPoints.updatedAt.toISOString(),
            pointsHistory: pointsHistory.map(transaction => ({
              ...transaction,
              createdAt: transaction.createdAt.toISOString(),
            })),
          },
          userRewards: userRewards.map(ur => ({
            ...ur,
            earnedAt: ur.earnedAt.toISOString(),
            usedAt: ur.usedAt?.toISOString(),
            expiresAt: ur.expiresAt?.toISOString(),
          })),
          stats,
          exportedAt: new Date().toISOString(),
        };
        
        return JSON.stringify(exportData, null, 2);
      },
    }),
    { 
      name: 'tejo-loyalty',
      partialize: (state) => ({
        tiers: state.tiers,
        userPoints: state.userPoints,
        rewards: state.rewards,
        userRewards: state.userRewards,
        campaigns: state.campaigns,
      }),
    }
  )
);

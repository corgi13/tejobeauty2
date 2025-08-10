import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  verifiedPurchase: boolean;
  helpfulVotes: number;
  totalVotes: number;
  userVote?: 'helpful' | 'not_helpful' | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewFilters {
  rating?: number;
  verifiedOnly?: boolean;
  hasPhotos?: boolean;
  sortBy?: 'newest' | 'oldest' | 'helpful' | 'rating';
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  verifiedReviews: number;
  reviewsWithPhotos: number;
}

type ReviewsState = {
  reviews: Review[];
  userReviews: Review[];
  reviewStats: Record<string, ReviewStats>;
  
  // Review actions
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpfulVotes' | 'totalVotes'>) => void;
  updateReview: (id: string, updates: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  
  // Vote actions
  voteHelpful: (reviewId: string, isHelpful: boolean) => void;
  removeVote: (reviewId: string) => void;
  
  // Photo actions
  addReviewPhoto: (reviewId: string, imageUrl: string) => void;
  removeReviewPhoto: (reviewId: string, imageUrl: string) => void;
  
  // Filtering and sorting
  getProductReviews: (productId: string, filters?: ReviewFilters) => Review[];
  getReviewStats: (productId: string) => ReviewStats;
  
  // Utility functions
  getReview: (id: string) => Review | undefined;
  getUserReviews: (userId: string) => Review[];
  getRecentReviews: (limit?: number) => Review[];
  getTopReviews: (limit?: number) => Review[];
  calculateReviewStats: (productId: string) => void;
  
  // Export/Import
  exportReviews: () => string;
  importReviews: (data: string) => void;
};

// Generate unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useReviews = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: [],
      userReviews: [],
      reviewStats: {},
      
      addReview: (reviewData) => {
        const { reviews } = get();
        const newReview: Review = {
          ...reviewData,
          id: generateId(),
          helpfulVotes: 0,
          totalVotes: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set({ reviews: [...reviews, newReview] });
        get().calculateReviewStats(reviewData.productId);
      },
      
      updateReview: (id, updates) => {
        const { reviews } = get();
        const updatedReviews = reviews.map(review =>
          review.id === id
            ? { ...review, ...updates, updatedAt: new Date() }
            : review
        );
        set({ reviews: updatedReviews });
        
        // Update stats for the product
        const review = reviews.find(r => r.id === id);
        if (review) {
          get().calculateReviewStats(review.productId);
        }
      },
      
      deleteReview: (id) => {
        const { reviews } = get();
        const review = reviews.find(r => r.id === id);
        const updatedReviews = reviews.filter(r => r.id !== id);
        set({ reviews: updatedReviews });
        
        if (review) {
          get().calculateReviewStats(review.productId);
        }
      },
      
      voteHelpful: (reviewId, isHelpful) => {
        const { reviews } = get();
        const updatedReviews = reviews.map(review => {
          if (review.id === reviewId) {
            const currentVote = review.userVote;
            let helpfulVotes = review.helpfulVotes;
            let totalVotes = review.totalVotes;
            
            // Remove previous vote if exists
            if (currentVote === 'helpful') {
              helpfulVotes--;
              totalVotes--;
            } else if (currentVote === 'not_helpful') {
              totalVotes--;
            }
            
            // Add new vote
            if (isHelpful) {
              helpfulVotes++;
              totalVotes++;
            } else {
              totalVotes++;
            }
            
            return {
              ...review,
              helpfulVotes,
              totalVotes,
              userVote: isHelpful ? 'helpful' as const : 'not_helpful' as const,
            };
          }
          return review;
        });
        set({ reviews: updatedReviews });
      },
      
      removeVote: (reviewId) => {
        const { reviews } = get();
        const updatedReviews = reviews.map(review => {
          if (review.id === reviewId) {
            let helpfulVotes = review.helpfulVotes;
            let totalVotes = review.totalVotes;
            
            // Remove current vote
            if (review.userVote === 'helpful') {
              helpfulVotes--;
              totalVotes--;
            } else if (review.userVote === 'not_helpful') {
              totalVotes--;
            }
            
            return {
              ...review,
              helpfulVotes,
              totalVotes,
              userVote: null,
            };
          }
          return review;
        });
        set({ reviews: updatedReviews });
      },
      
      addReviewPhoto: (reviewId, imageUrl) => {
        const { reviews } = get();
        const updatedReviews = reviews.map(review =>
          review.id === reviewId
            ? { ...review, images: [...review.images, imageUrl] }
            : review
        );
        set({ reviews: updatedReviews });
      },
      
      removeReviewPhoto: (reviewId, imageUrl) => {
        const { reviews } = get();
        const updatedReviews = reviews.map(review =>
          review.id === reviewId
            ? { ...review, images: review.images.filter(img => img !== imageUrl) }
            : review
        );
        set({ reviews: updatedReviews });
      },
      
      getProductReviews: (productId, filters = {}) => {
        const { reviews } = get();
        let filteredReviews = reviews.filter(review => review.productId === productId);
        
        // Apply filters
        if (filters.rating) {
          filteredReviews = filteredReviews.filter(review => review.rating === filters.rating);
        }
        
        if (filters.verifiedOnly) {
          filteredReviews = filteredReviews.filter(review => review.verifiedPurchase);
        }
        
        if (filters.hasPhotos) {
          filteredReviews = filteredReviews.filter(review => review.images.length > 0);
        }
        
        // Apply sorting
        switch (filters.sortBy) {
          case 'newest':
            filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'oldest':
            filteredReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case 'helpful':
            filteredReviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
            break;
          case 'rating':
            filteredReviews.sort((a, b) => b.rating - a.rating);
            break;
          default:
            // Default: newest first
            filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        
        return filteredReviews;
      },
      
      getReviewStats: (productId) => {
        const { reviewStats } = get();
        return reviewStats[productId] || {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          verifiedReviews: 0,
          reviewsWithPhotos: 0,
        };
      },
      
      getReview: (id) => {
        const { reviews } = get();
        return reviews.find(review => review.id === id);
      },
      
      getUserReviews: (userId) => {
        const { reviews } = get();
        return reviews.filter(review => review.userId === userId);
      },
      
      getRecentReviews: (limit = 10) => {
        const { reviews } = get();
        return reviews
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      },
      
      getTopReviews: (limit = 10) => {
        const { reviews } = get();
        return reviews
          .sort((a, b) => b.helpfulVotes - a.helpfulVotes)
          .slice(0, limit);
      },
      
      calculateReviewStats: (productId) => {
        const { reviews } = get();
        const productReviews = reviews.filter(review => review.productId === productId);
        
        if (productReviews.length === 0) {
          const { reviewStats } = get();
          set({
            reviewStats: {
              ...reviewStats,
              [productId]: {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                verifiedReviews: 0,
                reviewsWithPhotos: 0,
              },
            },
          });
          return;
        }
        
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / productReviews.length;
        
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        productReviews.forEach(review => {
          ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
        });
        
        const verifiedReviews = productReviews.filter(review => review.verifiedPurchase).length;
        const reviewsWithPhotos = productReviews.filter(review => review.images.length > 0).length;
        
        const { reviewStats } = get();
        set({
          reviewStats: {
            ...reviewStats,
            [productId]: {
              averageRating: Math.round(averageRating * 10) / 10,
              totalReviews: productReviews.length,
              ratingDistribution,
              verifiedReviews,
              reviewsWithPhotos,
            },
          },
        });
      },
      
      exportReviews: () => {
        const { reviews } = get();
        const exportData = {
          reviews: reviews.map(review => ({
            ...review,
            createdAt: review.createdAt.toISOString(),
            updatedAt: review.updatedAt.toISOString(),
          })),
          exportedAt: new Date().toISOString(),
        };
        return JSON.stringify(exportData, null, 2);
      },
      
      importReviews: (data) => {
        try {
          const importData = JSON.parse(data);
          if (importData.reviews && Array.isArray(importData.reviews)) {
            const importedReviews: Review[] = importData.reviews.map((review: any) => ({
              ...review,
              createdAt: new Date(review.createdAt),
              updatedAt: new Date(review.updatedAt),
            }));
            set({ reviews: importedReviews });
            
            // Recalculate stats for all products
            const productIds = [...new Set(importedReviews.map(r => r.productId))];
            productIds.forEach(productId => {
              get().calculateReviewStats(productId);
            });
          }
        } catch (error) {
          console.error('Failed to import reviews:', error);
        }
      },
    }),
    { 
      name: 'tejo-reviews',
      partialize: (state) => ({
        reviews: state.reviews,
        reviewStats: state.reviewStats,
      }),
    }
  )
);

"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Crown, Star, Gem, Trophy, Medal, Sparkles } from "lucide-react";

export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "vip";

interface LoyaltyBadgeProps {
  tier: LoyaltyTier;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const tierConfig = {
  bronze: {
    label: "Bronze",
    colors: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Medal,
    iconColor: "text-amber-600",
  },
  silver: {
    label: "Silver",
    colors: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Star,
    iconColor: "text-gray-600",
  },
  gold: {
    label: "Gold",
    colors: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Crown,
    iconColor: "text-yellow-600",
  },
  platinum: {
    label: "Platinum",
    colors: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Gem,
    iconColor: "text-blue-600",
  },
  diamond: {
    label: "Diamond",
    colors: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Sparkles,
    iconColor: "text-purple-600",
  },
  vip: {
    label: "VIP",
    colors: "bg-gradient-to-r from-gold-400 to-gold-600 text-white border-gold-500",
    icon: Trophy,
    iconColor: "text-white",
  },
};

const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

export const LoyaltyBadge: React.FC<LoyaltyBadgeProps> = ({
  tier,
  showIcon = true,
  size = "md",
  className,
  animated = true,
}) => {
  const config = tierConfig[tier];
  const IconComponent = config.icon;

  const BadgeContent = (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-semibold transition-all duration-300",
        config.colors,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <IconComponent
          className={cn("w-4 h-4", config.iconColor, {
            "w-3 h-3": size === "sm",
            "w-5 h-5": size === "lg",
          })}
        />
      )}
      <span>{config.label}</span>
    </div>
  );

  if (!animated) {
    return BadgeContent;
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ 
        scale: 1.05,
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      {BadgeContent}
    </motion.div>
  );
};

// Specialized badge components
export const BronzeBadge: React.FC<Omit<LoyaltyBadgeProps, "tier">> = (props) => (
  <LoyaltyBadge tier="bronze" {...props} />
);

export const SilverBadge: React.FC<Omit<LoyaltyBadgeProps, "tier">> = (props) => (
  <LoyaltyBadge tier="silver" {...props} />
);

export const GoldBadge: React.FC<Omit<LoyaltyBadgeProps, "tier">> = (props) => (
  <LoyaltyBadge tier="gold" {...props} />
);

export const PlatinumBadge: React.FC<Omit<LoyaltyBadgeProps, "tier">> = (props) => (
  <LoyaltyBadge tier="platinum" {...props} />
);

export const DiamondBadge: React.FC<Omit<LoyaltyBadgeProps, "tier">> = (props) => (
  <LoyaltyBadge tier="diamond" {...props} />
);

export const VIPBadge: React.FC<Omit<LoyaltyBadgeProps, "tier">> = (props) => (
  <LoyaltyBadge tier="vip" {...props} />
);

// Badge with level indicator
interface LoyaltyBadgeWithLevelProps extends LoyaltyBadgeProps {
  level: number;
  maxLevel?: number;
}

export const LoyaltyBadgeWithLevel: React.FC<LoyaltyBadgeWithLevelProps> = ({
  tier,
  level,
  maxLevel = 5,
  ...props
}) => {
  return (
    <div className="flex items-center gap-2">
      <LoyaltyBadge tier={tier} {...props} />
      <div className="flex items-center gap-1">
        {Array.from({ length: maxLevel }, (_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-colors duration-300",
              i < level ? "bg-gold-500" : "bg-cream-300"
            )}
          />
        ))}
      </div>
    </div>
  );
};

// Badge collection display
interface LoyaltyBadgeCollectionProps {
  tiers: Array<{ tier: LoyaltyTier; unlocked: boolean; level?: number }>;
  className?: string;
}

export const LoyaltyBadgeCollection: React.FC<LoyaltyBadgeCollectionProps> = ({
  tiers,
  className,
}) => {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {tiers.map(({ tier, unlocked, level }) => (
        <div key={tier} className="relative">
          <LoyaltyBadge
            tier={tier}
            animated={false}
            className={cn(
              unlocked ? "opacity-100" : "opacity-40 grayscale"
            )}
          />
          {unlocked && level && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {level}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
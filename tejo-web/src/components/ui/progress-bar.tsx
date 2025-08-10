"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showPercentage?: boolean;
  showAmount?: boolean;
  currency?: string;
  className?: string;
  variant?: "default" | "loyalty" | "shipping";
  size?: "sm" | "md" | "lg";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  label,
  showPercentage = true,
  showAmount = true,
  currency = "EUR",
  className,
  variant = "default",
  size = "md",
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  const remaining = Math.max(target - current, 0);

  const sizeClasses = {
    sm: "h-2 text-xs",
    md: "h-3 text-sm",
    lg: "h-4 text-base",
  };

  const variantClasses = {
    default: "bg-cream-200",
    loyalty: "bg-gradient-to-r from-amber-100 to-yellow-100",
    shipping: "bg-gradient-to-r from-blue-100 to-indigo-100",
  };

  const progressColors = {
    default: "from-gold-400 to-gold-600",
    loyalty: "from-amber-400 to-yellow-500",
    shipping: "from-blue-400 to-indigo-500",
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="font-medium text-onyx-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-semibold text-onyx-600">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn("relative w-full rounded-full overflow-hidden", variantClasses[variant], sizeClasses[size])}>
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", progressColors[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Shimmer effect on progress */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {showAmount && (
        <div className="flex items-center justify-between text-xs text-onyx-600">
          <span>
            {formatAmount(current)} / {formatAmount(target)}
          </span>
          {remaining > 0 && (
            <span className="font-medium">
              {formatAmount(remaining)} to go
            </span>
          )}
        </div>
      )}

      {/* Progress message */}
      {percentage >= 100 ? (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium"
          >
            🎉 Goal reached!
          </motion.div>
        </div>
      ) : (
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-xs text-onyx-500"
          >
            {variant === "shipping" && `Add ${formatAmount(remaining)} more for free shipping!`}
            {variant === "loyalty" && `${formatAmount(remaining)} more to next tier!`}
            {variant === "default" && `Keep going!`}
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Specialized components
export const FreeShippingProgress: React.FC<{
  current: number;
  threshold: number;
  currency?: string;
  className?: string;
}> = ({ current, threshold, currency, className }) => (
  <ProgressBar
    current={current}
    target={threshold}
    label="Free Shipping Progress"
    variant="shipping"
    size="md"
    currency={currency}
    className={className}
  />
);

export const LoyaltyProgress: React.FC<{
  current: number;
  target: number;
  tier: string;
  nextTier: string;
  className?: string;
}> = ({ current, target, tier, nextTier, className }) => (
  <div className={cn("space-y-3", className)}>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-onyx-700">Loyalty Progress</span>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-onyx-100 text-onyx-700">
          {tier}
        </span>
        <span className="text-xs text-onyx-500">→</span>
        <span className="text-xs px-2 py-1 rounded-full bg-gold-100 text-gold-700">
          {nextTier}
        </span>
      </div>
    </div>
    
    <ProgressBar
      current={current}
      target={target}
      variant="loyalty"
      size="md"
      showAmount={true}
      showPercentage={false}
    />
  </div>
);
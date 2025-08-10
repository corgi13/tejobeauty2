"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Spinner variants
const spinnerVariants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Basic Spinner
interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dots" | "bars" | "pulse" | "bounce";
  className?: string;
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "default",
  className,
  color = "text-gold-500",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn("rounded-full bg-current", sizeClasses[size])}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={cn("w-1 bg-current rounded-full", {
              "h-3": size === "sm",
              "h-4": size === "md",
              "h-6": size === "lg",
              "h-8": size === "xl",
            })}
            animate={{
              scaleY: [1, 2, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        className={cn("rounded-full bg-current", sizeClasses[size], className)}
        variants={spinnerVariants}
        animate="pulse"
      />
    );
  }

  if (variant === "bounce") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn("rounded-full bg-current", {
              "w-2 h-2": size === "sm",
              "w-3 h-3": size === "md",
              "w-4 h-4": size === "lg",
              "w-6 h-6": size === "xl",
            })}
            variants={spinnerVariants}
            animate="bounce"
            transition={{
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  // Default spinner
  return (
    <motion.div
      className={cn(
        "border-2 border-current border-t-transparent rounded-full",
        sizeClasses[size],
        color,
        className
      )}
      variants={spinnerVariants}
      animate="spin"
    />
  );
};

// Loading Overlay
interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  variant?: "fullscreen" | "overlay" | "inline";
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = "Učitavanje...",
  variant = "overlay",
  className,
}) => {
  if (!isLoading) return null;

  const overlayClasses = {
    fullscreen: "fixed inset-0 z-50",
    overlay: "absolute inset-0 z-10",
    inline: "relative",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex items-center justify-center bg-white/80 backdrop-blur-sm",
        overlayClasses[variant],
        className
      )}
    >
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-onyx-600 font-medium"
        >
          {text}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Skeleton Components
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  lines = 1,
}) => {
  if (variant === "text") {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "h-4 bg-onyx-200 rounded animate-pulse",
              i === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (variant === "circular") {
    return (
      <motion.div
        className={cn("bg-onyx-200 rounded-full animate-pulse", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    );
  }

  return (
    <motion.div
      className={cn("bg-onyx-200 rounded animate-pulse", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}>
    <Skeleton className="w-full h-48" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" lines={2} />
      <Skeleton className="w-24 h-6" />
      <Skeleton className="w-full h-10" />
    </div>
  </div>
);

// Blog Post Skeleton
export const BlogPostSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}>
    <Skeleton className="w-full h-48" />
    <div className="p-6 space-y-4">
      <Skeleton variant="text" lines={1} />
      <Skeleton variant="text" lines={3} />
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="w-10 h-10" />
        <Skeleton className="w-32 h-4" />
      </div>
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 5,
  columns = 4,
  className,
}) => (
  <div className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}>
    <div className="p-6">
      <Skeleton className="w-48 h-8 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton
                key={j}
                className={cn("h-4", {
                  "w-24": j === 0,
                  "w-32": j === 1,
                  "w-20": j === 2,
                  "w-16": j === 3,
                })}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Progress Bar
interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "gradient" | "glow";
  size?: "sm" | "md" | "lg";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className,
  showLabel = false,
  variant = "default",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const progressClasses = {
    default: "bg-gold-500",
    gradient: "bg-gradient-to-r from-gold-400 to-gold-600",
    glow: "bg-gold-500 shadow-lg shadow-gold-500/50",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-onyx-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className={cn("bg-onyx-200 rounded-full overflow-hidden", sizeClasses[size])}>
        <motion.div
          className={cn("h-full rounded-full transition-all duration-300", progressClasses[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Shimmer Effect
export const Shimmer: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("relative overflow-hidden", className)}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

// Pulse Ring
export const PulseRing: React.FC<{ className?: string; size?: number }> = ({ 
  className, 
  size = 40 
}) => (
  <div className={cn("relative", className)} style={{ width: size, height: size }}>
    <motion.div
      className="absolute inset-0 border-2 border-gold-500 rounded-full"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute inset-0 border-2 border-gold-400 rounded-full"
      animate={{
        scale: [1, 1.4, 1],
        opacity: [1, 0.3, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      }}
    />
    <div className="absolute inset-0 border-2 border-gold-300 rounded-full" />
  </div>
);

// Loading Dots
export const LoadingDots: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("flex items-center gap-1", className)}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-gold-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Wave Loading
export const WaveLoading: React.FC<{ className?: string; bars?: number }> = ({ 
  className, 
  bars = 5 
}) => (
  <div className={cn("flex items-center gap-1", className)}>
    {Array.from({ length: bars }).map((_, i) => (
      <motion.div
        key={i}
        className="w-1 bg-gold-500 rounded-full"
        animate={{
          scaleY: [1, 2, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.1,
          ease: "easeInOut",
        }}
        style={{ height: 20 }}
      />
    ))}
  </div>
);
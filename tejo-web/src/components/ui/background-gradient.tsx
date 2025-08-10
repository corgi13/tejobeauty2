"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundGradientProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  variant?: "default" | "gold" | "cream" | "blush" | "gradient" | "mesh";
  size?: "sm" | "md" | "lg" | "xl";
  duration?: number;
  blur?: boolean;
  opacity?: number;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  children,
  className,
  containerClassName,
  variant = "default",
  size = "md",
  duration = 20,
  blur = true,
  opacity = 0.1,
}) => {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
    xl: "w-[32rem] h-[32rem]",
  };

  const variantConfigs = {
    default: {
      colors: ["rgba(255, 215, 0, 0.1)", "rgba(255, 182, 193, 0.1)", "rgba(245, 245, 220, 0.1)"],
      positions: ["0% 0%", "100% 100%", "50% 50%"],
    },
    gold: {
      colors: ["rgba(255, 215, 0, 0.15)", "rgba(218, 165, 32, 0.1)", "rgba(255, 223, 0, 0.1)"],
      positions: ["0% 0%", "100% 100%", "50% 50%"],
    },
    cream: {
      colors: ["rgba(245, 245, 220, 0.1)", "rgba(255, 248, 220, 0.1)", "rgba(250, 235, 215, 0.1)"],
      positions: ["0% 0%", "100% 100%", "50% 50%"],
    },
    blush: {
      colors: ["rgba(255, 182, 193, 0.1)", "rgba(255, 192, 203, 0.1)", "rgba(255, 20, 147, 0.1)"],
      positions: ["0% 0%", "100% 100%", "50% 50%"],
    },
    gradient: {
      colors: ["rgba(255, 215, 0, 0.1)", "rgba(255, 182, 193, 0.1)", "rgba(245, 245, 220, 0.1)", "rgba(255, 215, 0, 0.1)"],
      positions: ["0% 0%", "25% 25%", "50% 50%", "75% 75%"],
    },
    mesh: {
      colors: ["rgba(255, 215, 0, 0.08)", "rgba(255, 182, 193, 0.08)", "rgba(245, 245, 220, 0.08)", "rgba(255, 215, 0, 0.08)"],
      positions: ["0% 0%", "33% 33%", "66% 66%", "100% 100%"],
    },
  };

  const config = variantConfigs[variant];

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Animated background gradients */}
      <motion.div
        className={cn(
          "absolute inset-0 -z-10",
          blur && "blur-3xl",
          sizeClasses[size]
        )}
        style={{
          background: `radial-gradient(circle at ${config.positions[0]}, ${config.colors[0]}, transparent 50%)`,
          opacity,
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={cn(
          "absolute inset-0 -z-10",
          blur && "blur-3xl",
          sizeClasses[size]
        )}
        style={{
          background: `radial-gradient(circle at ${config.positions[1]}, ${config.colors[1]}, transparent 50%)`,
          opacity,
        }}
        animate={{
          x: [100, 0, 100],
          y: [100, 0, 100],
        }}
        transition={{
          duration: duration * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {variant === "gradient" && (
        <motion.div
          className={cn(
            "absolute inset-0 -z-10",
            blur && "blur-3xl",
            sizeClasses[size]
          )}
          style={{
            background: `radial-gradient(circle at ${config.positions[2]}, ${config.colors[2]}, transparent 50%)`,
            opacity,
          }}
          animate={{
            x: [50, 150, 50],
            y: [50, 150, 50],
          }}
          transition={{
            duration: duration * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {variant === "mesh" && (
        <>
          <motion.div
            className={cn(
              "absolute inset-0 -z-10",
              blur && "blur-3xl",
              sizeClasses[size]
            )}
            style={{
              background: `radial-gradient(circle at ${config.positions[2]}, ${config.colors[2]}, transparent 50%)`,
              opacity,
            }}
            animate={{
              x: [50, 150, 50],
              y: [50, 150, 50],
            }}
            transition={{
              duration: duration * 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className={cn(
              "absolute inset-0 -z-10",
              blur && "blur-3xl",
              sizeClasses[size]
            )}
            style={{
              background: `radial-gradient(circle at ${config.positions[3]}, ${config.colors[3]}, transparent 50%)`,
              opacity,
            }}
            animate={{
              x: [150, 50, 150],
              y: [150, 50, 150],
            }}
            transition={{
              duration: duration * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      {/* Content */}
      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
};

// Floating orbs background
interface FloatingOrbsProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  count?: number;
  size?: "sm" | "md" | "lg";
  duration?: number;
  opacity?: number;
  blur?: boolean;
}

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({
  children,
  className,
  containerClassName,
  count = 6,
  size = "md",
  duration = 15,
  opacity = 0.1,
  blur = false,
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: (i / count) * duration,
    duration: duration * (0.8 + Math.random() * 0.4),
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={cn(
            "absolute rounded-full bg-gradient-to-br from-gold-200/20 to-blush-200/20",
            blur === true ? "blur-xl" : "",
            sizeClasses[size]
          )}
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            opacity,
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
};

// Animated grid background
interface AnimatedGridProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  size?: "sm" | "md" | "lg";
  duration?: number;
  opacity?: number;
  color?: string;
}

export const AnimatedGrid: React.FC<AnimatedGridProps> = ({
  children,
  className,
  containerClassName,
  size = "md",
  duration = 20,
  opacity = 0.05,
  color = "rgba(255, 215, 0, 0.1)",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${color} 1px, transparent 1px),
            linear-gradient(90deg, ${color} 1px, transparent 1px)
          `,
          backgroundSize: `${sizeClasses[size]} ${sizeClasses[size]}`,
          opacity,
        }}
        animate={{
          x: [0, -parseInt(sizeClasses[size])],
          y: [0, -parseInt(sizeClasses[size])],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
};

// Combined background effects
interface CombinedBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  effects?: Array<"gradient" | "orbs" | "grid">;
  variant?: "default" | "gold" | "cream" | "blush";
  size?: "sm" | "md" | "lg" | "xl";
  duration?: number;
  opacity?: number;
}

export const CombinedBackground: React.FC<CombinedBackgroundProps> = ({
  children,
  className,
  containerClassName,
  effects = ["gradient"],
  variant = "default",
  size = "md",
  duration = 20,
  opacity = 0.1,
}) => {
  return (
    <div className={cn("relative", containerClassName)}>
      {effects.includes("gradient") && (
        <BackgroundGradient
          variant={variant}
          size={size}
          duration={duration}
          opacity={opacity * 0.7}
        />
      )}
      
      {effects.includes("orbs") && (
        <FloatingOrbs
          count={4}
          size="sm"
          duration={duration * 0.8}
          opacity={opacity * 0.5}
        />
      )}
      
      {effects.includes("grid") && (
        <AnimatedGrid
          size="md"
          duration={duration * 1.5}
          opacity={opacity * 0.3}
        />
      )}

      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
};
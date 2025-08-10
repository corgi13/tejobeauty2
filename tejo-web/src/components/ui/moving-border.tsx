"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  rx?: number;
  ry?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  borderWidth?: number;
  asChild?: boolean;
}

export const MovingBorder: React.FC<MovingBorderProps> = ({
  children,
  duration = 2000,
  rx = 16,
  ry = 16,
  className,
  containerClassName,
  borderClassName,
  borderWidth = 2,
  asChild = false,
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        containerClassName
      )}
    >
      <motion.div
        className={cn(
          "absolute inset-0 rounded-[inherit]",
          borderClassName
        )}
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent)`,
          border: `${borderWidth}px solid transparent`,
          borderRadius: `${rx}px`,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className={cn(
          "absolute inset-0 rounded-[inherit]",
          borderClassName
        )}
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent)`,
          border: `${borderWidth}px solid transparent`,
          borderRadius: `${rx}px`,
        }}
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: duration * 0.8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div
        className={cn(
          "relative z-10 rounded-[inherit]",
          className
        )}
        style={{
          borderRadius: `${rx}px`,
        }}
      >
        {asChild ? children : <div>{children}</div>}
      </div>
    </div>
  );
};

// Border beam effect
interface BorderBeamProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  asChild?: boolean;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderClassName,
  asChild = false,
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        containerClassName
      )}
    >
      <motion.div
        className={cn(
          "absolute inset-0",
          borderClassName
        )}
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.8), transparent)`,
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className={cn("relative z-10", className)}>
        {asChild ? children : <div>{children}</div>}
      </div>
    </div>
  );
};

// Glow border effect
interface GlowBorderProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  asChild?: boolean;
}

export const GlowBorder: React.FC<GlowBorderProps> = ({
  children,
  intensity = 0.6,
  className,
  containerClassName,
  borderClassName,
  asChild = false,
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        containerClassName
      )}
    >
      <motion.div
        className={cn(
          "absolute inset-0 rounded-[inherit] blur-sm",
          borderClassName
        )}
        style={{
          background: `radial-gradient(circle, rgba(255, 215, 0, ${intensity}) 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className={cn("relative z-10", className)}>
        {asChild ? children : <div>{children}</div>}
      </div>
    </div>
  );
};

// Shine effect
interface ShineProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  shineClassName?: string;
  asChild?: boolean;
}

export const Shine: React.FC<ShineProps> = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  shineClassName,
  asChild = false,
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        containerClassName
      )}
    >
      <motion.div
        className={cn(
          "absolute inset-0 -skew-x-12",
          shineClassName
        )}
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)`,
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className={cn("relative z-10", className)}>
        {asChild ? children : <div>{children}</div>}
      </div>
    </div>
  );
};

// Neon glow effect
interface NeonGlowProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  className?: string;
  containerClassName?: string;
  asChild?: boolean;
}

export const NeonGlow: React.FC<NeonGlowProps> = ({
  children,
  color = "rgba(255, 215, 0, 0.8)",
  intensity = 0.6,
  className,
  containerClassName,
  asChild = false,
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        containerClassName
      )}
    >
      <motion.div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: `blur(${intensity * 20}px)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className={cn("relative z-10", className)}>
        {asChild ? children : <div>{children}</div>}
      </div>
    </div>
  );
};

// Combined effects
interface AnimatedBorderProps {
  children: React.ReactNode;
  variant?: "moving" | "beam" | "glow" | "shine" | "neon" | "combined";
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  asChild?: boolean;
}

export const AnimatedBorder: React.FC<AnimatedBorderProps> = ({
  children,
  variant = "moving",
  duration = 2000,
  className,
  containerClassName,
  borderClassName,
  asChild = false,
}) => {
  switch (variant) {
    case "moving":
      return (
        <MovingBorder
          duration={duration}
          className={className}
          containerClassName={containerClassName}
          borderClassName={borderClassName}
          asChild={asChild}
        >
          {children}
        </MovingBorder>
      );
    
    case "beam":
      return (
        <BorderBeam
          duration={duration}
          className={className}
          containerClassName={containerClassName}
          borderClassName={borderClassName}
          asChild={asChild}
        >
          {children}
        </BorderBeam>
      );
    
    case "glow":
      return (
        <GlowBorder
          className={className}
          containerClassName={containerClassName}
          borderClassName={borderClassName}
          asChild={asChild}
        >
          {children}
        </GlowBorder>
      );
    
    case "shine":
      return (
        <Shine
          duration={duration}
          className={className}
          containerClassName={containerClassName}
          asChild={asChild}
        >
          {children}
        </Shine>
      );
    
    case "neon":
      return (
        <NeonGlow
          className={className}
          containerClassName={containerClassName}
          asChild={asChild}
        >
          {children}
        </NeonGlow>
      );
    
    case "combined":
      return (
        <div className={cn("relative", containerClassName)}>
          <MovingBorder
            duration={duration}
            className={className}
            borderClassName={borderClassName}
            asChild={asChild}
          >
            {children}
          </MovingBorder>
          
          <GlowBorder
            className="absolute inset-0"
            asChild={asChild}
          >
            <div className="opacity-50" />
          </GlowBorder>
        </div>
      );
    
    default:
      return <>{children}</>;
  }
};
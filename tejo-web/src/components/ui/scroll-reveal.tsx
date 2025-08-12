"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// Scroll Reveal Container
interface ScrollRevealContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
  threshold?: number;
}

export const ScrollRevealContainer: React.FC<ScrollRevealContainerProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 50,
  once = true,
  threshold = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getTransform = () => {
    switch (direction) {
      case "up":
        return { y: distance, opacity: 0 };
      case "down":
        return { y: -distance, opacity: 0 };
      case "left":
        return { x: distance, opacity: 0 };
      case "right":
        return { x: -distance, opacity: 0 };
      default:
        return { opacity: 0 };
    }
  };

  const getAnimate = () => {
    switch (direction) {
      case "up":
        return { y: 0, opacity: 1 };
      case "down":
        return { y: 0, opacity: 1 };
      case "left":
        return { x: 0, opacity: 1 };
      case "right":
        return { x: 0, opacity: 1 };
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getTransform()}
      animate={isInView ? getAnimate() : getTransform()}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
};

// Sticky Scroll Container
interface StickyScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
  speed?: number;
}

export const StickyScrollContainer: React.FC<StickyScrollContainerProps> = ({
  children,
  className,
  offset = 0,
  speed = 0.5,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, offset - 100 * speed]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};

// Parallax Container
interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
  offset?: number;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  className,
  speed = 0.5,
  direction = "up",
  offset = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up" 
      ? [offset, offset - 100 * speed]
      : [offset, offset + 100 * speed]
  );

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};

// Fade In On Scroll
interface FadeInOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export const FadeInOnScroll: React.FC<FadeInOnScrollProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
};

// Scale In On Scroll
interface ScaleInOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  scale?: number;
}

export const ScaleInOnScroll: React.FC<ScaleInOnScrollProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  once = true,
  scale = 0.8,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
};

// Slide In On Scroll
interface SlideInOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  direction?: "left" | "right" | "up" | "down";
  distance?: number;
}

export const SlideInOnScroll: React.FC<SlideInOnScrollProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  once = true,
  direction = "left",
  distance = 100,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getInitialTransform = () => {
    switch (direction) {
      case "left":
        return { x: -distance, opacity: 0 };
      case "right":
        return { x: distance, opacity: 0 };
      case "up":
        return { y: distance, opacity: 0 };
      case "down":
        return { y: -distance, opacity: 0 };
      default:
        return { x: -distance, opacity: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialTransform()}
      animate={isInView ? { x: 0, y: 0, opacity: 1 } : getInitialTransform()}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
};

// Rotate In On Scroll
interface RotateInOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  rotation?: number;
}

export const RotateInOnScroll: React.FC<RotateInOnScrollProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  once = true,
  rotation = 15,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, rotate: -rotation }}
      animate={isInView ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -rotation }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered Children
interface StaggeredChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
  once?: boolean;
}

export const StaggeredChildren: React.FC<StaggeredChildrenProps> = ({
  children,
  className,
  staggerDelay = 0.1,
  threshold = 0.1,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Intersection Observer Hook
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return { ref, isIntersecting, entry };
};

// Scroll Progress Indicator
interface ScrollProgressIndicatorProps {
  className?: string;
  color?: string;
  height?: number;
}

export const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({
  className,
  color = "bg-gold-500",
  height = 2,
}) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className={cn("fixed top-0 left-0 right-0 z-50 origin-left", className)}
      style={{
        height,
        background: `linear-gradient(90deg, ${color}, ${color})`,
        transformOrigin: "0%",
        scaleX: scrollYProgress,
      }}
    />
  );
};

// Scroll Triggered Animation
interface ScrollTriggeredAnimationProps {
  children: React.ReactNode;
  className?: string;
  triggerAt?: number; // 0-1, percentage of scroll
  animation: "fade" | "slide" | "scale" | "rotate";
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

export const ScrollTriggeredAnimation: React.FC<ScrollTriggeredAnimationProps> = ({
  children,
  className,
  triggerAt = 0.5,
  animation,
  direction = "up",
  distance = 50,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Create all possible transforms at the top level
  const fadeTransform = useTransform(scrollYProgress, [0, triggerAt, 1], [0, 1, 1]);
  const slideTransform = useTransform(scrollYProgress, [0, triggerAt, 1], 
    [direction === "up" || direction === "left" ? distance : -distance, 0, 0]);
  const scaleTransform = useTransform(scrollYProgress, [0, triggerAt, 1], [0.8, 1, 1]);
  const rotateTransform = useTransform(scrollYProgress, [0, triggerAt, 1], [-15, 0, 0]);
  
  const opacity = useTransform(scrollYProgress, [0, triggerAt, 1], [0, 1, 1]);
  
  // Select the appropriate transform based on animation type
  let transform;
  switch (animation) {
    case "fade":
      transform = fadeTransform;
      break;
    case "slide":
      transform = slideTransform;
      break;
    case "scale":
      transform = scaleTransform;
      break;
    case "rotate":
      transform = rotateTransform;
      break;
    default:
      transform = fadeTransform;
  }

  const styleProps: any = { opacity };
  
  if (animation === "slide") {
    styleProps[direction === "up" || direction === "down" ? "y" : "x"] = transform;
  } else if (animation === "scale") {
    styleProps.scale = transform;
  } else if (animation === "rotate") {
    styleProps.rotate = transform;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={styleProps}
    >
      {children}
    </motion.div>
  );
};
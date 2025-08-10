"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ExternalLink, Eye } from "lucide-react";

interface HoverPeekProps {
  children: React.ReactNode;
  preview: React.ReactNode;
  delay?: number;
  placement?: "top" | "bottom" | "left" | "right";
  maxWidth?: number;
  className?: string;
  showArrow?: boolean;
  interactive?: boolean;
}

interface ProductPreviewProps {
  image: string;
  title: string;
  price: string;
  rating?: number;
  category?: string;
  className?: string;
}

interface BlogPreviewProps {
  image: string;
  title: string;
  excerpt: string;
  readTime?: string;
  date?: string;
  className?: string;
}

export const HoverPeek: React.FC<HoverPeekProps> = ({
  children,
  preview,
  delay = 300,
  placement = "top",
  maxWidth = 320,
  className,
  showArrow = true,
  interactive = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const placementClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-cream-100",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-cream-100",
    left: "left-full top-1/2 -translate-y-1/2 border-l-cream-100",
    right: "right-full top-1/2 -translate-y-1/2 border-r-cream-100",
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let x = 0;
      let y = 0;

      switch (placement) {
        case "top":
          x = triggerRect.left + triggerRect.width / 2;
          y = triggerRect.top - tooltipRect.height - 8;
          break;
        case "bottom":
          x = triggerRect.left + triggerRect.width / 2;
          y = triggerRect.bottom + 8;
          break;
        case "left":
          x = triggerRect.left - tooltipRect.width - 8;
          y = triggerRect.top + triggerRect.height / 2;
          break;
        case "right":
          x = triggerRect.right + 8;
          y = triggerRect.top + triggerRect.height / 2;
          break;
      }

      setPosition({ x, y });
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={cn(
              "absolute z-50 pointer-events-none",
              placementClasses[placement]
            )}
            style={{
              maxWidth: `${maxWidth}px`,
              left: placement === "left" || placement === "right" ? "auto" : "auto",
              top: placement === "top" || placement === "bottom" ? "auto" : "auto",
              transform: "none",
            }}
            initial={{ opacity: 0, scale: 0.95, y: placement === "top" ? 10 : placement === "bottom" ? -10 : 0, x: placement === "left" ? 10 : placement === "right" ? -10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: placement === "top" ? 10 : placement === "bottom" ? -10 : 0, x: placement === "left" ? 10 : placement === "right" ? -10 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className={cn(
                "bg-white border border-cream-200 rounded-lg shadow-lg p-4",
                interactive && "pointer-events-auto"
              )}
            >
              {preview}
              
              {showArrow && (
                <div
                  className={cn(
                    "absolute w-0 h-0 border-4 border-transparent",
                    arrowClasses[placement]
                  )}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Product preview component
export const ProductPreview: React.FC<ProductPreviewProps> = ({
  image,
  title,
  price,
  rating,
  category,
  className,
}) => {
  return (
    <div className={cn("flex gap-3", className)}>
      <div className="flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-16 h-16 object-cover rounded-md"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        {category && (
          <div className="text-xs text-cream-600 mb-1">{category}</div>
        )}
        
        <h4 className="font-medium text-onyx-800 text-sm mb-1 line-clamp-2">
          {title}
        </h4>
        
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gold-600 text-sm">{price}</span>
          
          {rating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < Math.floor(rating) ? "text-yellow-400" : "text-cream-300"
                    )}
                  >
                    ★
                  </div>
                ))}
              </div>
              <span className="text-xs text-cream-600">{rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Blog preview component
export const BlogPreview: React.FC<BlogPreviewProps> = ({
  image,
  title,
  excerpt,
  readTime,
  date,
  className,
}) => {
  return (
    <div className={cn("flex gap-3", className)}>
      <div className="flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-16 h-16 object-cover rounded-md"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-onyx-800 text-sm mb-1 line-clamp-2">
          {title}
        </h4>
        
        <p className="text-xs text-onyx-600 mb-2 line-clamp-2">
          {excerpt}
        </p>
        
        <div className="flex items-center gap-3 text-xs text-cream-600">
          {readTime && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {readTime}
            </span>
          )}
          
          {date && (
            <span>{date}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Link with preview wrapper
interface LinkWithPreviewProps {
  href: string;
  children: React.ReactNode;
  preview: React.ReactNode;
  className?: string;
  external?: boolean;
}

export const LinkWithPreview: React.FC<LinkWithPreviewProps> = ({
  href,
  children,
  preview,
  className,
  external = false,
}) => {
  return (
    <HoverPeek
      preview={preview}
      placement="top"
      delay={400}
      interactive={false}
      className={className}
    >
      <a
        href={href}
        className="inline-flex items-center gap-1 text-gold-600 hover:text-gold-700 transition-colors duration-200"
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
        {external && <ExternalLink className="w-3 h-3" />}
      </a>
    </HoverPeek>
  );
};

// Product link with preview
interface ProductLinkWithPreviewProps {
  href: string;
  children: React.ReactNode;
  product: {
    image: string;
    title: string;
    price: string;
    rating?: number;
    category?: string;
  };
  className?: string;
}

export const ProductLinkWithPreview: React.FC<ProductLinkWithPreviewProps> = ({
  href,
  children,
  product,
  className,
}) => {
  return (
    <LinkWithPreview
      href={href}
      preview={<ProductPreview {...product} />}
      className={className}
    >
      {children}
    </LinkWithPreview>
  );
};

// Blog link with preview
interface BlogLinkWithPreviewProps {
  href: string;
  children: React.ReactNode;
  post: {
    image: string;
    title: string;
    excerpt: string;
    readTime?: string;
    date?: string;
  };
  className?: string;
}

export const BlogLinkWithPreview: React.FC<BlogLinkWithPreviewProps> = ({
  href,
  children,
  post,
  className,
}) => {
  return (
    <LinkWithPreview
      href={href}
      preview={<BlogPreview {...post} />}
      className={className}
    >
      {children}
    </LinkWithPreview>
  );
};
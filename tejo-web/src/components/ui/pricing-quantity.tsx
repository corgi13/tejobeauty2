"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Minus, 
  ShoppingCart,
  Star,
  CheckCircle2,
  AlertCircle,
  Info
} from "lucide-react";
import { MovingBorder } from "./moving-border";

// Animated Counter Component
interface AnimatedCounterProps {
  value: number;
  className?: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  className,
  duration = 1,
  prefix = "",
  suffix = "",
  decimals = 0,
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return latest.toFixed(decimals);
  });

  useEffect(() => {
    const controls = animate(count, value, { duration });
    return controls.stop;
  }, [value, duration, count]);

  return (
    <motion.span className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
};

// Quantity Stepper Component
interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showTotal?: boolean;
  pricePerUnit?: number;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  className,
  size = "md",
  showTotal = false,
  pricePerUnit = 0,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  const buttonSizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const handleChange = (newValue: number) => {
    if (newValue < min || newValue > max || isAnimating) return;
    
    setIsAnimating(true);
    onChange(newValue);
    
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const totalPrice = value * pricePerUnit;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          onClick={() => handleChange(value - step)}
          disabled={value <= min}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center justify-center rounded-lg border border-cream-300 bg-white text-onyx-600 hover:bg-cream-50 hover:border-gold-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
            buttonSizeClasses[size]
          )}
        >
          <Minus className="w-4 h-4" />
        </motion.button>

        <motion.input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-16 text-center border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all duration-200",
            sizeClasses[size]
          )}
        />

        <motion.button
          type="button"
          onClick={() => handleChange(value + step)}
          disabled={value >= max}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center justify-center rounded-lg border border-cream-300 bg-white text-onyx-600 hover:bg-cream-50 hover:border-gold-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
            buttonSizeClasses[size]
          )}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {showTotal && pricePerUnit > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-3 bg-cream-50 rounded-lg border border-cream-200"
        >
          <div className="text-sm text-onyx-600 mb-1">Ukupna cijena:</div>
          <div className="text-lg font-semibold text-onyx-800">
            <AnimatedCounter
              value={totalPrice}
              prefix="€"
              decimals={2}
              className="text-gold-600"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Pricing Breakdown Component
interface PricingBreakdownProps {
  basePrice: number;
  quantity: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  className?: string;
  showDetails?: boolean;
}

export const PricingBreakdown: React.FC<PricingBreakdownProps> = ({
  basePrice,
  quantity,
  discount = 0,
  shipping = 0,
  tax = 0,
  className,
  showDetails = true,
}) => {
  const subtotal = basePrice * quantity;
  const discountAmount = (subtotal * discount) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalAfterDiscount * tax) / 100;
  const total = subtotalAfterDiscount + taxAmount + shipping;

  const breakdownItems = [
    { label: "Cijena po komadu", value: basePrice, prefix: "€" },
    { label: "Količina", value: quantity, suffix: " kom" },
    { label: "Međuzbroj", value: subtotal, prefix: "€" },
    ...(discount > 0 ? [{ label: `Popust (${discount}%)`, value: -discountAmount, prefix: "€" }] : []),
    ...(shipping > 0 ? [{ label: "Dostava", value: shipping, prefix: "€" }] : []),
    ...(tax > 0 ? [{ label: `PDV (${tax}%)`, value: taxAmount, prefix: "€" }] : []),
    { label: "Ukupno", value: total, prefix: "€", isTotal: true },
  ];

  return (
    <div className={cn("bg-white rounded-lg border border-cream-200 p-4", className)}>
      <h3 className="text-lg font-semibold text-onyx-800 mb-4">Detalji cijene</h3>
      
      <div className="space-y-3">
        {breakdownItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex justify-between items-center py-2",
              item.isTotal && "border-t border-cream-200 pt-3"
            )}
          >
            <span className={cn(
              "text-onyx-600",
              item.isTotal && "font-semibold text-onyx-800"
            )}>
              {item.label}
            </span>
            <span className={cn(
              "font-mono",
              item.isTotal ? "text-lg font-bold text-gold-600" : "text-onyx-800"
            )}>
              {item.prefix}
              <AnimatedCounter
                value={Math.abs(item.value)}
                decimals={2}
                duration={0.8}
              />
              {item.suffix}
            </span>
          </motion.div>
        ))}
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-cream-50 rounded-lg border border-cream-200"
        >
          <div className="flex items-center gap-2 text-sm text-onyx-600">
            <Info className="w-4 h-4" />
            <span>Cijene uključuju PDV. Besplatna dostava za narudžbe iznad €50.</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Price Display Component
interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showStrike?: boolean;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  currency = "€",
  size = "md",
  showStrike = true,
  className,
}) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("font-bold text-onyx-800", sizeClasses[size])}
      >
        {currency}
        <AnimatedCounter
          value={price}
          decimals={2}
          duration={0.6}
        />
      </motion.span>

      {hasDiscount && showStrike && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-onyx-400 line-through"
        >
          {currency}{originalPrice?.toFixed(2)}
        </motion.span>
      )}

      {hasDiscount && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full"
        >
          -{Math.round(((originalPrice! - price) / originalPrice!) * 100)}%
        </motion.div>
      )}
    </div>
  );
};

// Bulk Pricing Component
interface BulkPricingProps {
  basePrice: number;
  tiers: Array<{ min: number; max?: number; discount: number }>;
  currentQuantity: number;
  className?: string;
}

export const BulkPricing: React.FC<BulkPricingProps> = ({
  basePrice,
  tiers,
  currentQuantity,
  className,
}) => {
  const getCurrentTier = () => {
    return tiers.find(tier => 
      currentQuantity >= tier.min && (!tier.max || currentQuantity <= tier.max)
    );
  };

  const currentTier = getCurrentTier();
  const currentPrice = currentTier 
    ? basePrice * (1 - currentTier.discount / 100)
    : basePrice;

  const nextTier = tiers.find(tier => tier.min > currentQuantity);

  return (
    <div className={cn("bg-gradient-to-r from-cream-50 to-white rounded-lg border border-cream-200 p-4", className)}>
      <h4 className="text-sm font-medium text-onyx-700 mb-3">Količinski popusti</h4>
      
      <div className="space-y-2">
        {tiers.map((tier, index) => {
          const isActive = currentTier === tier;
          const tierPrice = basePrice * (1 - tier.discount / 100);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex justify-between items-center p-2 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-gold-100 border border-gold-200" 
                  : "hover:bg-cream-100"
              )}
            >
              <div className="flex items-center gap-2">
                {isActive && (
                  <CheckCircle2 className="w-4 h-4 text-gold-600" />
                )}
                <span className="text-sm text-onyx-600">
                  {tier.min}+ kom
                </span>
              </div>
              <span className="text-sm font-medium text-onyx-800">
                €{tierPrice.toFixed(2)}
              </span>
            </motion.div>
          );
        })}
      </div>

      {nextTier && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <AlertCircle className="w-4 h-4" />
            <span>
              Dodajte još {nextTier.min - currentQuantity} kom za popust od {nextTier.discount}%
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Add to Cart Button with Quantity
interface AddToCartButtonProps {
  price: number;
  onAddToCart: (quantity: number) => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  price,
  onAddToCart,
  className,
  disabled = false,
  loading = false,
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <QuantityStepper
        value={quantity}
        onChange={setQuantity}
        min={1}
        max={99}
        showTotal
        pricePerUnit={price}
      />
      
      <MovingBorder className="rounded-lg">
        <motion.button
          onClick={handleAddToCart}
          disabled={disabled || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Dodaj u košaricu
            </>
          )}
        </motion.button>
      </MovingBorder>
    </div>
  );
};
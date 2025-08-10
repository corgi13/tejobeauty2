"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string | React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  labelClassName?: string;
}

export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onChange,
  label,
  required = false,
  disabled = false,
  size = "md",
  className,
  labelClassName,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <motion.div
        className={cn(
          "relative flex-shrink-0 cursor-pointer rounded border-2 transition-all duration-300",
          "focus-within:ring-4 focus-within:ring-gold-100 focus-within:outline-none",
          sizeClasses[size],
          {
            "border-gold-500 bg-gold-500": checked && !disabled,
            "border-cream-300 bg-white hover:border-gold-400": !checked && !disabled,
            "border-cream-200 bg-cream-100 cursor-not-allowed": disabled,
          }
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        initial={false}
        animate={{
          scale: checked ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
      >
        {/* Checkmark */}
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check
              className={cn(
                "text-white font-bold",
                iconSizes[size]
              )}
            />
          </motion.div>
        )}

        {/* Ripple effect on click */}
        <motion.div
          className="absolute inset-0 rounded bg-gold-200"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={checked ? { scale: 1.5, opacity: 0 } : { scale: 0, opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
        />
      </motion.div>

      {label && (
        <div className="flex-1 min-w-0">
          <label
            className={cn(
              "text-sm leading-relaxed cursor-pointer select-none transition-colors duration-200",
              {
                "text-onyx-700": !disabled,
                "text-cream-500 cursor-not-allowed": disabled,
              },
              labelClassName
            )}
            onClick={!disabled ? handleClick : undefined}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        </div>
      )}
    </div>
  );
};

// Specialized checkbox for terms and conditions
interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  onChange,
  disabled,
  className,
}) => {
  return (
    <AnimatedCheckbox
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      size="md"
      className={cn("p-4 bg-cream-50 rounded-lg border border-cream-200", className)}
      label={
        <span>
          I agree to the{" "}
          <a
            href="/terms"
            className="text-gold-600 hover:text-gold-700 underline font-medium transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-gold-600 hover:text-gold-700 underline font-medium transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </span>
      }
      required
    />
  );
};

// Newsletter subscription checkbox
interface NewsletterCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const NewsletterCheckbox: React.FC<NewsletterCheckboxProps> = ({
  checked,
  onChange,
  disabled,
  className,
}) => {
  return (
    <AnimatedCheckbox
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      size="md"
      className={className}
      label={
        <span>
          Subscribe to our newsletter for exclusive offers, beauty tips, and new product updates.{" "}
          <span className="text-cream-600 text-xs">
            (You can unsubscribe at any time)
          </span>
        </span>
      }
    />
  );
};

// Marketing preferences checkbox group
interface MarketingPreferencesProps {
  preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  onChange: (preferences: { email: boolean; sms: boolean; push: boolean }) => void;
  disabled?: boolean;
  className?: string;
}

export const MarketingPreferences: React.FC<MarketingPreferencesProps> = ({
  preferences,
  onChange,
  disabled,
  className,
}) => {
  const handleChange = (key: keyof typeof preferences, value: boolean) => {
    onChange({
      ...preferences,
      [key]: value,
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      <h4 className="font-medium text-onyx-800 mb-3">Marketing Preferences</h4>
      
      <AnimatedCheckbox
        checked={preferences.email}
        onChange={(checked) => handleChange("email", checked)}
        disabled={disabled}
        size="sm"
        label="Email marketing and newsletters"
      />
      
      <AnimatedCheckbox
        checked={preferences.sms}
        onChange={(checked) => handleChange("sms", checked)}
        disabled={disabled}
        size="sm"
        label="SMS notifications and offers"
      />
      
      <AnimatedCheckbox
        checked={preferences.push}
        onChange={(checked) => handleChange("push", checked)}
        disabled={disabled}
        size="sm"
        label="Push notifications (if enabled)"
      />
    </div>
  );
};
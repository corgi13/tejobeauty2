"use client";
import * as React from 'react';
import clsx from 'clsx';

type MovingBorderProps = {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number;
  duration?: number; // ms
};

export function MovingBorder({ children, className, borderRadius = 14, duration = 6000 }: MovingBorderProps) {
  return (
    <div
      className={clsx('moving-border', className)}
      style={{
        // exposed CSS custom properties used by globals.css .moving-border
        // consistent with Aceternity UI moving border concept
        ['--mb-radius' as any]: `${borderRadius}px`,
        ['--mb-duration' as any]: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}



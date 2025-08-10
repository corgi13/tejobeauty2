"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  type: 'sparkle' | 'flower' | 'bubble' | 'star';
}

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
  theme?: 'beauty' | 'nature' | 'cosmic';
}

const beautyColors = {
  sparkle: ['#FFD700', '#FFA500', '#FF69B4', '#FF1493'],
  flower: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB'],
  bubble: ['#87CEEB', '#00BFFF', '#1E90FF', '#4169E1'],
  star: ['#FFD700', '#FFA500', '#FF6347', '#FF4500']
};

const natureColors = {
  sparkle: ['#32CD32', '#228B22', '#00FF00', '#90EE90'],
  flower: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB'],
  bubble: ['#98FB98', '#90EE90', '#00FF7F', '#00FA9A'],
  star: ['#FFD700', '#FFA500', '#FF6347', '#FF4500']
};

const cosmicColors = {
  sparkle: ['#9370DB', '#8A2BE2', '#9400D3', '#9932CC'],
  flower: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB'],
  bubble: ['#00CED1', '#20B2AA', '#48D1CC', '#40E0D0'],
  star: ['#FFD700', '#FFA500', '#FF6347', '#FF4500']
};

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  className = '',
  particleCount = 50,
  interactive = true,
  theme = 'beauty'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const colors = theme === 'beauty' ? beautyColors : theme === 'nature' ? natureColors : cosmicColors;

  const createParticle = useCallback((x: number, y: number): Particle => {
    const types: Particle['type'][] = ['sparkle', 'flower', 'bubble', 'star'];
    const type = types[Math.floor(Math.random() * types.length)];
    const colorArray = colors[type];
    const color = colorArray[Math.floor(Math.random() * colorArray.length)];
    
    return {
      id: Math.random(),
      x: x || Math.random() * window.innerWidth,
      y: y || Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.8 + 0.2,
      color,
      type
    };
  }, [colors]);

  const initParticles = useCallback(() => {
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(0, 0));
  }, [particleCount, createParticle]);

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
      if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

      // Interactive mouse attraction
      if (interactive) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += dx * force * 0.001;
          particle.vy += dy * force * 0.001;
        }
      }

      // Draw particle based on type
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      
      switch (particle.type) {
        case 'sparkle':
          drawSparkle(ctx, particle.x, particle.y, particle.size, particle.color);
          break;
        case 'flower':
          drawFlower(ctx, particle.x, particle.y, particle.size, particle.color);
          break;
        case 'bubble':
          drawBubble(ctx, particle.x, particle.y, particle.size, particle.color);
          break;
        case 'star':
          drawStar(ctx, particle.x, particle.y, particle.size, particle.color);
          break;
      }
      
      ctx.restore();
    });

    animationRef.current = requestAnimationFrame(updateParticles);
  }, [interactive]);

  const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    // Draw cross
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
    
    // Draw diagonal lines
    ctx.beginPath();
    ctx.moveTo(x - size * 0.7, y - size * 0.7);
    ctx.lineTo(x + size * 0.7, y + size * 0.7);
    ctx.moveTo(x - size * 0.7, y + size * 0.7);
    ctx.lineTo(x + size * 0.7, y - size * 0.7);
    ctx.stroke();
  };

  const drawFlower = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    ctx.fillStyle = color;
    
    // Draw petals
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const petalX = x + Math.cos(angle) * size;
      const petalY = y + Math.sin(angle) * size;
      
      ctx.beginPath();
      ctx.arc(petalX, petalY, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw center
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.fillStyle = color + '20';
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Add highlight
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    ctx.fillStyle = color;
    
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.5;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    initParticles();
    updateParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, updateParticles]);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
};
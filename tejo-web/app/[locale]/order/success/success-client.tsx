"use client";
import { useEffect } from 'react';
import { addConfetti, clearConfetti } from '@/lib/confetti';

export default function OrderSuccessClient() {
  useEffect(() => {
    addConfetti();
    return () => clearConfetti();
  }, []);
  return null;
}
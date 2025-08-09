"use client";
import confetti from 'canvas-confetti';

let globalConfetti: ReturnType<typeof confetti.create> | null = null;

export function initConfetti(): void {
  if (globalConfetti) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'tejo-confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);
  globalConfetti = confetti.create(canvas, { resize: true, useWorker: true });
}

type ConfettiOptions = {
  emojis?: string[];
  colors?: string[];
  particleCount?: number;
};

export function addConfetti(opts: ConfettiOptions = {}): void {
  initConfetti();
  const { emojis = ['🎉', '✨', '💖', '💅'], colors = ['#D4AF37', '#F5EFE6', '#F9DDE5', '#111111'], particleCount = 160 } = opts;
  const scalar = 1.2;
  if (globalConfetti) {
    globalConfetti({
      particleCount,
      spread: 70,
      origin: { y: 0.6 },
      ticks: 200,
      colors,
      shapes: ['square', 'circle'],
    });
    // Emoji burst
    globalConfetti({
      particleCount: Math.round(particleCount / 3),
      spread: 100,
      origin: { y: 0.5 },
      shapes: emojis.map((e) => ({ type: 'text', value: e } as any)),
      scalar,
    });
  }
}

export function clearConfetti(): void {
  const el = document.getElementById('tejo-confetti-canvas');
  if (el && el.parentElement) el.parentElement.removeChild(el);
  globalConfetti = null;
}



declare module 'js-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  class ConfettiGenerator {
    constructor(options?: ConfettiOptions);
    addConfetti(confettiOptions?: ConfettiOptions): void;
    clear(): void;
  }

  export default ConfettiGenerator;
}
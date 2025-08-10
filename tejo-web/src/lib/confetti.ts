"use client";
import JSConfetti from 'js-confetti';

interface ConfettiOptions {
  emojis?: string[];
  emojiSize?: number;
  confettiNumber?: number;
  confettiColors?: string[];
  duration?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  ticks?: number;
}

interface ConfettiTrigger {
  x?: number;
  y?: number;
  angle?: number;
}

class ConfettiManager {
  private confetti!: JSConfetti;
  private isInitialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.confetti = new JSConfetti();
      this.isInitialized = true;
    }
  }

  private getDefaultOptions(): ConfettiOptions {
    return {
      emojis: ['🎉', '✨', '🎊', '💫', '🌟', '💎', '🎁', '🏆'],
      emojiSize: 100,
      confettiNumber: 100,
      confettiColors: ['#FFD700', '#FFB6C1', '#F5F5DC', '#FF69B4', '#FFA500'],
      duration: 3000,
      spread: 70,
      startVelocity: 30,
      decay: 0.9,
      gravity: 1,
      ticks: 200,
    };
  }

  private getDefaultTrigger(): ConfettiTrigger {
    return {
      x: 0.5, // Center of screen
      y: 0.5,
      angle: 90,
    };
  }

  /**
   * Trigger confetti with emojis
   */
  async addConfetti(options: ConfettiOptions = {}, trigger: ConfettiTrigger = {}) {
    if (!this.isInitialized) {
      console.warn('Confetti not initialized - window not available');
      return;
    }

    const finalOptions = { ...this.getDefaultOptions(), ...options };
    const finalTrigger = { ...this.getDefaultTrigger(), ...trigger };

    try {
      await this.confetti.addConfetti({
        particleCount: finalOptions.confettiNumber,
        colors: finalOptions.confettiColors,
        spread: finalOptions.spread,
        startVelocity: finalOptions.startVelocity,
        decay: finalOptions.decay,
        gravity: finalOptions.gravity,
        ticks: finalOptions.ticks,
        origin: {
          x: finalTrigger.x!,
          y: finalTrigger.y!,
        },
      });
    } catch (error) {
      console.error('Failed to trigger confetti:', error);
    }
  }

  /**
   * Trigger confetti with custom emojis for specific events
   */
  async addConfettiForEvent(event: 'order-success' | 'goal-reached' | 'achievement' | 'celebration', options: Partial<ConfettiOptions> = {}) {
    const eventConfigs = {
      'order-success': {
        emojis: ['🎉', '✨', '🎊', '💫', '🎁', '💎', '🏆', '🌟'],
        confettiNumber: 150,
        duration: 4000,
      },
      'goal-reached': {
        emojis: ['🎯', '🏆', '💎', '⭐', '🌟', '✨', '🎊', '💫'],
        confettiNumber: 120,
        duration: 3500,
      },
      'achievement': {
        emojis: ['🏅', '🎖️', '🏆', '💎', '⭐', '🌟', '✨', '🎊'],
        confettiNumber: 100,
        duration: 3000,
      },
      'celebration': {
        emojis: ['🎉', '🎊', '✨', '💫', '🌟', '🎈', '🎁', '💎'],
        confettiNumber: 200,
        duration: 5000,
      },
    };

    const eventConfig = eventConfigs[event];
    const finalOptions = { ...this.getDefaultOptions(), ...eventConfig, ...options };

    await this.addConfetti(finalOptions);
  }

  /**
   * Trigger confetti with brand colors
   */
  async addBrandConfetti(options: Partial<ConfettiOptions> = {}) {
    const brandOptions: ConfettiOptions = {
      confettiColors: ['#FFD700', '#FFB6C1', '#F5F5DC', '#FF69B4', '#FFA500'],
      confettiNumber: 120,
      spread: 80,
      startVelocity: 35,
      ...options,
    };

    await this.addConfetti(brandOptions);
  }

  /**
   * Trigger confetti from a specific element
   */
  async addConfettiFromElement(element: HTMLElement, options: Partial<ConfettiOptions> = {}) {
    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    await this.addConfetti(options, { x, y });
  }

  /**
   * Trigger confetti from cursor position
   */
  async addConfettiFromCursor(options: Partial<ConfettiOptions> = {}) {
    const handleClick = async (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;

      await this.addConfetti(options, { x, y });
    };

    document.addEventListener('click', handleClick, { once: true });
  }

  /**
   * Clear all confetti
   */
  clearConfetti() {
    if (this.isInitialized) {
      this.confetti.clear();
    }
  }

  /**
   * Get confetti instance
   */
  getConfettiInstance() {
    return this.isInitialized ? this.confetti : null;
  }
}

// Create singleton instance
const confettiManager = new ConfettiManager();

// Export functions for easy use
export const addConfetti = (options?: ConfettiOptions, trigger?: ConfettiTrigger) =>
  confettiManager.addConfetti(options, trigger);

export const addConfettiForEvent = (event: 'order-success' | 'goal-reached' | 'achievement' | 'celebration', options?: Partial<ConfettiOptions>) =>
  confettiManager.addConfettiForEvent(event, options);

export const addBrandConfetti = (options?: Partial<ConfettiOptions>) =>
  confettiManager.addBrandConfetti(options);

export const addConfettiFromElement = (element: HTMLElement, options?: Partial<ConfettiOptions>) =>
  confettiManager.addConfettiFromElement(element, options);

export const addConfettiFromCursor = (options?: Partial<ConfettiOptions>) =>
  confettiManager.addConfettiFromCursor(options);

export const clearConfetti = () => confettiManager.clearConfetti();

export const getConfettiInstance = () => confettiManager.getConfettiInstance();

// Export the manager class for advanced usage
export { ConfettiManager };

// Default export
export default confettiManager;



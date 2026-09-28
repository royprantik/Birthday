import confetti from 'canvas-confetti';

// Launch Grand Celebration Fireworks & Heart Explosion
export function triggerFireworks() {
  const duration = 4 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Confetti from left and right corners
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#ff2a85', '#ffcf40', '#00f2fe', '#ff4d6d', '#ffffff']
    });
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#ff2a85', '#ffcf40', '#00f2fe', '#ff4d6d', '#ffffff']
    });
  }, 250);
}

// Heart Blast Confetti
export function triggerHeartBlast() {
  const heartShape = confetti.shapeFromPath({
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
  });

  confetti({
    shapes: [heartShape],
    scalar: 2,
    particleCount: 40,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#ff2a85', '#ff4d6d', '#ffcf40']
  });
}

/**
 * Drifting golden particles, echoing the "golden hour" sections on
 * Zenwood's site. Pauses when off screen; disabled for reduced motion.
 */
import { motionEnabled } from './scrollFx.js';

export function attachFireflies(canvas, { density = 0.00005, color = '196, 186, 166' } = {}) {
  if (!motionEnabled()) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, flies = [], raf = 0, visible = false;

  const seed = () => {
    const count = Math.max(14, Math.min(70, Math.round(w * h * density)));
    flies = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -0.05 - Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.01,
    }));
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const f of flies) {
      f.phase += f.speed;
      f.x += f.vx + Math.sin(f.phase * 0.7) * 0.08;
      f.y += f.vy;
      if (f.y < -10) { f.y = h + 10; f.x = Math.random() * w; }
      if (f.x < -10) f.x = w + 10; else if (f.x > w + 10) f.x = -10;
      const a = 0.15 + 0.6 * Math.pow((Math.sin(f.phase) + 1) / 2, 2);
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
      g.addColorStop(0, `rgba(${color}, ${a})`);
      g.addColorStop(1, `rgba(${color}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 5, 0, Math.PI * 2); ctx.fill();
    }
    raf = visible ? requestAnimationFrame(draw) : 0;
  };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(draw);
  }).observe(canvas);
  resize();
}

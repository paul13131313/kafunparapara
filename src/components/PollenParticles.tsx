"use client";

import { useEffect, useRef } from "react";

interface PollenParticlesProps {
  pollenLevel: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  colorIndex: number;
  wobbleOffset: number;
  wobbleSpeed: number;
}

const PARTICLE_COUNTS = [0, 12, 120, 400, 800];

const COLORS = [
  [220, 190, 60],
  [210, 180, 40],
  [200, 170, 50],
  [230, 200, 70],
  [190, 160, 30],
];

export default function PollenParticles({ pollenLevel }: PollenParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const targetCount = PARTICLE_COUNTS[pollenLevel - 1] ?? 0;

    function createParticle(): Particle {
      if (!canvas) throw new Error("no canvas");

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.38;
      const spread = canvas.width * (0.15 + pollenLevel * 0.06);

      return {
        x: centerX + (Math.random() - 0.5) * spread,
        y: centerY + (Math.random() - 0.5) * spread * 0.6,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.3 + 0.08,
        size: Math.random() * 1.8 + 0.8,
        opacity: Math.random() * 0.35 + 0.15,
        life: 0,
        maxLife: Math.random() * 350 + 150,
        colorIndex: Math.floor(Math.random() * COLORS.length),
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.015 + 0.008,
      };
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      while (particles.length < targetCount) {
        particles.push(createParticle());
      }
      while (particles.length > targetCount) {
        particles.pop();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // ふわふわした軽やかな動き
        const wobbleX = Math.sin(p.life * p.wobbleSpeed + p.wobbleOffset) * 0.4;
        const wobbleY = Math.cos(p.life * p.wobbleSpeed * 0.7 + p.wobbleOffset) * 0.2;

        p.x += p.vx + wobbleX;
        p.y += p.vy + wobbleY;

        // 重力はほぼゼロ — 空気中を漂う感じ
        p.vy += 0.001;

        // 微風でゆっくり横に流れる
        p.vx += (Math.random() - 0.5) * 0.01;

        p.life++;

        const lifeRatio = p.life / p.maxLife;
        // フェードイン→維持→フェードアウト
        let alpha: number;
        if (lifeRatio < 0.1) {
          alpha = p.opacity * (lifeRatio / 0.1);
        } else if (lifeRatio > 0.7) {
          alpha = p.opacity * ((1 - lifeRatio) / 0.3);
        } else {
          alpha = p.opacity;
        }

        if (p.life >= p.maxLife || p.y > canvas.height || p.x < -20 || p.x > canvas.width + 20) {
          particles[i] = createParticle();
          continue;
        }

        const [r, g, b] = COLORS[p.colorIndex];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [pollenLevel]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
}

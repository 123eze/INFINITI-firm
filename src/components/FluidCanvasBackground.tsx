import React, { useEffect, useRef } from 'react';

interface FluidCanvasProps {
  intensity?: number;
  interactive?: boolean;
}

export const FluidCanvasBackground: React.FC<FluidCanvasProps> = ({
  intensity = 1.0,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, speed: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const targetX = e.clientX / window.innerWidth;
      const targetY = e.clientY / window.innerHeight;
      const dx = targetX - mouseRef.current.targetX;
      const dy = targetY - mouseRef.current.targetY;
      mouseRef.current.speed = Math.min(Math.sqrt(dx * dx + dy * dy) * 5, 2.0);
      mouseRef.current.targetX = targetX;
      mouseRef.current.targetY = targetY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Fluid Orbs config
    const orbs = [
      { x: 0.25, y: 0.3, radius: 0.38, vx: 0.0003, vy: 0.0004, color1: 'rgba(0, 240, 255, 0.16)', color2: 'rgba(14, 165, 233, 0.02)' },
      { x: 0.75, y: 0.4, radius: 0.45, vx: -0.00025, vy: 0.00035, color1: 'rgba(168, 85, 247, 0.14)', color2: 'rgba(99, 102, 241, 0.01)' },
      { x: 0.5, y: 0.8, radius: 0.42, vx: 0.00035, vy: -0.00025, color1: 'rgba(245, 158, 11, 0.11)', color2: 'rgba(217, 119, 6, 0.01)' },
      { x: 0.85, y: 0.85, radius: 0.35, vx: -0.0003, vy: -0.0002, color1: 'rgba(56, 189, 248, 0.12)', color2: 'rgba(30, 58, 138, 0.01)' },
    ];

    let t = 0;

    const render = () => {
      t += 0.004 * intensity;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      mouseRef.current.speed *= 0.95;

      // Base deep obsidian clear
      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, width, height);

      // Render fluid caustic orbs
      orbs.forEach((orb, i) => {
        orb.x += orb.vx * intensity + Math.sin(t + i * 1.5) * 0.0002;
        orb.y += orb.vy * intensity + Math.cos(t + i * 1.2) * 0.0002;

        if (orb.x < 0.1) orb.vx = Math.abs(orb.vx);
        if (orb.x > 0.9) orb.vx = -Math.abs(orb.vx);
        if (orb.y < 0.1) orb.vy = Math.abs(orb.vy);
        if (orb.y > 0.9) orb.vy = -Math.abs(orb.vy);

        // Displace slightly by mouse interaction
        const mDistX = mouseRef.current.x - orb.x;
        const mDistY = mouseRef.current.y - orb.y;
        const mDist = Math.sqrt(mDistX * mDistX + mDistY * mDistY);
        const push = Math.max(0, 0.4 - mDist) * 0.15;
        const renderX = (orb.x - mDistX * push) * width;
        const renderY = (orb.y - mDistY * push) * height;
        const renderR = orb.radius * Math.min(width, height) * (1 + Math.sin(t * 1.2 + i) * 0.08);

        const gradient = ctx.createRadialGradient(
          renderX,
          renderY,
          renderR * 0.05,
          renderX,
          renderY,
          renderR
        );
        gradient.addColorStop(0, orb.color1);
        gradient.addColorStop(0.5, orb.color2);
        gradient.addColorStop(1, 'rgba(5, 7, 14, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(renderX, renderY, renderR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle dynamic fluid caustic lines / liquid waves
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.lineWidth = 1.2;
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const waveOffset = t * 1.5 + w * 2.1;
        const startY = height * (0.35 + w * 0.2);
        ctx.moveTo(0, startY + Math.sin(waveOffset) * 40);

        for (let x = 0; x <= width; x += 40) {
          const mFactor = Math.exp(-Math.pow((x - mouseRef.current.x * width) / 180, 2)) * 35;
          const y = startY +
            Math.sin(x * 0.003 + waveOffset) * 35 +
            Math.cos(x * 0.006 - waveOffset * 0.8) * 20 +
            mFactor;
          ctx.lineTo(x, y);
        }

        const waveAlpha = 0.04 + Math.sin(t + w) * 0.015;
        ctx.strokeStyle = w === 0
          ? `rgba(0, 240, 255, ${waveAlpha})`
          : w === 1
          ? `rgba(168, 85, 247, ${waveAlpha})`
          : `rgba(245, 158, 11, ${waveAlpha})`;
        ctx.stroke();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, interactive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-95 transition-opacity duration-1000"
      />
      {/* Cinematic dark luxury vignettes and micro-grid pattern */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#05070e]/40 to-[#030408]/90" />
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-screen bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 .5H32M.5 0V32' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

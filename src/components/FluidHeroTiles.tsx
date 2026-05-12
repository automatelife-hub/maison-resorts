'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';

/**
 * FluidHeroTiles - A high-end animated hero background.
 * Features:
 * - Tile lattice with spring-damping physics.
 * - Cursor-reactive wave propagation.
 * - Flow vectors for organic movement.
 * - Performance optimized (DPR scaling, visibility pausing, reduced-motion fallback).
 */

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
}

interface FluidHeroTilesProps {
  children: React.ReactNode;
  gridSize?: number;
  accentColor?: string;
  className?: string;
}

export const FluidHeroTiles: React.FC<FluidHeroTilesProps> = ({
  children,
  gridSize = 45,
  accentColor = '#d4af37', // Maison Gold
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -2000, y: -2000 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Constants for the motion system
  const SPRING_K = 0.045;
  const DAMPING = 0.88;
  const FORCE_RADIUS = 350;
  const FORCE_STRENGTH = 1.2;
  const FLOW_SPEED = 0.0008;

  // Handle prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Intersection Observer to pause animation when offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !canvasRef.current || !isVisible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let points: Point[] = [];
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    const initGrid = () => {
      const dpr = window.devicePixelRatio || 1;
      width = containerRef.current?.offsetWidth || window.innerWidth;
      height = containerRef.current?.offsetHeight || 600;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / gridSize) + 1;
      rows = Math.ceil(height / gridSize) + 1;
      points = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * gridSize;
          const py = y * gridSize;
          points.push({
            x: px,
            y: py,
            originX: px,
            originY: py,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    const update = (time: number) => {
      const mouse = mouseRef.current;

      points.forEach((p) => {
        // 1. Cursor Interaction (Wave Force)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist < FORCE_RADIUS) {
          const force = (FORCE_RADIUS - dist) / FORCE_RADIUS;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * FORCE_STRENGTH;
          p.vy += Math.sin(angle) * force * FORCE_STRENGTH;
        }

        // 2. Flow Vectors (Organic Drift)
        const flowX = Math.sin(p.originY * 0.005 + time * FLOW_SPEED) * 0.2;
        const flowY = Math.cos(p.originX * 0.005 + time * FLOW_SPEED) * 0.2;
        p.vx += flowX;
        p.vy += flowY;

        // 3. Spring + Damping (Restoration)
        const ax = (p.originX - p.x) * SPRING_K;
        const ay = (p.originY - p.y) * SPRING_K;
        p.vx = (p.vx + ax) * DAMPING;
        p.vy = (p.vy + ay) * DAMPING;

        // 4. Update Position
        p.x += p.vx;
        p.y += p.vy;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw Lattice
      ctx.beginPath();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.15;

      // Draw horizontal lines
      for (let y = 0; y < rows; y++) {
        ctx.moveTo(points[y * cols].x, points[y * cols].y);
        for (let x = 1; x < cols; x++) {
          const p = points[y * cols + x];
          ctx.lineTo(p.x, p.y);
        }
      }

      // Draw vertical lines
      for (let x = 0; x < cols; x++) {
        ctx.moveTo(points[x].x, points[x].y);
        for (let y = 1; y < rows; y++) {
          const p = points[y * cols + x];
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();

      // Draw "Tile" nodes (dots) for extra depth
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.4;
      points.forEach(p => {
        const dx = p.x - p.originX;
        const dy = p.y - p.originY;
        const displacement = Math.sqrt(dx*dx + dy*dy);
        
        // Scale dot size by displacement
        const size = 1 + displacement * 0.05;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const loop = (time: number) => {
      update(time);
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', initGrid);
    initGrid();
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', initGrid);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion, isVisible, gridSize, accentColor]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -2000, y: -2000 };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full overflow-hidden ${className}`}
    >
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: 'transparent' }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';

const AnimatedBackground = React.memo(() => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic configuration based on screen width
    const getParticleCount = (w) => (w < 768 ? 45 : 120);
    const getConnectionDistance = (w) => (w < 768 ? 90 : 130);

    let particleCount = getParticleCount(width);
    let connectionDistance = getConnectionDistance(width);

    // Helper to get colors based on light/dark mode
    const getThemeColors = () => {
      // Check if light class is on html/body or prefers-color-scheme is light
      const isLightMode = 
        document.documentElement.classList.contains('light') || 
        document.body.classList.contains('light');
        
      if (isLightMode) {
        return {
          colors: [
            { r: 79, g: 70, b: 229 },  // Indigo/Primary
            { r: 8, g: 145, b: 178 },  // Cyan/Accent
            { r: 147, g: 51, b: 234 }, // Purple
          ],
          neutral: { r: 100, g: 116, b: 139 }, // Slate
          bgGradient: { start: 'rgba(255, 255, 255, 0.8)', end: 'rgba(241, 245, 249, 0.8)' }
        };
      } else {
        return {
          colors: [
            { r: 124, g: 107, b: 255 }, // Primary/Violet
            { r: 34, g: 211, b: 238 },  // Accent/Cyan
            { r: 167, g: 139, b: 250 }, // Primary-2/Lavender
          ],
          neutral: { r: 238, g: 240, b: 250 }, // Off-white
          bgGradient: { start: 'rgba(6, 8, 18, 0.95)', end: 'rgba(11, 15, 30, 0.95)' }
        };
      }
    };

    let theme = getThemeColors();

    class Particle {
      constructor() {
        this.reset();
      }

      reset(fromEdge = false) {
        this.baseRadius = Math.random() * 1.5 + 0.5;
        this.radius = this.baseRadius;
        
        if (fromEdge) {
          // If wrapping around or resetting, place at boundary
          const edge = Math.floor(Math.random() * 4);
          if (edge === 0) { // Top
            this.x = Math.random() * width;
            this.y = -10;
          } else if (edge === 1) { // Right
            this.x = width + 10;
            this.y = Math.random() * height;
          } else if (edge === 2) { // Bottom
            this.x = Math.random() * width;
            this.y = height + 10;
          } else { // Left
            this.x = -10;
            this.y = Math.random() * height;
          }
        } else {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        }

        // Calm, slow movement vectors
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.15 + 0.05;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.baseAlpha = Math.random() * 0.4 + 0.15;
        this.alpha = this.baseAlpha;
        
        // Depth factor for parallax (larger = closer, moves more)
        this.depth = Math.random() * 0.6 + 0.4; // 0.4 to 1.0

        // Glow/Pulse animation properties
        this.isPulsing = false;
        this.pulseProgress = 0;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        
        // Assign color
        const colorPalette = theme.colors;
        const useNeutral = Math.random() > 0.7;
        this.colorObj = useNeutral ? theme.neutral : colorPalette[Math.floor(Math.random() * colorPalette.length)];
      }

      update() {
        // Continuous calm movement
        this.x += this.vx;
        this.y += this.vy;

        // Apply smooth pulse
        if (this.isPulsing) {
          this.pulseProgress += this.pulseSpeed;
          if (this.pulseProgress >= Math.PI) {
            this.isPulsing = false;
            this.pulseProgress = 0;
            this.radius = this.baseRadius;
            this.alpha = this.baseAlpha;
          } else {
            const scale = Math.sin(this.pulseProgress);
            this.radius = this.baseRadius + scale * 1.5;
            this.alpha = this.baseAlpha + scale * 0.35;
          }
        } else {
          // Occasionally start a soft pulse
          if (Math.random() < 0.0003) {
            this.isPulsing = true;
          }
        }

        // Soft screen bounds check with wrap-around
        const margin = 50;
        if (
          this.x < -margin || 
          this.x > width + margin || 
          this.y < -margin || 
          this.y > height + margin
        ) {
          this.reset(true);
        }
      }

      draw(parallaxX, parallaxY) {
        // Shift coordinate based on depth and lerped mouse position
        const drawX = this.x + parallaxX * this.depth;
        const drawY = this.y + parallaxY * this.depth;

        ctx.beginPath();
        ctx.arc(drawX, drawY, this.radius, 0, Math.PI * 2);
        
        // Add subtle radial glow for pulsing particles
        if (this.isPulsing) {
          const glow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, this.radius * 2);
          glow.addColorStop(0, `rgba(${this.colorObj.r}, ${this.colorObj.g}, ${this.colorObj.b}, ${this.alpha})`);
          glow.addColorStop(1, `rgba(${this.colorObj.r}, ${this.colorObj.g}, ${this.colorObj.b}, 0)`);
          ctx.fillStyle = glow;
        } else {
          ctx.fillStyle = `rgba(${this.colorObj.r}, ${this.colorObj.g}, ${this.colorObj.b}, ${this.alpha})`;
        }
        
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    // Mouse movement listeners
    const handleMouseMove = (e) => {
      // Target parallax calculations (normalized around center)
      const normX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const normY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      
      mouseRef.current.targetX = normX * 18; // Maximum pixel shift on X
      mouseRef.current.targetY = normY * 18; // Maximum pixel shift on Y
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Watch for system/custom theme changes via observer
    const observer = new MutationObserver(() => {
      theme = getThemeColors();
      particles.forEach(p => {
        // Re-assign colors to existing particles on theme change
        const colorPalette = theme.colors;
        const useNeutral = Math.random() > 0.7;
        p.colorObj = useNeutral ? theme.neutral : colorPalette[Math.floor(Math.random() * colorPalette.length)];
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Handle viewport resizing
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particleCount = getParticleCount(width);
      connectionDistance = getConnectionDistance(width);
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse positions for ultra-smooth parallax transition
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const pX = mouseRef.current.x;
      const pY = mouseRef.current.y;

      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw(pX, pY);
      });

      // Draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const p1DrawX = p1.x + pX * p1.depth;
        const p1DrawY = p1.y + pY * p1.depth;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const p2DrawX = p2.x + pX * p2.depth;
          const p2DrawY = p2.y + pY * p2.depth;

          const dx = p1DrawX - p2DrawX;
          const dy = p1DrawY - p2DrawY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            // Smoothly fade in/out connections
            const alpha = (1 - dist / connectionDistance) * 0.12;
            
            // Blend colors of both nodes for connection line color
            const avgR = Math.round((p1.colorObj.r + p2.colorObj.r) / 2);
            const avgG = Math.round((p1.colorObj.g + p2.colorObj.g) / 2);
            const avgB = Math.round((p1.colorObj.b + p2.colorObj.b) / 2);

            ctx.strokeStyle = `rgba(${avgR}, ${avgG}, ${avgB}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1DrawX, p1DrawY);
            ctx.lineTo(p2DrawX, p2DrawY);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden"
    />
  );
};

export default AnimatedBackground;

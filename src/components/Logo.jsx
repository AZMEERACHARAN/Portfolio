import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { subscribeToSettings } from '../services/settingsService';

/**
 * Premium Logo Mark — "The Prism Core"
 *
 * A futuristic geometric emblem:
 *  - Outer orbital hexagonal ring with gradient stroke
 *  - Inner diamond (rotated square) with glow
 *  - Central spark / core node
 *  - Radiating light lines from the center
 *
 * The shape reads as a high-tech sensor, compass, or energy core —
 * not a letter or coding symbol. Instantly memorable, infinitely scalable.
 */

export const LogoMark = ({ size = 40, animate = false, className = '' }) => {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const id = `logo-grad-${size}`;
  const glowId = `logo-glow-${size}`;
  const coreId = `logo-core-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Azmeera Charan logo mark"
    >
      <defs>
        {/* Primary gradient — purple → cyan */}
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c6bff" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#5eead4" />
        </linearGradient>

        {/* Outer glow filter */}
        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Core glow */}
        <filter id={coreId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Radial gradient for core */}
        <radialGradient id={`${id}-radial`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7c6bff" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* ── Layer 1: Outer hexagonal ring (rotated 30°) ── */}
      <polygon
        points="20,3 34,11 34,27 20,35 6,27 6,11"
        stroke={`url(#${id})`}
        strokeWidth="0.8"
        fill="none"
        strokeOpacity="0.35"
      />

      {/* ── Layer 2: Mid rotated square (diamond) ── */}
      <rect
        x="11"
        y="11"
        width="18"
        height="18"
        rx="2"
        transform="rotate(45 20 20)"
        stroke={`url(#${id})`}
        strokeWidth="1"
        fill="none"
        strokeOpacity="0.6"
        filter={`url(#${glowId})`}
      />

      {/* ── Layer 3: Inner diamond (smaller) ── */}
      <rect
        x="15"
        y="15"
        width="10"
        height="10"
        rx="1"
        transform="rotate(45 20 20)"
        stroke={`url(#${id})`}
        strokeWidth="1.2"
        fill={`url(#${id}-radial)`}
        fillOpacity="0.15"
        filter={`url(#${glowId})`}
      />

      {/* ── Layer 4: Tick marks / light rays at cardinal points ── */}
      {/* Top */}
      <line x1="20" y1="3" x2="20" y2="7" stroke={`url(#${id})`} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
      {/* Bottom */}
      <line x1="20" y1="33" x2="20" y2="37" stroke={`url(#${id})`} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
      {/* Left */}
      <line x1="3" y1="20" x2="7" y2="20" stroke={`url(#${id})`} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
      {/* Right */}
      <line x1="33" y1="20" x2="37" y2="20" stroke={`url(#${id})`} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />

      {/* ── Layer 5: Corner dots ── */}
      <circle cx="20" cy="3" r="1" fill="#7c6bff" fillOpacity="0.9" />
      <circle cx="34" cy="11" r="0.8" fill="#22d3ee" fillOpacity="0.7" />
      <circle cx="34" cy="27" r="0.8" fill="#22d3ee" fillOpacity="0.7" />
      <circle cx="20" cy="37" r="1" fill="#5eead4" fillOpacity="0.9" />
      <circle cx="6" cy="27" r="0.8" fill="#22d3ee" fillOpacity="0.7" />
      <circle cx="6" cy="11" r="0.8" fill="#22d3ee" fillOpacity="0.7" />

      {/* ── Layer 6: Central core — glowing dot ── */}
      <circle
        cx="20"
        cy="20"
        r="2.8"
        fill={`url(#${id}-radial)`}
        filter={`url(#${coreId})`}
      />
      <circle cx="20" cy="20" r="1.4" fill="white" fillOpacity="0.9" />
    </svg>
  );
};

/**
 * Full Logo — Mark + Wordmark
 * Use variant="navbar" | "footer" | "mobile" | "loading"
 */
export const Logo = ({
  variant = 'navbar',
  animate: shouldAnimate = false,
  className = '',
  onClick,
}) => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const unsubscribe = subscribeToSettings((data) => {
      if (data) setSettings(data);
    });
    return () => unsubscribe();
  }, []);

  const configs = {
    navbar: { markSize: 34, nameSize: 'text-sm', gap: 'gap-2.5', stacked: false },
    footer: { markSize: 40, nameSize: 'text-base', gap: 'gap-3', stacked: false },
    mobile: { markSize: 36, nameSize: 'text-sm', gap: 'gap-3', stacked: false },
    loading: { markSize: 64, nameSize: 'text-2xl', gap: 'gap-5', stacked: true },
  };

  const config = configs[variant] || configs.navbar;

  const wordmark = (
    <div className={`flex flex-col ${config.stacked ? 'items-center' : 'items-start'} leading-none`}>
      <span
        className={`font-display font-bold tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-2 to-accent ${config.stacked ? 'text-3xl' : config.nameSize}`}
        style={{ letterSpacing: '0.18em' }}
      >
        AZMEERA
      </span>
      <span
        className={`font-display font-light tracking-[0.28em] text-white/60 ${config.stacked ? 'text-xl mt-0.5' : 'text-[0.65em] mt-px'}`}
        style={{ letterSpacing: '0.28em' }}
      >
        CHARAN
      </span>
    </div>
  );

  const mark = settings.logoUrl ? (
    <div className="relative flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl" style={{ width: config.markSize, height: config.markSize }}>
      <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
    </div>
  ) : (
    <div className="relative flex-shrink-0">
      {/* Ambient glow behind mark */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(124,107,255,0.5) 0%, rgba(34,211,238,0.3) 60%, transparent 100%)',
          transform: 'scale(1.5)',
        }}
      />
      <LogoMark size={config.markSize} className="relative z-10" />
    </div>
  );

  if (shouldAnimate) {
    return (
      <motion.div
        className={`flex ${config.stacked ? 'flex-col' : 'flex-row'} items-center ${config.gap} ${className}`}
        onClick={onClick}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {mark}
        </motion.div>
        {wordmark}
      </motion.div>
    );
  }

  return (
    <div
      className={`flex ${config.stacked ? 'flex-col' : 'flex-row'} items-center ${config.gap} group/logo ${className}`}
      onClick={onClick}
    >
      <div className="transition-transform duration-500 group-hover/logo:rotate-[30deg]">
        {mark}
      </div>
      {wordmark}
    </div>
  );
};

/**
 * Favicon SVG (32×32 inlined SVG for use as data URI or public/favicon.svg)
 */
export const FaviconSVG = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fav-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7c6bff" />
        <stop offset="50%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#5eead4" />
      </linearGradient>
      <radialGradient id="fav-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#7c6bff" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width="40" height="40" rx="10" fill="#060812" />
    <polygon points="20,4 33,11 33,27 20,34 7,27 7,11" stroke="url(#fav-grad)" strokeWidth="1" fill="none" strokeOpacity="0.5" />
    <rect x="12" y="12" width="16" height="16" rx="2" transform="rotate(45 20 20)" stroke="url(#fav-grad)" strokeWidth="1.5" fill="none" />
    <circle cx="20" cy="20" r="3" fill="url(#fav-core)" />
    <circle cx="20" cy="20" r="1.5" fill="white" />
  </svg>
);

export default Logo;

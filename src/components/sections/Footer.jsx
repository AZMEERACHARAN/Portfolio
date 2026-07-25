import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../Logo';
import { GitFork, Link2, ExternalLink, Mail, ArrowUp } from 'lucide-react';
import { subscribeToSettings } from '../../services/settingsService';

const Twitter = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const Instagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const Youtube = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.5 7.1C2.5 7.1 2.3 5.4 3.1 4.6 4 3.7 5.1 3.7 5.6 3.6 8.7 3.4 12 3.4 12 3.4s3.3 0 6.4.2c.5.1 1.6.1 2.5 1 .8.8.6 2.5.6 2.5s.2 2 .2 4v2.1c0 2-.2 4-.2 4s.2 1.7-.6 2.5c-.9.9-2 .9-2.5 1-3.5.3-6.1.2-6.1.2s-3.3 0-6.4-.2c-.5-.1-1.6-.1-2.5-1-.8-.8-.6-2.5-.6-2.5s-.2-2-.2-4V9.1c0-2 .2-4 .2-4z"/><path d="M9.8 13.9L15.3 10 9.8 6.1z"/></svg>
);

const ICON_MAP = {
  GitHub: GitFork,
  LinkedIn: Link2,
  Twitter: Twitter,
  Instagram: Instagram,
  YouTube: Youtube,
  Email: Mail,
  Portfolio: ExternalLink,
  Default: ExternalLink
};

const Footer = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const unsubscribe = subscribeToSettings((data) => {
      if (data) setSettings(data);
    });
    return () => unsubscribe();
  }, []);
  
  const activeSocials = [
    { platform: 'GitHub', url: settings.github },
    { platform: 'LinkedIn', url: settings.linkedin },
    { platform: 'Twitter', url: settings.twitter },
    { platform: 'Instagram', url: settings.instagram },
    { platform: 'Portfolio', url: settings.portfolioUrl },
  ].filter(s => s.url).map(link => {
    return {
      icon: ICON_MAP[link.platform] || ICON_MAP.Default,
      label: link.platform,
      href: link.url
    };
  });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative mt-20 border-t border-white/[0.06] overflow-hidden">
      {/* Ambient glow at top of footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">

          {/* Left — Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start gap-4"
          >
            <Logo variant="footer" />
            <p className="text-sm text-text-muted max-w-xs text-center md:text-left leading-relaxed">
              {settings.websiteDescription || 'Crafting premium digital experiences with modern technology and elegant design.'}
            </p>
          </motion.div>

          {/* Right — Socials + Back to top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center md:items-end gap-6"
          >
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {activeSocials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="group p-3 rounded-full bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(124,107,255,0.3)] transition-all duration-300"
                >
                  <Icon className="w-4 h-4 text-text-muted group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 text-xs font-mono text-text-muted hover:text-primary transition-colors uppercase tracking-widest"
            >
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
              Back to top
            </button>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted/60 font-mono">
            {settings.copyrightText || `© ${new Date().getFullYear()} ${settings.ownerName || 'Azmeera Charan'}. All rights reserved.`}
          </p>
          <p className="text-xs text-text-muted/40 font-mono">
            Designed &amp; Developed with ♥ using React &amp; Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


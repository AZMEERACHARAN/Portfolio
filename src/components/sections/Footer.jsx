import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../Logo';
import { GitFork, Link2, ExternalLink, Mail, ArrowUp } from 'lucide-react';

const socials = [
  { icon: GitFork, label: 'GitHub', href: 'https://github.com/' },
  { icon: Link2, label: 'LinkedIn', href: 'https://linkedin.com/' },
  { icon: Mail, label: 'Email', href: 'mailto:azmeera@example.com' },
];

const Footer = () => {
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
              Crafting premium digital experiences with modern technology and elegant design.
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
              {socials.map(({ icon: Icon, label, href }) => (
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
            © {new Date().getFullYear()} Azmeera Charan. All rights reserved.
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


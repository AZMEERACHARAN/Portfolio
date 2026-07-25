import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Logo } from '../Logo';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Education', href: '#education' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Services', href: '#services' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'GitHub', href: '#github' },
  { name: 'Contact', href: '#contact' },
];

// ── Theme Toggle Button ──────────────────────────────────────────────────────
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label="Toggle theme"
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent-2/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <AnimatePresence mode="wait" initial={false}>
        {isLight ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <Moon className="w-4 h-4 text-primary" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <Sun className="w-4 h-4 text-accent-2" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  
  // Spotlight
  const navRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHoveringNav, setIsHoveringNav] = useState(false);

  const { scrollY } = useScroll();
  
  // Dynamic transformations on scroll
  const navWidth = useTransform(scrollY, [0, 200], ['95%', '80%']);
  const navY = useTransform(scrollY, [0, 200], [24, 16]);
  const backdropBlur = useTransform(scrollY, [0, 200], ['blur(10px)', 'blur(20px)']);
  const bgOpacity = useTransform(scrollY, [0, 200], [0.3, 0.7]);

  const handleMouseMove = (e) => {
    if (!navRef.current) return;
    const { left, top } = navRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.name.toLowerCase());
      const scrollPosition = window.scrollY + 300;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Staggered variants for mobile menu
  const menuVars = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1, transition: { duration: 0.5, ease: [0.12, 0, 0.39, 0] } },
    exit: { scaleY: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 } }
  };
  
  const linkVars = {
    initial: { y: 30, opacity: 0 },
    open: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  const containerVars = {
    initial: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.2, staggerChildren: 0.05, staggerDirection: 1 } }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
        <motion.div
          ref={navRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringNav(true)}
          onMouseLeave={() => setIsHoveringNav(false)}
          style={{ width: navWidth, y: navY, backdropFilter: backdropBlur }}
          className="pointer-events-auto relative flex items-center justify-between px-4 py-2 lg:px-6 lg:py-3 rounded-[2rem] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-all max-w-7xl"
        >
          {/* Dynamic Background opacity */}
          <motion.div 
            className="absolute inset-0 bg-[#0a0a0f] -z-20"
            style={{ opacity: bgOpacity }} 
          />
          
          {/* Moving Light Reflection */}
          <motion.div 
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -z-10"
          />

          {/* Spotlight Hover Effect */}
          <motion.div
            className="absolute -z-10 rounded-full transition-opacity duration-300 pointer-events-none"
            style={{
              opacity: isHoveringNav ? 1 : 0,
              background: `radial-gradient(150px circle at ${mouseX.get()}px ${mouseY.get()}px, rgba(124, 107, 255, 0.15), transparent 80%)`,
              left: 0, top: 0, right: 0, bottom: 0
            }}
          />

          {/* Left: Branding */}
          <a 
            href="#home" 
            onClick={(e) => scrollToSection(e, '#home')}
            className="flex items-center cursor-pointer"
          >
            <Logo variant="navbar" />
          </a>

          {/* Center: Navigation */}
          <nav className="hidden xl:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.name.toLowerCase();
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative px-5 py-2 text-sm font-medium transition-colors rounded-full"
                >
                  {/* Hover Background */}
                  {hoveredLink === link.name && !isActive && (
                    <motion.div
                      layoutId="navbar-hover"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {/* Active Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-full border border-primary/40 shadow-[0_0_20px_rgba(124,107,255,0.25)] bg-gradient-to-b from-white/10 to-transparent"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      {/* Smooth Underline Glow */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                    </motion.div>
                  )}
                  
                  <span className={`relative z-10 ${isActive ? 'text-white' : 'text-text-muted hover:text-white'}`}>
                    {link.name}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Right: CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            <motion.a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden lg:flex relative items-center justify-center px-6 py-2.5 rounded-full font-semibold text-xs text-white group/cta overflow-hidden"
            >
              {/* Animated Gradient Border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent-2 to-primary opacity-60 group-hover/cta:opacity-100 transition-opacity p-[1px]" style={{ backgroundSize: '200% 100%' }}>
                <div className="absolute inset-0 rounded-full bg-[#0a0a0f] m-[1px]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent-2/10 opacity-0 group-hover/cta:opacity-100 transition-opacity" />
              <span className="relative z-10">Let's Connect</span>
            </motion.a>

            <button 
              className="xl:hidden p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Full-screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[60] bg-[#030308]/95 backdrop-blur-3xl origin-top flex flex-col"
          >
            <div className="flex items-center justify-between px-8 py-8 border-b border-white/10">
              <Logo variant="mobile" />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-white/5 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <motion.div 
              variants={containerVars}
              initial="initial"
              animate="open"
              exit="initial"
              className="flex-grow flex flex-col px-8 space-y-4 sm:space-y-6 py-4 overflow-y-auto pb-24"
            >
              {navLinks.map((link) => (
                <div key={link.name} className="overflow-hidden">
                  <motion.a
                    variants={linkVars}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="block text-4xl font-display font-medium text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </motion.a>
                </div>
              ))}
              
              <div className="overflow-hidden pt-8 mt-8 border-t border-white/10">
                <motion.a
                  variants={linkVars}
                  href="#contact"
                  onClick={(e) => scrollToSection(e, '#contact')}
                  className="inline-flex items-center justify-center w-full py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary to-accent-2 rounded-2xl hover:shadow-[0_0_30px_rgba(124,107,255,0.4)] transition-shadow"
                >
                  Let's Connect
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

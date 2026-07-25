import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Download, Code, Terminal, Sparkles, Database, Layers, Loader2 } from 'lucide-react';
import { getHeroData, subscribeToHeroData } from '../../services/heroService';
import { subscribeToSettings } from '../../services/settingsService';

// Custom Typewriter component
const Typewriter = ({ words }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1500);
      return () => clearTimeout(timeout);
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="inline-block min-w-[250px] text-accent-2">
      {words[index].substring(0, subIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// 3D Tilt Card component
const TiltCard = ({ children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full aspect-square max-w-[420px] mx-auto rounded-[3rem] z-10"
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} className="w-full h-full relative">
        {children}
      </div>
    </motion.div>
  );
};

const MagneticButton = ({ children, className, href }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.2);
    y.set((clientY - (top + height / 2)) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.a>
  );
};

const FloatingBadge = ({ icon: Icon, text, delay, style, yAnim }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1, y: yAnim || [-5, 5, -5] }}
    transition={{ 
      opacity: { delay, duration: 0.5 }, 
      scale: { delay, type: "spring", stiffness: 200, damping: 20 },
      y: { duration: Math.random() * 2 + 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }
    }}
    className="absolute z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0a0a0f]/80 border border-white/10 backdrop-blur-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
    style={{ ...style, transform: "translateZ(70px)" }} // 3D pop effect
  >
    {Icon && <Icon className="w-4 h-4 text-primary-2" />}
    <span className="text-xs font-mono font-semibold text-white/90 whitespace-nowrap">{text}</span>
  </motion.div>
);

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [heroData, setHeroData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    
    let isHeroLoaded = false;
    let isSettingsLoaded = false;

    const checkLoading = () => {
      if (isHeroLoaded && isSettingsLoaded) setIsLoading(false);
    };

    const unsubscribeHero = subscribeToHeroData((data) => {
      setHeroData(data);
      isHeroLoaded = true;
      checkLoading();
    });

    const unsubscribeSettings = subscribeToSettings((data) => {
      if (data) setSettings(data);
      isSettingsLoaded = true;
      checkLoading();
    });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      unsubscribeHero();
      unsubscribeSettings();
    };
  }, []);

  if (isLoading) {
    return (
      <section id="home" className="relative min-h-screen pt-32 pb-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </section>
    );
  }

  if (!heroData) return null;

  const roles = [
    heroData.title || "Frontend Developer",
    "B.Tech CSE Student",
    "React Developer",
    "Problem Solver",
    "UI Enthusiast",
    "Continuous Learner"
  ];

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden selection:bg-primary/30">
      
      {/* Dynamic Mouse Spotlight */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 107, 255, 0.05), transparent 40%)`
        }}
      />

      {/* Aurora Background & Particles */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, -50, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -100, 0], y: [0, 100, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-accent/30 rounded-full blur-[120px]"
        />
        
        {/* Animated Mesh/Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10 mt-10 lg:mt-0">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col space-y-8"
          >
            {/* Premium Label */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.02)]"
            >
              <Sparkles className="w-4 h-4 text-accent-2" />
              <span className="text-[10px] sm:text-xs font-mono text-white/80 uppercase tracking-[0.2em] font-semibold">
                {heroData.subtitle || 'BUILDING MODERN WEB EXPERIENCES'}
              </span>
            </motion.div>

            {/* Main Name Heading */}
            <div className="space-y-2">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl sm:text-7xl lg:text-[5rem] xl:text-[6rem] font-display font-bold leading-[0.9] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary via-accent-2 to-primary animate-gradient bg-[length:200%_auto] relative uppercase"
              >
                <span className="absolute inset-0 bg-primary/20 blur-3xl -z-10 mix-blend-screen" />
                {(heroData.name || "AZMEERA CHARAN").split(' ').map((word, i) => (
                  <React.Fragment key={i}>
                    {word}
                    {i !== (heroData.name || "AZMEERA CHARAN").split(' ').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </motion.h1>
              
              {/* Typing Animation */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl sm:text-2xl xl:text-3xl font-heading font-medium text-white/90 pt-4"
              >
                I am a <Typewriter words={roles} />
              </motion.div>
            </div>

            {/* Professional Intro */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-lg font-sans font-light text-text-muted max-w-xl leading-relaxed tracking-wide"
            >
              {heroData.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <MagneticButton 
                href="#projects"
                className="group relative px-6 py-3.5 font-button font-semibold text-white bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/30 hover:shadow-[0_0_30px_rgba(124,107,255,0.3)] flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2">
                  {heroData.primaryButton || 'Explore My Work'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </MagneticButton>

              <MagneticButton 
                href={settings?.resumeUrl || heroData.resumeUrl || '#'}
                className="group px-6 py-3.5 font-button font-semibold text-white/90 bg-transparent border border-white/10 rounded-2xl hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                {heroData.secondaryButton || 'Download Resume'} <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </MagneticButton>
              
              <MagneticButton 
                href="#contact"
                className="group px-6 py-3.5 font-button font-semibold text-white/90 bg-transparent border border-transparent hover:text-accent-2 transition-colors flex items-center gap-2"
              >
                Let's Connect
              </MagneticButton>
            </motion.div>

            {/* Social Links & Status */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col xl:flex-row items-start xl:items-center gap-6 pt-6 border-t border-white/5"
            >
              <div className="flex items-center gap-5 text-sm font-button text-text-muted">
                {(settings?.github || heroData.socialLinks?.github) && (
                  <a href={settings?.github || heroData.socialLinks?.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors relative group">
                    GitHub
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
                  </a>
                )}
                {(settings?.linkedin || heroData.socialLinks?.linkedin) && (
                  <a href={settings?.linkedin || heroData.socialLinks?.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors relative group">
                    LinkedIn
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
                  </a>
                )}
                {(settings?.twitter || heroData.socialLinks?.twitter) && (
                  <a href={settings?.twitter || heroData.socialLinks?.twitter} target="_blank" rel="noreferrer" className="hover:text-white transition-colors relative group">
                    Twitter
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
                  </a>
                )}
                {(settings?.instagram || heroData.socialLinks?.instagram) && (
                  <a href={settings?.instagram || heroData.socialLinks?.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors relative group">
                    Instagram
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
                  </a>
                )}
              </div>
              
              <div className="hidden xl:block w-1.5 h-1.5 rounded-full bg-white/20" />
              
              <div className="inline-flex items-center gap-2 text-xs font-medium text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Open to Internships & Learning Opportunities
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full min-h-[500px] flex justify-center items-center lg:justify-end mt-12 lg:mt-0"
          >
            {/* Animated background shape for the image */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-primary/30 via-accent-2/10 to-accent-2/30 blur-3xl -z-10"
            />
            
            <TiltCard>
              <div className="relative w-full h-full rounded-[3rem] bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] group">
                {/* Glowing border effect */}
                <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/50 via-transparent to-accent-2/50 rounded-[3rem] opacity-50 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                
                {/* Profile Image Container */}
                <div className="absolute inset-2 rounded-[2.5rem] overflow-hidden bg-[#0a0a0f] border border-white/5 z-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10 opacity-70" />
                  
                  {/* Glass Reflection */}
                  <div className="absolute -inset-full w-[250%] h-[250%] rotate-[35deg] bg-gradient-to-br from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 z-20 pointer-events-none" />
                  
                  <img 
                    src={settings?.profileImageUrl || heroData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(settings?.ownerName || heroData.name || 'Admin')}&size=400&background=7c6bff&color=fff`} 
                    alt={settings?.ownerName || heroData.name || "Profile"} 
                    className="w-full h-full object-cover object-center transition-all duration-700 scale-105 group-hover:scale-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(settings?.ownerName || heroData.name || 'Admin')}&size=400&background=7c6bff&color=fff`;
                    }}
                  />
                  {/* Fallback pattern if image is missing */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%,transparent_100%)] bg-[size:20px_20px] -z-10" />
                </div>

                {/* Floating Technology Badges */}
                <FloatingBadge text="React" icon={Code} delay={0.5} style={{ top: '15%', left: '-8%' }} yAnim={[-4, 4, -4]} />
                <FloatingBadge text="JavaScript" icon={Terminal} delay={0.7} style={{ top: '5%', right: '5%' }} yAnim={[-6, 6, -6]} />
                <FloatingBadge text="Tailwind CSS" delay={0.9} style={{ bottom: '25%', left: '-12%' }} yAnim={[-3, 3, -3]} />
                <FloatingBadge text="AI" icon={Sparkles} delay={1.1} style={{ bottom: '15%', right: '-5%' }} yAnim={[-5, 5, -5]} />
                <FloatingBadge text="Python" delay={1.3} style={{ top: '40%', right: '-15%' }} yAnim={[-7, 7, -7]} />
                <FloatingBadge text="Node.js" icon={Database} delay={1.5} style={{ top: '35%', left: '-15%' }} yAnim={[-4, 4, -4]} />
                <FloatingBadge text="Git" delay={1.7} style={{ bottom: '-5%', left: '20%' }} yAnim={[-3, 3, -3]} />
                <FloatingBadge text="GitHub" delay={1.9} style={{ bottom: '5%', right: '20%' }} yAnim={[-5, 5, -5]} />
              </div>
            </TiltCard>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 z-20"
      >
        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[2px] h-12 bg-gradient-to-b from-primary via-accent-2 to-transparent rounded-full shadow-[0_0_10px_rgba(124,107,255,0.5)]"
        />
      </motion.div>
    </section>
  );
};

export default Hero;

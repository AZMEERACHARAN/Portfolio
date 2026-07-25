import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download, GraduationCap, Target, Brain, Lightbulb, Flame } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';

const ICONS = {
  GraduationCap, Target, Brain, Lightbulb, Flame
};

const AboutCard = ({ title, icon: Icon, description, delay, items, fullWidth }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02 }}
      className={`relative group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 backdrop-blur-md transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(124,107,255,0.15)] overflow-hidden h-full flex flex-col justify-center ${fullWidth ? 'md:col-span-2' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      
      {/* Animated Particles */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/40 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-700" />
      <div className="absolute bottom-4 left-1/2 w-1.5 h-1.5 rounded-full bg-accent/40 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-1000 delay-300" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(124,107,255,0.4)]">
            <Icon className="w-6 h-6 text-accent-2 group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-heading font-semibold text-lg text-white/90 group-hover:text-white transition-colors">{title}</h3>
        </div>
        
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
          <div className="overflow-hidden">
            <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {description && (
                <p className="text-sm font-sans text-text-muted leading-relaxed">
                  {description}
                </p>
              )}
              
              {items && (
                <ul className="space-y-2">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm font-sans text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(124,107,255,0.8)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const About = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const aboutData = usePortfolioData('aboutData') || {};
  const cards = aboutData.cards || [];

  return (
    <section id="about" className="relative py-32 overflow-hidden" ref={containerRef}>
      {/* Aurora Background for About Section */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, -50, 0], y: [0, 50, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-start">
          
          {/* LEFT SIDE: Story */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col space-y-8 lg:sticky lg:top-32"
          >
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md shadow-[0_0_15px_rgba(124,107,255,0.1)]"
              >
                <span className="text-[10px] sm:text-xs font-mono text-primary-2 uppercase tracking-[0.2em] font-semibold">
                  DISCOVER MORE
                </span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight"
              >
                Who <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-accent-2 animate-gradient-x">I Am</span>
              </motion.h2>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
              className="space-y-6 text-base sm:text-lg font-sans font-light text-text-muted leading-relaxed whitespace-pre-wrap"
            >
              {aboutData.biography || (
                <>
                  <p>
                    I am a driven software developer, fueled by an immense passion for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-2 font-medium">Frontend Development</span>, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-2 font-medium">React</span>, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-2 font-medium">Modern UI/UX</span>.
                  </p>
                  <p>
                    For me, coding is more than just writing logic—it is the art of crafting seamless, intuitive, and <span className="text-white font-medium">premium web applications</span> that leave a lasting impact.
                  </p>
                </>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              className="relative p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary shadow-[inset_0_0_20px_rgba(124,107,255,0.05)]"
            >
              <p className="font-heading font-medium text-white/90 italic text-lg">
                "{aboutData.careerObjective || 'The only way to do great work is to love what you do. Constantly learning, constantly evolving.'}"
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <button className="group relative px-8 py-4 font-button font-semibold text-white bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:border-white/30 hover:shadow-[0_0_30px_rgba(124,107,255,0.3)] flex items-center gap-3">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-3">
                  Download Resume <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: Interactive Glass Dashboard (Bento Box) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {cards.map((card, index) => (
                <AboutCard
                  key={card.id || index}
                  title={card.title}
                  icon={ICONS[card.icon] || Lightbulb}
                  description={card.description}
                  items={card.items}
                  fullWidth={card.fullWidth}
                  delay={0.2 + (index * 0.1)}
                />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default About;

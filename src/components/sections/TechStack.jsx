import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToSkills } from '../../services/skillsService';
import * as Icons from 'lucide-react';

const TechCard = ({ tech }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = tech.icon;

  return (
    <div 
      className={`relative flex items-center justify-center w-[140px] sm:w-[160px] md:w-[170px] h-32 sm:h-40 ${isHovered ? 'z-50' : 'z-0'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Added touch events for mobile support
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
        <motion.div
          layout
          className={`glass rounded-3xl border overflow-hidden flex flex-col transition-shadow duration-300 ${
            isHovered
              ? `fixed top-1/2 left-0 right-0 mx-auto -translate-y-1/2 md:absolute md:inset-0 md:m-auto md:translate-y-0 h-fit w-[calc(100vw-2rem)] max-w-[320px] md:max-w-none md:w-[340px] z-[100] md:z-50 p-6 bg-[#0b0f1e]/98 md:bg-[#0b0f1e]/95 backdrop-blur-2xl border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] md:shadow-none ${tech.glowColor}`
              : 'relative w-full h-full z-10 p-4 items-center justify-center bg-white/5 border-white/10 hover:border-white/20'
          }`}
        style={{ backdropFilter: 'blur(20px)' }}
      >
        <motion.div 
          layout 
          className={`flex ${isHovered ? 'flex-row items-center gap-4 mb-4' : 'flex-col items-center justify-center gap-3'}`}
        >
          <motion.div 
            layout 
            className={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${tech.color} shadow-lg border border-white/10 overflow-hidden ${
              isHovered ? 'w-12 h-12' : 'w-12 h-12 sm:w-14 sm:h-14'
            }`}
          >
            {tech.imageUrl ? (
              <>
                <img 
                  src={tech.imageUrl} 
                  alt={tech.name} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'block';
                    }
                  }}
                />
                <Icon 
                  className="text-white w-6 h-6 sm:w-7 sm:h-7" 
                  style={{ display: 'none' }}
                />
              </>
            ) : (
              <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
            )}
          </motion.div>
          <motion.h3 
            layout 
            className={`font-display font-semibold text-white ${isHovered ? 'text-xl' : 'text-sm sm:text-base text-center'}`}
          >
            {tech.name}
          </motion.h3>
        </motion.div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 text-left"
            >
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Experience Level</span>
                <span className="text-xs font-medium text-primary-2 bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                  {tech.level}
                </span>
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">About</span>
                <p className="text-sm text-white/80 leading-relaxed">{tech.description}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Projects</span>
                <p className="text-sm text-white/80 leading-relaxed truncate">
                  {tech.projects.join(', ')}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Status</span>
                <p className="text-sm text-accent-2 leading-relaxed truncate">{tech.status}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const TechStack = React.memo(() => {
  const [technologies, setTechnologies] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = subscribeToSkills((data) => {
      const mapped = data.map(skill => {
        let projectsArr = [];
        if (Array.isArray(skill.projects)) {
          projectsArr = skill.projects;
        } else if (typeof skill.projects === 'string' && skill.projects.trim()) {
          projectsArr = skill.projects.split(',').map(s => s.trim());
        }

        const color = skill.color || "from-[#7C6BFF]/40 to-[#7C6BFF]/10";
        const glowColor = skill.glowColor || "shadow-[0_0_30px_rgba(124,107,255,0.4)]";
        const Icon = Icons[skill.icon] || Icons.Code2;

        return {
          id: skill.id,
          name: skill.title || skill.name || 'Unknown',
          icon: Icon,
          imageUrl: skill.imageUrl || skill.image || '',
          color,
          glowColor,
          description: skill.about || skill.description || 'No description provided.',
          level: skill.proficiency || skill.level || 'Intermediate',
          projects: projectsArr.length ? projectsArr : ['No projects listed'],
          status: skill.status || 'Active'
        };
      });
      setTechnologies(mapped);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <section id="skills" className="relative py-32 min-h-screen overflow-hidden">
      {/* Background glow & particles */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 40, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] will-change-transform"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="hidden md:block absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-accent-2/20 rounded-full blur-[100px] will-change-transform"
        />
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mx-auto shadow-[0_0_15px_rgba(124,107,255,0.1)]"
          >
            <span className="text-[10px] sm:text-xs font-mono text-primary-2 uppercase tracking-[0.2em] font-semibold">
              TECHNOLOGY HUB
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight"
          >
            Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-accent-2 animate-gradient-x">Technologies</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-muted max-w-2xl mx-auto text-sm sm:text-base"
          >
            Hover over any technology card below to smoothly expand it and explore my experience, related projects, and proficiency level.
          </motion.p>
        </div>

        {/* Flow Container */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24 text-white/50">
            <Icons.Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-3">Loading technologies...</span>
          </div>
        ) : technologies.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            No technologies found. Please add them from the admin panel.
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {technologies.map((tech) => (
              <TechCard key={tech.id} tech={tech} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
});

export default TechStack;

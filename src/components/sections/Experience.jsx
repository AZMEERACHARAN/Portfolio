import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Layout, Blocks, Rocket, Milestone, Briefcase } from 'lucide-react';
import { getExperienceData } from '../../services/experienceApi';

const Experience = () => {
  const [experienceData, setExperienceData] = useState([]);

  useEffect(() => {
    const loadExperience = () => {
      const data = getExperienceData();
      setExperienceData(data || []);
    };
    loadExperience();
    window.addEventListener('storage', loadExperience);
    return () => window.removeEventListener('storage', loadExperience);
  }, []);

  return (
    <section id="experience" className="py-32 relative min-h-screen">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-2/5 rounded-full blur-[120px]" />
      </div>

      <div className="container max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg"
          >
            <Milestone className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary-2 uppercase tracking-widest font-semibold">
              Experience
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight"
          >
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Professional Journey</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base"
          >
            A timeline of my professional experience and roles.
          </motion.p>
        </div>

        {experienceData.length === 0 ? (
          <div className="text-center text-white/40 py-20">
            No experience records added yet. Add them in the admin panel.
          </div>
        ) : (
          /* Experience Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {experienceData.map((item, index) => {
              return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass p-8 rounded-3xl border border-white/10 hover:border-primary/30 hover:bg-white/5 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Card Hover Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary to-accent shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/5">
                      {item.duration}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-2 transition-colors">
                    {item.position}
                  </h3>
                  <h4 className="text-sm font-medium text-primary mb-3">
                    {item.organization}
                  </h4>
                  
                  <p className="text-sm text-white/60 leading-relaxed flex-grow whitespace-pre-wrap">
                    {item.description}
                  </p>
                  
                </div>
              </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default Experience;

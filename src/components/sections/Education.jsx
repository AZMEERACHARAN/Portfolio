import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen, Star, Sparkles } from 'lucide-react';
import { getEducationData } from '../../services/educationApi';

const Education = () => {
  const [educationData, setEducationData] = useState([]);

  useEffect(() => {
    const loadEducation = () => {
      const data = getEducationData();
      setEducationData(data || []);
    };
    loadEducation();
    window.addEventListener('storage', loadEducation);
    return () => window.removeEventListener('storage', loadEducation);
  }, []);

  return (
    <section id="education" className="py-32 relative min-h-screen">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px]" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg"
          >
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary-2 uppercase tracking-widest font-semibold">
              Academic Journey
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight"
          >
            Education & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-2">Timeline</span>
          </motion.h2>
        </div>

        {/* Timeline Container */}
        {educationData.length === 0 ? (
          <div className="text-center text-white/40 py-20">
            No education records added yet. Add them in the admin panel.
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            {/* Main vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-white/10 to-transparent transform md:-translate-x-1/2 rounded-full" />

            <div className="space-y-16">
              {educationData.map((item, index) => {
                return (
                <div key={item.id} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Dot & Icon */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className={`absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[#0b0f1e] border-2 border-primary/30 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-accent shadow-inner`}>
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className={`w-full md:w-1/2 pl-24 pr-4 md:px-12 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}
                  >
                    <div className={`glass p-8 rounded-3xl border border-white/10 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-primary/20 relative overflow-hidden group`}>
                      
                      {/* Hover Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                      
                      <span className="inline-block px-3 py-1 mb-4 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
                        {item.duration}
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary-2 transition-colors">
                        {item.degree}
                      </h3>
                      <h4 className="text-sm font-medium text-primary mb-4 flex items-center gap-2 justify-start md:justify-normal">
                        <BookOpen className="w-4 h-4" /> {item.institute}
                      </h4>
                      
                      <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>

                </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Education;

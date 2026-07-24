import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { getSkillsData } from '../../services/skillsApi';

const CAT_COLORS = {
  Frontend: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]',
  Backend: 'from-orange-500/20 to-orange-500/5 border-orange-500/20 hover:border-orange-500/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]',
  Database: 'from-green-500/20 to-green-500/5 border-green-500/20 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]',
  DevOps: 'from-red-500/20 to-red-500/5 border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]',
  Tools: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]',
  Language: 'from-pink-500/20 to-pink-500/5 border-pink-500/20 hover:border-pink-500/40 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]',
  Design: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]',
  Other: 'from-primary/20 to-primary/5 border-primary/20 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(124,107,255,0.2)]',
};

const DEFAULT_SKILLS = [
  { id: '1', name: 'React.js', category: 'Frontend', level: 'Advanced' },
  { id: '2', name: 'Node.js', category: 'Backend', level: 'Intermediate' },
  { id: '3', name: 'JavaScript', category: 'Language', level: 'Expert' },
  { id: '4', name: 'TypeScript', category: 'Language', level: 'Advanced' },
  { id: '5', name: 'Tailwind CSS', category: 'Frontend', level: 'Expert' },
  { id: '6', name: 'MongoDB', category: 'Database', level: 'Intermediate' },
  { id: '7', name: 'Git', category: 'Tools', level: 'Advanced' },
  { id: '8', name: 'Python', category: 'Language', level: 'Intermediate' },
  { id: '9', name: 'Express', category: 'Backend', level: 'Intermediate' },
  { id: '10', name: 'Framer Motion', category: 'Frontend', level: 'Advanced' },
  { id: '11', name: 'Next.js', category: 'Frontend', level: 'Intermediate' },
  { id: '12', name: 'SQL', category: 'Database', level: 'Intermediate' },
];

const CATEGORIES_ORDER = ['Frontend', 'Backend', 'Language', 'Database', 'DevOps', 'Tools', 'Design', 'Other'];

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const loadSkills = () => {
      const data = getSkillsData();
      setSkills(data && data.length > 0 ? data : DEFAULT_SKILLS);
    };

    loadSkills(); // Initial load

    // Listen for changes from admin panel (e.g., cross-tab updates)
    window.addEventListener('storage', loadSkills);
    return () => window.removeEventListener('storage', loadSkills);
  }, []);

  // Group by category in defined order
  const grouped = CATEGORIES_ORDER.reduce((acc, cat) => {
    const items = skills.filter(s => s.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  // Add any uncategorized/unknown categories
  skills.forEach(s => {
    if (!CATEGORIES_ORDER.includes(s.category) && s.category) {
      if (!grouped[s.category]) grouped[s.category] = [];
      if (!grouped[s.category].find(x => x.id === s.id)) grouped[s.category].push(s);
    }
  });

  return (
    <section id="skills" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -40, 0], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 60, 0], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="container max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mx-auto shadow-[0_0_15px_rgba(124,107,255,0.1)]"
          >
            <Code2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] sm:text-xs font-mono text-primary-2 uppercase tracking-[0.2em] font-semibold">
              TECHNICAL SKILLS
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight"
          >
            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-accent-2 animate-gradient-x">Skills</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-muted max-w-2xl mx-auto text-sm sm:text-base"
          >
            Technologies I work with to bring ideas to life.
          </motion.p>
        </div>

        {/* Skills Display */}
        {skills.length === 0 ? (
          <div className="text-center py-16 text-white/30">No skills data yet. Add skills from the admin panel.</div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items], catIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIdx * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 font-mono">{category}</h3>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {items.map((skill, idx) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: catIdx * 0.05 + idx * 0.04 }}
                      whileHover={{ scale: 1.06, y: -4 }}
                      className={`px-5 py-2.5 rounded-full bg-gradient-to-br border text-sm font-medium text-white backdrop-blur-md transition-all duration-300 cursor-default ${CAT_COLORS[category] || CAT_COLORS.Other}`}
                    >
                      {skill.name}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;

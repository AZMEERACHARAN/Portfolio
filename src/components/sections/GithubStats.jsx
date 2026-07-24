import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, GitFork, Users, Star, BookOpen, Activity, Code2 } from 'lucide-react';

const stats = [
  { label: 'Total Repositories', value: 42, icon: BookOpen, color: 'text-blue-400' },
  { label: 'Followers', value: 128, icon: Users, color: 'text-purple-400' },
  { label: 'Following', value: 35, icon: Users, color: 'text-pink-400' },
  { label: 'Total Stars', value: 310, icon: Star, color: 'text-yellow-400' },
  { label: 'Total Forks', value: 85, icon: GitFork, color: 'text-emerald-400' },
];

const languages = [
  { name: 'JavaScript', percentage: 45, color: 'bg-yellow-400' },
  { name: 'React/JSX', percentage: 25, color: 'bg-blue-400' },
  { name: 'HTML/CSS', percentage: 20, color: 'bg-orange-400' },
  { name: 'Python', percentage: 10, color: 'bg-green-400' },
];

const GithubStats = () => {
  return (
    <section id="github" className="py-32 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg"
          >
            <GitBranch className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary-2 uppercase tracking-widest font-semibold">
              Open Source
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight"
          >
            GitHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-2">Statistics</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Stat Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex flex-col items-center justify-center text-center group"
              >
                <StatIcon className={`w-8 h-8 mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-xs text-text-muted uppercase tracking-wider">{stat.label}</p>
              </motion.div>
              );
            })}
            
            {/* Activity Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary/10 to-accent-2/10"
            >
              <Activity className="w-8 h-8 mb-3 text-white animate-pulse" />
              <h3 className="text-3xl font-bold text-white mb-1">1.2k</h3>
              <p className="text-xs text-white/70 uppercase tracking-wider">Contributions</p>
            </motion.div>
          </div>

          {/* Top Languages Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-3xl border border-white/10 flex flex-col"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" /> Top Languages
            </h3>
            
            <div className="space-y-6 flex-grow">
              {languages.map((lang, i) => (
                <div key={lang.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">{lang.name}</span>
                    <span className="text-white/50">{lang.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${lang.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                      className={`h-full ${lang.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contribution Graph Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 glass p-8 rounded-3xl border border-white/10 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1e] via-transparent to-transparent pointer-events-none z-10" />
            <h3 className="text-lg font-bold text-white mb-6">Contribution Activity</h3>
            
            {/* Mock GitHub Contribution Graph Pattern */}
            <div className="flex gap-1 overflow-hidden opacity-50">
              {[...Array(52)].map((_, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-1">
                  {[...Array(7)].map((_, rowIndex) => {
                    // Randomize cell colors to simulate contributions
                    const intensity = Math.random();
                    let bgColor = 'bg-white/5';
                    if (intensity > 0.9) bgColor = 'bg-primary';
                    else if (intensity > 0.7) bgColor = 'bg-primary/70';
                    else if (intensity > 0.5) bgColor = 'bg-primary/40';
                    
                    return (
                      <div 
                        key={`${colIndex}-${rowIndex}`} 
                        className={`w-3 h-3 rounded-sm ${bgColor}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default GithubStats;

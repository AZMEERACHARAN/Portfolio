import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { FolderGit2, Cpu, GitBranch, Code2, Award, Clock, Star, Target, Trophy, Loader2 } from 'lucide-react';
import { subscribeToAchievements } from '../../services/achievementsService';

const STAT_COLORS = [
  { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  { color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
  { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  { color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
  { color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
  { color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/20' }
];

const ICONS = {
  FolderGit2, Cpu, GitBranch, Code2, Award, Clock
};

const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 20, duration: 2000 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-US').format(Math.floor(latest));
      }
    });
  }, [springValue]);

  return (
    <span className="flex items-center">
      <span ref={ref}>0</span>
      <span>{suffix}</span>
    </span>
  );
};

const Achievements = () => {
  const [stats, setStats] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = subscribeToAchievements((data) => {
      const activeStats = data
        .filter(s => s.isActive !== false)
        .sort((a, b) => {
          const orderA = a.displayOrder || 0;
          const orderB = b.displayOrder || 0;
          if (orderA !== orderB) {
            return orderA - orderB;
          }
          const timeA = a.achievementDate ? new Date(a.achievementDate).getTime() : 
                        (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0);
          const timeB = b.achievementDate ? new Date(b.achievementDate).getTime() : 
                        (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0);
          return timeB - timeA;
        });
      setStats(activeStats);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="achievements" className="py-24 relative overflow-hidden">
      
      {/* Background styling */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent-2/5 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />
      </div>

      <div className="container max-w-6xl mx-auto px-6">
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : stats.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-white/40 text-sm">No achievements available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {stats.map((stat, index) => {
              const StatIcon = ICONS[stat.icon] || Trophy;
              const style = STAT_COLORS[index % STAT_COLORS.length];
              return (
              <motion.div
                key={stat.id || stat.label || index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group p-6 sm:p-8 rounded-3xl glass border border-white/10 text-center hover:border-white/20 transition-all duration-300"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                
                <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg} ${style.color} group-hover:scale-110 transition-transform duration-500`}>
                    <StatIcon className="w-6 h-6" />
                  </div>
                  
                  <div className={`text-4xl sm:text-5xl font-display font-bold ${style.color} drop-shadow-lg`}>
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  
                  <h3 className="text-sm sm:text-base font-medium text-white/70 tracking-wide">
                    {stat.title || stat.label}
                  </h3>
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

export default Achievements;

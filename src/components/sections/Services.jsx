import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Smartphone, Layout, Palette, Briefcase, Zap } from 'lucide-react';

const services = [
  {
    title: 'Frontend Development',
    description: 'Building robust, scalable, and highly performant web applications using modern JavaScript frameworks like React and Next.js.',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/20'
  },
  {
    title: 'Responsive Websites',
    description: 'Ensuring your website looks pixel-perfect and functions flawlessly across all devices, from mobile phones to ultra-wide monitors.',
    icon: Smartphone,
    color: 'from-purple-500 to-fuchsia-500',
    shadow: 'shadow-purple-500/20'
  },
  {
    title: 'React Applications',
    description: 'Specialized in developing complex Single Page Applications (SPAs) with robust state management and seamless API integrations.',
    icon: Layout,
    color: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-emerald-500/20'
  },
  {
    title: 'UI/UX Design Implementation',
    description: 'Translating Figma designs into pixel-perfect code with advanced CSS techniques, glassmorphism, and smooth animations.',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    shadow: 'shadow-pink-500/20'
  },
  {
    title: 'Portfolio Development',
    description: 'Creating award-winning personal branding websites and developer portfolios that stand out to recruiters and clients.',
    icon: Briefcase,
    color: 'from-orange-400 to-red-500',
    shadow: 'shadow-orange-500/20'
  },
  {
    title: 'Performance Optimization',
    description: 'Auditing and optimizing existing web applications to achieve perfect Lighthouse scores and lightning-fast load times.',
    icon: Zap,
    color: 'from-yellow-400 to-amber-500',
    shadow: 'shadow-yellow-500/20'
  }
];

const Services = () => {
  return (
    <section id="services" className="py-32 relative">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-2/5 rounded-full blur-[120px]" />
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
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary-2 uppercase tracking-widest font-semibold">
              What I Do
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight"
          >
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-2">Services</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base"
          >
            Leveraging modern web technologies to build premium, scalable, and visually stunning digital experiences.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const ServiceIcon = service.icon;
            return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              {/* Gradient Border Glow (visible on hover) */}
              <div className={`absolute -inset-[1px] rounded-3xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]`} />
              
              <div className="relative h-full glass p-8 rounded-3xl border border-white/10 bg-[#0b0f1e]/90 hover:bg-[#060812]/95 transition-colors overflow-hidden flex flex-col">
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 group-hover:scale-150 group-hover:rotate-12 transform origin-top-right">
                  <ServiceIcon className="w-48 h-48" />
                </div>

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${service.color} mb-6 shadow-lg ${service.shadow} group-hover:scale-110 transition-transform duration-500`}>
                  <ServiceIcon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-2 transition-colors z-10">
                  {service.title}
                </h3>
                
                <p className="text-white/60 text-sm leading-relaxed z-10">
                  {service.description}
                </p>
              </div>
            </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;

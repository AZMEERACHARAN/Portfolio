import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ExternalLink, GitBranch, Layers, Clock, Star,
  FolderGit2, Rocket, Target, Zap
} from 'lucide-react';
import { subscribeToProjects } from '../../services/projectsService';

const STATUS_COLORS = {
  Completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Ongoing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Planned: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToProjects((data) => {
      setProjects(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedId) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedId]);

  const selectedProject = projects.find(p => p.id === selectedId);

  return (
    <section id="projects" className="relative py-32 min-h-screen">
      {/* Background Styling */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="hidden md:block absolute top-1/3 right-10 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
        <div className="hidden md:block absolute bottom-0 left-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mx-auto shadow-[0_0_15px_rgba(124,107,255,0.1)]"
          >
            <span className="text-[10px] sm:text-xs font-mono text-primary-2 uppercase tracking-[0.2em] font-semibold">
              PORTFOLIO SHOWCASE
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight"
          >
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-accent-2 animate-gradient-x">Projects</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-muted max-w-2xl mx-auto text-sm sm:text-base"
          >
            Click on any project to explore the architecture, technologies used, and links.
          </motion.p>
        </div>

        {/* Empty / Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white/[0.02] border border-white/6 rounded-3xl">
            <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin mb-4" />
            <p className="text-white/40 text-sm">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center bg-white/[0.02] border border-white/6 rounded-3xl"
          >
            <FolderGit2 className="w-16 h-16 text-white/10 mb-4" />
            <h3 className="text-white/40 text-lg font-medium mb-2">No Projects Yet</h3>
            <p className="text-white/25 text-sm">Projects added from the admin panel will appear here.</p>
          </motion.div>
        ) : (
          /* Project Grid */
          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 ${selectedId ? 'opacity-30 blur-md pointer-events-none' : 'opacity-100 blur-none'}`}>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                layoutId={`project-container-${project.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => setSelectedId(project.id)}
                className="group cursor-pointer rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors shadow-lg"
              >
                {/* Image / Gradient Area */}
                <motion.div
                  layoutId={`project-image-${project.id}`}
                  className="h-56 relative overflow-hidden flex items-center justify-center border-b border-white/5 bg-[#0a0a0f]"
                >
                  {project.image ? (
                    <img src={project.image} alt={project.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent-2/30 opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-700" />
                      <Layers className="w-12 h-12 text-white/30 z-10 group-hover:scale-110 transition-transform duration-500" />
                    </>
                  )}

                  {/* Overlays */}
                  {project.featured && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-[10px] font-bold z-10">
                      <Star className="w-3 h-3" /> Featured
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold border z-10 ${STATUS_COLORS[project.status] || STATUS_COLORS.Planned}`}>
                    {project.status}
                  </span>
                </motion.div>

                {/* Card Content */}
                <div className="p-6">
                  <motion.h3 layoutId={`project-title-${project.id}`} className="font-display font-bold text-2xl text-white mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </motion.h3>
                  <motion.p layoutId={`project-desc-${project.id}`} className="text-sm text-text-muted line-clamp-2 mb-4">
                    {project.description}
                  </motion.p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.split(',').filter(t => t.trim()).slice(0, 3).map((tech, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                        {tech.trim()}
                      </span>
                    ))}
                    {project.technologies.split(',').filter(t => t.trim()).length > 3 && (
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs">
                        +{project.technologies.split(',').filter(t => t.trim()).length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#030308]/80 backdrop-blur-md pointer-events-auto"
              onClick={() => setSelectedId(null)}
            />

            <motion.div
              layoutId={`project-container-${selectedProject.id}`}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#0b0f1e] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent-2 opacity-60" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:text-white text-white/70 transition-all hover:rotate-90 shadow-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto overflow-x-hidden w-full flex-1 min-h-0 flex flex-col">
                {/* Modal Hero Container */}
                <div className="relative flex flex-col md:block w-full flex-shrink-0">
                  {/* Modal Hero Image */}
                  <motion.div
                    layoutId={`project-image-${selectedProject.id}`}
                    className="w-full h-48 md:h-72 relative overflow-hidden border-b border-white/10 bg-[#060812]"
                  >
                    {selectedProject.image ? (
                      <img src={selectedProject.image} alt={selectedProject.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent-2/30 opacity-40" />
                    )}
                    {/* Desktop overlay tint */}
                    <div className="hidden md:block absolute inset-0 bg-[#0b0f1e]/50" />
                  </motion.div>

                  {/* Title & Desc (Below image on mobile, Overlaid on desktop) */}
                  <div className="relative md:absolute md:inset-0 z-10 flex flex-col justify-center items-center text-center px-5 py-6 md:py-0 md:mt-8 bg-[#0b0f1e] md:bg-transparent">
                    <motion.h2 layoutId={`project-title-${selectedProject.id}`} className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-2xl mb-2 md:mb-3 break-words w-full">
                      {selectedProject.title}
                    </motion.h2>
                    <motion.p layoutId={`project-desc-${selectedProject.id}`} className="text-sm md:text-lg text-white/80 max-w-xl mx-auto drop-shadow-lg break-words w-full">
                      {selectedProject.description}
                    </motion.p>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-5 sm:p-8 lg:p-12 w-full max-w-full">
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

                    {/* Left Sidebar */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-0 h-fit">

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 w-full">
                        {selectedProject.demo && (
                          <a
                            href={selectedProject.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent-2 text-white font-semibold shadow-[0_0_20px_rgba(124,107,255,0.3)] hover:shadow-[0_0_30px_rgba(124,107,255,0.5)] hover:-translate-y-1 transition-all text-sm"
                          >
                            View Live Demo <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {selectedProject.github && (
                          <a
                            href={selectedProject.github}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 hover:-translate-y-1 transition-all text-sm"
                          >
                            View on GitHub <GitBranch className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {/* Info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                          <Clock className="w-4 h-4 text-[--text-muted] mb-2" />
                          <p className="text-[10px] uppercase tracking-wider text-[--text-muted] font-mono">Status</p>
                          <p className={`text-xs font-bold px-2 py-0.5 rounded-full border inline-block ${STATUS_COLORS[selectedProject.status] || ''}`}>
                            {selectedProject.status}
                          </p>
                        </div>
                        {selectedProject.featured && (
                          <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 space-y-1">
                            <Star className="w-4 h-4 text-yellow-400 mb-2" />
                            <p className="text-[10px] uppercase tracking-wider text-yellow-400/70 font-mono">Featured</p>
                            <p className="text-xs font-medium text-yellow-400">Highlighted</p>
                          </div>
                        )}
                      </div>

                      {/* Tech Stack */}
                      <div className="space-y-3">
                        <h3 className="text-xs uppercase tracking-wider text-[--text-muted] font-mono">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.technologies.split(',').filter(t => t.trim()).map((tech, i) => (
                            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border bg-primary/10 border-primary/20 text-primary">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full lg:w-2/3 space-y-6 md:space-y-8">
                      <div className="space-y-3">
                        <h3 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
                          <Rocket className="w-5 h-5 text-primary" /> Overview
                        </h3>
                        <p className="text-white/70 leading-relaxed text-sm md:text-base whitespace-pre-wrap break-words">
                          {selectedProject.overview || selectedProject.description}
                        </p>
                      </div>

                      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary space-y-2">
                        <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
                          <Target className="w-4 h-4 text-primary" /> Project Goal
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed break-words">
                          {selectedProject.projectGoal || selectedProject.description}
                        </p>
                      </div>

                      {selectedProject.technologies && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-accent" /> Technology Stack
                          </h3>
                          <ul className="grid sm:grid-cols-2 gap-3">
                            {selectedProject.technologies.split(',').filter(t => t.trim()).map((tech, i) => (
                              <li key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                <span className="text-sm text-white/80">{tech.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;

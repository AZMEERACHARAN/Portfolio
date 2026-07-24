import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Wind, Zap, Coffee, Cpu, GitBranch,
  GitFork, Monitor, PenTool, Network, Atom, FileJson,
  FileCode, Palette, Server, Terminal, BrainCircuit
} from 'lucide-react';

const technologies = [
  {
    id: "react",
    name: "React",
    icon: Atom,
    color: "from-[#61DAFB]/40 to-[#61DAFB]/10",
    glowColor: "shadow-[0_0_30px_rgba(97,218,251,0.4)]",
    description: "A JavaScript library for building user interfaces.",
    level: "Advanced",
    projects: ["Premium Portfolio", "E-Commerce", "Dashboard"],
    status: "Using daily"
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: FileJson,
    color: "from-[#F7DF1E]/40 to-[#F7DF1E]/10",
    glowColor: "shadow-[0_0_30px_rgba(247,223,30,0.4)]",
    description: "The programming language of the Web.",
    level: "Advanced",
    projects: ["Interactive Games", "Web Apps"],
    status: "Mastering advanced concepts"
  },
  {
    id: "html",
    name: "HTML5",
    icon: FileCode,
    color: "from-[#E34F26]/40 to-[#E34F26]/10",
    glowColor: "shadow-[0_0_30px_rgba(227,79,38,0.4)]",
    description: "The standard markup language for documents.",
    level: "Advanced",
    projects: ["All Web Projects"],
    status: "Using daily"
  },
  {
    id: "css",
    name: "CSS3",
    icon: Palette,
    color: "from-[#1572B6]/40 to-[#1572B6]/10",
    glowColor: "shadow-[0_0_30px_rgba(21,114,182,0.4)]",
    description: "Style sheet language used for presentation.",
    level: "Advanced",
    projects: ["Animated Portfolios", "Responsive Dashboards"],
    status: "Exploring 3D transforms"
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    icon: Wind,
    color: "from-[#06B6D4]/40 to-[#06B6D4]/10",
    glowColor: "shadow-[0_0_30px_rgba(6,182,212,0.4)]",
    description: "A utility-first CSS framework for rapid UI development.",
    level: "Advanced",
    projects: ["Modern Portfolios", "SaaS Landing Pages"],
    status: "Using daily"
  },
  {
    id: "nodejs",
    name: "Node.js",
    icon: Server,
    color: "from-[#339933]/40 to-[#339933]/10",
    glowColor: "shadow-[0_0_30px_rgba(51,153,51,0.4)]",
    description: "An asynchronous event-driven JavaScript runtime.",
    level: "Intermediate",
    projects: ["RESTful APIs", "Real-time Chat Apps"],
    status: "Building microservices"
  },
  {
    id: "express",
    name: "Express.js",
    icon: Zap,
    color: "from-white/40 to-white/10",
    glowColor: "shadow-[0_0_30px_rgba(255,255,255,0.4)]",
    description: "Fast, unopinionated web framework for Node.js.",
    level: "Intermediate",
    projects: ["Authentication Systems", "CRUD Applications"],
    status: "Using regularly"
  },
  {
    id: "python",
    name: "Python",
    icon: Terminal,
    color: "from-[#3776AB]/40 to-[#3776AB]/10",
    glowColor: "shadow-[0_0_30px_rgba(55,118,171,0.4)]",
    description: "A high-level, general-purpose programming language.",
    level: "Intermediate",
    projects: ["Data Scrapers", "Automation Scripts"],
    status: "Exploring AI integrations"
  },
  {
    id: "java",
    name: "Java",
    icon: Coffee,
    color: "from-[#B07219]/40 to-[#B07219]/10",
    glowColor: "shadow-[0_0_30px_rgba(176,114,25,0.4)]",
    description: "A high-level, class-based, object-oriented programming language.",
    level: "Intermediate",
    projects: ["Desktop Applications", "Core Algorithms"],
    status: "Studying design patterns"
  },
  {
    id: "c",
    name: "C",
    icon: Cpu,
    color: "from-[#A8B9CC]/40 to-[#A8B9CC]/10",
    glowColor: "shadow-[0_0_30px_rgba(168,185,204,0.4)]",
    description: "A general-purpose, procedural computer programming language.",
    level: "Intermediate",
    projects: ["System Utilities", "Algorithm Implementations"],
    status: "Revisiting memory concepts"
  },
  {
    id: "mysql",
    name: "MySQL",
    icon: Database,
    color: "from-[#4479A1]/40 to-[#4479A1]/10",
    glowColor: "shadow-[0_0_30px_rgba(68,121,161,0.4)]",
    description: "An open-source relational database management system.",
    level: "Intermediate",
    projects: ["User Management Systems", "Inventory Trackers"],
    status: "Optimizing complex queries"
  },
  {
    id: "git",
    name: "Git",
    icon: GitBranch,
    color: "from-[#F05032]/40 to-[#F05032]/10",
    glowColor: "shadow-[0_0_30px_rgba(240,80,50,0.4)]",
    description: "A free and open source distributed version control system.",
    level: "Advanced",
    projects: ["All Repositories"],
    status: "Using daily"
  },
  {
    id: "github",
    name: "GitHub",
    icon: GitFork,
    color: "from-white/40 to-white/10",
    glowColor: "shadow-[0_0_30px_rgba(255,255,255,0.4)]",
    description: "A platform for software development and version control.",
    level: "Advanced",
    projects: ["Open Source Contributions"],
    status: "Using daily"
  },
  {
    id: "vscode",
    name: "VS Code",
    icon: Monitor,
    color: "from-[#007ACC]/40 to-[#007ACC]/10",
    glowColor: "shadow-[0_0_30px_rgba(0,122,204,0.4)]",
    description: "A streamlined code editor with robust extension support.",
    level: "Advanced",
    projects: ["Daily Development"],
    status: "Primary IDE"
  },
  {
    id: "figma",
    name: "Figma",
    icon: PenTool,
    color: "from-[#F24E1E]/40 to-[#F24E1E]/10",
    glowColor: "shadow-[0_0_30px_rgba(242,78,30,0.4)]",
    description: "A collaborative web application for interface design.",
    level: "Intermediate",
    projects: ["Portfolio Design", "App Mockups"],
    status: "Creating design systems"
  },
  {
    id: "ai",
    name: "AI",
    icon: BrainCircuit,
    color: "from-[#7C6BFF]/40 to-[#7C6BFF]/10",
    glowColor: "shadow-[0_0_30px_rgba(124,107,255,0.4)]",
    description: "Artificial Intelligence and Machine Learning paradigms.",
    level: "Beginner",
    projects: ["Generative AI Experiments"],
    status: "Actively studying"
  },
  {
    id: "dsa",
    name: "DSA",
    icon: Network,
    color: "from-[#FF4500]/40 to-[#FF4500]/10",
    glowColor: "shadow-[0_0_30px_rgba(255,69,0,0.4)]",
    description: "Core computer science concepts for optimized code.",
    level: "Intermediate",
    projects: ["Competitive Programming"],
    status: "Solving daily problems"
  }
];

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
            ? `absolute inset-0 m-auto h-fit w-[300px] sm:w-[340px] z-50 p-6 bg-[#0b0f1e]/95 border-white/30 ${tech.glowColor}`
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
            className={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${tech.color} shadow-lg border border-white/10 ${
              isHovered ? 'w-12 h-12' : 'w-12 h-12 sm:w-14 sm:h-14'
            }`}
          >
            <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
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

const TechStack = () => {
  return (
    <section id="skills" className="relative py-32 min-h-screen overflow-hidden">
      {/* Background glow & particles */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03]" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 40, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-accent-2/20 rounded-full blur-[100px]"
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
      </div>
    </section>
  );
};

export default TechStack;

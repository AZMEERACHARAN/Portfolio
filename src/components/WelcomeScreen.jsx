import React from 'react';
import { motion } from 'framer-motion';

const WelcomeScreen = ({ name }) => {
  return (
    <motion.div
      key="welcome-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[10000] bg-[#060812] flex items-center justify-center overflow-hidden"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated Background Glows */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.15 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute w-[400px] h-[400px] bg-primary/40 rounded-full blur-[100px]"
        />
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.15 }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
          className="absolute w-[300px] h-[300px] bg-accent-2/40 rounded-full blur-[80px]"
        />

        {/* Text Animation */}
        <motion.div
          initial={{ y: 30, opacity: 0, filter: "blur(10px)", scale: 0.9 }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <span className="text-xs sm:text-sm font-mono text-primary-2 uppercase tracking-[0.4em] font-semibold">
            Welcome To
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 tracking-tight uppercase text-center px-4">
            {name || "AZMEERA CHARAN"}
          </h1>
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
            className="w-20 h-[2px] bg-gradient-to-r from-primary via-accent-2 to-primary mt-2 rounded-full origin-center"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;

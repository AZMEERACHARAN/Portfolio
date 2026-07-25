import { Outlet } from 'react-router-dom';
import Navbar from '../components/sections/Navbar';
import Footer from '../components/sections/Footer';
import FAB from '../components/FAB';
import AnimatedBackground from '../components/AnimatedBackground';
import { motion, useScroll, useSpring } from 'framer-motion';

const PortfolioLayout = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden w-full max-w-[100vw]">
      <AnimatedBackground />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent-2 origin-left z-50"
        style={{ scaleX }}
      />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <FAB />
      <Footer />
    </div>
  );
};

export default PortfolioLayout;

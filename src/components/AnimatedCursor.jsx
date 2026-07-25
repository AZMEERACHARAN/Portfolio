import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const AnimatedCursor = React.memo(() => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  // Smooth springs for cursor followers
  const springX = useSpring(mouseX, { stiffness: 1000, damping: 50, mass: 0.1 });
  const springY = useSpring(mouseY, { stiffness: 1000, damping: 50, mass: 0.1 });

  // Outer cursor is slightly more delayed and offset
  const outerX = useTransform(mouseX, x => x - 12);
  const outerY = useTransform(mouseY, y => y - 12);
  const outerSpringX = useSpring(outerX, { stiffness: 200, damping: 30, mass: 0.5 });
  const outerSpringY = useSpring(outerY, { stiffness: 200, damping: 30, mass: 0.5 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      mouseX.set(e.clientX - 8);
      mouseY.set(e.clientY - 8);
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.closest('.cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full mix-blend-screen pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{ x: springX, y: springY }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 50, mass: 0.1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-primary-2/50 rounded-full mix-blend-screen pointer-events-none z-[99] transform -translate-x-1/2 -translate-y-1/2 hidden md:block will-change-transform"
        style={{ x: outerSpringX, y: outerSpringY }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 0.5,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 30, mass: 0.5 }}
      />
    </>
  );
});

export default AnimatedCursor;

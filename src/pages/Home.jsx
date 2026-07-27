import React, { lazy, Suspense } from 'react';
import Hero from '../components/sections/Hero';

const About = lazy(() => import('../components/sections/About'));
const TechStack = lazy(() => import('../components/sections/TechStack'));
const Education = lazy(() => import('../components/sections/Education'));
const Projects = lazy(() => import('../components/sections/Projects'));
const Experience = lazy(() => import('../components/sections/Experience'));
const Achievements = lazy(() => import('../components/sections/Achievements'));
const Certificates = lazy(() => import('../components/sections/Certificates'));
const Services = lazy(() => import('../components/sections/Services'));
const Testimonials = lazy(() => import('../components/sections/Testimonials'));
const Contact = lazy(() => import('../components/sections/Contact'));

const Home = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero />
      <Suspense fallback={<div className="h-20 w-full flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div>}>
        <About />
        <TechStack />
        <Education />
        <Projects />
        <Experience />
        <Achievements />
        <Certificates />
        <Services />
        <Testimonials />
        <Contact />
      </Suspense>
    </div>
  );
};

export default Home;

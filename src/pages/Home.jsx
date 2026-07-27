import React, { lazy, Suspense } from 'react';
import Hero from '../components/sections/Hero';
import ErrorBoundary from '../components/ErrorBoundary';

const SectionWrapper = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<div className="h-32 w-full flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div>}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

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
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>
      <SectionWrapper><About /></SectionWrapper>
      <SectionWrapper><TechStack /></SectionWrapper>
      <SectionWrapper><Education /></SectionWrapper>
      <SectionWrapper><Projects /></SectionWrapper>
      <SectionWrapper><Experience /></SectionWrapper>
      <SectionWrapper><Achievements /></SectionWrapper>
      <SectionWrapper><Certificates /></SectionWrapper>
      <SectionWrapper><Services /></SectionWrapper>
      <SectionWrapper><Testimonials /></SectionWrapper>
      <SectionWrapper><Contact /></SectionWrapper>
    </div>
  );
};

export default Home;

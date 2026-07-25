import React from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import TechStack from '../components/sections/TechStack';
import Education from '../components/sections/Education';
import Projects from '../components/sections/Projects';
import Experience from '../components/sections/Experience';
import Achievements from '../components/sections/Achievements';
import Certificates from '../components/sections/Certificates';
import Services from '../components/sections/Services';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';

const Home = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Hero />
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
    </div>
  );
};

export default Home;

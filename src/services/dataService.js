const INITIAL_DATA = {
  heroData: {
    description: 'I am a passionate B.Tech Computer Science student who enjoys building modern, responsive, and user-friendly web applications. I love learning new technologies, solving real-world problems, and creating beautiful digital experiences through clean code and thoughtful design.',
  },
  aboutData: {
    biography: 'I am a driven software developer, fueled by an immense passion for Frontend Development, React, and Modern UI/UX.\n\nFor me, coding is more than just writing logic—it is the art of crafting seamless, intuitive, and premium web applications that leave a lasting impact.',
    careerObjective: 'The only way to do great work is to love what you do. Constantly learning, constantly evolving.',
    interests: 'React, AI, Design, Open Source',
    cards: [
    {
      id: '1',
      title: "Education",
      icon: "GraduationCap",
      description: "Pursuing B.Tech in Computer Science Engineering at RGUKT Basar, building a strong foundation in core CS principles, algorithms, and software engineering.",
      fullWidth: true
    },
    {
      id: '2',
      title: "Passion",
      icon: "Flame",
      description: "Deeply passionate about crafting seamless, intuitive, and modern web applications with a focus on UI/UX."
    },
    {
      id: '3',
      title: "Mission",
      icon: "Target",
      description: "To build impactful products that solve real-world problems while delivering an exceptional user experience."
    },
    {
      id: '4',
      title: "Currently Learning",
      icon: "Brain",
      items: ["Advanced React Patterns", "AI Integrations", "Full-Stack Architecture", "Web 3D Graphics"]
    },
    {
      id: '5',
      title: "Vision",
      icon: "Lightbulb",
      description: "To become a world-class Software Engineer, continuously evolving, innovating, and inspiring the tech community."
    }
  ]},
  skillsData: [
    { id: '1', name: 'React.js', category: 'Frontend', level: 'Advanced' },
    { id: '2', name: 'Node.js', category: 'Backend', level: 'Intermediate' },
    { id: '3', name: 'JavaScript', category: 'Language', level: 'Expert' },
    { id: '4', name: 'TypeScript', category: 'Language', level: 'Advanced' },
    { id: '5', name: 'Tailwind CSS', category: 'Frontend', level: 'Expert' },
    { id: '6', name: 'MongoDB', category: 'Database', level: 'Intermediate' },
    { id: '7', name: 'Git', category: 'Tools', level: 'Advanced' },
    { id: '8', name: 'Python', category: 'Language', level: 'Intermediate' },
    { id: '9', name: 'Express', category: 'Backend', level: 'Intermediate' },
    { id: '10', name: 'Framer Motion', category: 'Frontend', level: 'Advanced' },
    { id: '11', name: 'Next.js', category: 'Frontend', level: 'Intermediate' },
    { id: '12', name: 'SQL', category: 'Database', level: 'Intermediate' },
  ],
  projectsData: [],
  educationData: [],
  experienceData: [],
  certificatesData: [],
  servicesData: [
    {
      id: '1',
      title: 'Frontend Development',
      description: 'Building robust, scalable, and highly performant web applications using modern JavaScript frameworks like React and Next.js.',
      icon: 'Code2',
    },
    {
      id: '2',
      title: 'Responsive Websites',
      description: 'Ensuring your website looks pixel-perfect and functions flawlessly across all devices, from mobile phones to ultra-wide monitors.',
      icon: 'Smartphone',
    },
    {
      id: '3',
      title: 'React Applications',
      description: 'Specialized in developing complex Single Page Applications (SPAs) with robust state management and seamless API integrations.',
      icon: 'Layout',
    },
    {
      id: '4',
      title: 'UI/UX Design Implementation',
      description: 'Translating Figma designs into pixel-perfect code with advanced CSS techniques, glassmorphism, and smooth animations.',
      icon: 'Palette',
    },
    {
      id: '5',
      title: 'Portfolio Development',
      description: 'Creating award-winning personal branding websites and developer portfolios that stand out to recruiters and clients.',
      icon: 'Briefcase',
    },
    {
      id: '6',
      title: 'Performance Optimization',
      description: 'Auditing and optimizing existing web applications to achieve perfect Lighthouse scores and lightning-fast load times.',
      icon: 'Zap',
    }
  ],
  testimonialsData: [
    {
      id: '1',
      name: 'Sarah Jenkins',
      role: 'Product Manager',
      image: 'https://i.pravatar.cc/150?img=47',
      review: 'Charan built an incredible portfolio for me. His attention to detail and mastery of React made the final product far exceed my expectations. Highly recommended!',
      rating: 5
    },
    {
      id: '2',
      name: 'David Chen',
      role: 'Startup Founder',
      image: 'https://i.pravatar.cc/150?img=11',
      review: 'Working with Charan on our frontend MVP was a breeze. He delivered pixel-perfect UI and ensured everything was responsive across all devices.',
      rating: 5
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      image: 'https://i.pravatar.cc/150?img=5',
      review: 'As a designer, I am very particular about how things look. Charan translated my Figma files into code perfectly. The animations are so smooth!',
      rating: 5
    },
    {
      id: '4',
      name: 'Michael Chang',
      role: 'Senior Engineer',
      image: 'https://i.pravatar.cc/150?img=33',
      review: 'Great code quality and folder structure. He understands the importance of writing maintainable React components. A bright future ahead of him.',
      rating: 4
    }
  ],
  achievementsData: [
    { id: '1', title: 'Projects Completed', value: 15, suffix: '+', icon: 'FolderGit2' },
    { id: '2', title: 'Technologies Learned', value: 25, suffix: '+', icon: 'Cpu' },
    { id: '3', title: 'GitHub Repositories', value: 40, suffix: '', icon: 'GitBranch' },
    { id: '4', title: 'Coding Problems Solved', value: 300, suffix: '+', icon: 'Code2' },
    { id: '5', title: 'Certificates Earned', value: 8, suffix: '', icon: 'Award' },
    { id: '6', title: 'Learning Hours', value: 1200, suffix: '+', icon: 'Clock' }
  ],
  contactMessages: [],
  websiteSettings: {
    // 1. General
    websiteTitle: 'My Portfolio',
    websiteDescription: 'Crafting premium digital experiences with modern technology and elegant design.',
    logo: '',
    favicon: '',
    
    // 2. Profile
    fullName: 'AZMEERA CHARAN',
    professionalTitle: 'Frontend Developer',
    email: 'hello@azmeera.dev',
    phone: '+1 234 567 890',
    location: 'Hyderabad, India',
    resumeUrl: '#',
    profileImage: '/profile.jpg',
    
    // 3. Social Links
    socialLinks: {
      github: '#',
      linkedin: '#',
      instagram: '#',
      twitter: '#',
      youtube: '',
      portfolioUrl: '#'
    },

    // 4. Appearance
    theme: 'dark',
    primaryColor: '#7c6bff',
    secondaryColor: '#22d3ee',
    accentColor: '#5eead4',
    animationToggle: true,

    // 5. Contact
    contactEmail: 'hello@azmeera.dev',
    contactPhone: '+1 234 567 890',
    address: 'Hyderabad, India',
    googleMapsLink: '',

    // 6. SEO
    metaTitle: 'Azmeera Charan - Portfolio',
    metaDescription: 'Portfolio of Azmeera Charan, a Frontend Developer specializing in React and modern UI/UX.',
    metaKeywords: 'react, developer, portfolio, frontend, ui/ux',
    openGraphImage: '',

    // 7. Footer
    copyrightText: '© 2026 Azmeera Charan. All rights reserved.',
    footerDescription: 'Crafting premium digital experiences with modern technology and elegant design.',
    footerSocialLinks: [
      { platform: 'GitHub', url: '#' },
      { platform: 'LinkedIn', url: '#' },
      { platform: 'Twitter', url: '#' }
    ],

    // 8. Security (Password stored via admin login flow but keeping a flag or placeholder here if needed)
    // password: 'admin' // Not storing plaintext password here for now, but UI will have it.
  }
};

/**
 * Initialize localStorage with default data if empty.
 */
export const initializeData = () => {
  Object.keys(INITIAL_DATA).forEach((key) => {
    const existing = localStorage.getItem(key);
    if (!existing) {
      localStorage.setItem(key, JSON.stringify(INITIAL_DATA[key]));
    } else if (key === 'websiteSettings' || key === 'heroData' || key === 'aboutData') {
      // Merge missing keys for objects that might have been updated with new schema
      try {
        const parsed = JSON.parse(existing);
        let updated = false;
        Object.keys(INITIAL_DATA[key]).forEach(subKey => {
          if (parsed[subKey] === undefined) {
            parsed[subKey] = INITIAL_DATA[key][subKey];
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem(key, JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("Error merging data for " + key, e);
      }
    }
  });
};

/**
 * Generic getData function
 */
export const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      // Fallback for aboutData cards if they were accidentally cleared
      if (key === 'aboutData' && (!parsed.cards || parsed.cards.length === 0)) {
        parsed.cards = INITIAL_DATA.aboutData.cards;
      }
      return parsed;
    }
  } catch (error) {
    console.error(`Error parsing data for ${key}:`, error);
  }
  return INITIAL_DATA[key] || null;
};

/**
 * Generic saveData function
 */
export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Dispatch a global event so hooks can pick up the change
    window.dispatchEvent(new CustomEvent('portfolio-data-updated', { detail: { key } }));
    return true;
  } catch (error) {
    console.error(`Error saving data for ${key}:`, error);
    return false;
  }
};

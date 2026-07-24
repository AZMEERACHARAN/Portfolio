import { saveSkillsData, getSkillsData } from '../services/skillsApi';
import { saveProjectsData, getProjectsData } from '../services/projectsApi';
import { saveEducationData, getEducationData } from '../services/educationApi';

export const seedDemoData = () => {
  // --- Seed Skills ---
  const existingSkills = getSkillsData();
  if (!existingSkills || existingSkills.length === 0) {
    saveSkillsData([
      { id: '1', name: 'React.js', category: 'Frontend', level: 'Advanced' },
      { id: '2', name: 'Node.js', category: 'Backend', level: 'Intermediate' },
      { id: '3', name: 'JavaScript', category: 'Language', level: 'Expert' },
      { id: '4', name: 'Tailwind CSS', category: 'Frontend', level: 'Expert' },
      { id: '5', name: 'Framer Motion', category: 'Frontend', level: 'Advanced' },
      { id: '6', name: 'Python', category: 'Language', level: 'Intermediate' },
      { id: '7', name: 'MongoDB', category: 'Database', level: 'Intermediate' },
      { id: '8', name: 'Git & GitHub', category: 'Tools', level: 'Advanced' }
    ]);
  }

  // --- Seed Projects ---
  const existingProjects = getProjectsData();
  if (!existingProjects || existingProjects.length === 0) {
    saveProjectsData([
      {
        id: 'p1',
        title: 'Nexus E-Commerce',
        description: 'A modern, fully functional e-commerce platform built with React, Node.js, and MongoDB. Features real-time inventory updates, secure Stripe payments, and an AI-powered product recommendation engine.',
        technologies: 'React, Node.js, Express, MongoDB, Tailwind CSS, Stripe',
        github: 'https://github.com/example/nexus',
        demo: 'https://example.com/nexus',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
        featured: true,
        status: 'Completed'
      },
      {
        id: 'p2',
        title: 'TaskFlow AI',
        description: 'An intelligent task management dashboard that auto-categorizes and prioritizes tasks using NLP. Drag-and-drop interface powered by Framer Motion.',
        technologies: 'Next.js, TypeScript, OpenAI API, Framer Motion',
        github: 'https://github.com/example/taskflow',
        demo: 'https://example.com/taskflow',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
        featured: true,
        status: 'Ongoing'
      },
      {
        id: 'p3',
        title: 'DevSpace Blog',
        description: 'A minimalist, MDX-powered developer blog with dark mode, code highlighting, and SEO optimization. Completely server-side rendered for maximum performance.',
        technologies: 'React, Vite, MDX, Tailwind CSS',
        github: 'https://github.com/example/devspace',
        demo: '',
        image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80',
        featured: false,
        status: 'Completed'
      }
    ]);
  }

  // --- Seed Education ---
  const existingEdu = getEducationData();
  if (!existingEdu || existingEdu.length === 0) {
    saveEducationData([
      {
        id: 'e1',
        degree: 'Continuous Learning & Open Source',
        institute: 'Global Tech Community',
        duration: 'Present',
        description: 'Actively contributing to open-source projects, mastering advanced full-stack architectures, and exploring Web3 & AI integrations.'
      },
      {
        id: 'e2',
        degree: 'B.Tech in Computer Science',
        institute: 'Tech University',
        duration: '2020 - 2024',
        description: 'Graduated with First Class Honors. \n- Led the University Web Development Club.\n- Won 1st place in the Annual Hackathon 2023.\n- Core coursework: Data Structures, Algorithms, Web Engineering, Database Systems.'
      },
      {
        id: 'e3',
        degree: 'High School (Science Stream)',
        institute: 'National Public School',
        duration: '2018 - 2020',
        description: 'Focused on Mathematics and Physics. Developed early passion for logic and problem-solving through coding competitions.'
      }
    ]);
  }
};

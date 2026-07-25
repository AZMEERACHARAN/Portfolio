import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const ABOUT_DOC_REF = doc(db, 'about', 'main');

export const DEFAULT_ABOUT_DATA = {
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
  ]
};

export const getAboutData = async () => {
  try {
    const docSnap = await getDoc(ABOUT_DOC_REF);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      await setDoc(ABOUT_DOC_REF, DEFAULT_ABOUT_DATA);
      return DEFAULT_ABOUT_DATA;
    }
  } catch (error) {
    console.error("Error fetching about data (possibly due to Firestore rules):", error);
    // Graceful fallback so the UI doesn't crash or disappear
    return DEFAULT_ABOUT_DATA;
  }
};

export const updateAboutData = async (data) => {
  try {
    await setDoc(ABOUT_DOC_REF, data, { merge: true });
  } catch (error) {
    console.error("Error updating about data:", error);
    throw error;
  }
};

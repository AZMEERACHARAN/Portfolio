import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const HERO_DOC_REF = doc(db, 'hero', 'main');

export const DEFAULT_HERO_DATA = {
  name: 'Azmeera Charan',
  title: 'Frontend Developer',
  subtitle: 'BUILDING MODERN WEB EXPERIENCES',
  description: 'Building exceptional digital experiences with modern web technologies. Passionate about UI/UX and clean code.',
  profileImage: '',
  resumeUrl: '',
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    instagram: ''
  },
  primaryButton: 'Explore My Work',
  secondaryButton: 'Download Resume'
};

export const getHeroData = async () => {
  try {
    const docSnap = await getDoc(HERO_DOC_REF);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Automatically create it with default data if it doesn't exist
      await setDoc(HERO_DOC_REF, DEFAULT_HERO_DATA);
      return DEFAULT_HERO_DATA;
    }
  } catch (error) {
    console.error("Error fetching hero data (possibly due to Firestore rules):", error);
    // Graceful fallback so the UI doesn't crash or disappear
    return DEFAULT_HERO_DATA;
  }
};

export const updateHeroData = async (data) => {
  try {
    await setDoc(HERO_DOC_REF, data, { merge: true });
  } catch (error) {
    console.error("Error updating hero data:", error);
    throw error;
  }
};

export const subscribeToHeroData = (callback, onError) => {
  return onSnapshot(HERO_DOC_REF, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(DEFAULT_HERO_DATA);
    }
  }, (error) => {
    console.error("Error subscribing to hero data:", error);
    if (onError) onError(error);
    callback(DEFAULT_HERO_DATA);
  });
};

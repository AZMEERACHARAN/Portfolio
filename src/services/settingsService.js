import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getData } from './dataService';

const COLLECTION_NAME = 'settings';
const DOC_ID = 'main';

export const subscribeToSettings = (callback, onError) => {
  const docRef = doc(db, COLLECTION_NAME, DOC_ID);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error fetching settings: ", error);
    if (onError) onError(error);
    callback(null);
  });
};

export const updateSettings = async (settingsData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const updatedData = {
      ...settingsData,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(docRef, updatedData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating settings: ", error);
    throw error;
  }
};

export const migrateSettingsToFirestore = async () => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      const localSettings = getData('websiteSettings') || {};
      
      console.log("Migrating settings from localStorage to Firestore...");
      
      const newSettings = {
        websiteTitle: localSettings.websiteTitle || '',
        websiteDescription: localSettings.websiteDescription || '',
        ownerName: localSettings.fullName || localSettings.ownerName || '',
        tagline: localSettings.professionalTitle || localSettings.tagline || '',
        logoUrl: localSettings.logo || localSettings.logoUrl || '',
        faviconUrl: localSettings.favicon || localSettings.faviconUrl || '',
        resumeUrl: localSettings.resumeUrl || '',
        profileImageUrl: localSettings.profileImage || localSettings.profileImageUrl || '',
        email: localSettings.contactEmail || localSettings.email || '',
        phone: localSettings.contactPhone || localSettings.phone || '',
        location: localSettings.address || localSettings.location || '',
        github: localSettings.socialLinks?.github || '',
        linkedin: localSettings.socialLinks?.linkedin || '',
        instagram: localSettings.socialLinks?.instagram || '',
        twitter: localSettings.socialLinks?.twitter || '',
        portfolioUrl: localSettings.socialLinks?.portfolioUrl || '',
        theme: localSettings.theme || 'dark',
        primaryColor: localSettings.primaryColor || '#7c6bff',
        accentColor: localSettings.accentColor || '#5eead4',
        copyrightText: localSettings.copyrightText || '',
        updatedAt: serverTimestamp()
      };
      
      await setDoc(docRef, newSettings);
      console.log("Settings migration complete.");
    }
  } catch (error) {
    console.error("Error during settings migration: ", error);
    throw error;
  }
};

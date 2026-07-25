import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getData } from './dataService';

const COLLECTION_NAME = 'contact';
const DOC_ID = 'main';

export const subscribeToContact = (callback, onError) => {
  const docRef = doc(db, COLLECTION_NAME, DOC_ID);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error fetching contact info: ", error);
    if (onError) onError(error);
    callback(null);
  });
};

export const updateContact = async (contactData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const updatedData = {
      ...contactData,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(docRef, updatedData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating contact info: ", error);
    throw error;
  }
};

export const migrateContactToFirestore = async () => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      const localSettings = getData('websiteSettings');
      
      if (localSettings) {
        console.log("Migrating contact info from localStorage to Firestore...");
        
        const contactData = {
          email: localSettings.contactEmail || localSettings.email || '',
          phone: localSettings.contactPhone || localSettings.phone || '',
          location: localSettings.address || localSettings.location || '',
          linkedin: localSettings.socialLinks?.linkedin || '',
          github: localSettings.socialLinks?.github || '',
          twitter: localSettings.socialLinks?.twitter || '',
          instagram: localSettings.socialLinks?.instagram || '',
          website: localSettings.socialLinks?.portfolioUrl || '',
          availability: 'Available for work', // Default
          updatedAt: serverTimestamp()
        };
        
        await setDoc(docRef, contactData);
        console.log("Contact migration complete.");
      } else {
        // Create empty document
        await setDoc(docRef, {
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          github: '',
          twitter: '',
          instagram: '',
          website: '',
          availability: 'Available for work',
          updatedAt: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.error("Error during contact migration: ", error);
    throw error;
  }
};

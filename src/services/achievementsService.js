import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getData } from './dataService';

const COLLECTION_NAME = 'achievements';

export const subscribeToAchievements = (callback, onError) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('displayOrder', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  }, (error) => {
    console.error("Error fetching achievements:", error);
    if (onError) onError(error);
  });
};

export const addAchievement = async (achievementData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...achievementData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding achievement:", error);
    throw error;
  }
};

export const updateAchievement = async (id, achievementData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...achievementData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating achievement:", error);
    throw error;
  }
};

export const deleteAchievement = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting achievement:", error);
    throw error;
  }
};

export const migrateAchievementsToFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (querySnapshot.empty) {
      const localData = getData('achievementsData');
      if (localData && localData.length > 0) {
        console.log("Migrating achievements from localStorage to Firestore...");
        for (let i = 0; i < localData.length; i++) {
          const item = localData[i];
          await addDoc(collection(db, COLLECTION_NAME), {
            title: item.title || item.label || '',
            description: '',
            category: '',
            organization: '',
            achievementDate: '',
            imageUrl: '',
            certificateUrl: '',
            value: item.value || '',
            suffix: item.suffix || '',
            icon: item.icon || 'Trophy',
            displayOrder: i,
            isFeatured: false,
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
        console.log("Achievements migration complete.");
      }
    }
  } catch (error) {
    console.error("Error during achievements migration:", error);
  }
};

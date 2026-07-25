import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getData } from './dataService';

const COLLECTION_NAME = 'services';

export const subscribeToServices = (callback, onError) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('displayOrder', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  }, (error) => {
    console.error("Error fetching services:", error);
    if (onError) onError(error);
  });
};

export const addService = async (serviceData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...serviceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...serviceData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};

export const migrateServicesToFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (querySnapshot.empty) {
      const localData = getData('servicesData');
      if (localData && localData.length > 0) {
        console.log("Migrating services from localStorage to Firestore...");
        for (let i = 0; i < localData.length; i++) {
          const item = localData[i];
          await addDoc(collection(db, COLLECTION_NAME), {
            title: item.title || '',
            description: item.description || '',
            icon: item.icon || 'Code2',
            imageUrl: '',
            technologies: [],
            displayOrder: i,
            isFeatured: false,
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
        console.log("Services migration complete.");
      }
    }
  } catch (error) {
    console.error("Error during services migration:", error);
  }
};

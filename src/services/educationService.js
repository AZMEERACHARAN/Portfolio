import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getData } from './dataService';

const COLLECTION_NAME = 'education';

const educationCollection = collection(db, COLLECTION_NAME);

export const subscribeToEducation = (callback, onError) => {
  const q = query(educationCollection, orderBy('displayOrder', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const education = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(education);
  }, (error) => {
    console.error("Error fetching education: ", error);
    if (onError) onError(error);
    callback([]);
  });
};

export const addEducation = async (eduData) => {
  try {
    const newEdu = {
      institutionName: eduData.institutionName || eduData.school || '',
      degree: eduData.degree || '',
      specialization: eduData.specialization || '',
      startYear: eduData.startYear || '',
      endYear: eduData.endYear || '',
      grade: eduData.grade || '',
      location: eduData.location || '',
      description: eduData.description || '',
      displayOrder: eduData.displayOrder || 0,
      isVisible: eduData.isVisible !== undefined ? eduData.isVisible : true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(educationCollection, newEdu);
    return { id: docRef.id, ...newEdu };
  } catch (error) {
    console.error("Error adding education: ", error);
    throw error;
  }
};

export const updateEducation = async (id, eduData) => {
  try {
    const eduRef = doc(db, COLLECTION_NAME, id);
    const updatedData = {
      ...eduData,
      updatedAt: serverTimestamp()
    };
    
    // Map existing fields if necessary
    if (eduData.school) updatedData.institutionName = eduData.school;
    delete updatedData.school;

    await updateDoc(eduRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating education: ", error);
    throw error;
  }
};

export const deleteEducation = async (id) => {
  try {
    const eduRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(eduRef);
    return true;
  } catch (error) {
    console.error("Error deleting education: ", error);
    throw error;
  }
};

export const reorderEducation = async (items) => {
  try {
    const batch = writeBatch(db);
    
    items.forEach((item, index) => {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      batch.update(docRef, { 
        displayOrder: index,
        updatedAt: serverTimestamp()
      });
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error reordering education: ", error);
    throw error;
  }
};

export const migrateEducationToFirestore = async () => {
  try {
    const querySnapshot = await getDocs(educationCollection);
    
    if (querySnapshot.empty) {
      const localEducation = getData('educationData');
      
      if (localEducation && localEducation.length > 0) {
        console.log(`Migrating ${localEducation.length} education records from localStorage to Firestore...`);
        
        const batch = writeBatch(db);
        
        localEducation.forEach((edu, index) => {
          const newDocRef = doc(educationCollection);
          batch.set(newDocRef, {
            institutionName: edu.school || edu.institutionName || '',
            degree: edu.degree || '',
            specialization: edu.specialization || '',
            startYear: edu.startYear || '',
            endYear: edu.endYear || '',
            grade: edu.grade || '',
            location: edu.location || '',
            description: edu.description || '',
            displayOrder: index,
            isVisible: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });
        
        await batch.commit();
        console.log("Migration complete.");
        
        localStorage.removeItem('educationData');
      }
    }
  } catch (error) {
    console.error("Error during migration: ", error);
    throw error;
  }
};

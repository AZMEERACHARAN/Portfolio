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

const COLLECTION_NAME = 'experience';

const experienceCollection = collection(db, COLLECTION_NAME);

export const subscribeToExperience = (callback, onError) => {
  const q = query(experienceCollection, orderBy('displayOrder', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const experience = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(experience);
  }, (error) => {
    console.error("Error fetching experience: ", error);
    if (onError) onError(error);
    callback([]);
  });
};

export const addExperience = async (expData) => {
  try {
    const newExp = {
      company: expData.company || expData.organization || '',
      role: expData.role || expData.position || '',
      employmentType: expData.employmentType || '',
      location: expData.location || '',
      startDate: expData.startDate || '',
      endDate: expData.currentlyWorking ? '' : (expData.endDate || ''),
      currentlyWorking: expData.currentlyWorking || false,
      description: expData.description || '',
      technologies: expData.technologies || '',
      displayOrder: expData.displayOrder || 0,
      isVisible: expData.isVisible !== undefined ? expData.isVisible : true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(experienceCollection, newExp);
    return { id: docRef.id, ...newExp };
  } catch (error) {
    console.error("Error adding experience: ", error);
    throw error;
  }
};

export const updateExperience = async (id, expData) => {
  try {
    const expRef = doc(db, COLLECTION_NAME, id);
    const updatedData = {
      ...expData,
      updatedAt: serverTimestamp()
    };
    
    // Legacy mapping cleanup
    if (expData.organization) updatedData.company = expData.organization;
    if (expData.position) updatedData.role = expData.position;
    delete updatedData.organization;
    delete updatedData.position;

    // Handle currently working logic
    if (updatedData.currentlyWorking) {
      updatedData.endDate = '';
    }

    await updateDoc(expRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating experience: ", error);
    throw error;
  }
};

export const deleteExperience = async (id) => {
  try {
    const expRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(expRef);
    return true;
  } catch (error) {
    console.error("Error deleting experience: ", error);
    throw error;
  }
};

export const reorderExperience = async (items) => {
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
    console.error("Error reordering experience: ", error);
    throw error;
  }
};

export const migrateExperienceToFirestore = async () => {
  try {
    const querySnapshot = await getDocs(experienceCollection);
    
    if (querySnapshot.empty) {
      const localExperience = getData('experienceData');
      
      if (localExperience && localExperience.length > 0) {
        console.log(`Migrating ${localExperience.length} experience records from localStorage to Firestore...`);
        
        const batch = writeBatch(db);
        
        localExperience.forEach((exp, index) => {
          const newDocRef = doc(experienceCollection);
          batch.set(newDocRef, {
            company: exp.organization || '',
            role: exp.position || '',
            employmentType: '',
            location: '',
            startDate: exp.duration || '',
            endDate: '',
            currentlyWorking: false,
            description: exp.description || '',
            technologies: '',
            displayOrder: index,
            isVisible: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });
        
        await batch.commit();
        console.log("Migration complete.");
        
        localStorage.removeItem('experienceData');
      }
    }
  } catch (error) {
    console.error("Error during migration: ", error);
    throw error;
  }
};

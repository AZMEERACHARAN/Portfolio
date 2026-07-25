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

const COLLECTION_NAME = 'skills';

// Reference to the skills collection
const skillsCollection = collection(db, COLLECTION_NAME);

/**
 * Subscribe to skills in real-time.
 * @param {Function} callback - Function to call when data changes
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToSkills = (callback, onError) => {
  const q = query(skillsCollection, orderBy('displayOrder', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const skills = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(skills);
  }, (error) => {
    console.error("Error fetching skills: ", error);
    if (onError) onError(error);
    callback([]);
  });
};

/**
 * Add a new skill
 * @param {Object} skillData - The skill data to add
 */
export const addSkill = async (skillData) => {
  try {
    const newSkill = {
      title: skillData.name || skillData.title || '',
      category: skillData.category || 'Other',
      proficiency: skillData.level || skillData.proficiency || 'Intermediate',
      icon: skillData.icon || '',
      image: skillData.image || '',
      imageUrl: skillData.imageUrl || skillData.image || '',
      description: skillData.description || '',
      about: skillData.about || '',
      projects: skillData.projects || '',
      status: skillData.status || '',
      displayOrder: skillData.displayOrder || 0,
      isVisible: skillData.isVisible !== undefined ? skillData.isVisible : true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(skillsCollection, newSkill);
    return { id: docRef.id, ...newSkill };
  } catch (error) {
    console.error("Error adding skill: ", error);
    throw error;
  }
};

/**
 * Update an existing skill
 * @param {string} id - The skill document ID
 * @param {Object} skillData - The updated skill data
 */
export const updateSkill = async (id, skillData) => {
  try {
    const skillRef = doc(db, COLLECTION_NAME, id);
    const updatedData = {
      ...skillData,
      updatedAt: serverTimestamp()
    };
    
    // Map UI fields to Firestore fields if present
    if (skillData.name) updatedData.title = skillData.name;
    if (skillData.level) updatedData.proficiency = skillData.level;
    
    // Clean up mapping fields to avoid duplicates
    delete updatedData.name;
    delete updatedData.level;

    await updateDoc(skillRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating skill: ", error);
    throw error;
  }
};

/**
 * Delete a skill
 * @param {string} id - The skill document ID
 */
export const deleteSkill = async (id) => {
  try {
    const skillRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(skillRef);
    return true;
  } catch (error) {
    console.error("Error deleting skill: ", error);
    throw error;
  }
};

/**
 * Migrate skills from localStorage to Firestore (One-time)
 */
export const migrateSkillsToFirestore = async () => {
  try {
    // Check if Firestore already has skills
    const querySnapshot = await getDocs(skillsCollection);
    
    if (querySnapshot.empty) {
      // Firestore is empty, get from localStorage
      const localSkills = getData('skillsData');
      
      if (localSkills && localSkills.length > 0) {
        console.log(`Migrating ${localSkills.length} skills from localStorage to Firestore...`);
        
        const batch = writeBatch(db);
        
        localSkills.forEach((skill, index) => {
          const newDocRef = doc(skillsCollection);
          batch.set(newDocRef, {
            title: skill.name || '',
            category: skill.category || 'Other',
            proficiency: skill.level || 'Intermediate',
            icon: '',
            image: '',
            description: '',
            displayOrder: index, // Use index for initial order
            isVisible: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });
        
        await batch.commit();
        console.log("Migration complete.");
        
        // Remove skillsData from localStorage so we don't migrate again if Firestore gets emptied
        localStorage.removeItem('skillsData');
      }
    }
  } catch (error) {
    console.error("Error during migration: ", error);
    throw error;
  }
};

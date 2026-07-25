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

const COLLECTION_NAME = 'projects';

const projectsCollection = collection(db, COLLECTION_NAME);

export const subscribeToProjects = (callback, onError) => {
  const q = query(projectsCollection, orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(projects);
  }, (error) => {
    console.error("Error fetching projects: ", error);
    if (onError) onError(error);
    callback([]);
  });
};

export const addProject = async (projectData) => {
  try {
    const newProject = {
      title: projectData.title || '',
      description: projectData.description || '',
      overview: projectData.overview || '',
      projectGoal: projectData.projectGoal || '',
      technologies: projectData.technologies || '',
      github: projectData.github || '',
      demo: projectData.demo || '',
      image: projectData.image || '',
      featured: projectData.featured || false,
      status: projectData.status || 'Completed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(projectsCollection, newProject);
    return { id: docRef.id, ...newProject };
  } catch (error) {
    console.error("Error adding project: ", error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const projectRef = doc(db, COLLECTION_NAME, id);
    const updatedData = {
      ...projectData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(projectRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating project: ", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const projectRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(projectRef);
    return true;
  } catch (error) {
    console.error("Error deleting project: ", error);
    throw error;
  }
};

export const migrateProjectsToFirestore = async () => {
  try {
    const querySnapshot = await getDocs(projectsCollection);
    
    if (querySnapshot.empty) {
      const localProjects = getData('projectsData');
      
      if (localProjects && localProjects.length > 0) {
        console.log(`Migrating ${localProjects.length} projects from localStorage to Firestore...`);
        
        const batch = writeBatch(db);
        
        localProjects.forEach((project) => {
          const newDocRef = doc(projectsCollection);
          batch.set(newDocRef, {
            title: project.title || '',
            description: project.description || '',
            overview: project.overview || project.description || '',
            projectGoal: project.projectGoal || project.description || '',
            technologies: project.technologies || '',
            github: project.github || '',
            demo: project.demo || '',
            image: project.image || '',
            featured: project.featured || false,
            status: project.status || 'Completed',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });
        
        await batch.commit();
        console.log("Migration complete.");
        
        localStorage.removeItem('projectsData');
      }
    }
  } catch (error) {
    console.error("Error during migration: ", error);
    throw error;
  }
};

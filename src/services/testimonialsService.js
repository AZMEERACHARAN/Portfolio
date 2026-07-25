import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getData } from './dataService';

const COLLECTION_NAME = 'testimonials';

export const subscribeToTestimonials = (callback, onError) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('displayOrder', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  }, (error) => {
    console.error("Error fetching testimonials:", error);
    if (onError) onError(error);
  });
};

export const addTestimonial = async (testimonialData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...testimonialData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding testimonial:", error);
    throw error;
  }
};

export const updateTestimonial = async (id, testimonialData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...testimonialData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }
};

export const migrateTestimonialsToFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (querySnapshot.empty) {
      const localData = getData('testimonialsData');
      if (localData && localData.length > 0) {
        console.log("Migrating testimonials from localStorage to Firestore...");
        for (let i = 0; i < localData.length; i++) {
          const item = localData[i];
          await addDoc(collection(db, COLLECTION_NAME), {
            name: item.name || '',
            role: item.role || '',
            organization: item.organization || '',
            profileImage: item.photo || '', // migrating 'photo' to 'profileImage'
            rating: item.rating || 5,
            message: item.review || '',     // migrating 'review' to 'message'
            displayOrder: i,
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
        console.log("Testimonials migration complete.");
      }
    }
  } catch (error) {
    console.error("Error during testimonials migration:", error);
  }
};

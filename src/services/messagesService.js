import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const COLLECTION_NAME = 'messages';

export const subscribeToMessages = (callback, onError) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Handle server timestamp locally if not fully written yet
      timestamp: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    }));
    callback(messages);
  }, (error) => {
    console.error("Error fetching messages: ", error);
    if (onError) onError(error);
  });
};

export const addMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...messageData,
      isRead: false,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding message: ", error);
    throw error;
  }
};

export const updateMessageStatus = async (id, isRead) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { isRead });
    return true;
  } catch (error) {
    console.error("Error updating message status: ", error);
    throw error;
  }
};

export const deleteMessage = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting message: ", error);
    throw error;
  }
};

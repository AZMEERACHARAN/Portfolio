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

const COLLECTION_NAME = 'certificates';

const certificatesCollection = collection(db, COLLECTION_NAME);

export const subscribeToCertificates = (callback, onError) => {
  const q = query(certificatesCollection, orderBy('displayOrder', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const certificates = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(certificates);
  }, (error) => {
    console.error("Error fetching certificates: ", error);
    if (onError) onError(error);
    callback([]);
  });
};

export const addCertificate = async (certData) => {
  try {
    const newCert = {
      title: certData.title || certData.name || '',
      issuer: certData.issuer || certData.organization || '',
      issueDate: certData.issueDate || certData.date || '',
      expiryDate: certData.expiryDate || '',
      credentialId: certData.credentialId || '',
      credentialUrl: certData.credentialUrl || certData.link || '',
      certificateImageUrl: certData.certificateImageUrl || certData.image || '',
      description: certData.description || '',
      skills: certData.skills || '',
      displayOrder: certData.displayOrder || 0,
      isVisible: certData.isVisible !== undefined ? certData.isVisible : true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(certificatesCollection, newCert);
    return { id: docRef.id, ...newCert };
  } catch (error) {
    console.error("Error adding certificate: ", error);
    throw error;
  }
};

export const updateCertificate = async (id, certData) => {
  try {
    const certRef = doc(db, COLLECTION_NAME, id);
    const updatedData = {
      ...certData,
      updatedAt: serverTimestamp()
    };
    
    // Legacy mapping cleanup
    if (certData.name) updatedData.title = certData.name;
    if (certData.organization) updatedData.issuer = certData.organization;
    if (certData.date) updatedData.issueDate = certData.date;
    if (certData.link) updatedData.credentialUrl = certData.link;
    if (certData.image) updatedData.certificateImageUrl = certData.image;

    delete updatedData.name;
    delete updatedData.organization;
    delete updatedData.date;
    delete updatedData.link;
    delete updatedData.image;

    await updateDoc(certRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating certificate: ", error);
    throw error;
  }
};

export const deleteCertificate = async (id) => {
  try {
    const certRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(certRef);
    return true;
  } catch (error) {
    console.error("Error deleting certificate: ", error);
    throw error;
  }
};

export const reorderCertificates = async (items) => {
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
    console.error("Error reordering certificates: ", error);
    throw error;
  }
};

export const migrateCertificatesToFirestore = async () => {
  try {
    const querySnapshot = await getDocs(certificatesCollection);
    
    if (querySnapshot.empty) {
      const localCertificates = getData('certificatesData');
      
      if (localCertificates && localCertificates.length > 0) {
        console.log(`Migrating ${localCertificates.length} certificates from localStorage to Firestore...`);
        
        const batch = writeBatch(db);
        
        localCertificates.forEach((cert, index) => {
          const newDocRef = doc(certificatesCollection);
          batch.set(newDocRef, {
            title: cert.title || cert.name || '',
            issuer: cert.issuer || cert.organization || '',
            issueDate: cert.issueDate || cert.date || '',
            expiryDate: '',
            credentialId: '',
            credentialUrl: cert.credentialUrl || cert.link || '',
            certificateImageUrl: cert.certificateImageUrl || cert.image || '',
            description: cert.description || '',
            skills: '',
            displayOrder: index,
            isVisible: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });
        
        await batch.commit();
        console.log("Migration complete.");
        
        localStorage.removeItem('certificatesData');
      }
    }
  } catch (error) {
    console.error("Error during migration: ", error);
    throw error;
  }
};

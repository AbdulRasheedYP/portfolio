import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";

// Convert file to Base64 Data URL (used as universal fallback)
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

// --- Storage Upload ---
export const uploadFileToStorage = async (file, path, onProgress) => {
  // Determine content type safely
  let contentType = file.type;
  if (!contentType) {
    if (file.name.toLowerCase().endsWith(".pdf")) contentType = "application/pdf";
    else if (file.name.toLowerCase().endsWith(".png")) contentType = "image/png";
    else if (file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".jpeg")) contentType = "image/jpeg";
    else contentType = "application/octet-stream";
  }

  const metadata = { contentType };
  const storageRef = ref(storage, path);

  if (onProgress) onProgress(30);

  // Attempt 1: Try Firebase Storage with a 3.5s fast timeout
  try {
    const uploadPromise = (async () => {
      const snapshot = await uploadBytes(storageRef, file, metadata);
      if (onProgress) onProgress(80);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      if (onProgress) onProgress(100);
      return downloadUrl;
    })();

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Storage timeout")), 3500);
    });

    return await Promise.race([uploadPromise, timeoutPromise]);
  } catch (storageErr) {
    console.warn("Firebase Storage unavailable, falling back to direct Data URL:", storageErr);

    // Attempt 2: Instant Base64 Fallback (supports PDFs, resumes, and images up to 1.5MB)
    if (file.size <= 1.5 * 1024 * 1024) {
      if (onProgress) onProgress(70);
      const dataUrl = await fileToDataUrl(file);
      if (onProgress) onProgress(100);
      return dataUrl;
    } else {
      throw new Error(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds direct storage limit (1.5MB). Please compress the file or enable Cloud Storage in Firebase Console.`
      );
    }
  }
};

// --- Settings ---
export const updateGeneralSettings = async (settingsData) => {
  const docRef = doc(db, "settings", "general");
  await setDoc(docRef, { ...settingsData, updatedAt: serverTimestamp() }, { merge: true });
};

// --- Projects ---
export const addProjectDoc = async (projectData) => {
  return await addDoc(collection(db, "projects"), {
    ...projectData,
    createdAt: serverTimestamp()
  });
};

export const updateProjectDoc = async (id, projectData) => {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, {
    ...projectData,
    updatedAt: serverTimestamp()
  });
};

export const deleteProjectDoc = async (id) => {
  await deleteDoc(doc(db, "projects", id));
};

export const getProjectById = async (id) => {
  const docRef = doc(db, "projects", id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
};

// --- Skills ---
export const addSkillDoc = async (skillData) => {
  return await addDoc(collection(db, "skills"), {
    ...skillData,
    createdAt: serverTimestamp()
  });
};

export const updateSkillDoc = async (id, skillData) => {
  const docRef = doc(db, "skills", id);
  await updateDoc(docRef, {
    ...skillData,
    updatedAt: serverTimestamp()
  });
};

export const updateSkillsOrder = async (orderedSkills) => {
  const batch = writeBatch(db);
  orderedSkills.forEach((skill, index) => {
    if (skill.id) {
      const docRef = doc(db, "skills", skill.id);
      batch.update(docRef, {
        order: index + 1,
        updatedAt: serverTimestamp()
      });
    }
  });
  await batch.commit();
};

export const deleteSkillDoc = async (id) => {
  await deleteDoc(doc(db, "skills", id));
};

// --- Services ---
export const addServiceDoc = async (serviceData) => {
  return await addDoc(collection(db, "services"), {
    ...serviceData,
    createdAt: serverTimestamp()
  });
};

export const updateServiceDoc = async (id, serviceData) => {
  const docRef = doc(db, "services", id);
  await updateDoc(docRef, {
    ...serviceData,
    updatedAt: serverTimestamp()
  });
};

export const deleteServiceDoc = async (id) => {
  await deleteDoc(doc(db, "services", id));
};

// --- Messages ---
export const saveMessageDoc = async ({ name, email, message }) => {
  return await addDoc(collection(db, "messages"), {
    name,
    email,
    message,
    read: false,
    createdAt: serverTimestamp()
  });
};

export const deleteMessageDoc = async (id) => {
  await deleteDoc(doc(db, "messages", id));
};

// --- Social Links ---
export const addSocialDoc = async (socialData) => {
  return await addDoc(collection(db, "socials"), {
    ...socialData,
    createdAt: serverTimestamp()
  });
};

export const deleteSocialDoc = async (id) => {
  await deleteDoc(doc(db, "socials", id));
};


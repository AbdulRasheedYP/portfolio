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

// Auto-compress large images via HTML5 canvas for fast load and Firestore storage
export const compressImage = (file, maxWidth = 1600, maxHeight = 900, quality = 0.75) => {
  return new Promise((resolve) => {
    const isImage =
      (file.type && file.type.startsWith("image/")) ||
      /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(file.name || "");

    if (!isImage) {
      return resolve(null);
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        let compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

        // If still > 350KB, compress further to 0.55 quality
        if (compressedDataUrl.length > 350 * 1024) {
          compressedDataUrl = canvas.toDataURL("image/jpeg", 0.55);
        }

        resolve(compressedDataUrl);
      } catch (err) {
        console.warn("Canvas compression failed, falling back to original:", err);
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    reader.onerror = () => resolve(null);
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
    console.warn("Firebase Storage unavailable, falling back to direct compressed storage:", storageErr);

    const isImage =
      (file.type && file.type.startsWith("image/")) ||
      /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(file.name || "");

    // Attempt 2: If image, auto-compress client-side (works for files of any size)
    if (isImage) {
      if (onProgress) onProgress(60);
      let maxW = 1280;
      let maxH = 720;
      let q = 0.68;
      if (path.includes("screenshot")) {
        maxW = 960;
        maxH = 540;
        q = 0.62;
      } else if (path.includes("gallery")) {
        maxW = 800;
        maxH = 600;
        q = 0.65;
      } else if (path.includes("profile")) {
        maxW = 500;
        maxH = 500;
        q = 0.75;
      }
      const compressed = await compressImage(file, maxW, maxH, q);
      if (compressed) {
        if (onProgress) onProgress(100);
        return compressed;
      }
    }

    // Attempt 3: For PDFs or documents up to 2MB
    if (file.size <= 2 * 1024 * 1024) {
      if (onProgress) onProgress(70);
      const dataUrl = await fileToDataUrl(file);
      if (onProgress) onProgress(100);
      return dataUrl;
    } else {
      throw new Error(
        `PDF File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 2MB limit. Please upload a PDF under 2MB.`
      );
    }
  }
};

// --- Settings ---
export const updateGeneralSettings = async (settingsData) => {
  const docRef = doc(db, "settings", "general");
  await setDoc(docRef, { ...settingsData, updatedAt: serverTimestamp() }, { merge: true });
};

export const updateMediaSettings = async ({ backgrounds, gallery }) => {
  const promises = [];
  if (backgrounds) {
    const bgRef = doc(db, "settings", "backgrounds");
    promises.push(setDoc(bgRef, { ...backgrounds, updatedAt: serverTimestamp() }, { merge: true }));
  }
  if (gallery) {
    const galRef = doc(db, "settings", "gallery");
    promises.push(setDoc(galRef, { ...gallery, updatedAt: serverTimestamp() }, { merge: true }));
  }
  await Promise.all(promises);
};

export const syncAllDataWithCV = async (
  cvSettings,
  cvSkills,
  cvServices,
  cvSocials,
  cvJourney
) => {
  const promises = [];

  // 1. Settings General (Bio, Roles, Resume, Location)
  if (cvSettings) {
    const docRef = doc(db, "settings", "general");
    promises.push(
      setDoc(
        docRef,
        {
          subtitle: cvSettings.subtitle,
          name: cvSettings.name,
          roles: cvSettings.roles,
          heroDesc: cvSettings.heroDesc,
          about: cvSettings.about,
          resumeUrl: cvSettings.resumeUrl,
          location: cvSettings.location,
          phone: cvSettings.phone,
          email: cvSettings.email,
          freelanceState: cvSettings.freelanceState,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      )
    );
  }

  // 2. Socials
  if (Array.isArray(cvSocials)) {
    for (const soc of cvSocials) {
      const socRef = doc(db, "socials", soc.id);
      promises.push(
        setDoc(socRef, { ...soc, updatedAt: serverTimestamp() }, { merge: true })
      );
    }
  }

  // 3. Skills
  if (Array.isArray(cvSkills)) {
    for (const sk of cvSkills) {
      const skRef = doc(db, "skills", sk.id);
      promises.push(
        setDoc(skRef, { ...sk, updatedAt: serverTimestamp() }, { merge: true })
      );
    }
  }

  // 4. Services
  if (Array.isArray(cvServices)) {
    for (const srv of cvServices) {
      const srvRef = doc(db, "services", srv.id);
      promises.push(
        setDoc(srvRef, { ...srv, updatedAt: serverTimestamp() }, { merge: true })
      );
    }
  }

  // 5. Journey Milestones
  if (Array.isArray(cvJourney)) {
    for (const jm of cvJourney) {
      const { sprints: _sp, ...payload } = jm;
      const jmRef = doc(db, "journey", jm.id);
      promises.push(
        setDoc(jmRef, { ...payload, updatedAt: serverTimestamp() }, { merge: true })
      );
    }
  }

  await Promise.all(promises);
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

// --- Journey / Learning Roadmap Milestones ---
export const addJourneyDoc = async (journeyData) => {
  return await addDoc(collection(db, "journey"), {
    ...journeyData,
    createdAt: serverTimestamp()
  });
};

export const updateJourneyDoc = async (id, journeyData) => {
  if (!id) throw new Error("Document ID is required for update");
  const docRef = doc(db, "journey", id);
  await setDoc(
    docRef,
    {
      ...journeyData,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
};

export const updateJourneyOrder = async (orderedMilestones) => {
  const batch = writeBatch(db);
  orderedMilestones.forEach((item, index) => {
    const targetId = item.firestoreId || item.id;
    if (targetId) {
      const docRef = doc(db, "journey", targetId);
      batch.update(docRef, {
        order: index + 1,
        updatedAt: serverTimestamp()
      });
    }
  });
  await batch.commit();
};

export const deleteJourneyDoc = async (id) => {
  if (!id) throw new Error("Document ID is required for deletion");
  await deleteDoc(doc(db, "journey", id));
};


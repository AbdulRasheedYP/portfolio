import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  FALLBACK_SETTINGS,
  FALLBACK_SKILLS,
  FALLBACK_SERVICES,
  FALLBACK_PROJECTS,
  FALLBACK_SOCIALS,
  FALLBACK_JOURNEY
} from "../constants/fallbackData";

const PortfolioContext = createContext(null);

const getCachedData = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(`portfolio_${key}`);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) return parsed;
    }
  } catch (err) {
    console.warn(`Error reading cached ${key}:`, err);
  }
  return fallback;
};

const setCachedData = (key, data) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`portfolio_${key}`, JSON.stringify(data));
  } catch (err) {
    // Quota exceeded or storage unavailable
  }
};

export const PortfolioProvider = ({ children }) => {
  // Initialize with cached data for instant 0ms render without flashes
  const [settings, setSettings] = useState(() => getCachedData("settings", FALLBACK_SETTINGS));
  const [skills, setSkills] = useState(() => getCachedData("skills", FALLBACK_SKILLS));
  const [services, setServices] = useState(() => getCachedData("services", FALLBACK_SERVICES));
  const [projects, setProjects] = useState(() => getCachedData("projects", FALLBACK_PROJECTS));
  const [socials, setSocials] = useState(() => getCachedData("socials", FALLBACK_SOCIALS));
  const [journey, setJourney] = useState(() => getCachedData("journey", FALLBACK_JOURNEY));
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  useEffect(() => {
    const unsubscribes = [];

    try {
      // 1. Settings listener (general, backgrounds, and gallery docs)
      const unsubSettings = onSnapshot(
        doc(db, "settings", "general"),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setSettings((prev) => {
              const updated = { ...prev, ...data };
              setCachedData("settings", updated);
              return updated;
            });
            setIsLiveSynced(true);
          }
        },
        (err) => console.warn("Firestore general settings notice:", err.message)
      );
      unsubscribes.push(unsubSettings);

      const unsubBackgrounds = onSnapshot(
        doc(db, "settings", "backgrounds"),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setSettings((prev) => {
              const updated = { ...prev, ...data };
              setCachedData("settings", updated);
              return updated;
            });
            setIsLiveSynced(true);
          }
        },
        (err) => console.warn("Firestore backgrounds notice:", err.message)
      );
      unsubscribes.push(unsubBackgrounds);

      const unsubGallery = onSnapshot(
        doc(db, "settings", "gallery"),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setSettings((prev) => {
              const updated = { ...prev, ...data };
              setCachedData("settings", updated);
              return updated;
            });
            setIsLiveSynced(true);
          }
        },
        (err) => console.warn("Firestore gallery notice:", err.message)
      );
      unsubscribes.push(unsubGallery);

      // 2. Skills listener
      const unsubSkills = onSnapshot(
        collection(db, "skills"),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() });
            });
            list.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
            setSkills(list);
            setCachedData("skills", list);
            setIsLiveSynced(true);
          }
        },
        (err) => console.warn("Firestore skills notice:", err.message)
      );
      unsubscribes.push(unsubSkills);

      // 3. Services listener
      const unsubServices = onSnapshot(
        collection(db, "services"),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() });
            });
            setServices(list);
            setCachedData("services", list);
            setIsLiveSynced(true);
          }
        },
        (err) => console.warn("Firestore services notice:", err.message)
      );
      unsubscribes.push(unsubServices);

      // 4. Projects listener
      const unsubProjects = onSnapshot(
        collection(db, "projects"),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() });
            });
            setProjects(list);
            setCachedData("projects", list);
            setIsLiveSynced(true);
          }
        },
        (err) => console.warn("Firestore projects notice:", err.message)
      );
      unsubscribes.push(unsubProjects);

      // 5. Socials listener
      const unsubSocials = onSnapshot(
        collection(db, "socials"),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() });
            });
            setSocials(list);
            setCachedData("socials", list);
          }
        },
        (err) => console.warn("Firestore socials notice:", err.message)
      );
      unsubscribes.push(unsubSocials);
    } catch (e) {
      console.warn("Firebase live sync initialization error:", e);
    }

    return () => {
      unsubscribes.forEach((unsub) => unsub && unsub());
    };
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        settings,
        skills,
        services,
        projects,
        socials,
        journey,
        isLiveSynced
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};

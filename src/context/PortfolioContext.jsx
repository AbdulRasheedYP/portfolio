import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  FALLBACK_SETTINGS,
  FALLBACK_SKILLS,
  FALLBACK_SERVICES,
  FALLBACK_PROJECTS,
  FALLBACK_SOCIALS
} from "../constants/fallbackData";

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [skills, setSkills] = useState(FALLBACK_SKILLS);
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [socials, setSocials] = useState(FALLBACK_SOCIALS);
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  useEffect(() => {
    const unsubscribes = [];

    try {
      // 1. Settings listener
      const unsubSettings = onSnapshot(
        doc(db, "settings", "general"),
        (snap) => {
          if (snap.exists()) {
            setSettings((prev) => ({ ...prev, ...snap.data() }));
            setIsLiveSynced(true);
          }
        },
        (err) => console.warn("Firestore settings notice:", err.message)
      );
      unsubscribes.push(unsubSettings);

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

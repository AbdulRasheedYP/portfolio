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

const CACHE_VERSION = "cv_sync_v2";
const getCachedData = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const currentVer = localStorage.getItem("portfolio_cache_version");
    if (currentVer !== CACHE_VERSION) {
      // Invalidate old local cache so new CV alignments take effect immediately
      const keysToClear = ["settings", "skills", "services", "socials", "journey"];
      keysToClear.forEach((k) => localStorage.removeItem(`portfolio_${k}`));
      localStorage.setItem("portfolio_cache_version", CACHE_VERSION);
      return fallback;
    }
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

// Sanitizers to prevent obsolete database documents from overwriting new CV data
const sanitizeSettings = (data) => {
  if (!data || typeof data !== "object") return data;
  const cleaned = { ...data };

  // If roles is old generic string, upgrade to CV-aligned roles
  if (
    !cleaned.roles ||
    cleaned.roles.trim() === "Python Full-Stack Developer, Django Developer, Backend Specialist, Web Developer" ||
    cleaned.roles.trim() === "Python Full-Stack Developer"
  ) {
    cleaned.roles = FALLBACK_SETTINGS.roles;
  }

  // If heroDesc is old generic string, upgrade to CV-aligned heroDesc
  if (
    !cleaned.heroDesc ||
    cleaned.heroDesc.includes("Passionate about Python, backend architecture, and continuous learning")
  ) {
    cleaned.heroDesc = FALLBACK_SETTINGS.heroDesc;
  }

  // If about is old student transition bio, upgrade to CV-aligned bio
  if (
    !cleaned.about ||
    cleaned.about.includes("I'm a commerce graduate transitioning into software development") ||
    cleaned.about.includes("My goal is to become a job-ready full-stack developer")
  ) {
    cleaned.about = FALLBACK_SETTINGS.about;
  }

  // If resumeUrl is old CV, upgrade to new CV
  if (
    !cleaned.resumeUrl ||
    cleaned.resumeUrl === "/img/AbdulrasheedCV.pdf" ||
    cleaned.resumeUrl.endsWith("AbdulrasheedCV.pdf")
  ) {
    cleaned.resumeUrl = "/img/AbdulRasheedCV_new.pdf";
  }

  // If location is old, update
  if (!cleaned.location || cleaned.location === "Malappuram, Kerala, India") {
    cleaned.location = "Kerala, India";
  }

  return cleaned;
};

const sanitizeSocials = (list) => {
  if (!Array.isArray(list) || list.length === 0) return FALLBACK_SOCIALS;
  return list.map((s) => {
    if (s.name === "GitHub" && (s.url?.includes("Rashi0099") || !s.url)) {
      return { ...s, url: "https://github.com/AbdulRasheedYP" };
    }
    if (
      s.name === "LinkedIn" &&
      (!s.url || s.url === "https://www.linkedin.com/" || s.url === "https://www.linkedin.com")
    ) {
      return { ...s, url: "https://www.linkedin.com/in/abdulrasheedyp/" };
    }
    return s;
  });
};

const sanitizeSkills = (list) => {
  if (!Array.isArray(list) || list.length === 0) return FALLBACK_SKILLS;
  const hasAI = list.some((s) => s.name?.includes("LLM") || s.name?.includes("AI"));
  const hasDRF = list.some((s) => s.name?.includes("Django REST Framework") || s.name === "DRF");
  if (!hasAI || !hasDRF) {
    const existingNames = new Set(list.map((s) => s.name?.toLowerCase()));
    const missing = FALLBACK_SKILLS.filter(
      (fs) => !existingNames.has(fs.name?.toLowerCase())
    );
    return [...list, ...missing].sort(
      (a, b) => (Number(a.order) || 99) - (Number(b.order) || 99)
    );
  }
  return list;
};

const sanitizeServices = (list) => {
  if (!Array.isArray(list) || list.length === 0) return FALLBACK_SERVICES;
  const hasAI = list.some((s) => s.title?.includes("AI"));
  if (!hasAI) {
    const aiService = FALLBACK_SERVICES.find((s) => s.id === "srv-ai");
    if (aiService) {
      return [list[0], aiService, ...list.slice(1)];
    }
  }
  return list;
};

const sanitizeJourney = (list) => {
  if (!Array.isArray(list) || list.length === 0) return FALLBACK_JOURNEY;
  return list.map((item) => {
    if (item.type === "academic" && (!item.subtitle || !item.subtitle.includes("Sullamussalam"))) {
      return {
        ...item,
        subtitle: "Sullamussalam Science College • University of Calicut | 2025"
      };
    }
    if (item.type === "tech" && item.id !== "j-bcom" && (!item.subtitle || !item.subtitle.includes("2 Years"))) {
      return {
        ...item,
        title: "Software Development Training Program",
        subtitle: "Brototype • Duration: 2 Years | Intensive Project-Driven Training"
      };
    }
    return item;
  });
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
            const cleanData = sanitizeSettings(data);
            setSettings((prev) => {
              const updated = { ...prev, ...cleanData };
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
            const upgraded = sanitizeSkills(list);
            setSkills(upgraded);
            setCachedData("skills", upgraded);
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
            const upgraded = sanitizeServices(list);
            setServices(upgraded);
            setCachedData("services", upgraded);
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
            const upgraded = sanitizeSocials(list);
            setSocials(upgraded);
            setCachedData("socials", upgraded);
          }
        },
        (err) => console.warn("Firestore socials notice:", err.message)
      );
      unsubscribes.push(unsubSocials);

      // 6. Journey milestones listener
      const unsubJourney = onSnapshot(
        collection(db, "journey"),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() });
            });
            list.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
            const upgraded = sanitizeJourney(list);
            setJourney(upgraded);
            setCachedData("journey", upgraded);
          } else {
            setJourney(FALLBACK_JOURNEY);
            setCachedData("journey", FALLBACK_JOURNEY);
          }
        },
        (err) => console.warn("Firestore journey notice:", err.message)
      );
      unsubscribes.push(unsubJourney);
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

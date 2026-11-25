import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { HomeTab } from "../../components/admin/tabs/HomeTab";
import { AboutTab } from "../../components/admin/tabs/AboutTab";
import { SkillsTab } from "../../components/admin/tabs/SkillsTab";
import { ServicesTab } from "../../components/admin/tabs/ServicesTab";
import { ProjectsTab } from "../../components/admin/tabs/ProjectsTab";
import { JourneyTab } from "../../components/admin/tabs/JourneyTab";
import { BackgroundsTab } from "../../components/admin/tabs/BackgroundsTab";
import { MessagesTab } from "../../components/admin/tabs/MessagesTab";
import { useToast } from "../../context/ToastContext";
import { syncAllDataWithCV } from "../../firebase/services";
import {
  FALLBACK_SETTINGS,
  FALLBACK_SKILLS,
  FALLBACK_SERVICES,
  FALLBACK_SOCIALS,
  FALLBACK_JOURNEY
} from "../../constants/fallbackData";

export const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [syncingCV, setSyncingCV] = useState(false);
  const toast = useToast();

  const handleSyncCV = async () => {
    if (
      !window.confirm(
        "Sync profile headline, bio, roles, resume link, and socials to match your latest CV? (Your custom skills and services will remain untouched)."
      )
    ) {
      return;
    }
    setSyncingCV(true);
    try {
      await syncAllDataWithCV(
        FALLBACK_SETTINGS,
        null,
        null,
        FALLBACK_SOCIALS,
        FALLBACK_JOURNEY
      );
      toast.success(
        "Profile bio, roles, resume link, and socials successfully synced with CV!"
      );
    } catch (err) {
      console.error(err);
      toast.error("Sync failed: " + err.message);
    } finally {
      setSyncingCV(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab />;
      case "about":
        return <AboutTab />;
      case "journey":
        return <JourneyTab />;
      case "skills":
        return <SkillsTab />;
      case "services":
        return <ServicesTab />;
      case "projects":
        return <ProjectsTab />;
      case "backgrounds":
        return <BackgroundsTab />;
      case "messages":
        return <MessagesTab />;
      default:
        return <ProjectsTab />;
    }
  };

  const tabTitles = {
    home: "Hero & Header Settings",
    about: "About & Personal Info",
    journey: "My Journey & Learning Milestones",
    skills: "Technical Skills",
    services: "Services & Capabilities",
    projects: "Projects Management",
    backgrounds: "Backgrounds & Gallery",
    messages: "Contacts Inbox"
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-200 flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <AdminHeader
          title={tabTitles[activeTab] || "Admin Dashboard"}
          onToggleMobile={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full">
          {/* Quick CV Sync Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20 text-primary shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Sync Cloud Database to Updated CV</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-semibold">
                    Python Backend & AI
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your profile headline, bio, roles, and links from your latest CV without affecting your custom skills or projects.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSyncCV}
              disabled={syncingCV}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all shadow-md shadow-primary/20 shrink-0"
            >
              {syncingCV ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Syncing Database...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Sync Cloud Database Now</span>
                </>
              )}
            </button>
          </div>

          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

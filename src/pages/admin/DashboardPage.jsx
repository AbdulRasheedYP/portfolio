import React, { useState } from "react";
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

export const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};
